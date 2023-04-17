import path, { join } from 'path';
import {
  STATIC_AVATARS_PATH,
  STATIC_AVATARS_URL,
  UPLOADS_TEMP_PATH,
} from '../config/constants';

export type StaticDirectoryKind = 'avatars';

export function staticPathIntoUrl(path: string, kind: StaticDirectoryKind) {
  let staticUrl;
  if (kind === 'avatars') {
    staticUrl = STATIC_AVATARS_URL;
  }
  return `${staticUrl}/${path.split('/').reverse()[0]}`;
}

export function staticUrlIntoPath(url: string, kind: StaticDirectoryKind) {
  let staticPath;
  if (kind === 'avatars') {
    staticPath = STATIC_AVATARS_PATH;
  }
  return join(process.cwd(), `${staticPath}/${url.split('/').reverse()[0]}`);
}

export function filenameIntoStaticPath(
  filename: string,
  kind: StaticDirectoryKind,
) {
  let staticPath;
  if (kind === 'avatars') {
    staticPath = STATIC_AVATARS_PATH;
  }

  return join(process.cwd(), `${staticPath}/${filename}`);
}

export function filenameIntoStaticUrl(
  filename: string,
  kind: StaticDirectoryKind,
) {
  let staticUrl;
  if (kind === 'avatars') {
    staticUrl = STATIC_AVATARS_URL;
  }
  return `${staticUrl}/${filename}`;
}

export function filenameIntoTempPath(filename: string) {
  return path.join(process.cwd(), `${UPLOADS_TEMP_PATH}/${filename}`);
}
