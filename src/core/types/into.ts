export interface Into<T> {
    into(): T;
}

export interface From<T, U> {
    from(data: T): U;
}