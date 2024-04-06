import { FilterQuery, PaginateOptions } from "mongoose";
import { QueryHandle } from "../../types/general";
import { PostModel } from "../../schemas/post";
import { Post } from "../../types/post";
import {
  PaginateResult,
  paginationCustomLabels,
} from "../../middlewares/pagination";
import { imagesServices } from "../images/services";
import { ServerResponse } from "http";

export interface GetAllArgs {
  paginateOptions?: PaginateOptions;
  routeNames?: Array<string>;
  search?: string;
  hidden?: boolean;
  hiddenBusiness?: boolean;
  createdBy?: string;
  //
  postCategoriesTags?: Array<string>;
  postCategoriesMethod?: "some" | "every";
}

export type PostUpdate = Partial<
  Pick<
    Post,
    | "currency"
    | "description"
    | "images"
    | "price"
    | "amountAvailable"
    | "clothingSizes"
    | "colors"
    | "details"
    | "highlights"
    | "hidden"
    | "hiddenBusiness"
    | "name"
    | "reviews"
    | "postCategoriesTags"
    | "discount"
    | "postPageLayout"
  >
>;

const getAll: QueryHandle<GetAllArgs, PaginateResult<Post>> = async ({
  paginateOptions = {},
  routeNames,
  search,
  hiddenBusiness,
  hidden,
  createdBy,
  postCategoriesTags,
  postCategoriesMethod,
}) => {
  const filterQuery: FilterQuery<Post> = {};

  ///////////////////////////////////////////////////////////////////

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }

  if (postCategoriesTags) {
    switch (postCategoriesMethod) {
      case "every": {
        filterQuery.postCategoriesTags = { $all: postCategoriesTags };
        break;
      }
      case "some": {
        filterQuery.postCategoriesTags = { $in: postCategoriesTags };
        break;
      }
      default: {
        filterQuery.postCategoriesTags = { $all: postCategoriesTags };
        break;
      }
    }
  }

  ///////////////////////////////////////////////////////////////////

  if (routeNames?.length) {
    filterQuery.routeName = { $in: routeNames };
  }

  ///////////////////////////////////////////////////////////////////

  if (hidden !== undefined) {
    filterQuery.hidden = hidden;
  }

  ///////////////////////////////////////////////////////////////////

  if (hiddenBusiness !== undefined) {
    filterQuery.hiddenBusiness = hiddenBusiness;
  }

  ///////////////////////////////////////////////////////////////////

  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }

  ///////////////////////////////////////////////////////////////////

  const out = await PostModel.paginate(filterQuery, {
    ...paginateOptions,
    customLabels: paginationCustomLabels,
  });

  return out as unknown as PaginateResult<Post>;
};

const getAllWithOutPagination: QueryHandle<GetAllArgs, Array<Post>> = async (
  args
) => {
  const out = await getAll({
    ...args,
    paginateOptions: {
      pagination: false,
    },
  });

  if (out instanceof ServerResponse) return out;

  return out.data;
};

const getOne: QueryHandle<
  {
    postId: string;
    hidden?: boolean;
  },
  Post
> = async ({ postId, res, hidden }) => {
  const filterQuery: FilterQuery<Post> = {};

  if (postId) {
    filterQuery._id = postId;
  }

  if (hidden !== undefined) {
    filterQuery.hidden = hidden;
  }

  const out = await PostModel.findOne(filterQuery);

  if (!out) {
    return res.status(404).json({
      message: "Post not found or you are not access to this post",
    });
  }

  return out.toJSON();
};

const deleteMany: QueryHandle<{
  routeName: string;
  postIds?: Array<string>;
  userId: string;
}> = async ({ res, routeName, userId, postIds: postIdsT }) => {
  let postIds: Array<string> = postIdsT || [];

  if (!postIds.length) {
    const allPost = await PostModel.find({
      routeName,
      createdBy: userId,
    });

    postIds = allPost.map((post) => post._id);
  }

  if (postIds?.length) {
    const promises = postIds.map((postId) => {
      return deleteOne({
        res,
        userId,
        postId,
        routeName,
      });
    });

    await Promise.all(promises);
  }
};

const deleteOne: QueryHandle<{
  routeName: string;
  postId: string;
  userId: string;
}> = async ({ routeName, postId, res, userId }) => {
  /**
   * Remove all images of post
   */
  await imagesServices.deleteDir({
    res,
    userId,
    postId,
    routeName,
  });

  /**
   * Removing the post
   */
  await PostModel.deleteOne({
    _id: postId,
    createdBy: userId,
  });
};

const addOne: QueryHandle<
  Pick<
    Post,
    | "currency"
    | "description"
    | "images"
    | "price"
    | "routeName"
    | "amountAvailable"
    | "name"
    | "clothingSizes"
    | "colors"
    | "details"
    | "highlights"
    | "createdBy"
    | "postPageLayout"
  >,
  Post
> = async (args) => {
  const newPost = new PostModel(args);

  await newPost.save();

  return newPost;
};

const updateOne: QueryHandle<{
  query: FilterQuery<Post>;
  update: PostUpdate;
}> = async ({ query, update }) => {
  const {
    amountAvailable,
    clothingSizes,
    colors,
    details,
    highlights,
    images,
    name,
    price,
    reviews,
    currency,
    description,
    hidden,
    hiddenBusiness,
    postCategoriesTags,
    discount,
    postPageLayout,
  } = update;

  await PostModel.updateOne(query, {
    amountAvailable,
    clothingSizes,
    colors,
    details,
    highlights,
    images,
    name,
    price,
    reviews,
    currency,
    description,
    hidden,
    hiddenBusiness,
    postCategoriesTags,
    discount,
    postPageLayout,
  });
};

const updateMany: QueryHandle<{
  query: FilterQuery<Post>;
  update: PostUpdate;
}> = async ({ query, update }) => {
  const {
    amountAvailable,
    clothingSizes,
    colors,
    details,
    highlights,
    images,
    name,
    price,
    reviews,
    currency,
    description,
    hidden,
    hiddenBusiness,
    postCategoriesTags,
    discount,
    postPageLayout,
  } = update;

  await PostModel.updateMany(query, {
    amountAvailable,
    clothingSizes,
    colors,
    details,
    highlights,
    images,
    name,
    price,
    reviews,
    currency,
    description,
    hidden,
    hiddenBusiness,
    postCategoriesTags,
    discount,
    postPageLayout,
  });
};

export const postServices = {
  deleteMany,
  getAll,
  getAllWithOutPagination,
  addOne,
  getOne,
  updateOne,
  updateMany,
  deleteOne,
};
