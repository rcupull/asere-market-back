import { Business } from "../types/business";
import { BaseIdentity } from "../types/general";
import mongose from "mongoose";
import { User } from "../types/user";
import { setAnyString } from "./test-utils";

export const dummyBaseIdentity1: BaseIdentity = {
  _id: "66154951caf3ba61a22cabd8",
  createdAt: "2024-04-09T14:01:19.495Z",
};

export const dummyBaseIdentity2: BaseIdentity = {
  _id: "66154951caf3ba61a22cabd9",
  createdAt: "2024-04-09T14:01:22.495Z",
};

//Business
export const objectIds = {
  obj0: new mongose.Types.ObjectId("62a23958e5a9e9b88f853a10"),
  obj1: new mongose.Types.ObjectId("62a23958e5a9e9b88f853a11"),
  obj2: new mongose.Types.ObjectId("62a23958e5a9e9b88f853a12"),
};
