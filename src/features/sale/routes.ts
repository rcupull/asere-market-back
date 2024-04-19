import { Router } from "express";
import { validators } from "../../middlewares/express-validator";
import { isLogged, isUserIdAccessible } from "../../middlewares/verify";

import { pagination } from "../../middlewares/pagination";
import { saleHandles } from "./handles";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/sale")
  .get(
    validators.query("routeName").notEmpty(),
    validators.handle,
    isLogged,
    saleHandles.get_sales()
  )
  .post(
    validators.body("routeName").notEmpty(),
    validators.body("postId").notEmpty(),
    validators.handle,
    isLogged,
    saleHandles.post_sale()
  )
  .delete(
    validators.body("routeName").notEmpty(),
    validators.handle,
    isLogged,
    saleHandles.delete_sale()
  );

router
  .route("/sale/:saleId")
  .get(
    validators.param("saleId").notEmpty(),
    validators.handle,
    isLogged,
    saleHandles.get_sale_saleId()
  );

router
  .route("/sale/:saleId/makeOrder")
  .post(
    validators.param("saleId").notEmpty(),
    validators.handle,
    isLogged,
    saleHandles.post_sale_saleId_make_order()
  );
