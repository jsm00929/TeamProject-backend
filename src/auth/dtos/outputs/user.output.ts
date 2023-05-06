import {User} from "@prisma/client";
import {isNullOrDeleted} from "../../../utils/is_null_or_deleted";

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

    public static nullOrFrom(u: User | null): UserOutput | null {
        return isNullOrDeleted(u) ? null : this.from(u!);
    }

    public static from(u: User): UserOutput {
        return new this(u);
    }
}

export class UserWithPasswordOutput extends UserOutput {
    password: string | null;

    protected constructor(u: User) {
        super(u);
        this.password = u.password;
    }

    public static nullOrFrom(u: User | null): UserWithPasswordOutput | null {
        return isNullOrDeleted(u) ? null : this.from(u!);
    }

    public static from(u: User): UserWithPasswordOutput {
        return new this(u);
    }
}
