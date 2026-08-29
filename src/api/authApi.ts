import axios from "axios";
import type { ApiResponse, LoginRequest } from "../types/auth";

const API_URL = "https://localhost:7110/api";

export const login = async (
    credentials: LoginRequest
) : Promise<ApiResponse<string>> => {
    const response = await axios.post<ApiResponse<string>>(
        `${API_URL}/auth`,
        credentials
    );

    return response.data;
}