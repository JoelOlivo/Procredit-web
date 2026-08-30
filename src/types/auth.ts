import type { ApiResponse } from "./api";

export interface AuthRequest {
    userName: string;
    password: string;
}

export type AuthResponse = ApiResponse<string>;