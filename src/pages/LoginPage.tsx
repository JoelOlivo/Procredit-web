import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Person
} from "@mui/icons-material";

import { login } from "../api/authApi";
import type { AuthRequest } from "../types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthRequest>();

  const onSubmit = async (data: AuthRequest) => {
    try {
      const response = await login(data);

      if (response.success) {
        setLoginError(null);
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/employees");
        }, 1000);
      } else {
        setLoginError(response.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setLoginError("Usuario o contraseña incorrectos");
      } else {
        setLoginError("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
      }
      console.error("Error de inicio de sesión", error);
    }
  };

  const userNameReg = register("userName", { required: "El usuario es requerido" });
  const passwordReg = register("password", { required: "La contraseña es requerida" });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2
          }}
        >
          <Box
            component="img"
            src="../../public/banner.png"
            alt="Logo"
            sx={{ height: 60, mb: 2, objectFit: "contain" }}
          />

          {loginError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="userName"
              label="Usuario"
              autoComplete="username"
              autoFocus
              name={userNameReg.name}
              onChange={userNameReg.onChange}
              onBlur={userNameReg.onBlur}
              inputRef={userNameReg.ref}
              error={!!errors.userName}
              helperText={errors.userName?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  )
                }
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              name={passwordReg.name}
              onChange={passwordReg.onChange}
              onBlur={passwordReg.onBlur}
              inputRef={passwordReg.ref}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
            >
              {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showSuccessToast}
        autoHideDuration={3000}
        onClose={() => setShowSuccessToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Inicio de sesión exitoso
        </Alert>
      </Snackbar>
    </Container>
  );
}