import {prisma} from "../../config/db";
import MoviesLikeRepository from "../repositories/movies.like.repository";
import {PickIds} from "../../core/types/pick_ids";
import {ToggleMovieLikeBody} from "../dtos/inputs/toggle_movie_like.body";
import {PaginationQuery, PaginationQueryWithCursor} from "../../core/dtos/inputs";
import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import {PaginationOutput} from "../../core/dtos/outputs/pagination_output";
import {MovieWithGenresOutput} from "../dtos/outputs/movie_with_genres.output";
import {isUpdatableLike} from "../validations/is_updatable_like";
import {isDeleted} from "../../utils/is_null_or_deleted";
import MoviesMetadataService from "./movies.metadata.service";

async function likeMovies(
    {userId}: PickIds<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieWithGenresOutput>> {
    return prisma.$transaction(async (tx) => {

        const q: PaginationQueryWithCursor = {count, after};

        // after가 생략되었을 경우, latest cursor을 얻기 위해 metadata 가져옴
        if (after === undefined) {
            const {latestLikeId} = await MoviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});

            // DB에서 가져온 latestLikeId 추가
            q.cursor = latestLikeId !== null ? latestLikeId : undefined;
        }

        return MoviesLikeRepository.findManyLikedMoviesByUserId({
            userId,
            tx,
        }, q);
    });
}


async function toggleMovieLike(
    {userId, movieId}: PickIds<'user' | 'movie'>,
    {nextLike}: ToggleMovieLikeBody,
) {
    await prisma.$transaction(async (tx) => {

        let nextLikesCount: 'increment' | 'decrement' = 'increment'

        // 1. like 찾기 or 생성 or 복구
        let like = await MoviesLikeRepository
            .findByUserIdAndMovieId({userId, movieId, tx});

        // prev, next가 동일한 경우, 상태 변화 x
        if (!isUpdatableLike(nextLike, like)) return;

        // 1. like exists -> updateIfLatest
        if (like !== null && !isDeleted(like)) {
            await MoviesLikeRepository.softDeleteById({movieLikeId: like.id, tx});
            await MoviesMetadataService.updateLatestLikeIfLatest({
                movieLikeId: like.id,
                userId,
                tx,
            });
            return;
        }

        // 2. like가 존재하지 않을 경우, create
        if (like === null) {
            // metadata increment
            like = await MoviesLikeRepository.create({
                userId,
                movieId,
                tx,
            });
        } else {
            // 3. 취소한 좋아요를 다시 누르는 경우
            await MoviesLikeRepository.restore({movieLikeId: like.id, tx});
        }

        await MoviesMetadataRepository.updateLatestLike({
            likesCount: nextLikesCount,
            userId,
            nextId: like.id,
            tx,
        });

    });
}

export default {
    likeMovies,
    toggleMovieLike,
}