import { Router } from "express";
import { router as postRouter } from "./features/post/routes";
import { router as userRouter } from "./features/user/routes";
import { router as authRouter } from "./features/auth/routes";
import { router as businessRouter } from "./features/business/routes";
import { router as paymentPlansRouter } from "./features/paymentPlans/routes";
import { router as adminRouter } from "./features/admin/routes";

export const router = Router();

router.use(
  "/",
  authRouter,
  userRouter,
  postRouter,
  businessRouter,
  paymentPlansRouter,
  adminRouter
);

export default router;
