import {PaginationQuery} from '../core/dtos/inputs';
import moviesRepository from './movies.repository';

async function getFavorites(userId: number, paginationInput: PaginationQuery) {
    return moviesRepository.getFavorites(userId, paginationInput);
}

async function getRecentlyViewed(
    userId: number,
    paginationInput: PaginationQuery,
) {
    return moviesRepository.getRecentlyViewed(userId, paginationInput);
}

async function getPopularMovies(paginationInput: PaginationQuery) {
    return moviesRepository.getPopularMovies(paginationInput);
}

async function getMovieDetail(userId: number | undefined, movieId: number) {
    if (userId) {
        await moviesRepository.updateViewedAt(userId, movieId);
    }

    return moviesRepository.getMovieDetail(movieId);
}

async function toggleFavoriteMovie(userId: number, movieId: number) {
    await moviesRepository.toggleFavoriteMovie(userId, movieId);
}

export default {
    getPopularMovies,
    getMovieDetail,
    getFavorites,
    getRecentlyViewed,
    toggleFavoriteMovie,
};
