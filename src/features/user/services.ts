import { QueryHandle } from "../../types/general";
import { User } from "../../types/user";
import { UserModel } from "../../schemas/user";
import { get401Response, get404Response } from "../../utils/server-response";

const addOne: QueryHandle<
  {
    email: string;
    password: string;
    name: string;
    canCreateBusiness: boolean;
  },
  User
> = async ({ email, res, password, name, canCreateBusiness }) => {
  // Check if the email is already registered
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return get401Response({
      res,
      json: {
        message: "Email already registered",
      },
    });
  }

  // Create a new user
  const newUser = new UserModel({
    email,
    password,
    passwordVerbose: password,
    canCreateBusiness,
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
    return get404Response({
      res,
      json: {
        message: "User not found",
      },
    });
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
