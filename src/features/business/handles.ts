import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { businessServices } from "./services";
import { ServerResponse } from "http";
import { BusinessModel } from "../../schemas/business";
import { PostModel } from "../../schemas/post";
import { get200Response } from "../../utils/server-response";
import { PostCategory } from "../../types/business";
import { postHandles } from "../post/handles";
import { postServices } from "../post/services";

const get_business: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions, query } =
        req as unknown as RequestWithPagination;

      const { routeNames, search } = query;

      const out = await businessServices.getAll({
        res,
        paginateOptions,
        routeNames,
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

      get200Response({
        res,
        json: {},
      });
    });
  };
};

const update_business_post_categories: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { routeName } = params;
      const { postCategories } = body as {
        postCategories: Array<PostCategory>;
      };

      const business = await businessServices.findOne({
        res,
        routeName,
      });

      if (business instanceof ServerResponse) return business;

      let out = undefined;

      const currentPostCategoriesTags = business.postCategories?.map(
        ({ tag }) => tag
      );
      const postCategoriesTags = postCategories.map(({ tag }) => tag);

      const missingTags = currentPostCategoriesTags?.reduce((acc, tag) => {
        return postCategoriesTags.includes(tag) ? acc : [...acc, tag];
      }, [] as Array<string>);

      if (missingTags?.length) {
        //
        out = await postServices.updateMany({
          res,
          query: {
            routeName,
          },
          update: {
            $pullAll: {
              postCategoriesTags: missingTags,
            },
          },
        });
        if (out instanceof ServerResponse) return out;

        //
        out = await businessServices.updateOne({
          res,
          query: {
            routeName,
          },
          update: {
            $pullAll: {
              "layouts.posts.sections.$[sectionToClean].postCategoriesTags":
                missingTags,
            },
          },
          options: {
            arrayFilters: [
              {
                "sectionToClean.postCategoriesTags": { $in: missingTags },
              },
            ],
          },
        });
        if (out instanceof ServerResponse) return out;
      }

      out = await businessServices.updateOne({
        res,
        query: {
          routeName,
        },
        update: {
          postCategories,
        },
      });

      if (out instanceof ServerResponse) return out;
      /**
       * actualizar posts y secciones que tiene las tags eliminadas
       */

      get200Response({
        res,
        json: {},
      });
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

      get200Response({
        res,
        json: {},
      });
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

      get200Response({
        res,
        json: {},
      });
    });
  };
};

export const businessHandles = {
  get_business,
  get_business_routeName,
  //
  get_business_post_categories,
  add_business_post_category,
  update_business_post_categories,
  put_business_post_category,
  del_business_post_category,
};
