import {BaseOutput} from '../../core/dtos/outputs/base_output';
import {Review, User} from "@prisma/client";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";
import {UserOutput} from "../../users/dtos/outputs/user.output";

export type ReviewWithAuthor = Review & { movie: { title: string }, author: User };

export class ReviewOutput extends BaseOutput {
    title: string;
    overview: string;
    content: string;
    rating: number | null;
    author: UserOutput;
    movieId: number;
    movieTitle: string;

    private constructor(r: ReviewWithAuthor) {
        super(r.id, r.createdAt, r.updatedAt);

        this.title = r.title;
        this.overview = r.overview;
        this.content = r.content;
        this.rating = r.rating;
        this.movieId = r.movieId;
        this.movieTitle = r.movie.title;
        this.author = UserOutput.from(r.author);
    }

    static from(r: ReviewWithAuthor): ReviewOutput {
        return new this(r);
    }

    static nullOrFrom(r: ReviewWithAuthor | null): ReviewOutput | null {
        return isNullOrDeleted(r) ? null : this.from(r!);
    }
}
