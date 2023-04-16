import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignupBody {
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(1)
  @MaxLength(20)
  name: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
