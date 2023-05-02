import { Response } from 'express';

export function handleNotFoundError(error: Error, _, res: Response, __) {
  return res.status(404).json({ message: 'not found' });
}
