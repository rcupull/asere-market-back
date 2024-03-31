import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { postServices } from "./services";
import { ServerResponse } from "http";

const get_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions } =
        req as unknown as RequestWithPagination;

      const { search, routeNames, postCategoriesTags, postCategoriesMethod } =
        query;

      const out = await postServices.getAll({
        res,
        paginateOptions,
        routeNames,
        search,
        hidden: false,
        hiddenBusiness: false,
        postCategoriesTags,
        postCategoriesMethod,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId } = params;

      const out = await postServices.getOne({
        res,
        postId,
        hidden: false,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

export const postHandles = {
  get_posts,
  get_posts_postId,
};
