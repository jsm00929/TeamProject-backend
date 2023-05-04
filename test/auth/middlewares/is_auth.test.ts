import { NextFunction } from 'express';
import { AppError, OptionalAuthRequest } from '../../../src/core/types';
import { isAuth } from '../../../src/auth/middlewares/is_auth';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../../src/config/constants';
import { ErrorMessages, HttpStatus } from '../../../src/core/constants';
import * as token from '../../../src/utils/token';

describe('isAuth middleware', () => {
  const mockRequest: Partial<OptionalAuthRequest> = {
    cookies: {},
  };
  const mockResponse = {};
  const mockNextFunction: NextFunction = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next function if there is no access token', () => {
    isAuth(mockRequest as OptionalAuthRequest, mockResponse, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockNextFunction).toHaveBeenCalledWith();
  });

  it('should call next function with an error if the access token is invalid', () => {
    const invalidAccessToken = 'invalid_token';
    mockRequest.cookies = {
      [ACCESS_TOKEN_COOKIE_NAME]: invalidAccessToken,
    };

    isAuth(mockRequest as OptionalAuthRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockNextFunction).toHaveBeenCalledWith(
      AppError.new({
        message: ErrorMessages.INVALID_TOKEN,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  });

  it('should set the userId property on the request object if the access token is valid', () => {
    const accessToken = 'valid_token';
    const userId = 1;
    mockRequest.cookies = {
      [ACCESS_TOKEN_COOKIE_NAME]: accessToken,
    };

    jest.spyOn(token, 'verifyAccessToken').mockReturnValueOnce(userId);

    isAuth(mockRequest as OptionalAuthRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
    expect(mockRequest.userId).toBe(userId);
  });
});
