import axios from 'axios';
import { snakeToCamel } from '../utils/parser/snake_to_camel';
import { Config } from '../config/env';

const { imdbApiKeyV3, imdbApiUrl } = Config.env;

// '/discover/movie?&sort_by=popularity.desc&'
export const tmdbClient = axios.create({
  baseURL: `${imdbApiUrl}/3`,

  params: {
    api_key: imdbApiKeyV3,
  },
});

tmdbClient.interceptors.response.use((res) => {
  res.data = snakeToCamel(res.data);
  return res;
});
