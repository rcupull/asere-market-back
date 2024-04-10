import { Request, RequestHandler, Response } from "express";
import { withTryCatch } from "../utils/error";
import { User } from "../types/user";
import { AnyRecord } from "../types/general";
import { ServerResponse } from "http";
import { postServices } from "../features/post/services";
import { isEqualIds } from "../utils/general";
import { passportJwtMiddleware } from "./passport";
import { get401Response, get404Response } from "../utils/server-response";

export const isLogged = passportJwtMiddleware;

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = req.user as User;

  if (user.role == "admin") return next();

  get401Response({ res, json: { message: "The user is not an admin" } });
};

export const isUserIdAccessible: RequestHandler = (req, res, next) => {
  const user = req.user as User;
  const { userId } = req.params;

  if (!userId) {
    return get404Response({
      res,
      json: { message: "UserId not found" },
    });
  }

  if (user._id.toString() === userId) return next();

  get401Response({
    res,
    json: { message: "The user has not access to this data" },
  });
};

export type RequestWithUser<
  P = AnyRecord,
  ResBody = any,
  ReqBody = any,
  ReqQuery = AnyRecord,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & {
  user: User;
};

/**
 * Should be put it after isLogged
 */
// export const verifyBussiness: RequestHandler = (req, res, next) => {
//   withTryCatch(req, res, async () => {
//     const user = req.user as unknown as User | undefined;
//     const routeName = req.params.routeName as string | undefined;

//     if (!routeName) {
//       return res
//         .sendStatus(404)
//         .json({ message: "The businessId does not exist" });
//     }

//     if (!user) {
//       return res.sendStatus(404).json({ message: "The user does not exist" });
//     }

//     const out = await businessServices.findOne({
//       res,
//       routeName,
//     });

//     if (out instanceof ServerResponse) return;

//     const { createdBy } = out;

//     if (createdBy !== user._id) {
//       return res
//         .sendStatus(401)
//         .json({ message: "Not have access to this business" });
//     }

//     //@ts-expect-error
//     req["business"] = out;

//     next();
//   });
// };

export const verifyPost: RequestHandler = (req, res, next) => {
  withTryCatch(req, res, async () => {
    const user = req.user as User;

    if (!user) {
      return res
        .sendStatus(404)
        .json({ message: "We should have some value in user in this point" });
    }

    const postId = req.params.postId as string | undefined;

    if (!postId) {
      return res
        .sendStatus(404)
        .json({ message: "We should have some value in postId in this point" });
    }

    const out = await postServices.getOne({
      res,
      postId,
    });

    if (out instanceof ServerResponse) return out;

    const { createdBy } = out;

    if (!isEqualIds(createdBy, user._id)) {
      return res
        .sendStatus(401)
        .json({ message: "Have not access to this post" });
    }

    next();
  });
};

// export const getVerifyRole =
//   (roleToCheck: UserRole): RequestHandler =>
//   (req, res, next) => {
//     withTryCatch(req, res, async () => {
//       //@ts-expect-error
//       const user = req.user as User; // we have access to the user object from the request

//       const { role } = user; // extract the user role
//       // check if user has no advance privileges
//       // return an unathorized response
//       if (role !== roleToCheck) {
//         return res.status(401).json({
//           message: "Wrong role. You are not authorized to do this action.",
//         });
//       }
//       next();
//     });
//   };
