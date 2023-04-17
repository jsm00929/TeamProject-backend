import { unlink, rename, stat } from 'fs/promises';
import {
  filenameIntoStaticPath,
  filenameIntoTempPath,
  staticUrlIntoPath,
} from './static_path_resolvers';

export async function persistAvatarImage(filename: string) {
  const tempPath = filenameIntoTempPath(filename);
  const avatarPath = filenameIntoStaticPath(filename, 'avatars');
  await rename(tempPath, avatarPath);
}

export async function existsAvatarImage(avatarUrl: string) {
  const avatarPath = staticUrlIntoPath(avatarUrl, 'avatars');

  try {
    await stat(avatarPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return false;
  }
  return true;
}

export async function removeAvatarImageIfExists(avatarUrl: string) {
  const exists = await existsAvatarImage(avatarUrl);
  if (exists) {
    await removeAvatarImage(avatarUrl);
  }
}

export async function removeAvatarImage(avatarUrl: string) {
  const avatarPath = staticUrlIntoPath(avatarUrl, 'avatars');
  await unlink(avatarPath);
}
