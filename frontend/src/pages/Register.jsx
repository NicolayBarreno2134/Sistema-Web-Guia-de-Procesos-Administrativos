import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { fetchDataBackend, loading } = useFetch();

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        celular: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${import.meta.env.VITE_API_URL}/registro`;
        const respuesta = await fetchDataBackend(url, form, "POST");
        if (respuesta) {
            setForm({
                nombre: "",
                apellido: "",
                direccion: "",
                celular: "",
                email: "",
                password: ""
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-center uppercase text-gray-800">
                    Registro Administrativo
                </h1>
                <small className="text-gray-500 block my-2 text-sm text-center">
                    Smart - Sistema Guía Administrativo
                </small>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Nombre</label>
                        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingresa tu nombre" className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Apellido</label>
                        <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ingresa tu apellido" className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Dirección</label>
                        <input type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ingresa tu dirección" className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Celular</label>
                        <input type="text" name="celular" value={form.celular} onChange={handleChange} inputMode="tel" placeholder="Ingresa tu celular" className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-700" required />
                    </div>
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
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <div className="mt-4 text-sm flex justify-between items-center">
                    <p className="text-gray-600">¿Ya posees una cuenta?</p>
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};