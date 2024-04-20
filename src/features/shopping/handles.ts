import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import {
  getBusinessNotFoundResponse,
  getUserNotFoundResponse,
} from "../../utils/server-response";
import { shoppingServices } from "./services";
import { postServices } from "../post/services";
import { isEqualIds, isNumber } from "../../utils/general";

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

const get_shopping_owner: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { business } = req;

      if (!business) {
        return getBusinessNotFoundResponse({ res });
      }

      const { routeName } = business;

      const out = await shoppingServices.getAll({
        req,
        res,
        query: {
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
      const { user } = req;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { body } = req;

      const { amountToAdd = 1 } = body;

      const amountAddedToPost = await postServices.updateStockAmount({
        req,
        res,
        amountToAdd: -amountToAdd,
      });

      if (amountAddedToPost instanceof ServerResponse) return amountAddedToPost;

      if (isNumber(amountAddedToPost)) {
        await shoppingServices.updateOrAddOne({
          req,
          res,
          amountToAdd: -amountAddedToPost,
        });

        if (amountAddedToPost !== amountToAdd) {
          return res.send({
            message:
              "Por falta de disponibilidad en el stock no se han podido agregar la cantidad solicitada. Se han agregado solamente las cantidades disponibles.",
          });
        }

        return res.send({});
      }

      await shoppingServices.updateOrAddOne({
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
        const oldShopping = await shoppingServices.findAndUpdateOne({
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

        if (oldShopping instanceof ServerResponse) return oldShopping;

        if (!oldShopping) {
          return res.send({});
        }

        if (oldShopping.posts.length === 1) {
          /**
           * si tenia 1 elemento, el cual ya fuel eliminado en el paso anterior entonces debe ser eliminada la shooping
           */
          await shoppingServices.deleteOne({
            res,
            req,
            query: {
              _id: oldShopping._id,
            },
          });
        }

        const shoppingPostToUpdate = oldShopping.posts.find((p) => {
          return isEqualIds(p.post._id, postId);
        });

        await postServices.updateStockAmount({
          req,
          res,
          amountToAdd: shoppingPostToUpdate?.count ?? 0,
        });

        return res.send({});
      }

      /**
       * Delete the whole shopping
       */
      const oldShopping = await shoppingServices.findOneAndDelete({
        res,
        req,
        query: {
          state: "CONSTRUCTION",
          routeName,
        },
      });

      if (oldShopping instanceof ServerResponse) return oldShopping;

      if (oldShopping) {
        const promises = oldShopping.posts.map(
          ({ post: { _id: postId }, count }) => {
            return new Promise((resolve) => {
              postServices
                .getOne({
                  res,
                  req,
                  postId,
                })
                .then((post) => {
                  if (post instanceof ServerResponse) {
                    return resolve(post);
                  }

                  req.post = post;
                  postServices
                    .updateStockAmount({
                      req,
                      res,
                      amountToAdd: count,
                    })
                    .then(() => {
                      resolve(null);
                    });
                });
            });
          }
        );

        await Promise.all(promises);
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
  //
  get_shopping_owner,
};
