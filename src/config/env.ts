import {
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
  max,
  validateSync,
} from 'class-validator';

export class Config {
  @Min(1025)
  @Max(65536)
  private _port: number;

  @IsString()
  @IsNotEmpty()
  private _dbUrl: string;

  @MinLength(10)
  @IsNotEmpty()
  private _accessTokenSecret: string;

  @MinLength(10)
  @IsNotEmpty()
  private _refreshTokenSecret: string;

  @IsString()
  @IsNotEmpty()
  private _imdbApiUrl: string;

  @IsString()
  @IsNotEmpty()
  private _imdbApiKeyV3: string;

  @IsString()
  @MinLength(100)
  private _cookieSecret: string;

  @IsIn(['dev', 'prod'])
  private _env: string;

  get port() {
    return this._port;
  }

  get dbUrl() {
    return this._dbUrl;
  }

  get accessTokenSecret() {
    return this._accessTokenSecret;
  }

  get refreshTokenSecret() {
    return this._refreshTokenSecret;
  }

  get imdbApiUrl() {
    return this._imdbApiUrl;
  }

  get imdbApiKeyV3() {
    return this._imdbApiKeyV3;
  }

  get cookieSecret() {
    return this._cookieSecret;
  }

  get env() {
    return this._env;
  }

  private static instance?: Config;

  static init() {
    require('dotenv').config();
    const {
      PORT,
      DB_URL,
      IMDB_API_URL,
      IMDB_API_KEY_V3,
      COOKIE_SECRET,
      ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET,
      NODE_ENV,
    } = process.env;
    const config = new Config();
    config._port = +PORT!;
    config._dbUrl = DB_URL!;
    config._accessTokenSecret = ACCESS_TOKEN_SECRET!;
    config._refreshTokenSecret = REFRESH_TOKEN_SECRET!;
    config._imdbApiUrl = IMDB_API_URL!;
    config._imdbApiKeyV3 = IMDB_API_KEY_V3!;
    config._cookieSecret = COOKIE_SECRET!;
    config._env = NODE_ENV!;

    const errors = validateSync(config);
    if (errors.length > 0) {
      throw new Error(`[failed to initialize 'Config'. errors: ${errors}]`);
    }

    this.instance = config;
  }

  static get env() {
    if (!this.instance) {
      this.init();
    }
    return this.instance!;
  }
}
