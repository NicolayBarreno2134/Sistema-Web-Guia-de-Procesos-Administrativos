import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { guardarSesion } from "../services/storeAuth";

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { fetchDataBackend, loading } = useFetch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${import.meta.env.VITE_API_URL}/login`;
        const respuesta = await fetchDataBackend(url, form, "POST");
        if (respuesta?.token) {
            guardarSesion(respuesta.token, respuesta.admin);
            navigate("/pasos");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-center uppercase text-gray-800">
                    Iniciar Sesión
                </h1>
                <small className="text-gray-500 block my-2 text-sm text-center">
                    Smart - Sistema Guía Administrativo
                </small>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Ingresa tu correo" className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Contraseña</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="************" className="w-full rounded-md border border-gray-300 px-3 py-1.5 pr-10 text-gray-700" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="bg-gray-800 text-white py-2 w-full rounded-xl mt-4 hover:bg-gray-900 disabled:opacity-50">
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                <div className="mt-4 text-sm flex justify-between items-center">
                    <Link to="/forgot" className="text-blue-600 font-semibold hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </div>
    );
};