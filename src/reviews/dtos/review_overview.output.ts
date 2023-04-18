import { BaseOutput } from '../../core/dtos/outputs/base_output';
import { UserSimpleInfoOutput } from '../../users/dtos/outputs/user_simple_info.output';

export interface ReviewOverviewOutput extends BaseOutput {
  title: string;
  overview: string;
  rating: number | null;
  author: UserSimpleInfoOutput;
}

// export class ReviewOutput extends BaseOutput {
//   title: string;
//   overview: string;
//   rating: number;
//   author: UserSimpleInfoOutput;

//   static fromEntity({
//     id,
//     title,
//     overview,
//     createdAt,
//     updatedAt,
//     rating,
//     author,
//   }: {
//     id: number;
//     title: string;
//     overview: string;
//     rating: number;
//     createdAt: Date;
//     updatedAt: Date;
//     author: {
//       id: number;
//       name: string;
//       avatarUrl: string | null;
//     };
//   }) {
//     const r = new ReviewOutput();

//     r.id = id;
//     r.title = title;
//     r.overview = overview;
//     r.rating = rating;
//     r.createdAt = createdAt;
//     r.updatedAt = updatedAt;
//     r.author = UserSimpleInfoOutput.create(author);

//     return r;
//   }
// }
