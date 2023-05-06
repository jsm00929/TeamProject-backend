import {IsBoolean, IsNotEmpty} from "class-validator";

export class ToggleMovieLikeBody {
    @IsNotEmpty()
    @IsBoolean()
    nextLike: boolean;

    public constructor(nextLike: boolean) {
        this.nextLike = nextLike;
    }
}