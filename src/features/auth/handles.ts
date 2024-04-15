import { RequestHandler } from "../../types/general";
import { withTryCatch } from "../../utils/error";
import { ServerResponse } from "http";
import { UserModel } from "../../schemas/user";
import { v4 as uuid } from "uuid";
import { SessionModel, ValidationCodeModel } from "../../schemas/auth";
import { userServices } from "../user/services";
import { sendEmail } from "../email";
import { User } from "../../types/user";
import {
  get200Response,
  get201Response,
  get401Response,
} from "../../utils/server-response";

const post_signIn: () => RequestHandler = () => {
  return (req, res, next) => {
    withTryCatch(req, res, async () => {
      const user = req.user as User;
      const { validated } = user;

      if (!validated) {
        return get401Response({
          res,
          json: { message: "The user is no validated" },
        });
      }
      //@ts-expect-error ignore
      const { password: ommited, ...userData } = user.toJSON();

      get200Response({
        res,
        json: { token: user.generateAccessJWT(), user: userData },
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
        return get401Response({
          res,
          json: { message: "The session does not exist" },
        });
      }

      await SessionModel.deleteOne({ token });

      return get200Response({
        res,
        json: { message: "the session was closed successfully" },
      });
    });
  };
};

const post_signUp: () => RequestHandler = () => {
  return (req, res) => {
    withTryCatch(req, res, async () => {
      const { email, password, name, canCreateBusiness } = req.body;

      const newUser = await userServices.addOne({
        email,
        name,
        password,
        canCreateBusiness,
        res,
        req,
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

      get201Response({
        res,
        json: { message: "User registered successfully" },
      });
    });
  };
};

const post_validate: () => RequestHandler = () => {
  return async (req, res) => {
    withTryCatch(req, res, async () => {
      const { email, code } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return get401Response({
          res,
          json: { message: "This user does not exist" },
        });
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

      get201Response({
        res,
        json: { message: "User validated successfully" },
      });
    });
  };
};

export const authHandles = {
  post_signIn,
  post_signOut,
  post_signUp,
  post_validate,
};
