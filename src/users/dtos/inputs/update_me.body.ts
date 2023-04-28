import { MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateMyNameBody {
  @MinLength(4)
  @MaxLength(20)
  name: string;
}
