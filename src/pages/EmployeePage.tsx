import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee, searchEmployees } from "../api/employeeApi";
import type { Employee } from "../types/employee";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import EmployeeSearch from "../components/EmployeeSerch";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            const response = await getEmployees();

            if (response.success) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEmployee(id: number) {
        const confirmed = window.confirm(
            "¿Está seguro de eliminar este empleado?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteEmployee(id);

            await loadEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    }

    async function handleSearch(params: {
        identityDocument?: string;
        areaId?: number;
        positionId?: number;
    }) {
        try {
            setLoading(true);

            const response = await searchEmployees(params);

            if (response.success) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Loading employees...</p>;
    }

    return (
        <div>
            <div>
                <h1>Empleados</h1>

                <button onClick={() => setShowAddModal(true)}>
                    Agregar empleado
                </button>
            </div>

            <EmployeeSearch onSearch={handleSearch} />
            
            <table>
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Salario</th>
                        <th>Área</th>
                        <th>Función</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.identityDocument}</td>
                            <td>
                                {employee.firstNames} {employee.lastNames}
                            </td>
                            <td>{employee.age}</td>
                            <td>{employee.monthlySalary}</td>
                            <td>{employee.area}</td>
                            <td>{employee.position}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        setSelectedEmployee(employee)
                                    }
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <AddEmployeeModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadEmployees();
                    }}
                />
            )}

            {selectedEmployee && (
                <EditEmployeeModal
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    onSuccess={() => {
                        setSelectedEmployee(null);
                        loadEmployees();
                    }}
                />
            )}
        </div>
    );
}

