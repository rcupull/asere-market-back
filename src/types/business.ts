import { BaseIdentity, Image } from "./general";
import { Schema } from "mongoose";

export type BusinessCategory = "food" | "tool" | "clothing" | "service";

export type PostsLayoutSectionType =
  | "grid"
  | "slicesHorizontal" // FUTURE
  | "alternateSummary"; // FUTURE

export type BannerLayoutType = "none" | "static" | "swipableClassic";
export type SearchLayoutType =
  | "none"
  | "left"
  | "center"
  | "right"
  | "postCategories"
  | "postCategoriesScrollable"
  | "postCategoriesExcluded"
  | "postCategoriesExcludedScrollable";

export type FooterLayoutType = "none" | "basic";

export interface PostsLayoutSection {
  name?: string;
  hidden?: boolean;

  hiddenName?: boolean;
  //
  searchLayout?: SearchLayoutType;
  //
  postCategoriesTags?: Array<string>;
  //
  type: PostsLayoutSectionType;
  postCardLayout?: PostCardLayout;
}
export interface PostsLayout {
  sections?: Array<PostsLayoutSection>;
}

export type PostCardLayoutImages = "static" | "hoverZoom" | "slider" | "switch";
export type PostCardSize = "small" | "medium" | "long";
export type PostCardLayoutName = "none" | "basic";
export type PostCardLayoutPrice =
  | "none"
  | "basic"
  | "smallerCurrency"
  | "usdCurrencySymbol";
export type PostCardLayoutDiscount = "none" | "savedPercent" | "savedMoney";

export interface PostCardLayout {
  images?: PostCardLayoutImages;
  size?: PostCardSize;
  name?: PostCardLayoutName;
  price?: PostCardLayoutPrice;
  discount?: PostCardLayoutDiscount;
}

export interface BannerLayout {
  type: BannerLayoutType;
}

export interface SearchLayout {
  type: SearchLayoutType;
}

export interface FooterLayout {
  type: FooterLayoutType;
}

export interface BusinessLayouts {
  posts?: PostsLayout;
  footer?: FooterLayout;
  banner?: BannerLayout;
}

export interface PostCategory {
  label: string;
  tag: string;
  hidden?: boolean;
}

export interface BusinessAboutUsPage {
  visible?: boolean;
  title?: string;
  description?: string; // checkeditor text
}

export interface Business extends BaseIdentity {
  name: string;
  routeName: string;
  category: BusinessCategory;
  createdBy: Schema.Types.ObjectId; // userId
  hidden?: boolean;
  bannerImages?: Array<Image>;
  logo?: Image;
  postCategories?: Array<PostCategory>;
  socialLinks: {
    face?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  layouts?: BusinessLayouts;
  aboutUsPage?: BusinessAboutUsPage;
}
