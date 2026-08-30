export interface Area {
    id: number;
    name: string;
}

export interface AreaResponse {
    success: boolean;
    code: number;
    message: string;
    data: Area[];
}