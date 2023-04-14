import { Request } from 'express';
import { Me } from './Me';

export interface AuthRequest extends Request {
  me?: Me;
}
