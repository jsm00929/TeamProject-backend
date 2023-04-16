import { Router } from 'express';
import usersController from './users.controller';
import { handle, handleResponse } from '../core/middlewares/handle_response';
import { mustAuth } from '../auth/middlewares/must_auth';
import { UpdateUserAvatarUrlInput } from './dtos/inputs/update_user_avatar_url.input';

const usersRouter = Router();

usersRouter.get(
  '/me',
  handle({
    authLevel: 'must',
    controller: usersController.me,
  }),
);

usersRouter.get(
  '/me/detail',
  handle({
    authLevel: 'must',
    controller: usersController.meDetail,
  }),
);

usersRouter.patch(
  '/me',
  handle({
    authLevel: 'must',
    bodyCls: UpdateUserAvatarUrlInput,
    controller: usersController.update,
  }),
);

usersRouter.delete(
  '/me',
  handle({
    authLevel: 'must',
    controller: usersController.withdraw,
  }),
);

export default usersRouter;
