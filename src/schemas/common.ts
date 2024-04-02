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
  size: {
    type: String,
    enum: ["small", "medium", "long"],
    default: "medium",
  },
  name: {
    type: String,
    enum: ["none", "basic"],
    required: true,
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
  whatsAppContact: {
    type: String,
    enum: ["none", "xsLink_lgQR"],
    default: "none",
  },
});

export const PostsLayoutSectionSchema = new Schema<PostsLayoutSection>({
  name: { type: String },
  hiddenName: { type: Boolean, default: false },
  searchLayout: {
    type: String,
    enum: [
      "none",
      "left",
      "center",
      "right",
      "postCategories",
      "postCategoriesScrollable",
      "postCategoriesExcluded",
      "postCategoriesExcludedScrollable",
    ],
    default: "none",
  },
  postCategoriesTags: { type: [String] },
  showIn: {
    type: [
      {
        type: String,
        enum: ["businessPage", "postPage"],
      },
    ],
    default: [],
  },
  type: {
    type: String,
    enum: ["grid", "oneRowSlider"],
    default: "grid",
  },
  postCardLayout: {
    type: PostCardLayoutSchema,
  },
});

export const PostLayoutSchema = new Schema<PostsLayout>({
  sections: {
    type: [PostsLayoutSectionSchema],
    default: [],
  },
});
