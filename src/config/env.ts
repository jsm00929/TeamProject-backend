import {
    ArrayMinSize,
    IsArray,
    IsIn,
    IsNotEmpty,
    IsString,
    IsUrl,
    Max,
    Min,
    MinLength,
    validateSync,
} from 'class-validator';

export class Config {


    private static instance?: Config;

    @IsIn(['dev', 'prod', 'test', 'ngrok'])
    private _env: string;

    static get env() {
        if (!this.instance) {
            this.init();
        }
        return this.instance!;
    }

    @IsString()
    private _aiSecret: string;

    public get aiSecret(): string {
        return this._aiSecret;
    }

    @IsString()
    @IsNotEmpty()
    private _host: string;


    public get host(): string {
        return this._host;
    }


    @Min(1025)
    @Max(65536)
    private _port: number;


    get port() {
        return this._port;
    }

    @IsString()
    @IsNotEmpty()
    private _clientHost: string;

    public get clientHost(): string {
        return this._clientHost;
    }


    @Min(1025)
    @Max(65536)
    private _clientPort: number;

    public get clientPort(): number {
        return this._clientPort;
    }

    @IsString()
    @IsNotEmpty()
    private _dbUrl: string;

    get dbUrl() {
        return this._dbUrl;
    }

    @IsString()
    @IsUrl()
    private _r2Url: string;

    get r2Url(): string {
        return this._r2Url;
    }

    @IsString()
    @IsUrl()
    private _redisUrl: string;

    get redisUrl(): string {
        return this._redisUrl;
    }

    @IsString()
    @IsNotEmpty()
    private _redisUsername: string;

    get redisUsername(): string {
        return this._redisUsername;
    }


    @IsString()
    @IsNotEmpty()
    private _redisPassword: string;


    get redisPassword(): string {
        return this._redisPassword;
    }

    @IsString()
    @IsNotEmpty()
    private _imdbApiUrl: string;

    get imdbApiUrl() {
        return this._imdbApiUrl;
    }

    @IsString()
    @IsNotEmpty()
    private _imdbApiKeyV3: string;

    get imdbApiKeyV3() {
        return this._imdbApiKeyV3;
    }

    @IsString()
    @IsNotEmpty()
    private _googleClientId: string;

    get googleClientId(): string {
        return this._googleClientId;
    }

    @IsString()
    @IsNotEmpty()
    private _googleClientSecret: string;

    get googleClientSecret(): string {
        return this._googleClientSecret;
    }

    @IsString()
    @IsNotEmpty()
    private _googleSignupRedirectUri: string;

    get googleSignupRedirectUri(): string {
        return this._googleSignupRedirectUri;
    }

    @IsString()
    @IsNotEmpty()
    private _googleLoginRedirectUri: string;

    get googleLoginRedirectUri(): string {
        return this._googleLoginRedirectUri;
    }

    @MinLength(10)
    @IsNotEmpty()
    private _accessTokenSecret: string;

    get accessTokenSecret() {
        return this._accessTokenSecret;
    }

    @MinLength(10)
    @IsNotEmpty()
    private _refreshTokenSecret: string;

    get refreshTokenSecret() {
        return this._refreshTokenSecret;
    }

    @IsString()
    @MinLength(100)
    private _cookieSecret: string;

    get cookieSecret() {
        return this._cookieSecret;
    }

    @IsString()
    @MinLength(30)
    private _jwtSecret: string;

    get jwtSecret(): string {
        return this._jwtSecret;
    }

    @IsArray()
    @ArrayMinSize(1)
    private _allowedOrigins: string[];

    get allowedOrigins(): string[] {
        return this._allowedOrigins;
    }

    get env() {
        return this._env;
    }

    static init() {
        const envPath = `.env.${process.env.NODE_ENV}`;

        require('dotenv').config({
            path: envPath,
        });

        const {
            HOST,
            PORT,
            CLIENT_HOST,
            CLIENT_PORT,
            DB_URL,
            REDIS_URL,
            REDIS_USERNAME,
            REDIS_PASSWORD,
            R2_URL,
            IMDB_API_URL,
            IMDB_API_KEY_V3,
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_SIGNUP_REDIRECT_URI,
            GOOGLE_LOGIN_REDIRECT_URI,
            COOKIE_SECRET,
            ACCESS_TOKEN_SECRET,
            REFRESH_TOKEN_SECRET,
            JWT_SECRET,
            NODE_ENV,
            ALLOWED_ORIGINS,
            AI_SECRET,
        } = process.env;
        const config = new Config();
        config._aiSecret = AI_SECRET!;
        config._host = HOST!;
        config._port = +PORT!;
        config._clientHost = CLIENT_HOST!;
        config._clientPort = +CLIENT_PORT!;
        config._dbUrl = DB_URL!;
        config._r2Url = R2_URL!;
        config._redisUrl = REDIS_URL!;
        config._redisUsername = REDIS_USERNAME!;
        config._redisPassword = REDIS_PASSWORD!;
        config._imdbApiUrl = IMDB_API_URL!;
        config._imdbApiKeyV3 = IMDB_API_KEY_V3!;
        config._googleClientId = GOOGLE_CLIENT_ID!;
        config._googleClientSecret = GOOGLE_CLIENT_SECRET!;
        config._googleSignupRedirectUri = GOOGLE_SIGNUP_REDIRECT_URI!;
        config._googleLoginRedirectUri = GOOGLE_LOGIN_REDIRECT_URI!;
        config._accessTokenSecret = ACCESS_TOKEN_SECRET!;
        config._refreshTokenSecret = REFRESH_TOKEN_SECRET!;
        config._cookieSecret = COOKIE_SECRET!;
        config._jwtSecret = JWT_SECRET!;
        config._env = NODE_ENV!;
        config._allowedOrigins = ALLOWED_ORIGINS!.split(',');

        const errors = validateSync(config);
        if (errors.length > 0) {
            throw new Error(`[failed to initialize 'Config'. errors: ${errors}]`);
        }

        this.instance = config;
    }
}
