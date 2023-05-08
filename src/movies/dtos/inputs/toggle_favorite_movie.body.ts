import {IsBoolean, IsNotEmpty} from "class-validator";

export class ToggleFavoriteMovieBody {
    @IsNotEmpty()
    @IsBoolean()
    nextFavorite: boolean;

    public constructor(nextFavorite: boolean) {
        this.nextFavorite = nextFavorite;
    }
}