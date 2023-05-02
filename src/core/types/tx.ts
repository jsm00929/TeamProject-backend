import {PrismaClient} from "@prisma/client";
import {prisma} from "../../config/db";

export type Tx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">

export function prismaClient(tx?: Tx) {
    if (tx === undefined) {
        return prisma;
    }
    return tx;
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

export interface MovieRecord {
    movieId: number;
}

export interface RatingRecord {
    ratingId: number;
    rating: number;
}