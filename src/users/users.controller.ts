import { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { RequestWith } from '../types/RequestWith';
import { LoginDto } from './dtos/login-dto';
import { AuthRequest } from '../types/AuthRequest';

export const usersController = {
  async signUp(req: RequestWith<CreateUserDto>, res: Response) {
    const createUserDto = req.unwrap();

    console.log(createUserDto);
    res.json(createUserDto);
  },
  async login(req: RequestWith<LoginDto>, res: Response) {},

  async user(req: AuthRequest, res: Response) {},
};
