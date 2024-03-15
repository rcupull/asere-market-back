import { Router } from "express";
import { verifyUser } from "../../middlewares/verify";

import { adminHandles } from "./handles";
import { validators } from "../../middlewares/express-validator";

export const router = Router();

/////////////////////////////////////////////////////////////////

router.route("/admin/users").get(verifyUser, adminHandles.get_users());

router
  .route("/admin/users/:userId")
  .delete(
    validators.param("userId").notEmpty(),
    validators.handle,
    verifyUser,
    adminHandles.del_users_userId()
  );

router
  .route("/admin/users/:userId/plans/:planId")
  .put(
    validators.param("userId").notEmpty(),
    validators.param("planId").notEmpty(),
    validators.handle,
    verifyUser,
    adminHandles.put_users_userId_plans_planId()
  );
