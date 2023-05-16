import { verify } from 'jsonwebtoken';
import { Config } from '../config/env';
import { Me } from '../types/Me';

export function verifyToken(token: string) {
  // TODO: 만료 기한 설정 필요
  return verify(token, Config.getInstance().jwtSecret) as Me;
}
