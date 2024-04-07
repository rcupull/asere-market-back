import { Request, RequestHandler, Response } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { ServerResponse } from "http";
import { businessServices } from "../business/services";
import { Business } from "../../types/business";
import { RequestWithUser } from "../../middlewares/verify";
import { GetAllArgs, postServices } from "../post/services";
import { paymentPlans } from "../../constants/plans";
import { imagesServices } from "../images/services";
import { Post } from "../../types/post";
import { userServices } from "./services";
import { User } from "../../types/user";
import { UserModel } from "../../schemas/user";
import { PostModel } from "../../schemas/post";
import { isEmpty } from "../../utils/general";

const get_users_userId: () => RequestHandler = () => {
  return (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;

      const { userId } = params;

      const out = await userServices.getOne({
        res,
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
  return (req: RequestWithPagination, res) => {
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
        });

        if (currentUser instanceof ServerResponse) return currentUser;

        if (currentUser.profileImage) {
          await imagesServices.deleteOldImages({
            res,
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

const get_users_userId_business: () => RequestHandler = () => {
  return (req: RequestWithPagination, res) => {
    withTryCatch(req, res, async () => {
      const { paginateOptions, query, params } = req;

      const { userId } = params;

      const { routeNames, search } = query;

      const out = await businessServices.getAll({
        res,
        paginateOptions,
        createdBy: userId,
        routeNames,
        search,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_business: () => RequestHandler = () => {
  return (req: Request<any, any, Business>, res) => {
    withTryCatch(req, res, async () => {
      const { body, params } = req;

      const { userId } = params;

      const { name, category, routeName } = body;

      const out = await businessServices.addOne({
        category,
        name,
        routeName,
        userId,
        res,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req as unknown as RequestWithUser;
      const { routeName, userId } = params;

      const out = await businessServices.findOne({
        res,
        routeName,
        createdBy: userId,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const get_users_userId_business_all_routeNames: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req as unknown as RequestWithUser;
      const { userId } = params;

      const out = await businessServices.getAllWithoutPagination({
        res,
        createdBy: userId,
      });

      if (out instanceof ServerResponse) return;

      res.send(out.map(({ routeName }) => routeName));
    });
  };
};

const put_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { routeName } = params;

      const out = await businessServices.updateOne({
        res,
        query: {
          routeName,
        },
        update: body,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const delete_users_userId_business_routeName: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;

      const { routeName, userId } = params;

      const out = await businessServices.deleteOne({
        res,
        routeName,
        userId,
      });

      if (out instanceof ServerResponse) return;

      res.send();
    });
  };
};

/**
 *  //////////////////////////////////////////POSTS
 */

const get_users_userId_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { query, paginateOptions, params } =
        req as unknown as RequestWithPagination;

      const { userId } = params;

      const { search, routeNames, postCategoriesTags, postCategoriesMethod } =
        query;

      const out = await postServices.getAll({
        res,
        paginateOptions,
        routeNames,
        search,
        createdBy: userId,
        postCategoriesTags,
        postCategoriesMethod,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_posts: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { body, params } = req;

      const { userId } = params;

      const out = await postServices.addOne({
        ...body,
        createdBy: userId,
        res,
      });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const post_users_userId_posts_postId_duplicate: () => RequestHandler = () => {
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
      return post_users_userId_posts()(req, res, next);
    });
  };
};

const get_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId } = params;

      const out = await postServices.getOne({ res, postId });

      if (out instanceof ServerResponse) return;

      res.send(out);
    });
  };
};

const put_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params, body } = req;
      const { postId } = params;

      const { images } = body as Post;

      if (images?.length) {
        const currentPost = await postServices.getOne({
          postId,
          res,
        });

        if (currentPost instanceof ServerResponse) return currentPost;

        await imagesServices.deleteOldImages({
          res,
          newImagesSrcs: body.images,
          oldImagesSrcs: currentPost.images,
        });
      }

      const out = await postServices.updateOne({
        res,
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

const delete_users_userId_posts_postId: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { params } = req;
      const { postId, userId } = params;

      const currentPost = await postServices.getOne({
        postId,
        res,
      });

      if (currentPost instanceof ServerResponse) return currentPost;

      /**
       * Removing the post
       */
      const out = await postServices.deleteOne({
        res,
        postId,
        routeName: currentPost.routeName,
        userId,
      });

      if (out instanceof ServerResponse) return out;

      res.send(out);
    });
  };
};

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

const delete_users_userId_business_routeName_bulkActions_posts: () => RequestHandler =
  () => {
    return (req, res) => {
      withTryCatch(req, res, async () => {
        const { params, body } = req;

        const { userId, routeName } = params;
        const { ids, query } = body as {
          ids?: Array<string>;
          all?: boolean;
          query?: Pick<
            GetAllArgs,
            "postCategoriesMethod" | "postCategoriesTags" | "search"
          >;
        };

        if (ids?.length) {
          // delete selected posts

          const out = await postServices.deleteMany({
            res,
            userId,
            postIds: ids,
            routeName,
          });

          if (out instanceof ServerResponse) return out;
        } else if (!isEmpty(query)) {
          const { postCategoriesMethod, postCategoriesTags, search } = query;

          const posts = await postServices.getAllWithOutPagination({
            res,
            routeNames: [routeName],
            createdBy: userId,
            postCategoriesMethod,
            postCategoriesTags,
            search,
          });

          if (posts instanceof ServerResponse) return posts;

          const out = await postServices.deleteMany({
            res,
            userId,
            postIds: posts.map(({ _id }) => _id),
            routeName,
          });

          if (out instanceof ServerResponse) return out;
        } else {
          // get all post
          const posts = await postServices.getAllWithOutPagination({
            res,
            routeNames: [routeName],
            createdBy: userId,
          });

          if (posts instanceof ServerResponse) return posts;

          const out = await postServices.deleteMany({
            res,
            userId,
            postIds: posts.map(({ _id }) => _id),
            routeName,
          });

          if (out instanceof ServerResponse) return out;
        }

        res.send();
      });
    };
  };
const put_users_userId_business_routeName_bulkActions_posts: () => RequestHandler =
  () => {
    return (req, res) => {
      withTryCatch(req, res, async () => {
        const { params, body } = req;

        const { userId, routeName } = params;
        const { ids, update, query } = body as {
          ids?: Array<string>;
          all?: boolean;
          update: {
            hidden?: boolean;
          };
          query?: Pick<
            GetAllArgs,
            "postCategoriesMethod" | "postCategoriesTags" | "search"
          >;
        };

        const { hidden } = update || {};

        if (ids?.length) {
          const out = await postServices.updateMany({
            res,
            query: {
              _id: { $in: ids },
            },
            update: {
              hidden,
            },
          });

          if (out instanceof ServerResponse) return out;
        } else if (!isEmpty(query)) {
          // TODO esto puede ser mejorado en una sola quuery
          const { postCategoriesMethod, postCategoriesTags, search } = query;

          const posts = await postServices.getAllWithOutPagination({
            res,
            routeNames: [routeName],
            createdBy: userId,
            postCategoriesMethod,
            postCategoriesTags,
            search,
          });

          if (posts instanceof ServerResponse) return posts;

          const out = await postServices.updateMany({
            res,
            query: {
              _id: { $in: posts.map(({ _id }) => _id) },
            },
            update: {
              hidden,
            },
          });

          if (out instanceof ServerResponse) return out;
        } else {
          // get all posts
          const posts = await postServices.getAllWithOutPagination({
            res,
            routeNames: [routeName],
            createdBy: userId,
          });

          if (posts instanceof ServerResponse) return posts;

          const out = await postServices.updateMany({
            res,
            query: {
              _id: { $in: posts.map(({ _id }) => _id) },
            },
            update: {
              hidden,
            },
          });

          if (out instanceof ServerResponse) return out;
        }

        res.send();
      });
    };
  };
export const userHandles = {
  get_users_userId,
  put_users_userId,
  get_users_userId_business,
  post_users_userId_business,
  get_users_userId_business_routeName,
  get_users_userId_business_all_routeNames,
  put_users_userId_business_routeName,
  delete_users_userId_business_routeName,
  //
  get_users_userId_posts,
  post_users_userId_posts,
  //
  get_users_userId_posts_postId,
  put_users_userId_posts_postId,
  delete_users_userId_posts_postId,
  //
  post_users_userId_posts_postId_duplicate,
  //
  get_users_userId_payment_plan,
  post_users_userId_payment_plan_purchase,
  // bulk actions
  delete_users_userId_business_routeName_bulkActions_posts,
  put_users_userId_business_routeName_bulkActions_posts,
};
