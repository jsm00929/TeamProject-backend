import {User} from "@prisma/client";

export class UserOutput {
    id: number;
    email: string;
    name: string;
    avatarUrl: string | null;

    protected constructor({id, email, name, avatarUrl}: User) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

    public static from(user: User): UserOutput {
        return new this(user);
    }
}

export class UserWithPasswordOutput extends UserOutput {
    password: string | null;

    protected constructor(user: User) {
        super(user);
        this.password = user.password;
    }

    public static from(user: User): UserWithPasswordOutput {
        return new this(user);
    }
}
