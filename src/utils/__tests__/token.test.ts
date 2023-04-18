import { Config } from '../../config/env';
import { ErrorMessages, HttpStatus } from '../../core/constants';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../token';

describe('Auth Tests', () => {
  const userId = 123;

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const accessToken = generateAccessToken(userId);
      expect(typeof accessToken).toBe('string');
      expect(accessToken).not.toBe('');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const refreshToken = generateRefreshToken(userId);
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken).not.toBe('');
    });
  });

  describe('verifyAccessToken', () => {
    let accessToken: string;

    beforeAll(() => {
      accessToken = generateAccessToken(userId);
    });

    it('should verify a valid access token', () => {
      const decodedUserId = verifyAccessToken(accessToken);
      expect(decodedUserId).toBe(userId);
    });

    it('should throw an error for an invalid access token', () => {
      expect(() => {
        verifyAccessToken('invalid-access-token');
      }).toThrowError(ErrorMessages.INVALID_TOKEN);
    });

    it('should throw an error for an expired access token', () => {
      const expiredAccessToken = generateAccessToken(userId, -1);
      expect(() => {
        verifyAccessToken(expiredAccessToken);
      }).toThrowError(ErrorMessages.EXPIRED_ACCESS_TOKEN);
    });
  });

  describe('verifyRefreshToken', () => {
    let refreshToken: string;

    beforeAll(() => {
      refreshToken = generateRefreshToken(userId);
    });

    it('should verify a valid refresh token', () => {
      const decodedUserId = verifyRefreshToken(refreshToken);
      expect(decodedUserId).toBe(userId);
    });

    it('should throw an error for an invalid refresh token', () => {
      expect(() => {
        verifyRefreshToken('invalid-refresh-token');
      }).toThrowError(ErrorMessages.INVALID_TOKEN);
    });

    it('should throw an error for an expired refresh token', () => {
      const expiredRefreshToken = generateRefreshToken(userId, -1);
      expect(() => {
        verifyRefreshToken(expiredRefreshToken);
      }).toThrowError(ErrorMessages.EXPIRED_REFRESH_TOKEN);
    });
  });
});
