import {IsNumber, IsOptional, Max, Min} from 'class-validator';

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

}

export type PaginationQueryWithCursor = PaginationQuery & { cursor?: number };


