import { useForm } from "react-hook-form";

interface EmployeeSearchProps {
    onSearch: (params: {
        identityDocument?: string;
        areaId?: number;
        positionId?: number;
    }) => void;
}

const areas = [
    { id: 1, name: "Recursos Humanos" },
    { id: 2, name: "Tecnología" },
];

const positions = [
    { id: 1, name: "Analista de Recursos Humanos" },
    { id: 2, name: "Desarrollador de Software" },
];

interface SearchForm {
    identityDocument: string;
    areaId: string;
    positionId: string;
}

export default function EmployeeSearch({
    onSearch,
}: EmployeeSearchProps) {
    const { register, handleSubmit, reset } = useForm<SearchForm>();

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