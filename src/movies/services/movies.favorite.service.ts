import {MovieRecord, UserRecord} from "../../core/types/tx";
import {prisma} from "../../config/db";
import MoviesFavoriteRepository from "../repositories/movies.favorite.repository";
import {PickIds} from "../../core/types/pick_ids";
import {ToggleFavoriteMovieBody} from "../dtos/inputs/toggle_favorite_movie.body";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";

async function toggleFavorite(
    {userId, movieId}: PickIds<'user' | 'movie'>,
    {nextFavorite}: ToggleFavoriteMovieBody,
) {
    await prisma.$transaction(async (tx) => {

        const favorite
            = await MoviesFavoriteRepository.findByUserIdAndMovieId({userId, movieId, tx});

        // 1. 즐겨찾기에 처음 등록하는 경우
        if (favorite === null && nextFavorite) {
            await MoviesFavoriteRepository.create({userId, movieId, tx});
            return;
        }

        if (favorite !== null) {
            if (!nextFavorite) {
                // 2. 즐겨찾기에서 삭제하는 경우
                await MoviesFavoriteRepository.softDeleteById({favoriteMovieId: favorite.id, tx});
            }
            // 3. 즐겨찾기에서 삭제 후 다시 추가하는 경우
            await MoviesFavoriteRepository.restore({favoriteMovieId: favorite.id, tx})
        }

    });
}

async function deleteFavorite(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    await prisma.$transaction(async (tx) => {

        const favorite
            = await MoviesFavoriteRepository.findByUserIdAndMovieId({userId, movieId, tx});

        // TODO:
        if (isNullOrDeleted(favorite)) return;

        await MoviesFavoriteRepository.softDeleteById({favoriteMovieId: favorite!.id, tx});
    });
}

export default {
    toggleFavorite,
    deleteFavorite,
}