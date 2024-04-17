import {
  BaseIdentity,
  Image,
  PaymentPlanStatus,
  PaymentPlanType,
} from "./general";

export type UserRole = "user" | "admin";

export interface UserShoppingCart {
  added: Array<{
    postId: string;
    routeName: string;
    count: number;
    lastUpdatedDate: Date;
  }>;
}

export interface User extends BaseIdentity {
  name: string;
  email: string;
  password: string;
  passwordVerbose: string; // remove after migration
  role: UserRole;
  validated: boolean;
  canCreateBusiness: boolean;
  profileImage?: Image;
  generateAccessJWT: () => string;
  payment: {
    planHistory: [
      {
        planType: PaymentPlanType;
        dateOfPurchase: string;
        trialMode: boolean;
        status: PaymentPlanStatus;
        validationPurchaseCode?: string;
      }
    ];
  };
  shoppingCart?: UserShoppingCart;
}
