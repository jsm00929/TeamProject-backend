import {prisma} from "../../config/db";
import MoviesLikeRepository from "../repositories/movies.like.repository";
import {PickIds} from "../../core/types/pick_ids";
import {ToggleMovieLikeBody} from "../dtos/inputs/toggle_movie_like.body";


async function toggleMovieLike(
    {userId, movieId}: PickIds<'user' | 'movie'>,
    {nextLike}: ToggleMovieLikeBody,
) {
    await prisma.$transaction(async (tx) => {

        const like = await MoviesLikeRepository
            .findByUserIdAndMovieId({userId, movieId, tx});

        // 1. 좋아요를 처음 누르는 경우
        if (like === null && nextLike) {
            await MoviesLikeRepository.create({userId, movieId, tx});
            return;
        }

        if (like) {
            if (!nextLike) {
                // 2. 좋아요를 취소하려는 경우
                await MoviesLikeRepository.softDeleteById({movieLikeId: like.id, tx});
            } else {
                // 3. 취소한 좋아요를 다시 누르는 경우
                await MoviesLikeRepository.restore({movieLikeId: like.id, tx});
            }
        }

    });
}

export default {
    toggleMovieLike,
}