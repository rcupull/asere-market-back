import { Router } from "express";
import { pagination } from "../../middlewares/pagination";
import { validators } from "../../middlewares/express-validator";
import { verifyUser } from "../../middlewares/verify";

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
    verifyUser,
    userHandles.get_users_userId()
  )
  .put(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.put_users_userId()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    pagination,
    userHandles.get_users_userId_business()
  )
  .post(
    validators.param("userId").notEmpty(),
    validators.body("name").notEmpty(),
    validators.body("category").notEmpty(),
    validators.body("routeName").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.post_users_userId_business()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business/allRouteNames")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    pagination,
    userHandles.get_users_userId_business_all_routeNames()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business/:routeName")
  .get(
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.get_users_userId_business_routeName()
  )
  .put(
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.put_users_userId_business_routeName()
  )
  .delete(
    //TODO add a middlware to check acces to this business
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.delete_users_userId_business_routeName()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/business/:routeName/postCategories")
  .get(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    verifyUser,
    businessHandles.get_business_post_categories()
  )
  .post(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.body("label").notEmpty(),
    validators.body("tag").notEmpty(),
    validators.handle,
    verifyUser,
    businessHandles.add_business_post_category()
  );

router
  .route("/user/:userId/business/:routeName/postCategories/:tag")
  .put(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.param("tag").notEmpty(),
    validators.handle,
    verifyUser,
    businessHandles.put_business_post_category()
  )
  .delete(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.param("tag").notEmpty(),
    validators.handle,
    verifyUser,
    businessHandles.del_business_post_category()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/image")
  .post(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    imageHandles.get_post_image()
  );

/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/posts")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    pagination,
    userHandles.get_users_userId_posts()
  )
  .post(
    validators.param("userId").notEmpty(),
    validators.body("routeName").notEmpty(),
    validators.body("name").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.post_users_userId_posts()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/posts/:postId")
  .get(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    userHandles.get_users_userId_posts_postId()
  )
  .put(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.put_users_userId_posts_postId()
  )
  .delete(
    //TODO add a middlware to check acces to this post
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.delete_users_userId_posts_postId()
  );

router
  .route("/user/:userId/posts/:postId/duplicate")
  .post(
    validators.param("userId").notEmpty(),
    validators.param("postId").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.post_users_userId_posts_postId_duplicate()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/user/:userId/payment/plan")
  .get(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    userHandles.get_users_userId_payment_plan()
  );

router
  .route("/user/:userId/payment/plan/purchase")
  .post(
    validators.param("userId").notEmpty(),
    validators.body("planType").notEmpty(),
    validators.body("validationPurchaseCode").notEmpty(),
    validators.handle,
    verifyUser,
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
    userHandles.put_users_userId_business_routeName_bulkActions_posts()
  )
  .delete(
    validators.param("userId").notEmpty(),
    validators.param("routeName").notEmpty(),
    validators.handle,
    userHandles.delete_users_userId_business_routeName_bulkActions_posts()
  );
