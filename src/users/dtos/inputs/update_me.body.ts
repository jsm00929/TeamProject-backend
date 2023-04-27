import { MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateMeBody {
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(100)
  password?: string;
}
