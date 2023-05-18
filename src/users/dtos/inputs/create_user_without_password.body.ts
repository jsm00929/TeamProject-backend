import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserWithoutPasswordBody {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl: string | null | undefined;
}
