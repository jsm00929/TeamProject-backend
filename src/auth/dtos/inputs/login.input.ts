import { MaxLength, MinLength } from 'class-validator';

export class LoginInput {
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
