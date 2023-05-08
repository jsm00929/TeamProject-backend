import {IsNumber} from 'class-validator';

export class MovieHistoryIdParams {
    @IsNumber()
    movieHistoryId: number;
}
