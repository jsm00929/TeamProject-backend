import { Request, Response, NextFunction } from 'express';
import { mustAuth } from '../../../src/auth/middlewares/must_auth';
import { AppError, AuthRequest } from '../../../src/core/types';
import { ErrorMessages, HttpStatus } from '../../../src/core/constants';
import * as token from '../../../src/utils/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../../src/config/constants';

describe('mustAuth', () => {
  const mockRequest: Partial<AuthRequest> = {
    signedCookies: {},
  };
  const mockResponse: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return unauthorized when access token is not provided', () => {
    mustAuth(
      mockRequest as AuthRequest,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ErrorMessages.UNAUTHORIZED_USER,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  });

  it('should return unauthorized when an invalid access token is provided', () => {
    const invalidToken = 'invalid token';
    (mockRequest as Request).signedCookies[ACCESS_TOKEN_COOKIE_NAME] =
      invalidToken;
    jest.spyOn(token, 'verifyAccessToken').mockImplementation(() => {
      throw AppError.new({
        message: ErrorMessages.INVALID_TOKEN,
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    mustAuth(
      mockRequest as AuthRequest,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockNextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ErrorMessages.INVALID_TOKEN,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  });

  it('should set userId in request object when a valid access token is provided', () => {
    const validToken = 'valid token';
    const userId = 100;
    (mockRequest as AuthRequest).signedCookies[ACCESS_TOKEN_COOKIE_NAME] =
      validToken;
    jest.spyOn(token, 'verifyAccessToken').mockImplementation(() => userId);

    mustAuth(
      mockRequest as AuthRequest,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockRequest.userId).toBe(userId);
    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});
