import {
  FilterQuery,
  PaginateOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import { QueryHandle } from "../../types/general";
import { Business, BusinessCategory } from "../../types/business";
import { BusinessModel } from "../../schemas/business";
import { postServices } from "../post/services";
import {
  PaginateResult,
  paginationCustomLabels,
} from "../../middlewares/pagination";
import { ServerResponse } from "http";
import { imagesServices } from "../images/services";

interface GetAllArgs {
  paginateOptions?: PaginateOptions;
  createdBy?: string;
  routeName?: string;
  search?: string;
  hidden?: boolean;
}
const getAll: QueryHandle<GetAllArgs, PaginateResult<Business>> = async (
  query
) => {
  const { paginateOptions = {}, createdBy, routeName, search, hidden } = query;
  const filterQuery: FilterQuery<Business> = {};

  ///////////////////////////////////////////////////////////////////
  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }
  ///////////////////////////////////////////////////////////////////

  if (routeName) {
    filterQuery.routeName = routeName;
  }
  ///////////////////////////////////////////////////////////////////

  if (search) {
    filterQuery.name = { $regex: new RegExp(search), $options: "i" };
  }
  ///////////////////////////////////////////////////////////////////

  if (hidden !== undefined) {
    filterQuery.hidden = hidden;
  }
  ///////////////////////////////////////////////////////////////////

  const out = await BusinessModel.paginate(filterQuery, {
    ...paginateOptions,
    customLabels: paginationCustomLabels,
  });

  return out as unknown as PaginateResult<Business>;
};

const getAllWithoutPagination: QueryHandle<
  Omit<GetAllArgs, "paginateOptions">,
  Array<Business>
> = async (args) => {
  const out = await getAll({
    ...args,
    paginateOptions: {
      pagination: false,
    },
  });

  if (out instanceof ServerResponse) return out;

  return out.data;
};

const addOne: QueryHandle<
  {
    category: BusinessCategory;
    name: string;
    routeName: string;
    userId: string;
  },
  Business
> = async ({ category, userId, routeName, name, res }) => {
  const routeNameExists = await BusinessModel.findOne({ routeName });
  if (routeNameExists) {
    return res.status(400).json({
      message: "Route name already exists",
    });
  }

  const out = new BusinessModel({
    category,
    createdBy: userId,
    name,
    routeName,
  });

  await out.save();

  return out;
};

const findOne: QueryHandle<
  {
    routeName: string;
    createdBy?: string;
  },
  Business
> = async ({ routeName, createdBy, res }) => {
  const filterQuery: FilterQuery<Business> = {
    routeName,
  };

  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }

  const out = await BusinessModel.findOne(filterQuery);

  if (!out) {
    return res.status(404).json({
      message: "Business not found",
    });
  }

  return out;
};

const deleteOne: QueryHandle<{
  routeName: string;
  userId: string;
}> = async ({ routeName, res, userId }) => {
  /**
   * Remove all business images
   */
  await imagesServices.deleteDir({
    res,
    userId,
    routeName,
  });

  await BusinessModel.deleteOne({
    routeName,
    createdBy: userId,
  });

  const out = await postServices.deleteMany({
    routeName,
    res,
    userId,
  });

  return out;
};

const updateOne: QueryHandle<{
  query: {
    routeName: string;
  };
  update:
    | UpdateQuery<
        Partial<
          Pick<
            Business,
            | "hidden"
            | "socialLinks"
            | "bannerImages"
            | "name"
            | "routeName"
            | "logo"
            | "layouts"
            | "postCategories"
            | "aboutUsPage"
            | "aboutUsPage"
          >
        >
      >
    | UpdateWithAggregationPipeline;
}> = async ({ query, update }) => {
  await BusinessModel.updateOne(query, update);
};

export const businessServices = {
  getAll,
  getAllWithoutPagination,
  addOne,
  findOne,
  deleteOne,
  updateOne,
};
