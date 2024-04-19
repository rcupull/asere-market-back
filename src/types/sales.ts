import { BaseIdentity } from "./general";
import { Post } from "./post";

export type SaleState = "CONSTRUCTION" | "REQUESTED";

export interface Sale extends BaseIdentity {
  posts: Array<{
    post: Post;
    count: number;
    lastUpdatedDate: Date;
  }>;
  purchaserId: string;
  routeName: string;
  state: SaleState;
}
