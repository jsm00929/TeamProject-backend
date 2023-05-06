export class PaginationOutput<T> {
    meta: PaginationMeta;
    data: T[];

    private constructor() {
    }

    public static new<T>(
        {
            data,
            count,
            hasMore,
        }: {
            data: T[];
            count: number;
            hasMore: boolean;
        }) {
        const p = new PaginationOutput<T>();
        p.meta = new PaginationMeta(count, hasMore);
        p.data = data;

        return p;
    }

    public static from<T>(
        {data, count}: { data: T[], count: number }
    ): PaginationOutput<T> {

        let hasMore = false;

        if (data.length > count) {
            --count;
            hasMore = true;
            data.pop();
        }

        return PaginationOutput.new({
            data,
            count,
            hasMore,
        });
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
