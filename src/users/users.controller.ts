import { HandlerResponse } from '../core/middlewares/handle_response';
import usersService from './users.service';
import { UpdateUserAvatarUrlInput } from './dtos/inputs/update_user_avatar_url.input';
import { AuthRequest, AuthRequestWith } from '../core/types';

async function me(req: AuthRequest): Promise<HandlerResponse> {
  const userId = req.userId;
  const me = await usersService.getMySimpleInfo(userId);

  return { body: me };
}

async function meDetail(req: AuthRequest): Promise<HandlerResponse> {
  const userId = req.userId;
  const meDetail = await usersService.getMyDetailInfo(userId);

  return { body: meDetail };
}

async function update(req: AuthRequestWith<UpdateUserAvatarUrlInput>) {
  const userId = req.userId;
  const updateUserInput = req.unwrap();

  await usersService.updateMyInfo(userId, updateUserInput);
}

async function withdraw(req: AuthRequest) {
  const userId = req.userId;

  await usersService.withdraw(userId);
}

export default {
  me,
  meDetail,
  update,
  withdraw,
};
