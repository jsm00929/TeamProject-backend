import axios from 'axios';
import process from 'process';

export async function fetchToken(code, status: string) {
  try {
    const redirect_uri =
      status === 'signup'
        ? process.env.GOOGLE_SIGNUP_REDIRECT_URI
        : process.env.GOOGLE_LOGIN_REDIRECT_URI;
    const { data } = await axios.post(
      `https://oauth2.googleapis.com/token`,
      {
        code: code,
        redirect_uri: redirect_uri,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        scope: 'email profile',
        grant_type: 'authorization_code',
      },
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );
    return data.access_token;
  } catch (error) {
    return error;
  }
}

export async function getUserInfo(access_token) {
  try {
    const userInfoApi = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log(`get user info - userInfo:${userInfoApi.data.email}`);
    return userInfoApi.data;
  } catch (error) {
    return error;
  }
}
