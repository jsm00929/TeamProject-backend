import {prisma} from "../../config/db";
import MoviesLikeRepository from "../repositories/movies.like.repository";
import {PickIds} from "../../core/types/pick_ids";
import {ToggleMovieLikeBody} from "../dtos/inputs/toggle_movie_like.body";


async function toggleMovieLike(
    {userId, movieId}: PickIds<'user' | 'movie'>,
    {nextLike}: ToggleMovieLikeBody,
) {
    await prisma.$transaction(async (tx) => {

        const like = await MoviesLikeRepository
            .findByUserIdAndMovieId({userId, movieId, tx});
        const prevLike = like !== null;
        // TODO:
        // Client에서 like의 현재 상태를 보낼지, 원하는 다음 상태를 보낼지 ?
        // 현재 상태보다 원하는 다음 상태를 보내는 것이 조금 더 직관적으로 느껴지는듯
        // like - 다음 상태(현재)
        //
        // 사용자는 좋아요를 누르려고 하는데, 이미 좋아요를 누른 상태라면 아무 것도 하지 않음
        // 사용자는 좋아요를 취소하려고 하는데, 좋아요를 누르지 않은 상태라면 아무 것도 하지 않음
        if (prevLike === nextLike) return;

        // 사용자가 좋아요를 누르려고 하는데, 좋아요를 누른 상태라면 삭제
        if (prevLike) {
            await MoviesLikeRepository.softDeleteById({movieLikeId: like.id, tx});
        } else {
            // 사용자가 좋아요를 누르려고 하는데, 좋아요를 누르지 않은 상태라면 좋아요를 누름
            await MoviesLikeRepository.create({userId, movieId, tx});
        }

        // TODO:
        // like를 2번 검사하는데, 중복되더라도 2중 if문보다 조금 더 가독성이 좋다고 생각됨
        // 어떤 방법이 좀 더 나을지 고민해보기
    });
}

export default {
    toggleMovieLike,
}