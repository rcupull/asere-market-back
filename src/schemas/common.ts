import { Schema } from "mongoose";
import {
  PostCardLayout,
  PostsLayout,
  PostsLayoutSection,
} from "../types/business";

export const PostCardLayoutSchema = new Schema<PostCardLayout>({
  images: {
    type: String,
    enum: ["static", "hoverZoom", "slider", "switch"],
    default: "static",
  },
  name: {
    type: String,
    enum: ["none", "basic"],
    default: "basic",
  },
  price: {
    type: String,
    enum: ["none", "basic", "smallerCurrency", "usdCurrencySymbol"],
    default: "basic",
  },
  discount: {
    type: String,
    enum: ["none", "savedPercent", "savedMoney"],
    default: "none",
  },
});

export const PostsLayoutSectionSchema = new Schema<PostsLayoutSection>({
  name: { type: String },
  showName: { type: Boolean },
  searchLayout: {
    type: String,
    enum: [],
  },
  showSearch: { type: Boolean },
  //
  postCategoriesTags: { type: [String] },
  showCategories: { type: Boolean },
  hidden: { type: Boolean },
  //
  type: {
    type: String,
    enum: ["grid", "slicesHorizontal", "alternateSummary"],
    default: "grid",
  },
  postCardLayout: PostCardLayoutSchema,
});

export const PostLayoutSchema = new Schema<PostsLayout>({
  sections: [PostsLayoutSectionSchema],
});
