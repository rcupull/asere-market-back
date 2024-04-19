import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import { getUserNotFoundResponse } from "../../utils/server-response";
import { shoppingServices } from "./services";
import { postServices } from "../post/services";
import { isNumber } from "../../utils/general";

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

      const post = await postServices.getOne({ postId, res, req });

      if (post instanceof ServerResponse) return post;

      if (isNumber(post.stockAmount)) {
        /**
         * habilitado el feature de stock amount
         */
        if (amountToAdd > post.stockAmount) {
          /**
           * la cantidad solicitada es mayor que la disponible
           */
          await shoppingServices.updateOrAddOne({
            post,
            routeName,
            req,
            res,
            amountToAdd: post.stockAmount,
          });

          await postServices.updateStockAmount({
            req,
            res,
            query: { _id: post._id },
            stockAmount: 0,
          });

          return res.send({
            message:
              "Por falta de disponibilidad en el stock no se han podido agregar la cantidad solicitada. Se han agregado todas las unidades disponibles.",
          });
        }

        await shoppingServices.updateOrAddOne({
          post,
          routeName,
          req,
          res,
          amountToAdd,
        });

        await postServices.updateStockAmount({
          req,
          res,
          query: { _id: post._id },
          stockAmount: post.stockAmount - amountToAdd,
        });

        return res.send({});
      }

      await shoppingServices.updateOrAddOne({
        post,
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
