import { MaxLength, MinLength, IsOptional } from "class-validator";

export class UpdateUserNameBody {
  @MinLength(4)
  @MaxLength(20)
  name: string;
}
