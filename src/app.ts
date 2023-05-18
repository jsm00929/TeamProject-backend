import express, { Express, Router } from "express";
import { Config } from "./config/env";
import { handleErrors, handleNotFoundError } from "./core/middlewares";
import { log } from "./utils/logger";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { STATIC_AVATARS_PATH, STATIC_AVATARS_URL } from "./config/constants";
import { parseSwaggerDoc } from "./utils/parsers";
import path from "path";
import { moviesRouter } from "./movies/controllers/movies.controller";
import { usersRouter } from "./users/controllers/users.controller";
import { authRouter } from "./auth/auth.controller";
import { moviesReviewsRouter } from "./movies/controllers/movies.reviews.controller";
import { usersMovieReviewsRouter } from "./users/controllers/users.reviews.controller";
import { reviewsRouter } from "./reviews/reviews.controller";

// Singleton App instance
export class App {
  private static instance?: App;
  private app: Express;
  private config: Config;

  // 1회만 실행 가능하며, 재실행 시 오류 발생
  static start() {
    if (this.instance) {
      throw new Error(
        `❌server is already running at port ${this.instance.config.port}`
      );
    }
    this.instance = new App();
    this.instance.init();
    this.instance.app.listen(this.instance.config.port, () => {
      console.log();
      log.info(`✅server is running at port ${this.instance!.config.port}😊`);
    });
  }

  // 설정 정보 로드
  private loadConfig() {
    Config.init();
    this.config = Config.env;
  }

  private setStaticDirs() {
    this.app.use(
      STATIC_AVATARS_URL,
      express.static(path.join(process.cwd(), STATIC_AVATARS_PATH))
    );
  }

  // http request 파싱을 위한 모든 parser 로드
  private setRequestParsers() {
    this.app.use(cookieParser(this.config.cookieSecret));
    this.app.use(express.json());
  }

  private setSwagger() {
    if (["dev", "ngrok"].includes(this.config.env)) {
      this.app.use(
        "/swagger",
        swaggerUi.serve,
        swaggerUi.setup(parseSwaggerDoc())
      );
    }
  }

  private setCors() {
    if (["dev", "ngrok"].includes(this.config.env)) {
      this.app.use(
        cors({
          origin: this.config.allowedOrigins,
          credentials: true,
        })
      );
    }
  }

  // api router 포함 모든 하위 router 로드
  private setApi() {
    if (["dev", "ngrok"].includes(this.config.env)) {
      this.app.get("/", (_, res) =>
        res.send("<h1>HOME: 서버가 잘 작동하고 있음</h1>")
      );
    }

    const api = Router();
    this.app.use("/api", api);
    api.use("/auth", authRouter);
    api.use("/users", usersRouter);
    api.use("/users", usersMovieReviewsRouter);
    api.use("/movies", moviesRouter);
    api.use("/movies", moviesReviewsRouter);
    api.use("/reviews", reviewsRouter);
  }

  // 오류 처리 미들웨어, 404 미들웨어 로드
  private setErrorHandlers() {
    this.app.use(handleErrors);
    this.app.use(handleNotFoundError);
  }

  // 서버는 인스턴스 생성 및 앞서 설정한 모든 정보 로드

  // 서버 구동에 필요한 모든 설정 정보 및 미들웨어 순차적 로드
  private init() {
    this.loadConfig();
    this.app = express();
    this.setStaticDirs();
    this.setRequestParsers();
    this.setCors();
    this.setSwagger();
    this.setApi();
    this.setErrorHandlers();
  }
}
