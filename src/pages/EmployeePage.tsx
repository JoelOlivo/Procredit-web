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
  Tooltip,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";

import { getEmployees, deleteEmployee, searchEmployees } from "../api/employeeApi";
import type { Employee, EmployeeSearchParams } from "../types/employee";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import EmployeeSearch from "../components/EmployeeSearch";
import ConfirmDialog from "../components/ConfirmDialog";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
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
    };

    const confirmDeleteEmployee = async () => {
        if (!employeeToDelete) return;

        try {
            await deleteEmployee(employeeToDelete.id);
            setSuccessMessage("Empleado eliminado exitosamente");
            await loadEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        } finally {
            setEmployeeToDelete(null);
        }
    };

    const handleSearch = async (params: EmployeeSearchParams) => {
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
    };

    const handleAddSuccess = (message: string) => {
        setShowAddModal(false);
        setSuccessMessage(message);
        loadEmployees();
    };

    const handleEditSuccess = (message: string) => {
        setSelectedEmployee(null);
        setSuccessMessage(message);
        loadEmployees();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" color="primary">
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

            <Box sx={{ mb: 4 }}>
                <EmployeeSearch onSearch={handleSearch} />
            </Box>

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
                                                    onClick={() => setEmployeeToDelete(employee)}
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

            {showAddModal && (
                <AddEmployeeModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddSuccess}
                />
            )}

            {selectedEmployee && (
                <EditEmployeeModal
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <ConfirmDialog
                open={!!employeeToDelete}
                title="Eliminar empleado"
                message={
                    employeeToDelete
                        ? `¿Está seguro de eliminar a ${employeeToDelete.firstNames} ${employeeToDelete.lastNames}?`
                        : ""
                }
                onConfirm={confirmDeleteEmployee}
                onCancel={() => setEmployeeToDelete(null)}
            />
        </Container>
    );
}