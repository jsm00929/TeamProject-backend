import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SignupBody {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(1)
  @MaxLength(20)
  name: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
