import type { 
    EmployeeResponse,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    EmployeeSearchParams
} from "../types/employee";

const API_URL = "https://localhost:7110/api/employees";

export async function getEmployees(): Promise<EmployeeResponse> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load employees");
    }

    return response.json();
}

export async function createEmployee(employee: CreateEmployeeRequest): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
    });

    if (!response.ok) {
        throw new Error("Failed to create employee");
    }
}

export async function updateEmployee(id: number,employee: UpdateEmployeeRequest): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
        `https://localhost:7110/api/employees/${id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update employee");
    }
}

export async function deleteEmployee(id: number): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
        `https://localhost:7110/api/employees/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete employee");
    }
}

export async function searchEmployees(params: EmployeeSearchParams): Promise<EmployeeResponse> {
    const token = localStorage.getItem("auth_token");

    const queryParams = new URLSearchParams();

    if (params.identityDocument) {
        queryParams.append("IdentityDocument", params.identityDocument);
    }

    if (params.areaId) {
        queryParams.append("AreaId", params.areaId.toString());
    }

    if (params.positionId) {
        queryParams.append("PositionId", params.positionId.toString());
    }

    const response = await fetch(
        `${API_URL}/search?${queryParams.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search employees");
    }

    return response.json();
}