export const ACCESS_TOKEN_COOKIE_NAME = 'ACCESS_TOKEN';
export const REFRESH_TOKEN_COOKIE_NAME = 'REFRESH_TOKEN';
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1h
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 * 2 * 1000; // 2w

export const STATIC_AVATARS_PATH = '/public/uploads/images/avatars';
export const STATIC_AVATARS_URL = '/images/avatars';
export const UPLOADS_TEMP_PATH = '/public/uploads/temp';

export const IMAGE_EXT_REGEX =
  /^(jpg|jpeg|jpe|jfif|png|gif|bmp|dib|tif|tiff|webp|heif|heic|avif|ico|cur|svg)$/i;
