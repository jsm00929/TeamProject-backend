import axios from 'axios';
import {
  GOOGLE_TOKEN_URL,
  GOOGLE_USER_INFO_URL,
} from '../../../config/constants';
import { Config } from '../../../config/env';
import { snakeToCamel } from '../../../utils/parsers';
import { GoogleToken, GoogleUserInfo } from './types';

const { googleClientId, googleClientSecret } = Config.env;

export const tokenClient = axios.create({
  baseURL: GOOGLE_TOKEN_URL,
  data: {
    client_id: googleClientId,
    client_secret: googleClientSecret,
    grant_type: 'authorization_code',
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

tokenClient.interceptors.response.use((res) => {
  res.data = snakeToCamel(res.data);
  return res;
});

export const userInfoClient = axios.create({
  baseURL: GOOGLE_USER_INFO_URL,
});

userInfoClient.interceptors.response.use((res) => {
  res.data = snakeToCamel(res.data);
  return res;
});
