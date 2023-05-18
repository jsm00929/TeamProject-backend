import { Genre, Movie } from "@prisma/client";

export type MovieWithGenres = Movie & { genres: Genre[] };
