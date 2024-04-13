import { Schema } from "mongoose";
import {
  PostCardLayout,
  PostLayoutSalesMethod,
  PostPageLayout,
  PostsLayout,
  PostsLayoutSection,
} from "../types/business";
import { SchemaDefinition } from "../types/general";

const PostLayoutSalesMethodDefinition: SchemaDefinition<PostLayoutSalesMethod> =
  {
    type: String,
    enum: ["none", "whatsApp_xsLink_lgQR", "salesCart"],
  };

export const PostCardLayoutSchema = new Schema<PostCardLayout>({
  images: {
    type: String,
    enum: ["static", "hoverZoom", "slider", "switch", "rounded"],
    default: "static",
  },
  size: {
    type: String,
    enum: ["small", "medium", "long"],
    default: "medium",
  },
  metaLayout: {
    type: String,
    enum: ["basic", "verticalCentered"],
    default: "basic",
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
  salesMethod: PostLayoutSalesMethodDefinition,
});

export const PostPageLayoutSchema = new Schema<PostPageLayout>({
  salesMethod: PostLayoutSalesMethodDefinition,
  postsSectionsBelowIds: { type: [String] },
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
