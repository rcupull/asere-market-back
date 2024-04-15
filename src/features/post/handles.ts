import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { postServices } from "./services";
import { ServerResponse } from "http";
import { User } from "../../types/user";
import { imagesServices } from "../images/services";
import { Post } from "../../types/post";
import { RequestWithMeta } from "../../types/general";
import {
  get400Response,
  getPostNotFoundResponse,
} from "../../utils/server-response";

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
        req,
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
        req,
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
        req,
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
        req,
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

const put_posts_postId: () => RequestHandler = () => {
  return (req: RequestWithMeta, res) => {
    withTryCatch(req, res, async () => {
      const currentPost = req.post;

      if (!currentPost) {
        return getPostNotFoundResponse({
          res,
        });
      }

      const { params, body } = req;
      const { postId } = params;

      const { images } = body as Post;

      if (images?.length) {
        await imagesServices.deleteOldImages({
          res,
          req,
          newImagesSrcs: body.images,
          oldImagesSrcs: currentPost.images,
        });
      }

      const out = await postServices.updateOne({
        res,
        req,
        query: {
          _id: postId,
        },
        update: body,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const delete_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId } = params;

      /**
       * Removing the post
       */
      const out = await postServices.deleteOne({
        res,
        req,
        postId,
      });

      if (out instanceof ServerResponse) return out;

      res.send(out);
    });
  };
};

export const postHandles = {
  get_posts,
  post_posts,
  post_posts_postId_duplicate,
  //
  get_posts_postId,
  put_posts_postId,
  delete_posts_postId,
};
