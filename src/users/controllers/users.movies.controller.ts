import {AuthRequestWith} from "../../core/types";
import {MovieIdParams} from "../../movies/dtos/inputs/get_movie_detail.params";
import moviesService from "../../movies/services/movies.service";
import {AppResult} from "../../core/types/app_result";
import {HttpStatus} from "../../core/constants";
import {UserMoviesPaginationQuery} from "../../movies/movies_pagination.query";
import moviesHistoryService from "../../movies/services/movies.history.service";
import {router} from "../../routers";
import {handle} from "../../core/handle";


/**
 * @deprecated
 * @description
 * 현재 로그인 된 사용자가 최근 본 영화
 * or 즐겨찾기에 추가한 영화
 * - filter: 'recentlyViewed' | 'favorite'
 */
router.users.get('/me/movies',
    handle({
        authLevel: 'must',
        queryCls: UserMoviesPaginationQuery,
        controller: myMovies
    }));

async function myMovies(req: AuthRequestWith<UserMoviesPaginationQuery>) {
    const {userId} = req;
    const {count, after, filter, include} = req.unwrap();

    const movies = await moviesService.userMovies(
        {userId},
        {count, after, filter, include},
    );

    return AppResult.new({body: movies});
}


/**
 * @description
 * 영화 조회 기록 삭제
 */
router.users.delete('/me/movies/histories/:movieId',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        controller: removeMyMovieHistory,
    }));

async function removeMyMovieHistory(req: AuthRequestWith<never, MovieIdParams>) {
    const {userId} = req;
    const {movieId} = req.unwrapParams();

    await moviesHistoryService.remove({userId, movieId});

    return AppResult.new({
        status: HttpStatus.OK,
    });
}

/**
 * @description
 * 영화 즐겨찾기 등록/해제
 */
router.users.post('/me/movies/:movieId/favorite',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        controller: toggleFavoriteMovie,
    }));



