import { Router } from "express";
import { pagination } from "../../middlewares/pagination";
import { validators } from "../../middlewares/express-validator";
import { isLogged, isUserIdAccessible } from "../../middlewares/verify";

import { userHandles } from "./handles";
import { imageHandles } from "../images/handles";
import { businessHandles } from "../business/handles";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.get_users_userId()
  )
  .put(
    validators.param("userId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.put_users_userId()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/image")
  .post(
    validators.param("userId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    imageHandles.get_post_image()
  );

/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/posts/:postId")
  .get(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.get_users_userId_posts_postId()
  )
  .put(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.put_users_userId_posts_postId()
  )
  .delete(
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.delete_users_userId_posts_postId()
  );

router
  .route("/user/:userId/posts/:postId/duplicate")
  .post(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.post_users_userId_posts_postId_duplicate()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/payment/plan")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.get_users_userId_payment_plan()
  );

router
  .route("/user/:userId/payment/plan/purchase")
  .post(
    validators.param("userId").notEmpty(),
    validators.body("planType").notEmpty(),
    validators.body("validationPurchaseCode").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.post_users_userId_payment_plan_purchase()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business/:routeName/bulkActions/posts")
  .put(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.body("update").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.put_users_userId_business_routeName_bulkActions_posts()
  )
  .delete(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.delete_users_userId_business_routeName_bulkActions_posts()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/shopping/car")
  .post(
    validators.param("userId").notEmpty(),
    validators.body("postId").notEmpty(),
    validators.handle,
    isLogged,
    isUserIdAccessible,
    userHandles.post_users_userId_shopping_car()
  );
