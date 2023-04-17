import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteUserBody {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
