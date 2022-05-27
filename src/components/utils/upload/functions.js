import { imageResizes } from "../../../firebase";
import assert from "assert";
import { timeoutPromise } from "../../../utils";
// import { RcFile, UploadFile } from "antd/lib/upload/interface";

// interface Props {
//   filePath: string;
//   fileName?: string;
//   storage: FirebaseStorage;
//   resize: ImageResize;
//   isImage: boolean;
//   options: {
//     file: string | Blob | RcFile,
//     onProgress: (percent: number) => void,
//     onSuccess: (message: string) => void,
//     onError: (error: FirebaseStorageError) => void,
//   };
// }
//
// type FileConfig = Record<FileConfigId, FileConfigUrl>;
//
// type FileConfigId = "url" | "thumbUrl";
//
// interface FileConfigUrl {
//   path: string;
//   fileName: string;
// }
//
// interface Return {
//   newFile: UploadFile;
//   status: boolean;
// }

export const uploadFile = async ({
  filePath,
  fileName,
  storage,
  resize,
  isImage,
  options: { file, onError, onProgress, onSuccess },
}) =>
  await new Promise((resolve, reject) => {
    assert(file instanceof File, "Options.file not is File");

    // if (file === File) throw Error("Options.file not is File");

    const fileExtension = file.name.split(".").pop();
    fileName = fileName || file.name.replace(`.${fileExtension}`, "");

    const fileConfig = {
      url: {
        path: filePath,
        fileName: `${fileName}.${fileExtension}`,
      },
      thumbUrl: {
        path: `${filePath}/thumbs`,
        fileName: `${fileName}_${resize}.${fileExtension}`,
      },
    };

    storage
      .ref(fileConfig.url.path)
      .child(fileConfig.url.fileName)
      .put(file)
      .on(
        "state_changed",
        ({ bytesTransferred, totalBytes }) =>
          onProgress((bytesTransferred / totalBytes) * 95),
        (error) => {
          onError(error);
          reject(error);
        },
        () => uploadComplete(mapUploadFile(file), fileConfig)
      );

    const uploadComplete = async (newFile, fileConfig) => {
      try {
        newFile.url = await storage
          .ref(fileConfig.url.path)
          .child(fileConfig.url.fileName)
          .getDownloadURL();

        if (isImage) {
          const fileThumbUrlRef = storage
            .ref(fileConfig.thumbUrl.path)
            .child(fileConfig.thumbUrl.fileName);

          newFile.thumbUrl = await keepTryingGetThumbURL(fileThumbUrlRef);
        }
        newFile.status = "success";
        newFile.name = fileConfig.url.fileName;

        onSuccess("ok");
        resolve({ newFile, status: true });
      } catch (error) {
        console.error("Upload Complete", { error, file });
        await timeoutPromise(5000);
        onError(error);
        resolve({ newFile, status: false });
      }
    };
  });

const mapUploadFile = (file) => ({
  uid: file.uid,
  name: file.name,
});

export const deleteFileAndFileThumbFromStorage = async (
  storage,
  filePath,
  fileName
) => {
  const extension = fileName.split(".").pop();

  const pathImage = `${filePath}/${fileName}`;

  const pathThumbImages = imageResizes.map(
    (resizeImage) =>
      `${filePath}/thumbs/${fileName.replace(
        `.${extension}`,
        ""
      )}_${resizeImage}.${extension}`
  );

  const uris = [pathImage, ...pathThumbImages].map(
    (url) => `gs://${storage.ref().bucket}/${url}`
  );

  try {
    await Promise.all(uris.map((uri) => deleteFileFromStorage(storage, uri)));
  } catch (error) {
    console.error("Delete file and file thumb", error);
  }
};

export const deleteFileFromStorage = async (storage, url) => {
  try {
    console.log("url", url);
    const ref = storage.refFromURL(url);

    return await storage.ref(ref.fullPath).delete();
  } catch (error) {
    if (error.code === "storage/object-not-found") return null;

    throw new Error(error);
  }
};

export const keepTryingGetThumbURL = async (storageRef, triesCount = 10) => {
  console.info("Getting thumb download URL...");

  if (triesCount < 0) return Promise.reject("out of tries");

  try {
    return await storageRef.getDownloadURL();
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      await timeoutPromise(1000);

      return keepTryingGetThumbURL(storageRef, triesCount - 1);
    } else {
      return Promise.reject(error);
    }
  }
};
