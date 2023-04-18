import { Config } from '../../../config/env';
import { tokenClient, userInfoClient } from './clients';
import { GoogleToken, GoogleUserInfo } from './types';

const { googleLoginRedirectUri, googleSignupRedirectUri } = Config.env;

type Purpose = 'login' | 'signup';

export async function fetchGoogleToken(code: string, purpose: Purpose) {
  const redirectUri =
    purpose === 'signup' ? googleSignupRedirectUri : googleLoginRedirectUri;

  return tokenClient.post<GoogleToken>('/', {
    code,
    redirect_uri: redirectUri,
  });
}

export async function fetchGoogleUserInfo(accessToken: string) {
  return userInfoClient.get<GoogleUserInfo>('/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
