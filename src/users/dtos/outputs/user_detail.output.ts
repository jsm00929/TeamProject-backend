import { User } from "@prisma/client";
import { BaseOutput } from "../../../core/dtos/outputs/base_output";

export interface UserDetailOutput extends BaseOutput {
  email: string;
  name: string;
  avatarUrl: string | null;
}

export function userEntityIntoUserDetailOutput({
  id,
  avatarUrl,
  email,
  name,
  createdAt,
  updatedAt,
}: User): UserDetailOutput {
  return {
    id,
    avatarUrl,
    email,
    name,
    createdAt,
    updatedAt,
  };
}
