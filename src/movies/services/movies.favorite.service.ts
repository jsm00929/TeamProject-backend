import {MovieRecord, UserRecord} from "../../core/types/tx";
import {prisma} from "../../config/db";
import MoviesFavoriteRepository from "../repositories/movies.favorite.repository";

async function addFavorite(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    return prisma.$transaction(async (tx) => {

        const favorite
            = await MoviesFavoriteRepository.findByUserIdAndMovieId({userId, movieId, tx});

        if (favorite !== null) return;

        await MoviesFavoriteRepository.create({userId, movieId, tx});
    });
}

async function removeFavorite(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    return prisma.$transaction(async (tx) => {

        const favorite
            = await MoviesFavoriteRepository.findByUserIdAndMovieId({userId, movieId, tx});

        if (favorite === null) return;

        await MoviesFavoriteRepository.removeById({favoriteMovieId: favorite.id, tx});
    });
}

export default {
    addFavorite,
    removeFavorite,
}