import {createClient} from 'redis';
import {Config} from "./env";

const {redisUrl, redisUsername, redisPassword} = Config.env;

export class Redis {
    private static readonly _accessToken = createClient({
        url: redisUrl,
        username: redisUsername,
        password: redisPassword,
        name: 'accessToken',
    });
    private static readonly _refreshToken = createClient({
        url: redisUrl,
        username: redisUsername,
        password: redisPassword,
        name: 'refreshToken',
    });

    static get accessToken() {
        return this._accessToken;
    }

    static get refreshToken() {
        return this._refreshToken;
    }
}