import {MovieRecord, UserRecord} from "../../core/types/tx";
import {prisma} from "../../config/db";
import MoviesFavoriteRepository from "../repositories/movies.favorite.repository";
import {PickIds} from "../../core/types/pick_ids";
import {ToggleFavoriteMovieBody} from "../dtos/inputs/toggle_favorite_movie.body";
import {isDeleted, isNullOrDeleted} from "../../utils/is_null_or_deleted";
import {isUpdatableLike} from "../validations/is_updatable_like";
import MoviesMetadataService from "./movies.metadata.service";
import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import {PaginationQuery, PaginationQueryWithCursor} from "../../core/dtos/inputs";
import {PaginationOutput} from "../../core/dtos/outputs/pagination_output";
import {MovieWithGenresOutput} from "../dtos/outputs/movie_with_genres.output";


async function favoriteMovies(
    {userId}: PickIds<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieWithGenresOutput>> {
    return prisma.$transaction(async (tx) => {

        const q: PaginationQueryWithCursor = {count, after};

        const {latestFavoriteId} =
            await MoviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});

        // after가 생략되었을 경우, metadata의 latest cursor 사용
        if (after === undefined) {
            // DB에서 가져온 latestLikeId 추가
            q.cursor = latestFavoriteId !== null ? latestFavoriteId : undefined;
        }

        return MoviesFavoriteRepository.findManyFavoriteMoviesByUserId({
            userId,
            tx,
        }, q);
    });
}

async function toggleFavorite(
    {userId, movieId}: PickIds<'user' | 'movie'>,
    {nextFavorite}: ToggleFavoriteMovieBody,
) {
    await prisma.$transaction(async (tx) => {

        // 1. like 찾기 or 생성 or 복구
        let favorite = await MoviesFavoriteRepository
            .findByUserIdAndMovieId({userId, movieId, tx});

        // prev, next가 동일한 경우, 상태 변화 x
        if (!isUpdatableLike(nextFavorite, favorite)) return;

        // 1. exists -> updateIfLatest
        if (favorite !== null && !isDeleted(favorite)) {
            await MoviesFavoriteRepository.softDeleteById({favoriteMovieId: favorite.id, tx});
            await MoviesMetadataService.updateLatestFavoriteIfLatest({
                favoriteMovieId: favorite.id,
                userId,
                tx,
            });
            return;
        }

        // 2. favorite가 존재하지 않을 경우, create
        if (favorite === null) {
            // metadata increment
            favorite = await MoviesFavoriteRepository.create({
                userId,
                movieId,
                tx,
            });
        } else {
            // 3. 취소한 즐겨찾기 다시 누르는 경우
            await MoviesFavoriteRepository.restore({favoriteMovieId: favorite.id, tx});
        }

        // TODO:
        await MoviesMetadataRepository.createIfNotExists({userId, tx});
        await MoviesMetadataRepository.updateLatestFavorite({
            favoritesCount: 'increment',
            userId,
            nextId: favorite.id,
            tx,
        });

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
    favoriteMovies,
    toggleFavorite,
    deleteFavorite,
}