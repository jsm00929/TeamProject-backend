import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import moviesMetadataRepository from "../repositories/movies.metadata.repository";
import {PickIdsWithTx} from "../../core/types/pick_ids";
import MoviesHistoryRepository from "../repositories/movies.history.repository";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";
import MoviesLikeRepository from "../repositories/movies.like.repository";
import MoviesFavoriteRepository from "../repositories/movies.favorite.repository";


async function createOrUpdateLatestHistory(
    {
        nextId,
        userId,
        tx,
        historiesCount,
    }: PickIdsWithTx<'user'> & {
        nextId: number,
        historiesCount: 'increment' | 'decrement' | null,
    },
) {
    // 1. 최초 사용 시, MetaData 존재하지 않으므로 생성
    await moviesMetadataRepository.createIfNotExists({userId, tx});
    // 2. latest history id 갱신
    await moviesMetadataRepository.updateLatestHistory({
        nextId,
        historiesCount,
        userId,
        tx,
    });
}

async function createOrUpdateLatestLike(
    {
        nextId,
        userId,
        tx,
        likesCount,
    }: PickIdsWithTx<'user'> & {
        nextId: number,
        likesCount: 'increment' | 'decrement' | null,
    },
) {
    // 1. 최초 사용 시, MetaData 존재하지 않으므로 생성
    await moviesMetadataRepository.createIfNotExists({userId, tx});
    // 2. latest like id 갱신
    await moviesMetadataRepository.updateLatestLike({
        nextId,
        likesCount,
        userId,
        tx,
    });
}


async function updateLatestHistoryIfLatest(
    {
        movieHistoryId,
        userId,
        tx,
    }: PickIdsWithTx<'movieHistory' | 'user'>,
) {
    // 1. 만약 latest movie history라면 history.latestMovieHistoryId update
    const metaData =
        await moviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});
    // 2. 아니면 return
    if (metaData.latestHistoryId !== movieHistoryId) return;

    // 3. 맞으면 next history 혹은 null 로 latest history id 대체
    const next = await MoviesHistoryRepository.findNextById({
        movieHistoryId,
        userId,
        tx,
    });

    const nextId = isNullOrDeleted(next) ? null : next!.id;

    // 4. decrement histories count
    await MoviesMetadataRepository.updateLatestHistory(
        {
            nextId,
            historiesCount: 'decrement',
            userId,
            tx,
        });
}


async function updateLatestLikeIfLatest(
    {
        movieLikeId,
        userId,
        tx,
    }: PickIdsWithTx<'movieLike' | 'user'>,
) {
    // 1. 만약 latest movie like라면 history.latestLikeMovieId update
    const metaData =
        await moviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});
    // 2. 아니면 return
    if (metaData.latestLikeId !== movieLikeId) return;

    // 3. 맞으면 next like 혹은 null 로 latest like id 대체
    const next = await MoviesLikeRepository.findNextById({
        movieLikeId,
        userId,
        tx,
    });
    const nextId = isNullOrDeleted(next) ? null : next!.id;

    await MoviesMetadataRepository.updateLatestLike(
        {
            nextId,
            likesCount: 'decrement',
            userId,
            tx,
        });
}


async function updateLatestFavoriteIfLatest(
    {
        favoriteMovieId,
        userId,
        tx,
    }: PickIdsWithTx<'favoriteMovie' | 'user'>,
) {
    const metaData =
        await moviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});
    if (metaData.latestFavoriteId !== favoriteMovieId) return;

    const next = await MoviesFavoriteRepository.findNextById({
        favoriteMovieId,
        userId,
        tx,
    });
    const nextId = isNullOrDeleted(next) ? null : next!.id;

    await MoviesMetadataRepository.updateLatestFavorite(
        {
            nextId,
            favoritesCount: 'decrement',
            userId,
            tx,
        });
}

export default {
    createOrUpdateLatestHistory,
    updateLatestHistoryIfLatest,
    updateLatestLikeIfLatest,
    updateLatestFavoriteIfLatest,
}