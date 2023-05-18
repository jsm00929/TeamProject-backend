import { LikeMovie } from "@prisma/client";
import { isNullOrDeleted } from "../../utils/is_null_or_deleted";

export function isUpdatableLike(next: boolean, prevLike: LikeMovie | null) {
  // null or deleted like means not liked
  const prev = !isNullOrDeleted(prevLike);
  // below means prev is equal to next, so no need to update
  return prev !== next;
}
