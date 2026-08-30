import { useForm } from "react-hook-form";
import { updateEmployee } from "../api/employeeApi";
import type { Employee, UpdateEmployeeRequest } from "../types/employee";

interface EditEmployeeModalProps {
    employee: Employee;
    onClose: () => void;
    onSuccess: () => void;
}

const positions = [
    { id: 1, name: "Analista de Recursos Humanos" },
    { id: 2, name: "Desarrollador de Software" },
];

export default function EditEmployeeModal({
    employee,
    onClose,
    onSuccess,
}: EditEmployeeModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateEmployeeRequest>({
        defaultValues: {
            age: employee.age,
            monthlySalary: employee.monthlySalary,
            positionId: positions.find(
                (position) => position.name === employee.position
            )?.id,
        },
    });

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