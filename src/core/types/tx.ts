import {PrismaClient} from "@prisma/client";
import {prisma} from "../../config/db";

export type Tx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">

export function prismaClient(tx?: Tx) {
    if (tx === undefined) {
        return prisma;
    }
    return tx;
}

export interface IdRecord {
    id: number;
}

export interface FetchRecord<T = IdRecord> extends TxRecord {
    where: T,
}

export interface CreateRecord<T> extends TxRecord {
    data: T;
}

export interface UpdateRecord<T> extends TxRecord {
    where: T;
    data: Partial<T>;
}

export interface TxRecord {
    tx?: Tx;
}

export interface ReviewRecord {
    reviewId: number;
}

export interface UserRecord {
    userId: number;
    email: string;
    name: string;
    avatarUrl: string | null;
    password: string
}

export interface UserMovieRecord {
    userMovieId: number;
    userId: number;
    movieId: number;
    viewedAt: Date;
    isFavorite: boolean;
}

export interface MovieRecord {
    movieId: number;
}

export interface RatingRecord {
    ratingId: number;
    rating: number;
}

export interface PaginationRecord {
    skip: number;
    take: number;
}

export type Include<T extends Record<string, any>> = Partial<{ [K in keyof T]?: boolean }>;
export type OrderBy<T extends Record<string, any>> = Partial<{ [K in keyof T]?: 'asc' | 'desc' }>;
export type MovieInclude = Include<{ genre: string }>;
export type MovieOrderBy = OrderBy<MovieRecord>;