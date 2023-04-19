import { MaxLength, MinLength } from 'class-validator';

export class UpdateMeBody {
  @MinLength(4)
  @MaxLength(20)
  name?: string;

  @MinLength(4)
  @MaxLength(100)
  password?: string;
}
