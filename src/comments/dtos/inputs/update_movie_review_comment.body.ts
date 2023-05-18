import { IsNotEmpty, IsString } from "class-validator";

export class UpdateReviewCommentBody {
  @IsString()
  @IsNotEmpty()
  content: string;
}
