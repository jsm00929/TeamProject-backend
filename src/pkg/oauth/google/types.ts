export interface GoogleToken {
  accessToken: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
  idToken: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  locale: string;
}
