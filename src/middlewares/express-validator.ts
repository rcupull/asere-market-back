import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  validationResult,
  query,
  param,
  body,
  header,
} from "express-validator";
import { AnyRecord } from "../types";

const handle: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let error: AnyRecord = {};
    errors.array().forEach((err) => {
      //@ts-expect-error ignore
      error[`${req.method} ${req.originalUrl} ${err.path}`] = err.msg;
    });
    return res.status(422).json({ error });
  }
  next();
};

export const validators = {
  query,
  param,
  body,
  header,
  handle,
};
