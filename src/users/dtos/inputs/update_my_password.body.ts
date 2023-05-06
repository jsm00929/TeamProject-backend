import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordBody {
  oldPassword?: string | null;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  newPassword: string;
}
