import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
    CircularProgress,
} from "@mui/material";

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

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Editar Empleado
            </DialogTitle>

            {loadingPositions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <TextField
                            label="Edad"
                            type="number"
                            fullWidth
                            {...register("age", {
                                required: "La edad es requerida",
                                valueAsNumber: true,
                            })}
                            error={!!errors.age}
                            helperText={errors.age?.message}
                        />

                        <TextField
                            label="Salario mensual"
                            type="number"
                            fullWidth
                            slotProps={{ htmlInput: { step: "0.01", min: "0" } }}
                            {...register("monthlySalary", {
                                required: "El salario es requerido",
                                valueAsNumber: true,
                            })}
                            error={!!errors.monthlySalary}
                            helperText={errors.monthlySalary?.message}
                        />

                        <TextField
                            select
                            label="Cargo"
                            fullWidth
                            defaultValue={employee.positionId}
                            {...register("positionId", {
                                required: "El cargo es requerido",
                                valueAsNumber: true,
                            })}
                            error={!!errors.positionId}
                            helperText={errors.positionId?.message}
                        >
                            <MenuItem value="" disabled>
                                <em>Seleccione un cargo</em>
                            </MenuItem>
                            {positions.map((position) => (
                                <MenuItem key={position.id} value={position.id}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </TextField>

                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={onClose} color="inherit" variant="text">
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogActions>
                </Box>
            )}
        </Dialog>
    );
}