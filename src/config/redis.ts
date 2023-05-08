import {createClient} from 'redis';
import {Config} from "./env";

const {redisUrl, redisUsername, redisPassword} = Config.env;

export const redisClient = createClient({
    url: redisUrl,
    username: redisUsername,
    password: redisPassword,
});