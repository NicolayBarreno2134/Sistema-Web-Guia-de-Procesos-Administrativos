import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import { useFetch } from "../hooks/useFetch"

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        celular: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        const respuesta = await fetchDataBackend(url, form, "POST")
        if (respuesta) {
            setForm({
                nombre: "",
                apellido: "",
                direccion: "",
                celular: "",
                email: "",
                password: ""
            })
        }
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full px-4">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-700">
                        Registro Administrativo
                    </h1>
                    <small className="text-gray-400 block my-4 text-sm text-center">
                        Smart - Sistema Guía Administrativo
                    </small>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                placeholder="Ingresa tu apellido"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={form.direccion}
                                onChange={handleChange}
                                placeholder="Ingresa tu dirección de domicilio"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Celular</label>
                            <input
                                type="text"
                                name="celular"
                                value={form.celular}
                                onChange={handleChange}
                                inputMode="tel"
                                placeholder="Ingresa tu celular"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Ingresa tu correo electrónico"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-600"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gray-700 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 disabled:opacity-50"
                            >
                                {loading ? "Registrando..." : "Registrarse"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya posees una cuenta?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 text-white border rounded-xl hover:scale-105 duration-300 hover:bg-gray-900"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/images/dogregister.jpg')] bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>
        </div>
    )
}
