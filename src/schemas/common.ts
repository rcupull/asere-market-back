import {
  ApplySchemaOptions,
  DefaultSchemaOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  Schema,
  SchemaDefinitionType,
} from "mongoose";
import {
  PostCardLayout,
  PostLayoutContact,
  PostPageLayout,
  PostsLayout,
  PostsLayoutSection,
} from "../types/business";
import { SchemaDefinition } from "../types/general";

const PostLayoutContactDefinition: SchemaDefinition<PostLayoutContact> = {
  type: String,
  enum: ["none", "whatsApp_xsLink_lgQR"],
};

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
  contact: PostLayoutContactDefinition,
});

export const PostPageLayoutSchema = new Schema<PostPageLayout>({
  contact: PostLayoutContactDefinition,
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
