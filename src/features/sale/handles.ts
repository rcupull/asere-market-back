import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import { getUserNotFoundResponse } from "../../utils/server-response";
import { saleServices } from "./services";

const get_sales: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { query, user } = req;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { routeName } = query;

      const out = await saleServices.getAll({
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

const post_sale: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const user = req.user;

      if (!user) {
        return getUserNotFoundResponse({ res });
      }

      const { body } = req;

      const { postId, amountToAdd = 1, routeName } = body;

      await saleServices.updateOrAddOne({
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

const delete_sale: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { body } = req;

      const { routeName, postId } = body;

      if (postId) {
        await saleServices.updateOne({
          res,
          req,
          query: {
            state: "construction",
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
        await saleServices.deleteOne({
          res,
          req,
          query: {
            state: "construction",
            routeName,
          },
        });
      }

      res.send({});
    });
  };
};

export const saleHandles = {
  get_sales,
  post_sale,
  delete_sale,
};
