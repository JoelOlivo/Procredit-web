import type { ApiResponse } from "./api";

export interface Position {
    id: number;
    name: string;
}

export type PositionResponse = ApiResponse<Position[]>;