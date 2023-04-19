import { Config } from '../../../config/env';
import { tokenClient, userInfoClient } from './clients';
import { GoogleToken, GoogleUserInfo } from './types';

const { googleLoginRedirectUri, googleSignupRedirectUri } = Config.env;

type Action = 'login' | 'signup';

const { googleClientId, googleClientSecret } = Config.env;

export async function fetchGoogleToken(code: string, purpose: Action) {
  const redirectUri =
    purpose === 'signup' ? googleSignupRedirectUri : googleLoginRedirectUri;

  const data = new URLSearchParams({
    code,
    redirect_uri: redirectUri,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    grant_type: 'authorization_code',
    scope: 'profile email',
  });

  return tokenClient.post<GoogleToken>('', data);
}

export async function fetchGoogleUserInfo(accessToken: string) {
  return userInfoClient.get<GoogleUserInfo>('/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
