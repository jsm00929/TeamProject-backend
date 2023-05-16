import { sign } from 'jsonwebtoken';
import { Me } from '../types/Me';
import { Config } from '../config/env';

export function generateToken(payload: Me) {
  return sign(payload, Config.getInstance().jwtSecret);
}
