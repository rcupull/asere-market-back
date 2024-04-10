import { BusinessModel } from "../schemas/business";
import { UserModel } from "../schemas/user";
import { User } from "../types/user";
import { objectIds } from "./test-dummies";

export const fillBD = async () => {
  //////////////////////////////////////////////////////////////////////////////////
  const user1 = new UserModel({
    name: "user1",
    email: "user1@gmail.com",
    password: "password_123_user1",
    passwordVerbose: "password_123_user1",
  });
  await user1.save();
  //
  const business1User1 = new BusinessModel({
    name: "business1User1",
    routeName: "business1User1",
    createdBy: user1._id,
  });
  await business1User1.save();

  const business2User1 = new BusinessModel({
    name: "business2User1",
    routeName: "business2User1",
    createdBy: user1.id,
  });
  await business2User1.save();

  //////////////////////////////////////////////////////////////////////////////////

  const user2 = new UserModel({
    name: "user2",
    email: "user2@gmail.com",
    password: "password_123_user2",
    passwordVerbose: "password_123_user2",
  });
  await user2.save();
  //
  const business1User2 = new BusinessModel({
    name: "business1User2",
    routeName: "business1User2",
    createdBy: user2.id,
  });
  await business1User2.save();

  //////////////////////////////////////////////////////////////////////////////////
  return { user1, user2, business1User1, business1User2, business2User1 };
};
