import { IsNotEmpty, IsString, Max, Min, validate } from 'class-validator';

export class Config {
  @Min(1025)
  @Max(65536)
  port: number;

  @IsString()
  @IsNotEmpty()
  dbUrl: string;

  @Min(30)
  @IsNotEmpty()
  jwtSecret: string;

  private static instance?: Config;

  static async init() {
    require('dotenv').config();
    const { PORT, DB_URL, JWT_SECRET } = process.env;
    const config = new Config();
    config.port = +PORT;
    config.dbUrl = DB_URL;
    config.jwtSecret = JWT_SECRET;

    const errors = await validate(config);
    if (errors.length > 0) {
      throw new Error(`[failed to initialize 'Config'. errors: ${errors}]`);
    }

    this.instance = config;
  }

  static getInstance() {
    if (!this.instance) {
      this.init();
      // throw new Error(`['Config' not initialized yet.]`);
    }
    return this.instance;
  }
}
