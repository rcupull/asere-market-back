import { QueryHandle } from "../../types/general";
import { User } from "../../types/user";
import { UserModel } from "../../schemas/user";

const addOne: QueryHandle<
  {
    email: string;
    password: string;
    name: string;
  },
  User
> = async ({ email, res, password, name }) => {
  // Check if the email is already registered
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(401).json({ message: "Email already registered" });
  }

  // Create a new user
  const newUser = new UserModel({
    email,
    password,
    passwordVerbose: password,
    name,
  });

  await newUser.save();

  return newUser;
};

const getOne: QueryHandle<
  {
    query: Pick<User, "_id">;
  },
  User
> = async ({ query, res }) => {
  const user = await UserModel.findOne(query);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return user;
};

const updateOne: QueryHandle<
  {
    query: Pick<User, "_id">;
    update: Pick<User, "profileImage">;
  },
  void
> = async ({ query, res, update }) => {
  await UserModel.updateOne(query, update);
};

export const userServices = {
  addOne,
  getOne,
  updateOne,
};
