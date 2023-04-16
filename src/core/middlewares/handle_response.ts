import { NextFunction, Request, Response } from 'express';
import { Handler } from '../types/handler';
import { AppResult } from '../types/app_result';

export const handleResponse =
  <R = Request>(handler: Handler<R>) =>
  async (req: R, res: Response, next: NextFunction) => {
    try {
      let appResult = await handler(req, res, next);

      if (!appResult) {
        appResult = AppResult.default();
      }

      const { status, body } = appResult;
      res.status(status).json(body);
    } catch (error) {
      next(error);
    }
  };
