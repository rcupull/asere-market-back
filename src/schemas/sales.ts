import { PaginateModel, Schema, model } from "mongoose";
import { createdAtSchemaDefinition } from "../utils/schemas";
import { Sale } from "../types/sales";
import { PostSchema } from "./post";

const SaleSchema = new Schema<Sale>({
  ...createdAtSchemaDefinition,
  posts: {
    type: [
      {
        _id: false,
        post: { type: PostSchema, required: true },
        count: { type: Number, required: true },
        lastUpdatedDate: { type: Date, required: true },
      },
    ],
  },
  purchaserId: { type: String, required: true },
  routeName: { type: String, required: true },
  state: { type: String, enum: ["CONSTRUCTION", "REQUESTED"], required: true },
});

export const SaleModel = model<Sale>("Sale", SaleSchema, "sales");
