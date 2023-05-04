export class PaginationOutputWith<T> {
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
        const p = new PaginationOutputWith<T>();
        p.meta = new PaginationMeta(count, hasMore);
        p.data = data;

        return p;
    }

    // public static fromMoviesEntity(
    //     {data, count}: { data: (Movie & { genres: string[] })[], count: number }
    // ): PaginationOutputWith<MovieOutput> {
    //     const movies = data.map((m) => MovieOutput.fromMovieEntity(m);
    //    return this.intoPaginationOutput<MovieOutput>({  data:movies,count});
    // }

    public static from<T>(
        {data, count}: { data: T[], count: number }
    ): PaginationOutputWith<T> {
        const p = PaginationOutputWith.new<T>({
            data,
            count,
            hasMore: false,
        });

        if (data.length > count) {
            p.meta.hasMore = true;
            --p.meta.count;
            data.pop();
        }

        return p;
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
