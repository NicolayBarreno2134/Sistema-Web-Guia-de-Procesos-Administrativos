import logoDog from '../assets/dog-hand.webp'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import axios from 'axios'


const Reset = () => {
    const [tokenback, setTokenBack] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    useEffect(() => {
        axios.get(`${apiUrl}/verificar-token-recuperacion/${token}`)
            .then(() => setTokenBack(true))
            .catch((requestError) => setError(requestError.response?.data?.msg || "El enlace no es válido"));
    }, [apiUrl, token]);

    const restablecerPassword = async (event) => {
        event.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${apiUrl}/restablecer-password/${token}`, { password });
            setMessage(data.msg);
            setTimeout(() => navigate("/login"), 1800);
        } catch (requestError) {
            setError(requestError.response?.data?.msg || "No se pudo actualizar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="flex flex-col items-center justify-center h-screen">

            
            <h1 className="text-3xl font-semibold mb-2 text-center text-gray-500">
                Bienvenido nuevamente
            </h1>
            <small className="text-gray-400 block my-4 text-sm">
                Pro favor, ingrese los siguientes datos
            </small>
            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={logoDog}
                alt="image description"
            />

            {tokenback && (

                <form className="w-80" onSubmit={restablecerPassword}>

                    <div className="mb-1">

                        {/* Campo nueva contraseña */}
                        <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                        <input type="password" placeholder="Ingresa tu nueva contraseña"
                            minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)}
                            className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                        />
                        
                        
                        {/* Campo repetir contraseña */}
                        <label className="mb-2 block text-sm font-semibold">Confirmar contraseña</label>
                        <input type="password" placeholder="Repite tu contraseña"
                            minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                            className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                        />

                    </div>

                    <div className="mb-3">
                        <button disabled={loading} className="bg-gray-600 text-slate-300 border py-2
                        w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 
                        hover:text-white">
                            {loading ? "Guardando..." : "Guardar contraseña"}
                        </button>

                    </div>
                    
                </form>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
            {message && <p role="status" className="mt-3 text-sm text-green-700">{message}</p>}
            {!tokenback && error && <Link to="/forgot/id" className="mt-4 underline">Solicitar otro enlace</Link>}
        </div>
    )
}

export default Reset
