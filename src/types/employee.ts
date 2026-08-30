export interface Employee {
    id: number;
    identityDocument: string;
    firstNames: string;
    lastNames: string;
    age: number;
    monthlySalary: number;
    area: string;
    position: string;
}

export interface EmployeeResponse {
    success: boolean;
    code: number;
    message: string;
    data: Employee[];
}

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