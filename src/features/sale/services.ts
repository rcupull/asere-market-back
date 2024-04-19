import { QueryHandle } from "../../types/general";
import { User } from "../../types/user";
import { UserModel } from "../../schemas/user";
import {
  get401Response,
  get404Response,
  getUserNotFoundResponse,
} from "../../utils/server-response";
import { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import { UpdateOptions } from "mongodb";
import { SaleModel } from "../../schemas/sales";
import { postServices } from "../post/services";
import { ServerResponse } from "http";
import { Sale } from "../../types/sales";

const updateOrAddOne: QueryHandle<
  {
    postId: string;
    routeName: string;
    amountToAdd?: Number;
  },
  void
> = async ({ postId, amountToAdd = 1, req, res, routeName }) => {
  const user = req.user;

  if (!user) {
    return getUserNotFoundResponse({ res });
  }

  const existInConstruction = await SaleModel.findOne({
    purchaserId: user._id,
    state: "CONSTRUCTION",
    routeName: routeName,
  });

  if (existInConstruction) {
    const existePost = existInConstruction.posts.find(
      (e) => e.post._id.toString() === postId
    );

    if (existePost) {
      await SaleModel.updateOne(
        {
          _id: existInConstruction._id,
        },
        {
          $set: {
            "posts.$[p].lastUpdatedDate": new Date(),
          },
          $inc: {
            "posts.$[p].count": amountToAdd,
          },
        },
        {
          arrayFilters: [
            {
              "p.post._id": postId,
            },
          ],
        }
      );
    } else {
      const post = await postServices.getOne({ postId, res, req });

      if (post instanceof ServerResponse) return post;

      await SaleModel.updateOne(
        {
          _id: existInConstruction._id,
        },
        {
          $push: {
            posts: {
              post,
              count: amountToAdd,
              lastUpdatedDate: new Date(),
            },
          },
        },
        {
          arrayFilters: [
            {
              "p.post._id": postId,
            },
          ],
        }
      );
    }
  } else {
    const post = await postServices.getOne({ postId, res, req });

    if (post instanceof ServerResponse) return post;

    const newSale = new SaleModel({
      state: "CONSTRUCTION",
      purchaserId: user._id,
      routeName,
      posts: [
        {
          post,
          count: amountToAdd,
          lastUpdatedDate: new Date(),
        },
      ],
    });

    await newSale.save();
  }
};

const getAll: QueryHandle<
  {
    query: FilterQuery<Sale>;
  },
  Array<Sale>
> = async ({ query, res }) => {
  const out = await SaleModel.find(query);

  return out;
};

const getOne: QueryHandle<
  {
    query: FilterQuery<Sale>;
  },
  Sale | null
> = async ({ query }) => {
  const out = await SaleModel.findOne(query);

  return out;
};

const updateOne: QueryHandle<
  {
    query: FilterQuery<Sale>;
    update: UpdateQuery<Sale>;
    options?: UpdateOptions;
  },
  void
> = async ({ query, update, options }) => {
  await SaleModel.updateOne(query, update, options);
};

const deleteOne: QueryHandle<
  {
    query: FilterQuery<Sale>;
  },
  void
> = async ({ query }) => {
  await SaleModel.deleteOne(query);
};

export const saleServices = {
  getOne,
  updateOne,
  updateOrAddOne,
  getAll,
  deleteOne,
};
