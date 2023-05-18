import { unlink, rename, stat, writeFile } from "fs/promises";
import { log } from "./logger";

export async function persistFile(filepath: string, data: string) {
  await existsFileOrThrow(filepath);
  await writeFile(filepath, data);
}

export async function moveFile(oldPath, newPath: string) {
  await rename(oldPath, newPath);
}

export async function existsFileOrThrow(filepath: string) {
  try {
    await stat(filepath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function removeFileOrThrow(filepath: string) {
  await existsFileOrThrow(filepath);
  await unlink(filepath);
}

// TODO
// export async function softRemoveFile(filepath: string) {
//   const trashDirPath = ;
//   await moveFile();
// }

export async function removeFile(filepath: string) {
  try {
    await existsFileOrThrow(filepath);
    await unlink(filepath);
  } catch (error) {
    log.error(error);
  }
}
