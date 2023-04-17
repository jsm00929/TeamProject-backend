import express, { Router, Express } from 'express';
import usersRouter from './users/users.router';
import { Config } from './config/env';
import { handleErrors } from './core/middlewares/handle_errors';
import { handleNotFoundError } from './core/middlewares/handle_not_found_error';
import { logger } from './utils/logger/logger';
import cookieParser from 'cookie-parser';
import authRouter from './auth/auth.router';
import moviesRouter from './movies/movies.router';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { parseSwaggerDoc } from './utils/parser/parse_swagger_doc';
import reviewsRouter from './reviews/reviews.router';

// Singleton App instance
export class App {
  private app: Express;
  private config: Config;

  private static instance?: App;

  // 설정 정보 로드
  private loadConfig() {
    Config.init();
    this.config = Config.env;
  }

  private setSwagger() {
    if (this.config.env === 'dev') {
      console.log(this.config.env);
      this.app.use(
        '/swagger',
        swaggerUi.serve,
        swaggerUi.setup(parseSwaggerDoc()),
      );
    }
  }

  private setCors() {
    if (this.config.env === 'dev') {
      console.log(this.config.allowedOrigins);
      this.app.use(
        cors({
          origin: this.config.allowedOrigins,
          credentials: true,
        }),
      );
    }
  }

  // http request 파싱을 위한 모든 parser 로드
  private setRequestParsers() {
    this.app.use(cookieParser(this.config.cookieSecret));
    this.app.use(express.json());
  }

  // api router 포함 모든 하위 router 로드
  private setApi() {
    const apiRouter = Router();
    this.app.use('/api', apiRouter);
    apiRouter.use('/auth', authRouter);
    apiRouter.use('/users', usersRouter);
    apiRouter.use('/movies', moviesRouter);
    apiRouter.use('/reviews', reviewsRouter);
    // apiRouter.use('/comments', moviesRouter);
  }

  // 오류 처리 미들웨어, 404 미들웨어 로드
  private setErrorHandlers() {
    this.app.use(handleErrors);
    this.app.use(handleNotFoundError);
  }

  // 서버 구동에 필요한 모든 설정 정보 및 미들웨어 순차적 로드
  private init() {
    this.loadConfig();
    this.app = express();
    this.setRequestParsers();
    this.setCors();
    this.setSwagger();
    this.setApi();
    this.setErrorHandlers();
  }

  // 서버는 인스턴스 생성 및 앞서 설정한 모든 정보 로드
  // 1회만 실행 가능하며, 재실행 시 오류 발생
  static start() {
    if (this.instance) {
      throw new Error(
        `❌server is already running at port ${this.instance.config.port}`,
      );
    }
    this.instance = new App();
    this.instance.init();
    this.instance.app.listen(this.instance.config.port, () => {
      logger.info(
        `✅server is running at port ${this.instance!.config.port}😊`,
      );
    });
  }
}
