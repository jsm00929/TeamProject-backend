import { join } from "path";
import {
  STATIC_AVATARS_PATH,
  STATIC_AVATARS_URL,
  UPLOADS_TEMP_PATH,
} from "../config/constants";

export type StaticDirectoryKind = "avatars";

// TODO
// export function resolveTrashDirPath(filepath: string) {
//   return `${filepath}`;
// }

export function staticPathIntoUrl(path: string, kind: StaticDirectoryKind) {
  let staticUrl;
  if (kind === "avatars") {
    staticUrl = STATIC_AVATARS_URL;
  }
  return `${staticUrl}/${path.split("/").reverse()[0]}`;
}

export function staticUrlIntoPath(
  url: string,
  kind: StaticDirectoryKind,
  isAbsolutePath: boolean = false
) {
  let staticPath;
  if (kind === "avatars") {
    staticPath = STATIC_AVATARS_PATH;
  }
  if (isAbsolutePath) {
    staticPath = intoAbsolutePath(staticPath);
  }
  return `${staticPath}/${url.split("/").reverse()[0]}`;
}

export function filenameIntoStaticPath(
  filename: string,
  kind: StaticDirectoryKind,
  isAbsolutePath: boolean = false
) {
  let staticPath;
  if (kind === "avatars") {
    staticPath = STATIC_AVATARS_PATH;
  }

  if (isAbsolutePath) {
    staticPath = intoAbsolutePath(staticPath);
  }
  return `${staticPath}/${filename}`;
}

export function filenameIntoStaticUrl(
  filename: string,
  kind: StaticDirectoryKind
) {
  let staticUrl;
  if (kind === "avatars") {
    staticUrl = STATIC_AVATARS_URL;
  }
  return `${staticUrl}/${filename}`;
}

export function filenameIntoAbsoluteTempPath(filename: string) {
  return intoAbsolutePath(`${UPLOADS_TEMP_PATH}/${filename}`);
}

export function intoAbsolutePath(path: string) {
  return join(process.cwd(), path);
}
