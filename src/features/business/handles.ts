import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { businessServices } from "./services";
import { ServerResponse } from "http";
import { BusinessModel } from "../../schemas/business";
import { PostModel } from "../../schemas/post";

const get_business: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions, query } =
        req as unknown as RequestWithPagination;

      const { routeName, search } = query;

      const out = await businessServices.getAll({
        res,
        paginateOptions,
        routeName,
        search,
        hidden: false,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { routeName } = params;

      const out = await businessServices.findOne({
        res,
        routeName,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_business_post_categories: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { routeName } = params;

      const out = await businessServices.findOne({
        res,
        routeName,
      });

      if (out instanceof ServerResponse) return;

      res.send(out.postCategories);
    });
  };
};

const add_business_post_category: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { routeName } = params;
      const { label, tag } = body;

      const out = await businessServices.updateOne({
        res,
        query: {
          routeName,
        },
        update: {
          $push: {
            postCategories: {
              label,
              tag,
            },
          },
        },
      });

      if (out instanceof ServerResponse) return out;

      res.status(200).json({});
    });
  };
};

const put_business_post_category: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { routeName, tag } = params;
      const { hidden } = body;

      if (hidden !== undefined) {
        await BusinessModel.updateOne(
          {
            routeName,
          },
          {
            $set: {
              "postCategories.$[postToUpdate].hidden": hidden,
            },
          },
          {
            arrayFilters: [
              {
                "postToUpdate.tag": tag,
              },
            ],
          }
        );
      }

      res.status(200).json({});
    });
  };
};

const del_business_post_category: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { routeName, tag } = params;

      /**
       * Remove tag from posts
       */
      await PostModel.updateMany(
        {
          postCategoriesTags: { $in: [tag] },
        },
        {
          $pull: {
            postCategoriesTags: tag,
          },
        }
      );

      const out = await businessServices.updateOne({
        res,
        query: {
          routeName,
        },
        update: {
          $pull: {
            postCategories: {
              tag,
            },
          },
        },
      });

      if (out instanceof ServerResponse) return out;

      res.status(200).json({});
    });
  };
};

export const businessHandles = {
  get_business,
  get_business_routeName,
  //
  get_business_post_categories,
  add_business_post_category,
  put_business_post_category,
  del_business_post_category,
};
