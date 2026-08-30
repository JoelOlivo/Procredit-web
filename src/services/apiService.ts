import axios from "axios";
import { getToken, logout } from "./authService";

const api = axios.create({
    baseURL: "https://localhost:7110/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.includes("/auth");

        if (error.response?.status === 401 && !isAuthRequest) {
            logout();
        }
        return Promise.reject(error);
    }
);

export default api;