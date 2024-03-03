import { PaginateModel, Schema, model } from "mongoose";
import { Business } from "./types";
import mongoosePaginate from "mongoose-paginate-v2";
import { createdAtSchemaDefinition } from "../../utils/schemas";
import { PostModel } from "../post/schemas";

const BusinessSchema = new Schema<Business>({
  ...createdAtSchemaDefinition,
  name: { type: String, required: true },
  routeName: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  category: { type: String, enum: ["food", "tool", "clothing", "service"] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bannerImages: {
    type: [
      {
        src: { type: String, required: true },
      },
    ],
    default: [],
  },
  logo: {
    type: {
      src: { type: String, required: true },
    },
    default: null,
  },
  socialLinks: {
    face: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
  },
  layouts: {
    banner: {
      type: {
        type: String,
        enum: ["none", "static", "swipableClassic"],
        default: "static",
      },
    },
    posts: {
      type: {
        type: String,
        enum: ["none", "grid", "slicesHorizontal", "alternateSummary"],
        default: "grid",
      },
    },
    footer: {
      type: {
        type: String,
        enum: ["none", "basic"],
        default: "basic",
      },
    },
    search: {
      type: {
        type: String,
        enum: ["none", "left", "center", "right"],
        default: "right",
      },
    },
  },
  layoutsMobile: {
    banner: {
      type: {
        type: String,
        enum: ["none", "static", "swipableClassic"],
        default: "none",
      },
    },
    posts: {
      type: {
        type: String,
        enum: ["none", "grid", "slicesHorizontal", "alternateSummary"],
        default: "none",
      },
    },
    footer: {
      type: {
        type: String,
        enum: ["none", "basic"],
        default: "basic",
      },
    },
    search: {
      type: {
        type: String,
        enum: ["none", "left", "center", "right"],
        default: "right",
      },
    },
  },
});

BusinessSchema.plugin(mongoosePaginate);

BusinessSchema.pre("updateOne", async function (next) {
  //@ts-expect-error ignored
  const { hidden } = this.getUpdate();
  const { routeName } = this.getQuery();

  if (hidden !== undefined) {
    await PostModel.updateMany(
      {
        routeName,
      },
      {
        hiddenBusiness: hidden,
      }
    );
  }

  next();
});

export const BusinessModel = model<Business, PaginateModel<Business>>(
  "Business",
  BusinessSchema,
  "business"
);
