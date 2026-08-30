import { useForm } from "react-hook-form";
import { createEmployee } from "../api/employeeApi";
import type { CreateEmployeeRequest } from "../types/employee";

interface AddEmployeeModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const areas = [
    { id: 1, name: "Recursos Humanos" },
    { id: 2, name: "Tecnología" },
];

const positions = [
    { id: 1, name: "Analista de Recursos Humanos" },
    { id: 2, name: "Desarrollador de Software" },
];

export default function AddEmployeeModal({
    onClose,
    onSuccess,
}: AddEmployeeModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateEmployeeRequest>();

    async function onSubmit(data: CreateEmployeeRequest) {
        try {
            const employee = {
                ...data,
                monthlySalary: Number(data.monthlySalary.toFixed(2)),
            };

            await createEmployee(employee);

            reset();
            onSuccess();
        } catch (error) {
            console.error("Error creating employee:", error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar empleado</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <label>Cédula</label>
                        <input
                            {...register("identityDocument", {
                                required: "La cédula es requerida",
                            })}
                        />
                        {errors.identityDocument && (
                            <span>{errors.identityDocument.message}</span>
                        )}
                    </div>

                    <div>
                        <label>Nombres</label>
                        <input
                            {...register("firstNames", {
                                required: "Los nombres son requeridos",
                            })}
                        />
                    </div>

                    <div>
                        <label>Apellidos</label>
                        <input
                            {...register("lastNames", {
                                required: "Los apellidos son requeridos",
                            })}
                        />
                    </div>

                    <div>
                        <label>Edad</label>
                        <input
                            type="number"
                            {...register("age", {
                                required: "La edad es requerida",
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    <div>
                        <label>Salario mensual</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("monthlySalary", {
                                required: "El salario es requerido",
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    <div>
                        <label>Área</label>
                        <select
                            {...register("areaId", {
                                required: "El área es requerida",
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">Seleccione un área</option>

                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Cargo</label>
                        <select
                            {...register("positionId", {
                                required: "El cargo es requerido",
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">Seleccione un cargo</option>

                            {positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}