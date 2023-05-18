import axios from "axios";
import {AI_PREDICT_BASE_URL} from "../config/constants";

export interface PredictAiDto {
    id: number;
    movie_id: number;
    content: string;
}

export interface PredictAiResultDto {
    id: number;
    movie_id: number;
    result: boolean;
}

export interface FindPredictAiResultDto {
    reviewId: number;
    movieId: number;
    after?: number,
}

// REQUEST FOR REVIEW PREDICT API TO FASTAPI SERVER
export async function predictAi(dto: PredictAiDto) {
    await aiClient.post('/ai/predict', dto);
}

const aiClient = axios.create({
    baseURL: AI_PREDICT_BASE_URL,
});

