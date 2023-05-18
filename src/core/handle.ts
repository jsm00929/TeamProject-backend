import { ClassConstructor } from "class-transformer";
import { NextFunction } from "express";
import { isAuth } from "../auth/middlewares/is_auth";
import { mustAuth } from "../auth/middlewares/must_auth";
import { HttpStatus, ErrorMessages } from "./constants";
import {
  mustValidBody,
  mustValidQuery,
  mustValidParams,
  handleResponse,
} from "./middlewares";
import { AppError } from "./types";
import { AuthLevel, ExtendedRequest } from "./types/extended_request";
import { Handler } from "./types/handler";

type HandleArgs<A extends AuthLevel, I, P> = {
  authLevel?: AuthLevel;
  bodyCls?: ClassConstructor<I>;
  queryCls?: ClassConstructor<I>;
  paramsCls?: ClassConstructor<P>;
  preController?: Handler<ExtendedRequest<A, I, P>>;
  controller: Handler<ExtendedRequest<A, I, P>>;
};

export function handle<A extends AuthLevel = "none", I = never, P = never>({
  authLevel,
  controller,
  bodyCls,
  queryCls,
  paramsCls,
  preController,
}: HandleArgs<A, I, P>) {
  type Request = ExtendedRequest<A, I, P>;

  const handlers: Handler<Request>[] = [];

  if (bodyCls && queryCls) {
    handlers.push(async (_, __, next: NextFunction) => {
      next(
        AppError.new({
          status: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.INVALID_REQUEST_INPUT,
        })
      );
    });
    return handlers;
  }

  if (bodyCls) {
    handlers.push(mustValidBody(bodyCls) as Handler<Request>);
  }

  if (queryCls) {
    handlers.push(mustValidQuery(queryCls) as Handler<Request>);
  }

  if (paramsCls) {
    handlers.push(mustValidParams(paramsCls) as Handler<Request>);
  }

  if (authLevel === "must") {
    handlers.push(mustAuth as Handler<Request>);
  } else if (authLevel === "optional") {
    handlers.push(isAuth as Handler<Request>);
  }

  if (preController) {
    handlers.push(handleResponse(preController));
  }

  handlers.push(handleResponse(controller));

  return handlers;
}
