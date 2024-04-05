import { Response } from "express";
import { ServerResponse } from "http";
import {
  ApplySchemaOptions,
  DefaultSchemaOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  Schema,
} from "mongoose";

export type AnyRecord = Record<string, any>;

export interface BaseIdentity {
  _id: string;
  createdAt: string;
}

export type QueryHandle<Args extends AnyRecord = AnyRecord, R = void> = (
  args: Args & { res: Response }
) => Promise<R | ServerResponse>;

export type PaymentPlanType = "free" | "beginner" | "professional" | "company";
export type PaymentPlanStatus = "current" | "validatingPurchase" | "historical";

export interface PaymentPlan {
  type: PaymentPlanType;
  price: number; //CUP
  trialTime: number | null; // days for free plan
  //
  maxBussinessByUser: number;
  maxPostsByBussiness: number;
  maxImagesByPosts: number;
  maxImagesByBusinessBanner: number;
}

export interface Image {
  src: string;
  width: number;
  height: number;
  href?: string;
}

export type SchemaDefinition<Type = any> = ApplySchemaOptions<
  ObtainDocumentType<any, Type, ResolveSchemaOptions<DefaultSchemaOptions>>,
  ResolveSchemaOptions<DefaultSchemaOptions>
>;

type EmptyObject<T> = { [K in keyof T]?: never };
export type EmptyObjectOf<T> = EmptyObject<T> extends T
  ? EmptyObject<T>
  : never;
