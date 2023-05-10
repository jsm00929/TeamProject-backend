import {PickIdsWithTx} from "../../core/types/pick_ids";
import {MovieMetaData} from "@prisma/client";

async function findByUserId({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.findUnique({
        where: {
            userId,
        },
    });
}

async function findByUserIdOrCreateAndReturn(
    {userId, tx}: PickIdsWithTx<'user'>,
): Promise<MovieMetaData> {
    let metaData = await findByUserId({userId, tx});

    // metaData가 DB에 없는 사용자의 경우, 생성
    if (metaData === null) {
        metaData = await createAndReturn({userId, tx});
    }

    return metaData;
}

async function createIfExists({userId, tx}: PickIdsWithTx<'user'>) {
    const metaData = await findByUserId({userId, tx});

    if (metaData === null) {
        await createAndReturn({userId, tx});
    }
}

async function createAndReturn({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.create({
        data: {
            userId,
        },
    });
}


async function updateLatestHistory(
    {
        userId,
        nextId,
        historiesCount,
        tx,
    }: PickIdsWithTx<'user'>
        & {
        nextId: number | null,
        historiesCount: 'increment' | 'decrement' | null,
    },
) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestHistoryId: nextId,
            // undefined or { increment: true } or { decrement: true }
            ...(historiesCount !== null && {historiesCount: {[historiesCount]: 1}}),
        },
    });
}

async function updateLatestLike(
    {
        userId,
        nextId,
        likesCount,
        tx,
    }: PickIdsWithTx<'user'>
        & {
        nextId: number | null,
        likesCount: 'increment' | 'decrement' | null,
    },
) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestLikeId: nextId,
            // undefined or { increment: true } or { decrement: true }
            ...(likesCount !== null && {likesCount: {[likesCount]: 1}}),
        },
    });
}

async function softDeleteByUserId({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export default {
    findByUserIdOrCreateAndReturn,
    createIfExists,
    softDeleteByUserId,
    updateLatestHistory,
    updateLatestLike,
}