import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
