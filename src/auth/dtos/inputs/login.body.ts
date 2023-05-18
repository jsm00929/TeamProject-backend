import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginBody {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
