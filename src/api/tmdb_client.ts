import axios from 'axios';
import { Config } from '../config/env';
import { parseISODateStringToDate, snakeToCamel } from '../utils/parsers';

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
  parseISODateStringToDate(res.data);
  return res;
});
