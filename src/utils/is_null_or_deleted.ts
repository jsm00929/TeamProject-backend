export function isNullOrDeleted(o: object | null) {
    if (o === null) return true;
    return (o.hasOwnProperty('deletedAt') && o['deletedAt'] !== null);
}

export function isDeleted(o: object | null) {
    if (o === null) return false;
    return (o.hasOwnProperty('deletedAt') && o['deletedAt'] !== null);
}



