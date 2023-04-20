import { BaseOutput } from '../../../core/dtos/outputs/base_output';
import { UserOutput } from '../../../users/dtos/outputs/user.output';

export interface ReviewOverviewOutput extends BaseOutput {
  title: string;
  overview: string;
  rating: number | null;
  author: UserOutput;
}
