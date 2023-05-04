import {MovieRecord, UserRecord} from "../../core/types/tx";
import {prisma} from "../../config/db";
import MoviesLikeRepository from "../repositories/movies.like.repository";

async function like(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    return prisma.$transaction(async (tx) => {

        const movieLike = await MoviesLikeRepository.findByUserIdAndMovieId({userId, movieId, tx});

        if (movieLike !== null) return;

        await MoviesLikeRepository.create({userId, movieId, tx});
    });
}

async function unlike(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    return prisma.$transaction(async (tx) => {

        const movieLike = await MoviesLikeRepository.findByUserIdAndMovieId({userId, movieId, tx});

        if (movieLike === null) return;

        await MoviesLikeRepository.removeById({likeMovieId: movieLike.id, tx});
    });
}

export default {
    like,
    unlike,
}