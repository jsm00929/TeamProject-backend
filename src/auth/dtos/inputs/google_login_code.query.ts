import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginCodeQuery {
  @IsString()
  @IsNotEmpty()
  code: string;
}
