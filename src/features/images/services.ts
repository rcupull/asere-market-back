import { filesDir } from "../../middlewares/files";
import { Image, QueryHandle } from "../../types";
import fs from "fs";

const deleteOne: QueryHandle<{
  src: string;
}> = async ({ src, res }) => {
  const fullPath = `${filesDir}${src}`;

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        return res.status(400).json({
          message: "Error deleting the image",
        });
      }
    });
  }
};

const deleteDir: QueryHandle<{
  postId?: string;
  routeName?: string;
  userId: string;
}> = async ({ postId, routeName, userId, res }) => {
  let path = `./${filesDir}/${userId}/`;

  if (routeName) {
    path = `${path}${routeName}/`;
  }

  if (postId) {
    path = `${path}${postId}/`;
  }

  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) {
      console.log("Some problem removing the folder");
      // return res.status(400).json({
      //   message: "Error deleting the folder",
      // });
    }
  });
};

const deleteOldImages: QueryHandle<{
  newImagesSrcs: Array<Image> | undefined;
  oldImagesSrcs: Array<Image> | undefined;
}> = async ({ newImagesSrcs, oldImagesSrcs, res }) => {
  if (!oldImagesSrcs?.length || !newImagesSrcs?.length) {
    return;
  }

  const imagesToRemove = oldImagesSrcs.filter(
    ({ src }) => !newImagesSrcs.map(({ src }) => src).includes(src)
  );

  imagesToRemove.forEach(({ src }) => {
    deleteOne({ src, res });
  });
};

export const imagesServices = {
  deleteOne,
  deleteOldImages,
  deleteDir,
};
