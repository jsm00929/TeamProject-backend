import { HasId } from "../../types/HasId";

export class PaginationOutput<T> {
  meta: PaginationMeta;
  data: T[];

  private constructor() {}

  public static new<T>({
    data,
    count,
    hasMore,
    lastId,
  }: {
    data: T[];
    count: number;
    hasMore: boolean;
    lastId: number | null;
  }) {
    const p = new PaginationOutput<T>();
    p.meta = new PaginationMeta(count, hasMore, lastId);
    p.data = data;

    return p;
  }

  public static from<T extends HasId>(
    data: T[],
    count: number
  ): PaginationOutput<T> {
    let hasMore = false;

    if (data.length > count) {
      hasMore = true;
      data.pop();
    }

    console.log(data);
    return PaginationOutput.new({
      data,
      count: data.length,
      lastId: data.length === 0 ? null : data[data.length - 1].id,
      hasMore,
    });
  }
}

class PaginationMeta {
  count: number;
  hasMore: boolean;
  lastId: number | null;

  constructor(count: number, hasMore: boolean, lastId: number | null) {
    this.count = count;
    this.hasMore = hasMore;
    this.lastId = lastId;
  }
}
