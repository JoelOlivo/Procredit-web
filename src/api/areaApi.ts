import type { AreaResponse } from "../types/area";

const API_URL = "https://localhost:7110/api/areas";

export async function getAreas(): Promise<AreaResponse> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load areas");
    }

    return response.json();
}