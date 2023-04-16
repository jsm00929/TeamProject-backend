import { MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordInput {
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
