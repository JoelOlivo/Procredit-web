import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Paper, TextField, Button, MenuItem } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

import { getAreas } from "../api/areaApi";
import { getPositions } from "../api/positionApi";

import type { Area } from "../types/area";
import type { Position } from "../types/position";
import type { EmployeeSearchParams } from "../types/employee";

interface EmployeeSearchProps {
    onSearch: (params: EmployeeSearchParams) => void;
}

interface SearchForm {
    identityDocument: string;
    areaId: string;
    positionId: string;
}

export default function EmployeeSearch({ onSearch }: EmployeeSearchProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    const { register, handleSubmit, reset } = useForm<SearchForm>();

    useEffect(() => {
        loadOptions();
    }, []);

    const loadOptions = async () => {
        try {
            const [areasResponse, positionsResponse] = await Promise.all([
                getAreas(),
                getPositions(),
            ]);

            if (areasResponse.success) setAreas(areasResponse.data);
            if (positionsResponse.success) setPositions(positionsResponse.data);
        } catch (error) {
            console.error("Error loading search options:", error);
        }
    };

    const submitSearch = (data: SearchForm) => {
        onSearch({
            identityDocument: data.identityDocument || undefined,
            areaId: data.areaId ? Number(data.areaId) : undefined,
            positionId: data.positionId ? Number(data.positionId) : undefined,
        });
    };

    const clearSearch = () => {
        reset();
        onSearch({});
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit(submitSearch)}
            elevation={2}
            sx={{
                p: 2,
                mb: 3,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
                borderRadius: 2
            }}
        >
            <TextField
                label="Cédula"
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, minWidth: '200px' }}
                {...register("identityDocument")}
            />

            <TextField
                select
                label="Área"
                variant="outlined"
                size="small"
                defaultValue=""
                sx={{ flexGrow: 1, minWidth: '200px' }}
                {...register("areaId")}
            >
                <MenuItem value=""><em>Todas las áreas</em></MenuItem>
                {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                        {area.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Cargo"
                variant="outlined"
                size="small"
                defaultValue=""
                sx={{ flexGrow: 1, minWidth: '200px' }}
                {...register("positionId")}
            >
                <MenuItem value=""><em>Todos los cargos</em></MenuItem>
                {positions.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                        {position.name}
                    </MenuItem>
                ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                >
                    Buscar
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={clearSearch}
                    startIcon={<ClearIcon />}
                >
                    Limpiar
                </Button>
            </Box>
        </Paper>
    );
}