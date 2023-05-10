import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import moviesMetadataRepository from "../repositories/movies.metadata.repository";
import {PickIdsWithTx} from "../../core/types/pick_ids";
import MoviesHistoryRepository from "../repositories/movies.history.repository";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";


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
    await moviesMetadataRepository.createIfExists({userId, tx});
    // 2. latest history id 갱신
    await moviesMetadataRepository.updateLatestHistory({
        nextId,
        historiesCount,
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

    // 5. decrement histories count
    await MoviesMetadataRepository.updateLatestHistory(
        {
            nextId,
            historiesCount: 'decrement',
            userId,
            tx,
        });
}

export default {
    createOrUpdateLatestHistory,
    updateLatestHistoryIfIsLatest: updateLatestHistoryIfLatest,
}