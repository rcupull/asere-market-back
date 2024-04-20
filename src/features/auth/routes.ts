import { Router } from "express";

import { validators } from "../../middlewares/express-validator";
import { authHandles } from "./handles";
import { passportLocalMiddleware } from "../../middlewares/passport";

export const router = Router();
/////////////////////////////////////////////////////////////////

router
  .route("/auth/sign-in")
  .post(
    validators.body("username").notEmpty(),
    validators.body("password").notEmpty(),
    validators.handle,
    passportLocalMiddleware,
    authHandles.post_signIn()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/auth/sign-out")
  .post(
    validators.body("token").notEmpty(),
    validators.handle,
    authHandles.post_signOut()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/auth/sign-up")
  .post(
    validators.body("email").notEmpty().isEmail(),
    validators.body("password").notEmpty(),
    validators.body("name").notEmpty(),
    validators.body("canCreateBusiness").notEmpty(),
    validators.handle,
    authHandles.post_signUp()
  );
/////////////////////////////////////////////////////////////////

router
  .route("/auth/validate")
  .post(
    validators.body("code").notEmpty(),
    validators.handle,
    authHandles.post_validate()
  );
