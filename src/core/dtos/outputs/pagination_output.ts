export class PaginationOutputWith<T> {
    meta: PaginationMeta;
    data: T[];

    private constructor() {
    }

    static new<T>({
                      data,
                      count,
                      hasMore,
                  }: {
        data: T[];
        count: number;
        hasMore: boolean;
    }) {
        const p = new PaginationOutputWith();
        p.meta = new PaginationMeta(count, hasMore);
        p.data = data;
    }
}

class PaginationMeta {
    count: number;
    hasMore: boolean;

    constructor(count: number, hasMore: boolean) {
        this.count = count;
        this.hasMore = hasMore;
    }
}
