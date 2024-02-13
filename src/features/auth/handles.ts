import { RequestHandler } from "express";
import { withTryCatch } from "../../utils/error";
import { RequestWithPagination } from "../../middlewares/pagination";
import { ServerResponse } from "http";
import { UserModel } from "../user/schemas";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { SessionModel, ValidationCodeModel } from "./schemas";
import { userServices } from "../user/services";
import { sendEmail } from "../email";

const post_signIn: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (!user.validated) {
        return res.status(401).json({
          message: "The user has not been validated",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = user.generateAccessJWT();

      const newSession = new SessionModel({
        token,
        userId: user._id,
      });

      await newSession.save();

      const { password: ommited, ...userData } = user.toJSON();

      res.status(200).json({
        user: userData,
        token,
      });
    });
  };
};

const post_signOut: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { token } = req.body;

      const session = await SessionModel.findOne({ token });

      if (!session) {
        return res.status(401).json({
          message: "the session does not exist",
        });
      }

      await SessionModel.deleteOne({ token });

      return res.status(201).json({
        message: "the session was closed successfully",
      });
    });
  };
};

const post_signUp: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { email, password, name } = req.body;

      const newUser = await userServices.addOne({
        email,
        name,
        password,
        res,
      });

      if (newUser instanceof ServerResponse) return;

      // send validation code by email
      const code = uuid().slice(0, 4).toUpperCase();

      await sendEmail({ email, code });
      const newValidationCode = new ValidationCodeModel({
        code,
        userId: newUser._id,
      });
      await newValidationCode.save();

      res.status(201).json({ message: "User registered successfully" });
    });
  };
};

const post_validate: () => RequestHandler = () => {
  return async (req, res) => {
    withTryCatch(req, res, async () => {
      const { email, code } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "This user does not exist" });
      }

      //check validation code
      const validationCode = await ValidationCodeModel.findOne({
        code,
        userId: user.id,
      });
      if (!validationCode) {
        return res
          .status(400)
          .json({ message: "This validation code does not exist" });
      }

      //validate user
      user.validated = true;
      await user.save();

      //delete validation code
      await ValidationCodeModel.deleteOne({ _id: validationCode._id });

      res.status(201).json({ message: "User validated successfully" });
    });
  };
};

export const authHandles = {
  post_signIn,
  post_signOut,
  post_signUp,
  post_validate,
};
