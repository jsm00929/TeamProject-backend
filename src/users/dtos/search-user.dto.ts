import { IsEmail, IsInt, MaxLength, MinLength } from 'class-validator';

export class SearchUserDto {
  @IsInt()
  id?: number;

  @IsEmail()
  email?: string;

  @MinLength(4)
  @MaxLength(20)
  name?: string;
}
