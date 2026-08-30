import type { ApiResponse } from "./api";

export interface Employee {
    id: number;
    identityDocument: string;
    firstNames: string;
    lastNames: string;
    age: number;
    monthlySalary: number;
    areaId: number;
    area: string;
    positionId: number;
    position: string;
}

export type EmployeeResponse = ApiResponse<Employee[]>;

export interface CreateEmployeeRequest {
    identityDocument: string;
    firstNames: string;
    lastNames: string;
    age: number;
    monthlySalary: number;
    areaId: number;
    positionId: number;
}

export interface UpdateEmployeeRequest {
    age: number;
    monthlySalary: number;
    positionId: number;
}

export interface EmployeeSearchParams {
    identityDocument?: string;
    areaId?: number;
    positionId?: number;
}