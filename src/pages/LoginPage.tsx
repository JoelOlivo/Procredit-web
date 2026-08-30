import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    IconButton,
    InputAdornment
} from "@mui/material";
import {
LockOutlined as LockIcon,
Visibility,
VisibilityOff,
Person as PersonIcon
} from "@mui/icons-material";

import { login } from "../api/authApi";
import { saveToken } from "../services/authService";
import type { LoginRequest } from "../types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data);
      if (response.success) {
        saveToken(response.data);
        navigate("/employees");
      }
    } catch (error) {
      console.log("Error de inicio de sesión", error);
    }
  };

  // Desestructuración manual de register para evitar errores de tipos en MUI 
  const userNameReg = register("UserName", { required: "Username is required" });
  const passwordReg = register("Password", { required: "Password is required" });

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

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="UserName"
              label="Usuario"
              autoComplete="username"
              autoFocus
              name={userNameReg.name}
              onChange={userNameReg.onChange}
              onBlur={userNameReg.onBlur}
              inputRef={userNameReg.ref}
              error={!!errors.UserName}
              helperText={errors.UserName?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
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
              id="Password"
              autoComplete="current-password"
              name={passwordReg.name}
              onChange={passwordReg.onChange}
              onBlur={passwordReg.onBlur}
              inputRef={passwordReg.ref}
              error={!!errors.Password}
              helperText={errors.Password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
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
    </Container>
  );
}