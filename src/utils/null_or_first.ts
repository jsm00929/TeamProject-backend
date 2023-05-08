export function nullOrFirst<T>(arr: T[]) {
    if (arr.length === 0) {
        return null;
    }
    return arr[0];
}