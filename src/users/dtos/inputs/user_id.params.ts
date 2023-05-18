import { IsNumber, Min } from "class-validator";

export class UserIdParams {
  @IsNumber()
  @Min(1)
  userId: number;
}
