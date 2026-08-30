import api from "../services/apiService";
import { saveToken } from "../services/authService";
import type { AuthRequest, AuthResponse } from "../types/auth";

export const login = async (
    credentials: AuthRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth", credentials);
    saveToken(response.data.data)
    return response.data;
};