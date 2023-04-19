import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMyPasswordBody {
  oldPassword?: string | null;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  newPassword: string;
}
