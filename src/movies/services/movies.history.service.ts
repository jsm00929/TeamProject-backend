import {prisma} from "../../config/db";
import {MovieRecord, TxRecord, UserRecord} from "../../core/types/tx";
import MoviesHistoryRepository from "../repositories/movies.history.repository";
import {AppError} from "../../core/types";
import {ErrorMessages, HttpStatus} from "../../core/constants";
import {PaginationQuery} from "../../core/dtos/inputs";

async function histories(
    {userId}: Pick<UserRecord, 'userId'>,
    {count, after}: PaginationQuery
) {
    return MoviesHistoryRepository.findManyByUserId(
        {userId},
        {count, after},
    );
}

async function createOrUpdate(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {

    const movieHistory
        = await MoviesHistoryRepository.findByUserIdAndMovieId({userId, movieId, tx});

    if (!movieHistory) {
        await MoviesHistoryRepository.create({userId, movieId, tx});
    } else {
        await MoviesHistoryRepository.updateById({movieHistoryId: movieHistory.id, tx});
    }

}

async function remove(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
) {
    return prisma.$transaction(async (tx) => {

        const movieHistory
            = await MoviesHistoryRepository.findByUserIdAndMovieId({userId, movieId, tx});

        if (!movieHistory) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }
        await MoviesHistoryRepository.removeById({movieHistoryId: movieHistory.id, tx});
    });
}


export default {
    histories,
    createOrUpdate,
    remove,
}