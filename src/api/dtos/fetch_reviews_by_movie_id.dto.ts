export interface FetchReviewsByMovieIdDto {
  id: number;
  page: number;
  results: ReviewDto[];
}

export interface ReviewDto {
  author: string;
  authorDetails: {
    name: string;
    username: string;
    avatarPath: string | null;
    rating: number | null;
  };
  content: string;
  createdAt: Date;
  // id: string;
  updatedAt: Date;
  url: string;
}
