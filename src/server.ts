import express from "express";
import { router } from "./router";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import { passportMiddlewareInitialize } from "./middlewares/passport";
import { commaSeparateQuery } from "./middlewares/comma-separate-query";
import { join } from "path";
import { appAssets, getAssetsDir } from "./config";
const DOC = process.env.DOC;

export const app = express();

if (DOC === "true") {
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(require("../swagger_output.json"), {
      explorer: true,
    })
  );
}

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use((req, res, next) => {
  /**
   * app assets
   */
  const isAppAsset = appAssets
    .map((assets) => req.url.startsWith(assets))
    .some(Boolean);

  if (isAppAsset) {
    return express.static(getAssetsDir())(req, res, next);
  }

  /**
   * backend
   */

  if (req.url.startsWith("/api")) {
    return next(); //backend
  }

  /**
   * front files
   */
  const exts = [".js", "css", "svg", "png"];
  const isFronFile = exts.map((ext) => req.url.includes(ext)).some(Boolean);
  const asereMarketFront = join(process.cwd(), `../asere-market-web/build`);

  if (isFronFile) {
    return express.static(asereMarketFront)(req, res, next);
  }

  /**
   * front index
   */
  res.sendFile(`${asereMarketFront}/index.html`);
});

// app.use(expressSession);
app.use(passportMiddlewareInitialize);
// app.use(passportMiddleware.authenticate("session"));

app.use(express.json());
app.use(commaSeparateQuery);
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
