import { BaseOutput } from '../../../core/dtos/outputs/base_output';
import { UserSimpleInfoOutput } from './user_simple_info.output';

export interface UserDetailInfoOutput extends UserSimpleInfoOutput, BaseOutput {
  username: string;
  email: string;
  googleId: string | null;
}
