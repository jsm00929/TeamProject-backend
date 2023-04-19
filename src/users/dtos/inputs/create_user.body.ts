import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserBody {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
