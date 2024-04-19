import { Router } from "express";
import { validators } from "../../middlewares/express-validator";
import { isLogged, isUserIdAccessible } from "../../middlewares/verify";

import { pagination } from "../../middlewares/pagination";
import { shoppingHandles } from "./handles";

export const router = Router();

/////////////////////////////////////////////////////////////////

router
  .route("/shopping")
  .get(
    validators.query("routeName").notEmpty(),
    validators.handle,
    isLogged,
    shoppingHandles.get_shopping()
  )
  .post(
    validators.body("routeName").notEmpty(),
    validators.body("postId").notEmpty(),
    validators.handle,
    isLogged,
    shoppingHandles.post_shopping()
  )
  .delete(
    validators.body("routeName").notEmpty(),
    validators.handle,
    isLogged,
    shoppingHandles.delete_shopping()
  );

router
  .route("/shopping/:shoppingId")
  .get(
    validators.param("shoppingId").notEmpty(),
    validators.handle,
    isLogged,
    shoppingHandles.get_shopping_shoppingId()
  );

router
  .route("/shopping/:shoppingId/makeOrder")
  .post(
    validators.param("shoppingId").notEmpty(),
    validators.handle,
    isLogged,
    shoppingHandles.post_shopping_shoppingId_make_order()
  );
