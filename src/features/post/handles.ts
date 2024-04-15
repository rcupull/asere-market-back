import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { postServices } from "./services";
import { ServerResponse } from "http";
import { User } from "../../types/user";

const get_posts: () => RequestHandler = () => {
  return (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions } = req;

      const {
        search,
        routeNames,
        postCategoriesTags,
        postCategoriesMethod,
        includeHidden,
      } = query;

      const out = await postServices.getAll({
        res,
        paginateOptions,
        routeNames,
        search,
        hidden: includeHidden ? undefined : false,
        hiddenBusiness: includeHidden ? undefined : false,
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

const post_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const user = req.user as User;
      const { body } = req;
      const { name, routeName } = body;

      const out = await postServices.addOne({
        name,
        routeName,
        createdBy: user._id,
        res,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_posts_postId_duplicate: () => RequestHandler = () => {
  return (req, res, next) => {
    withTryCatch(req, res, async () => {
      const { params } = req;

      const { postId } = params;

      const post = await postServices.getOne({
        postId,
        res,
      });

      if (post instanceof ServerResponse) return post;

      //these are omitted fields
      const { _id, createdAt, createdBy, reviews, images, ...propsToUse } =
        post;

      req.body = propsToUse;

      // add new post
      //TODO it show be created next to the current post
      return post_posts()(req, res, next);
    });
  };
};

export const postHandles = {
  get_posts,
  post_posts,
  post_posts_postId_duplicate,
  //
  get_posts_postId,
};
