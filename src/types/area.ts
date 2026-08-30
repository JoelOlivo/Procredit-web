import type { ApiResponse } from "./api";

export interface Area {
    id: number;
    name: string;
}

export type AreaResponse = ApiResponse<Area[]>;