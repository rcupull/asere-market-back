import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import { getUserNotFoundResponse } from "../../utils/server-response";
import { shoppingServices } from "./services";

const get_shopping: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { query, user } = req;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { routeName } = query;

      const out = await shoppingServices.getAll({
        req,
        res,
        query: {
          purchaserId: user._id,
          "posts.post.routeName": routeName,
        },
      });

      if (out instanceof ServerResponse) return out;

      res.send(out);
    });
  };
};

const get_shopping_shoppingId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, user } = req;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { shoppingId } = params;

      const out = await shoppingServices.getOne({
        req,
        res,
        query: {
          _id: shoppingId,
          purchaserId: user._id,
        },
      });

      if (out instanceof ServerResponse) return out;

      res.send(out);
    });
  };
};

const post_shopping: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const user = req.user;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { body } = req;

      const { postId, amountToAdd = 1, routeName } = body;

      await shoppingServices.updateOrAddOne({
        postId,
        routeName,
        req,
        res,
        amountToAdd,
      });

      res.send({});
    });
  };
};

const post_shopping_shoppingId_make_order: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const user = req.user;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { params } = req;

      const { shoppingId } = params;

      await shoppingServices.updateOne({
        req,
        res,
        query: {
          _id: shoppingId,
          purchaserId: user._id,
        },
        update: {
          state: "REQUESTED",
        },
      });

      res.send({});
    });
  };
};

const delete_shopping: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { user } = req;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { body } = req;

      const { routeName, postId } = body;

      if (postId) {
        await shoppingServices.updateOne({
          res,
          req,
          query: {
            state: "CONSTRUCTION",
            routeName,
            purchaserId: user._id,
          },
          update: {
            $pull: {
              posts: {
                "post._id": postId,
              },
            },
          },
        });
      } else {
        await shoppingServices.deleteOne({
          res,
          req,
          query: {
            state: "CONSTRUCTION",
            routeName,
          },
        });
      }

      res.send({});
    });
  };
};

export const shoppingHandles = {
  get_shopping,
  post_shopping,
  delete_shopping,
  get_shopping_shoppingId,
  post_shopping_shoppingId_make_order,
};
