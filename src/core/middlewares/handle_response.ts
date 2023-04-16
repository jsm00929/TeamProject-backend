import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/http_status';
import { AppError } from '../types';
import { mustAuth } from '../../auth/middlewares/must_auth';
import { isAuth } from '../../auth/middlewares/is_auth';
import { mustValidBody, mustValidParams, mustValidQuery } from './must_valid';
import { ClassConstructor } from 'class-transformer';
import { ErrorMessages } from '../constants';
import { Handler } from '../types/handler';
import { AuthLevel, ExtendedRequest } from '../types/extended_request';

export type HandlerResponse<T = unknown> = {
  body?: T;
  status?: HttpStatus;
};

type HandleArgs<A extends AuthLevel, I, P> = {
  authLevel?: AuthLevel;
  bodyCls?: ClassConstructor<I>;
  queryCls?: ClassConstructor<I>;
  paramsCls?: ClassConstructor<P>;
  controller: Handler<ExtendedRequest<A, I, P>>;
};

export function handle<A extends AuthLevel = 'none', I = never, P = never>({
  authLevel = 'none' as A,
  controller,
  bodyCls,
  queryCls,
  paramsCls,
}: HandleArgs<A, I, P>) {
  type Request = ExtendedRequest<A, I, P>;

  const handlers: Handler<Request>[] = [];

  if (authLevel === 'must') {
    handlers.push(mustAuth as Handler<Request>);
  } else if (authLevel === 'optional') {
    handlers.push(isAuth as Handler<Request>);
  }

  if (bodyCls && queryCls) {
    handlers.push(async (_, __, next: NextFunction) => {
      next(
        AppError.create({
          status: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.INVALID_REQUEST_INPUT,
        }),
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

  handlers.push(handleResponse(controller));

  return handlers;
}

export const handleResponse =
  <R = Request>(handler: Handler<R>) =>
  async (req: R, res: Response, next: NextFunction) => {
    try {
      let status = HttpStatus.OK;
      let body: HandlerResponse | null = null;

      const hr = await handler(req, res, next);

      if (hr) {
        if (hr.body) {
          body = hr.body;
        }
        if (hr.status) {
          status = hr.status;
        }
      }

      res.status(status).json(body);
    } catch (error) {
      next(error);
    }
  };
