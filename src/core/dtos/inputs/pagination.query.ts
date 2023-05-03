import {IsNumber, IsOptional, Max, Min} from 'class-validator';

export type Cursor = {
    id: number;
};

export class PaginationQuery {

    @IsNumber()
    @Min(10)
    @Max(100)
    count: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    after?: number;

    constructor(after?: number, count = 20) {
        this.after = after;
        this.count = count;
    }

    // public unwrapCursor(): Cursor | null {
    //     if (this.after === undefined || this.after === null) {
    //         return null;
    //     }
    //     return {
    //         id: this.after,
    //     };
    // }
}
