import { User } from '@prisma/client';
import { BaseOutput } from '../../../core/dtos/outputs/base_output';

export interface UserOutput extends BaseOutput {
  email: string;
  name: string;
  avatarUrl: string | null;
}

export function userEntityIntoUserOutput({
  id,
  avatarUrl,
  email,
  name,
  createdAt,
  updatedAt,
}: User): UserOutput {
  return {
    id,
    avatarUrl,
    email,
    name,
    createdAt,
    updatedAt,
  };
}
