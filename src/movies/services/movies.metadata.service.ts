import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import {PickIdsWithTx} from "../../core/types/pick_ids";
import {MovieMetaData} from "@prisma/client";
import MoviesHistoryRepository from "../repositories/movies.history.repository";


// async function findByUserId(
//     {userId, tx}: PickIdsWithTx<'user'>,
// ): Promise<MovieMetaData> {
//     return tx.movieMetaData.findUnique({
//         where: {
//             userId,
//         },
//     });
// }
//
async function findByUserIdOrCreateAndReturn(
    {userId, tx}: PickIdsWithTx<'user'>,
): Promise<MovieMetaData> {
    let metaData = await MoviesMetadataRepository.findByUserId({userId, tx});

    // metaData가 DB에 없는 사용자의 경우, 생성
    if (metaData === null) {
        metaData = await MoviesMetadataRepository.createAndReturn({userId, tx});
    }

    return metaData;
}

async function updateLatestHistoryIfIsLatest(
    {nextId, userId, tx}: PickIdsWithTx<'user'> & { nextId: number },
) {
    // 1. 만약 latest movie history라면 history.latestMovieHistoryId update
    const metaData = await findByUserIdOrCreateAndReturn({userId, tx});

    // 2-1. 아니면 return
    if (metaData.latestHistoryId !== nextId) return;

    // 2-2. 맞으면 next history 혹은 null 로 latest history id 대체
    const next = await MoviesHistoryRepository.findNextById({
        movieHistoryId: nextId, tx
    });
    await MoviesMetadataRepository.updateLatestHistoryId({
        nextId: next === null ? null : next.id,
        userId,
        tx,
    });
}

export default {
    findByUserIdOrCreateAndReturn,
    updateLatestHistoryIfIsLatest,
}