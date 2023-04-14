import express, { Router, Express } from 'express';
import { usersRouter } from './users/users.router';
import { Config } from './config/env';
import { handleErrors } from './middlewares/handleErrors';
import { handleNotFoundError } from './middlewares/handleNotFoundError';

// Singleton App instance
export class App {
  private app: Express;
  private config: Config;

  private static instance?: App;

  // 설정 정보 로드
  private async loadConfig() {
    await Config.init();
    this.config = Config.getInstance();
  }

  // api router 포함 모든 하위 router 로드
  private setApi() {
    const apiRouter = Router();
    apiRouter.use('/users', usersRouter);
  }

  // http request 파싱을 위한 모든 parser 로드
  private setRequestParsers() {
    this.app.use(express.json());
  }

  // 오류 처리 미들웨어, 404 미들웨어 로드
  private setErrorHandlers() {
    this.app.use(handleErrors);
    this.app.use(handleNotFoundError);
  }

  // 서버 구동에 필요한 모든 설정 정보 및 미들웨어 순차적 로드
  private async init() {
    await this.loadConfig();
    this.app = express();
    this.setRequestParsers();
    this.setApi();
    this.setErrorHandlers();
  }

  // 서버는 인스턴스 생성 및 앞서 설정한 모든 정보 로드
  // 1회만 실행 가능하며, 재실행 시 오류 발생
  static async start() {
    if (this.instance !== null) {
      throw new Error(
        `❌server is already running at port ${this.instance.config.port}`,
      );
    }
    this.instance = new App();
    await this.instance.init();
    this.instance.app.listen(this.instance.config.port, () => {
      console.log(
        `[🚀${new Date().toISOString()}] ✅server is running at port ${
          this.instance.config.port
        }😊`,
      );
    });
  }
}
