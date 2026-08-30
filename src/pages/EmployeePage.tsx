import { useEffect, useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";

import { getEmployees, deleteEmployee, searchEmployees } from "../api/employeeApi";
import type { Employee } from "../types/employee";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import EmployeeSearch from "../components/EmployeeSerch"; // Mantenemos tu import original

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
            setLoading(true);
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
        const confirmed = window.confirm("¿Está seguro de eliminar este empleado?");
        if (!confirmed) return;

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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Encabezado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    color="primary"
                >
                    Empleados
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddModal(true)}
                >
                    Agregar Empleado
                </Button>
            </Box>

            {/* Buscador */}
            <Box sx={{ mb: 4 }}>
                <EmployeeSearch onSearch={handleSearch} />
            </Box>

            {/* Tabla / Loading */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabla de empleados">
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cédula</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Edad</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Salario</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Área</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Función</TableCell>
                                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <TableRow 
                                        key={employee.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {employee.identityDocument}
                                        </TableCell>
                                        <TableCell>{employee.firstNames} {employee.lastNames}</TableCell>
                                        <TableCell>{employee.age}</TableCell>
                                        <TableCell>${employee.monthlySalary.toFixed(2)}</TableCell>
                                        <TableCell>{employee.area}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => setSelectedEmployee(employee)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron empleados.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Modales */}
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
        </Container>
    );
}