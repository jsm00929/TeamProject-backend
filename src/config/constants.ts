import { Config } from './env';

export const ACCESS_TOKEN_COOKIE_NAME = 'ACCESS_TOKEN';
export const REFRESH_TOKEN_COOKIE_NAME = 'REFRESH_TOKEN';
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1h(SECONDS)
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 * 2 * 1000; // 2w(SECONDS)

export const STATIC_AVATARS_PATH = '/public/uploads/images/avatars';
export const STATIC_AVATARS_URL = '/images/avatars';
export const UPLOADS_TEMP_PATH = '/public/uploads/temp';

export const IMAGE_EXT_REGEX =
  /^(jpg|jpeg|jpe|jfif|png|gif|bmp|dib|tif|tiff|webp|heif|heic|avif|ico|cur|svg)$/i;

export const GOOGLE_SIGNUP_OAUTH2_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${Config.env.googleClientId}&redirect_uri=${Config.env.googleSignupRedirectUri}&response_type=code&scope=email profile`;
export const GOOGLE_LOGIN_OAUTH2_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${Config.env.googleClientId}&redirect_uri=${Config.env.googleLoginRedirectUri}&response_type=code&scope=email profile`;
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USER_INFO_URL =
  'https://www.googleapis.com/oauth2/v2/userinfo';
