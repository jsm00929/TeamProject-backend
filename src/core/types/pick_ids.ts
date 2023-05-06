import {Tx} from "./tx";

type Key = 'user' | 'movie' | 'comment' | 'movieHistory' | 'movieLike' | 'favoriteMovie' | 'review' | 'author';

export type PickIds<T extends Key> = {
    [K in `${T}Id`]: number;
};

export type PickIdsWithTx<T extends Key> = PickIds<T> & { tx: Tx };
export type PickIdsWithOptionalTx<T extends Key> = PickIds<T> & { tx?: Tx };

export type EmailWithTx = { email: string } & { tx: Tx };
