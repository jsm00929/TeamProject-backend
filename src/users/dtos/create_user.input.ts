import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  name: string;

  @MinLength(4)
  @MaxLength(100)
  password: string;
}
