import type { PositionResponse } from "../types/position";

const API_URL = "https://localhost:7110/api/positions";

export async function getPositions(): Promise<PositionResponse> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load positions");
    }

    return response.json();
}