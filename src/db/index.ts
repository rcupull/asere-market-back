import { connect } from "mongoose";

const NODE_ENV = process.env.NODE_ENV;
const ATLAS_PASS = process.env.ATLAS_PASS;

const getAtlasUrlDb = (db: string) => {
  return `mongodb+srv://rcupull:${ATLAS_PASS}@cluster0.3ageacp.mongodb.net/${db}?retryWrites=true&w=majority`;
};
const getUrl = () => {
  if (NODE_ENV === "production") {
    return getAtlasUrlDb("asere-market-prod");
  }

  if (NODE_ENV === "staging") {
    return getAtlasUrlDb("asere-market-stage");
  }

  return "mongodb://127.0.0.1:27017/community_db";
};

export const connectDB = () => {
  connect(getUrl())
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
    });
};
