import { User } from '@prisma/client';

export class MeDto {
  id: number;
  username: string;
  name: string;
  email: string;
  avatarUrl: string | null;

  static fromUserEntity({ id, username, name, email, avatarUrl }: User) {
    const me = new MeDto();
    me.id = id;
    me.username = username;
    me.name = name;
    me.email = email;
    me.avatarUrl = avatarUrl;

    return me;
  }
}
