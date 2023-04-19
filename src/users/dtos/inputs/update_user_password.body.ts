import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordBody {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
