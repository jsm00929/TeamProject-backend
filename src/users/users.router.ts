import { Router } from 'express';
import { usersController } from './users.controller';
import { CreateUserDto } from './dtos/create-user.dto';
import { mustValid } from '../middlewares/mustValid';
import { LoginDto } from './dtos/login-dto';

export const usersRouter = Router();

usersRouter.post('/signup', mustValid(CreateUserDto), usersController.signUp);
usersRouter.post('/login', mustValid(LoginDto), usersController.login);
