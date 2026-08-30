import type { PositionResponse } from "../types/position";
import api from "../services/apiService";

export const getPositions = async (): Promise<PositionResponse> => {
    const response = await api.get<PositionResponse>("/positions");
    return response.data;
};