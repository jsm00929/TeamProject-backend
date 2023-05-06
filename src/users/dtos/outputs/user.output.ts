import {User} from "@prisma/client";
import {isNullOrDeleted} from "../../../utils/is_null_or_deleted";
import {BaseOutput} from "../../../core/dtos/outputs/base_output";

export class UserOutput extends BaseOutput {
    email: string;
    name: string;
    avatarUrl: string | null;

    protected constructor(u: User) {
        super(u.id, u.createdAt, u.updatedAt);
        this.email = u.email;
        this.name = u.name;
        this.avatarUrl = u.avatarUrl;
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
