export const TOKEN = '@jwt';
export const ACCESS_TOKEN_EXPIRED_TIMES = '1h';
export const GOOGLE_SIGNUP_AUTH_URI = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile&access_type=offline`;
export const GOOGLE_LOGIN_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile&access_type=offline`;
