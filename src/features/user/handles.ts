import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import { RequestWithUser } from "../../middlewares/verify";
import { GetAllArgs, postServices } from "../post/services";
import { paymentPlans } from "../../constants/plans";
import { imagesServices } from "../images/services";
import { userServices } from "./services";
import { User } from "../../types/user";
import { UserModel } from "../../schemas/user";
import { isEmpty } from "../../utils/general";

const get_users_userId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;

      const { userId } = params;

      const out = await userServices.getOne({
        res,
        req,
        query: {
          _id: userId,
        },
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const put_users_userId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;

      const { userId } = params;

      const { profileImage } = body as User;

      /**
       * Delete old profile image
       */
      if (profileImage) {
        const currentUser = await userServices.getOne({
          query: {
            _id: userId,
          },
          res,
          req,
        });

        if (currentUser instanceof ServerResponse) return currentUser;

        if (currentUser.profileImage) {
          await imagesServices.deleteOldImages({
            res,
            req,
            newImagesSrcs: [profileImage],
            oldImagesSrcs: [currentUser.profileImage],
          });
        }
      }

      /**
       * Update
       */
      const out = await userServices.updateOne({
        res,
        req,
        query: {
          _id: userId,
        },
        update: body,
      });

      if (out instanceof ServerResponse) return out;

      res.send(out);
    });
  };
};

/**
 *  //////////////////////////////////////////POSTS
 */

const get_users_userId_payment_plan: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { user } = req as RequestWithUser;
      const planHistory = user.payment.planHistory;
      const { planType } = planHistory[planHistory.length - 1] || {}; // always the last plan is the curent
      const currentPlan = paymentPlans[planType];

      res.send(currentPlan);
    });
  };
};
const post_users_userId_payment_plan_purchase: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { user, body } = req as RequestWithUser;
      const { planType, validationPurchaseCode } = body;

      await UserModel.updateOne(
        { _id: user._id },
        {
          $push: {
            "payment.planHistory": [
              {
                planType,
                dateOfPurchase: new Date().toISOString(),
                trialMode: false,
                status: "validatingPurchase",
                validationPurchaseCode,
              },
            ],
          },
        }
      );

      res.send({});
    });
  };
};

const post_users_userId_shopping_car: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req as RequestWithUser;
      const { userId } = params;
      const { postId } = body;

      const user = await userServices.getOne({
        res,
        req,
        query: {
          _id: userId,
        },
      });

      if (user instanceof ServerResponse) return user;

      const existMeta = !!user.shoppingCart?.added.find(
        ({ postId: _postId }) => _postId === postId
      );

      if (existMeta) {
        await userServices.updateOne({
          res,
          req,
          query: {
            _id: userId,
          },
          update: {
            $set: {
              "shoppingCart.added.$[meta].lastUpdatedDate": new Date(),
            },
            $inc: {
              "shoppingCart.added.$[meta].count": 1,
            },
          },
          options: {
            arrayFilters: [
              {
                "meta.postId": postId,
              },
            ],
          },
        });
      } else {
        await userServices.updateOne({
          res,
          req,
          query: {
            _id: userId,
          },
          update: {
            $push: {
              "shoppingCar.added": {
                postId,
                count: 1,
                lastUpdatedDate: new Date(),
              },
            },
          },
        });
      }

      res.send({});
    });
  };
};

export const userHandles = {
  get_users_userId,
  put_users_userId,
  //
  get_users_userId_payment_plan,
  post_users_userId_payment_plan_purchase,
  // bulk actions
  post_users_userId_shopping_car,
};
