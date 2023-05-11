import {FavoriteMovie} from "@prisma/client";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";

export function isUpdatableFavorite(next: boolean, prevFavorite: FavoriteMovie | null) {
    // null or deleted like means not liked
    const prev = !isNullOrDeleted(prevFavorite);
    // below means prev is equal to next, so no need to update
    return prev !== next;
}