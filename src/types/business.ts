import { BaseIdentity, Image } from "./general";
import { Schema } from "mongoose";

export type BusinessCategory = "food" | "tool" | "clothing" | "service";

export type PostsLayoutType =
  | "none"
  | "grid"
  | "slicesHorizontal"
  | "alternateSummary";
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

export interface PostsLayout {
  type: PostsLayoutType;
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
  search?: SearchLayout;
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
  layoutsMobile?: BusinessLayouts;
  aboutUsPage?: BusinessAboutUsPage;
}
