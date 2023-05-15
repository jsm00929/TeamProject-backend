import { IsNumber, IsString } from 'class-validator';

export class tokenPayload {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;
}
