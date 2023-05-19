import { Router } from "express";
import { ErrorMessages, HttpStatus } from "../core/constants";
import { handle } from "../core/handle";
import { AppError, AuthRequestWith, RequestWith } from "../core/types";
import { AppResult } from "../core/types/app_result";
import { ReviewIdParams } from "../reviews/dtos/review_id.params";
import commentsService from "./comments.service";
import { CommentsPaginationQuery } from "./dtos/inputs/comments_pagination.query";
import { CommentIdParams } from "./dtos/inputs/comment_id.params";
import { CreateReviewCommentBody } from "./dtos/inputs/create_movie_review_comment.body";
import { UpdateReviewCommentBody } from "./dtos/inputs/update_movie_review_comment.body";

export const commentRouter = Router();

// 댓글 생성
commentRouter.post(
  "/:reviewId/comment",
  handle({
    authLevel: "must",
    paramsCls: ReviewIdParams,
    bodyCls: CreateReviewCommentBody,
    controller: writeComment,
  })
);

async function writeComment(
  req: AuthRequestWith<CreateReviewCommentBody, ReviewIdParams>
) {
  try {
    const { userId } = req;
    const { reviewId } = req.unwrapParams();
    const { content } = req.unwrap();

    const commentId = await commentsService.writeComment(
      { userId, reviewId },
      { content }
    );

    return AppResult.new({
      body: commentId,
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    throw Error(error);
    // throw AppError.new({
    //   message: ErrorMessages.
    // });
  }
}

// 댓글 전체 조회
commentRouter.get(
  "/:reviewId/comment",
  handle({
    paramsCls: ReviewIdParams,
    queryCls: CommentsPaginationQuery,
    controller: reviewComments,
  })
);

async function reviewComments(
  req: RequestWith<CommentsPaginationQuery, ReviewIdParams>
) {
  try {
    const q = req.unwrap();
    const { reviewId } = req.unwrapParams();
    const comments = await commentsService.Comments({ reviewId }, q);

    return AppResult.new({
      body: comments,
    });
  } catch (error) {
    throw Error(error);
  }
}

// 댓글 수정
commentRouter.patch(
  "/:reviewId/comment/:commentId",
  handle({
    authLevel: "must",
    paramsCls: CommentIdParams,
    bodyCls: UpdateReviewCommentBody,
    controller: editComment,
  })
);

async function editComment(
  req: AuthRequestWith<UpdateReviewCommentBody, CommentIdParams>
) {
  try {
    const { userId } = req;
    const { commentId } = req.unwrapParams();
    const { content } = req.unwrap();

    const editedCommentId = await commentsService.editComment(
      { userId, commentId },
      { content }
    );
    return AppResult.new({
      body: editedCommentId,
    });
  } catch (error) {
    throw Error(error);
  }
}

// 댓글 삭제
commentRouter.delete(
  "/:reviewId/comment/:commentId",
  handle({
    authLevel: "must",
    paramsCls: CommentIdParams,
    controller: deleteComment,
  })
);

// 바로 조회가 가능한 index
// select 문에서 index에 있는 필드들만 가져올 때 < hdd를 안타도 되고 ram에서 다 가져올 수 있다. -> 커버링 인덱스

// index를 id에만 걸었을 때
// key:id, value: hdd block addr
// 1억 개의 row 중에서 10개를 찾아올 때

// index 안 건 column을 where로 사용했을 때
// -> full scan -> 10개를 찾아오더라도 1억 개를 무조건 다 도는건지, 아니면 O(N) 표기법처럼 최악을 가정하는건지
// 찾으려는 row 10개가 만약에 맨 앞 10개라면 10개 돌고 끝나는건지

// ->  DB에 순서가 존재하지 않음 id 값으로 정렬하는 것 뿐 -> 원판 모양의 hdd에서 시작/끝을 특정할 수 없음 - 임의의 위치
// ssd도 동일
//
// 데이터 다 찾으면 끝

// query 실행 전에 optimizer가 실행 계획 작성(비효율적인 query인 경우 최악의 경우를 상정해서 full scan이라고 알려줌)

// index 건 column을 where로 사용했을 때
// cursor로 id index 걸린거로 찾아오면 -> RAM에서 [1,1, ...(cursor)1억중 7번탐색 ,1 ,1 ,1]
// RAM index :    key: id, value: addr to hdd block
// 한방에 *id  ->  [  block(16KB), block(16KB), block(16KB) ......,    *block(16KB)       ]

// key (user_id, post_id) 복합키가 3~4개 ? 까지 ?
// 00000001 00000010
// (1, 100) -> &100block
// (1, 200) -> &200blcok
// (1, 300) -> &500blcok (createdAt)

// 만약에 사용자1이 post 1000개를 썼을떄 createdAt 순으로 orderby를 걸면
// 1000개떙겨와서 그 안에서 재정렬

// SELECT * FROM "post" WHERE user_id = 1 ORDER BY updated_at;
// SELECT * FROM "post" WHERE user_id = 1 LIMIT 10 ORDER BY updated_at;
// -> 만약에 1억개 중에 user_id가 1인 post가 10000개 있을 때,
// 위와 같이 updated_at(no index)으로 정렬을 하게 되면
// LIMIT의 여부와 상관 없이, 모든 column 다 뒤져야 하는지

// 메모리 영역에서 조건에 맞는 모든 column을 뒤져야 함 -> 정렬 비용
// 정렬하는 field에 따라(이미 정렬이 되어있나) 정렬 비용이 달라짐
// LIMIT은 영향 없음

// 복합키의 순서나 갯수에 대한 방법론?
// 어떤 column을 복합키로 거는 것이 좋은지
//
// -> 제목, 날짜, 여러 fk 등
// 1. 최신 게시물을 가져올 때 -> 어떤 식으로 복합키를 거는 것이 좋을지?
// 복합 인덱스() 하나의 인덱스에 여러 가지 column을 순서대로 나열 - 순서 중요
// (title, date, author)
// date를 제외하고 (title, author)만 조회를 하면 index가 안걸림
// (title, date)만 조회하면 index가 걸림
// title 1000 . date 1000 author 1000
// 10001000xxxx -> 10001001xxxx
// 1000xxxx1000 -> 1000xxxx1001 이어지지가 않음. 데이터를 결국 다 뒤져봐야 하는 문제가 생김
// 데이터를 조회할 때 순서를 잘 지켜야 함(상위 index가 선택되지 않은 상태에서 하위 index 선택 X)
//
// -> 날짜 데이터는 거의 중복되지 않기 때문에 index 걸기 좋음
// 자주 update 되는 날짜 데이터 - tradeoff(수정 비용 - 조회 비용)
//
// Real MySQL(정규화 방식 위주 비정규화X)
// Schema 설계  Join (Big tech들은 join 없이 table을 나누는 편) - 서버가 분리되어 있음
//
// 정산 - 판매 - 배달 - 정보 -> DB를 최대한 분리, 1:1(서버:DB)
// JOIN을 하면 모든 서버가 하나의 DB를 바라봐야 함
// 각 서버의 문제가 생겨도 다른 서버에 영향 X
//
// 상황에 따라 JOIN 선택
// MSA 트랜잭션 ? -
// 1.
//
// full managed service - AWS(구축, 관리 비용 X) 서비스 장애 시 고가용성, 복구 보장
// 팀마다 다름, 큰 기업일수록 full managed service 구축 비용이 크기 때문에 자사 인프라 구축이 유리
// 기업의 규모보다는 선택의 문제(인력 or 비용)
//
//

//
// ORDER BY가 걸려 있기 때문에 정렬을 위해선
// user_id가 1인 모든 row를 가져와야 될 것 같은데
//
// 그럼 일단 LIMIT과는 전혀 관계 없이 user_id=1인 모든 row를 index 타고 순차적으로 가져오고
// 그 데이터를 LIMIT만큼 잘라서 리턴하는 방식 ? -> 그러니까 ORDER BY가 걸리면
// 조건에 맞는 모든 데이터 다 무조건 뒤지는 것이 맞나? -> 조건이 index에 없는 예를 들어 created_at 같은 경우
//
// user id = 10인 post를 찾는데 ORDER BY updated_at
// 이 경우 updated_at은 index가 아니기 때문에
// 정렬을 위해서는 user_id = 10인 모든 row를 다 가져와야 하는 것이 맞는가
// -> 그 후 정렬
//
// index가 걸린 필드로 ORDER BY를 하면 index 자체가 정렬이 되어 있어서 다 가져올 필요가 없는 것이 맞나

// 어차피 index에 의해 sort가 되어있기 때문에 ORDER BY는 index 타는 것이랑은 관련이 없고
// index로 탐색해서 가져온 조건에 맞는 데이터를 재정렬 해주는 것일 뿐?

// index는 user_id로 되어잇는데 그 안에서 createdAt 정렬 하고 싶을 떄?

// (2, 500)
// (2, 1500)

//
// 인덱스자체가 정렬이 이미 되잇음

// 4Ghz
//
// 램이 0.7Ghz
//
// index 안걸리고 skip 100000하면 -> 하드로 가서 100000번 그대로 돌고 그다음부터 가져옴
// 하드는 이거의 수십~수백분의1+ 물리적으로 작동하는 시간 ? 까지 해서
// 버스타고 io를 해야되서... 이 시간도 추가

async function deleteComment(req: AuthRequestWith<CommentIdParams>) {
  try {
    const { userId } = req;
    const { commentId } = req.unwrapParams();

    await commentsService.deleteComment({ userId, commentId });
  } catch (error) {
    throw Error(error);
  }
}
