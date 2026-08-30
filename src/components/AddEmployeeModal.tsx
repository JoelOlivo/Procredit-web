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
    Alert
} from "@mui/material";

import { createEmployee } from "../api/employeeApi";
import { getAreas } from "../api/areaApi";
import { getPositions } from "../api/positionApi";

import type { CreateEmployeeRequest } from "../types/employee";
import type { Area } from "../types/area";
import type { Position } from "../types/position";

interface AddEmployeeModalProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
}

export default function AddEmployeeModal({ onClose, onSuccess }: AddEmployeeModalProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateEmployeeRequest>();

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
            console.error("Error loading options:", error);
        } finally {
            setLoadingOptions(false);
        }
    }

    const onSubmit = async (data: CreateEmployeeRequest) => {
        setSubmitError(null);

        try {
            const employee = {
                ...data,
                monthlySalary: Number(data.monthlySalary.toFixed(2)),
            };

            await createEmployee(employee);
            reset();
            onSuccess("Empleado creado exitosamente");
        } catch (error) {
            console.error("Error creating employee:", error);
            setSubmitError("No se pudo crear el empleado. Intenta de nuevo.");
        }
    }

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Agregar Empleado
            </DialogTitle>

            {loadingOptions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {submitError && (
                            <Alert severity="error">{submitError}</Alert>
                        )}
                        <TextField
                            label="Cédula"
                            fullWidth
                            {...register("identityDocument", { required: "La cédula es requerida" })}
                            error={!!errors.identityDocument}
                            helperText={errors.identityDocument?.message}
                        />

                        <TextField
                            label="Nombres"
                            fullWidth
                            {...register("firstNames", { required: "Los nombres son requeridos" })}
                            error={!!errors.firstNames}
                            helperText={errors.firstNames?.message}
                        />

                        <TextField
                            label="Apellidos"
                            fullWidth
                            {...register("lastNames", { required: "Los apellidos son requeridos" })}
                            error={!!errors.lastNames}
                            helperText={errors.lastNames?.message}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Edad"
                                type="number"
                                fullWidth
                                {...register("age", { 
                                    required: "La edad es requerida", 
                                    valueAsNumber: true 
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
                                    valueAsNumber: true 
                                })}
                                error={!!errors.monthlySalary}
                                helperText={errors.monthlySalary?.message}
                            />
                        </Box>

                        <TextField
                            select
                            label="Área"
                            fullWidth
                            defaultValue=""
                            {...register("areaId", { 
                                required: "El área es requerida", 
                                valueAsNumber: true 
                            })}
                            error={!!errors.areaId}
                            helperText={errors.areaId?.message}
                        >
                            <MenuItem value="" disabled><em>Seleccione un área</em></MenuItem>
                            {areas.map((area) => (
                                <MenuItem key={area.id} value={area.id}>
                                    {area.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Cargo"
                            fullWidth
                            defaultValue=""
                            {...register("positionId", { 
                                required: "El cargo es requerido", 
                                valueAsNumber: true 
                            })}
                            error={!!errors.positionId}
                            helperText={errors.positionId?.message}
                        >
                            <MenuItem value="" disabled><em>Seleccione un cargo</em></MenuItem>
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
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogActions>
                </Box>
            )}
        </Dialog>
    );
}