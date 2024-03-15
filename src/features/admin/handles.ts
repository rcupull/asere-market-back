import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import {
  RequestWithPagination,
  paginationCustomLabels,
} from "../../middlewares/pagination";
import { UserModel } from "../user/schemas";
import { imagesServices } from "../images/services";
import { ServerResponse } from "http";

const get_users: () => RequestHandler = () => {
  return (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions } = req;

      const out = await UserModel.paginate(
        {
          role: "user",
        },
        {
          ...paginateOptions,
          customLabels: paginationCustomLabels,
        }
      );

      res.send(out);
    });
  };
};

const del_users_userId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { userId } = params;

      /**
       * Remove all business images
       */
      const out = await imagesServices.deleteDir({
        res,
        userId,
      });

      if (out instanceof ServerResponse) return out;

      await UserModel.deleteOne({ _id: userId });

      res.send({});
    });
  };
};

export const adminHandles = {
  get_users,
  del_users_userId,
};
