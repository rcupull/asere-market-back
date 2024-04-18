import { Router } from "express";
import { router as postRouter } from "./features/post/routes";
import { router as userRouter } from "./features/user/routes";
import { router as authRouter } from "./features/auth/routes";
import { router as businessRouter } from "./features/business/routes";
import { router as paymentPlansRouter } from "./features/paymentPlans/routes";
import { router as adminRouter } from "./features/admin/routes";
import { router as catalogsRouter } from "./features/catalogs/routes";
import { router as imagesRouter } from "./features/images/routes";
import { router as saleRouter } from "./features/sale/routes";

export const router = Router();

router.use(
  "/",
  authRouter,
  userRouter,
  postRouter,
  businessRouter,
  paymentPlansRouter,
  adminRouter,
  catalogsRouter,
  imagesRouter,
  saleRouter
);

export default router;
