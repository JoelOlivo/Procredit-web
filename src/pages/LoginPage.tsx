import { useForm } from "react-hook-form";
import { login } from "../api/authApi";
import { saveToken } from "../services/authService";
import type { LoginRequest } from "../types/auth";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Usuario</label>
                <input
                {...register("UserName", {
                    required: "Username is required",
                })}
                />

                {errors.UserName && <span>{errors.UserName.message}</span>}
                </div>

                <div>
                <label>Password</label>
                <input
                type="password"
                {...register("Password", {
                    required: "Password is required",
                })}
                />

                {errors.Password && <span>{errors.Password.message}</span>}
            </div>

            <button type="submit">Login</button>
        </form>
    );
}