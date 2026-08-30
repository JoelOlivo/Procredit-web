export interface Position {
    id: number;
    name: string;
}

export interface PositionResponse {
    success: boolean;
    code: number;
    message: string;
    data: Position[];
}