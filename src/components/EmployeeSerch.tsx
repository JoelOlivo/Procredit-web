import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getAreas } from "../api/areaApi";
import { getPositions } from "../api/positionApi";

import type { Area } from "../types/area";
import type { Position } from "../types/position";

interface EmployeeSearchProps {
    onSearch: (params: {
        identityDocument?: string;
        areaId?: number;
        positionId?: number;
    }) => void;
}

interface SearchForm {
    identityDocument: string;
    areaId: string;
    positionId: string;
}

export default function EmployeeSearch({
    onSearch,
}: EmployeeSearchProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    const { register, handleSubmit, reset } = useForm<SearchForm>();

    useEffect(() => {
        loadOptions();
    }, []);

    async function loadOptions() {
        try {
            const [areasResponse, positionsResponse] = await Promise.all([
                getAreas(),
                getPositions(),
            ]);

            if (areasResponse.success) {
                setAreas(areasResponse.data);
            }

            if (positionsResponse.success) {
                setPositions(positionsResponse.data);
            }
        } catch (error) {
            console.error("Error loading search options:", error);
        }
    }

    function submitSearch(data: SearchForm) {
        onSearch({
            identityDocument: data.identityDocument || undefined,
            areaId: data.areaId
                ? Number(data.areaId)
                : undefined,
            positionId: data.positionId
                ? Number(data.positionId)
                : undefined,
        });
    }

    function clearSearch() {
        reset();
        onSearch({});
    }

    return (
        <form onSubmit={handleSubmit(submitSearch)}>
            <input
                placeholder="Cédula"
                {...register("identityDocument")}
            />

            <select {...register("areaId")}>
                <option value="">Todas las áreas</option>

                {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                        {area.name}
                    </option>
                ))}
            </select>

            <select {...register("positionId")}>
                <option value="">Todos los cargos</option>

                {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                        {position.name}
                    </option>
                ))}
            </select>

            <button type="submit">
                Buscar
            </button>

            <button type="button" onClick={clearSearch}>
                Limpiar
            </button>
        </form>
    );
}