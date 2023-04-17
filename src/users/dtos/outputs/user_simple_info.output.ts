import { BaseOutput } from '../../../core/dtos/outputs/base_output';

export interface UserSimpleInfoOutput extends Pick<BaseOutput, 'id'> {
  username: string;
  name: string;
  avatarUrl: string | null;
}
