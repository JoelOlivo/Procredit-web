import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { updateEmployee } from "../api/employeeApi";
import { getPositions } from "../api/positionApi";

import type { Employee, UpdateEmployeeRequest } from "../types/employee";
import type { Position } from "../types/position";

interface EditEmployeeModalProps {
    employee: Employee;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditEmployeeModal({
    employee,
    onClose,
    onSuccess,
}: EditEmployeeModalProps) {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loadingPositions, setLoadingPositions] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateEmployeeRequest>({
        defaultValues: {
            age: employee.age,
            monthlySalary: employee.monthlySalary,
            positionId: employee.positionId
        },
    });

    useEffect(() => {
        loadPositions();
    }, []);

    async function loadPositions() {
        try {
            const response = await getPositions();

            if (response.success) {
                setPositions(response.data);
            }
        } catch (error) {
            console.error("Error loading positions:", error);
        } finally {
            setLoadingPositions(false);
        }
    }

    async function onSubmit(data: UpdateEmployeeRequest) {
        try {
            const request = {
                ...data,
                monthlySalary: Number(data.monthlySalary.toFixed(2)),
            };

            await updateEmployee(employee.id, request);

            onSuccess();
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    }

    if (loadingPositions) {
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <p>Cargando información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Editar empleado</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Edad</label>

                        <input
                            type="number"
                            {...register("age", {
                                required: "La edad es requerida",
                                valueAsNumber: true,
                            })}
                        />

                        {errors.age && (
                            <span>{errors.age.message}</span>
                        )}
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

                        {errors.monthlySalary && (
                            <span>{errors.monthlySalary.message}</span>
                        )}
                    </div>

                    <div>
                        <label>Cargo</label>

                        <select
                            {...register("positionId", {
                                required: "El cargo es requerido",
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">
                                Seleccione un cargo
                            </option>

                            {positions.map((position) => (
                                <option
                                    key={position.id}
                                    value={position.id}
                                >
                                    {position.name}
                                </option>
                            ))}
                        </select>

                        {errors.positionId && (
                            <span>{errors.positionId.message}</span>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}