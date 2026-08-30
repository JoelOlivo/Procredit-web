import type { AreaResponse } from "../types/area";
import api from "../services/apiService";

export const getAreas = async (): Promise<AreaResponse> => {
    const response = await api.get<AreaResponse>("/areas");
    return response.data;
};