import type { 
    EmployeeResponse,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    EmployeeSearchParams
} from "../types/employee";

import api from "../services/apiService";

export const getEmployees = async (): Promise<EmployeeResponse> => {
    const response = await api.get<EmployeeResponse>("/employees");
    return response.data;
};

export const createEmployee = async (
    employee: CreateEmployeeRequest
): Promise<void> => {
    await api.post("/employees", employee);
};

export const updateEmployee = async (
    id: number,
    employee: UpdateEmployeeRequest
): Promise<void> => {
    await api.put(`/employees/${id}`, employee);
};

export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
};

export const searchEmployees = async (
    params: EmployeeSearchParams
): Promise<EmployeeResponse> => {
    const response = await api.get<EmployeeResponse>("/employees/search", {
        params: {
            IdentityDocument: params.identityDocument,
            AreaId: params.areaId,
            PositionId: params.positionId,
        },
    });
    return response.data;
};