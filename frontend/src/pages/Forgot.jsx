import { useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'


export const Forgot = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const solicitarRecuperacion = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
            const { data } = await axios.post(`${apiUrl}/recuperar-password`, { email });
            setMessage(data.msg);
        } catch (requestError) {
            setError(requestError.response?.data?.msg || "No se pudo enviar el correo");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="flex flex-col sm:flex-row h-screen">

            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">

                <div className="md:w-4/5 sm:w-full">

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">!Olvidaste tu contraseña¡</h1>
                    <small className="text-gray-400 block my-4 text-sm">No te preocupes</small>


                    {/* Formulario */}
                    <form onSubmit={solicitarRecuperacion}>

                        {/* Campo correo electrónico */}
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Ingresa un correo electrónico válido" className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                            />
                        </div>


                        {/* Botón Forgot password */}
                        <div className="mb-3">
                            <button disabled={loading} className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white disabled:opacity-60">{loading ? "Enviando..." : "Enviar correo"}
                            </button>
                        </div>

                    </form>
                    {message && <p role="status" className="mt-3 text-sm text-green-700">{message}</p>}
                    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}


                    <div className="mt-5 text-xs border-b-2 py-4 "/>


                    {/* Enlace para iniciar sesión si ya posee una cuenta */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Iniciar sesión</Link>
                    </div>

                </div>

            </div>

            {/* Imagen */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/public/images/catforgot.jpg')] 
                bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>

        </div>
    )
}
