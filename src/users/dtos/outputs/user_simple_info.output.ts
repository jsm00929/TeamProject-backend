import { BaseOutput } from '../../../core/dtos/outputs/base_output';

export interface UserSimpleInfoOutput extends Pick<BaseOutput, 'id'> {
  name: string;
  avatarUrl: string | null;
}
// export class UserSimpleInfoOutput {
//   id: number;
//   name: string;
//   avatarUrl: string | null;

//   static create({
//     id,
//     name,
//     avatarUrl,
//   }: {
//     id: number;
//     name: string;
//     avatarUrl: string | null;
//   }) {
//     const user = new UserSimpleInfoOutput();
//     user.id = id;
//     user.name = name;
//     user.avatarUrl = avatarUrl;

//     return user;
//   }

//   static fromUserEntity({ id, name, avatarUrl }: User) {
//     const user = new UserSimpleInfoOutput();
//     user.id = id;
//     user.name = name;
//     user.avatarUrl = avatarUrl;

//     return user;
//   }
// }
