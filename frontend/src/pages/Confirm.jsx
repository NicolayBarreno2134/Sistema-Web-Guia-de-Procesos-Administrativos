import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useFetch } from '../hooks/useFetch'

export const Confirm = () => {
    const { token } = useParams()
    const { fetchDataBackend } = useFetch()
    const [confirmado, setConfirmado] = useState(false)

    useEffect(() => {
        const verifyToken = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`
            const respuesta = await fetchDataBackend(url, null, "GET")
            if (respuesta) {
                setConfirmado(true)
            }
        }
        if (token) {
            verifyToken()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">
                    Smart - Sistema Guía Administrativo
                </h1>
                <p className="text-3xl text-gray-800 mt-8 font-semibold">
                    {confirmado ? "Cuenta Confirmada" : "Verificando Cuenta..."}
                </p>
                <p className="md:text-lg text-gray-600 mt-4">
                    {confirmado
                        ? "Tu correo electrónico ha sido verificado correctamente. Ya puedes iniciar sesión."
                        : "Estamos validando tu token de seguridad."}
                </p>
                <Link
                    to="/login"
                    className="block p-3 mt-8 w-full text-center bg-gray-700 text-white rounded-xl hover:scale-105 duration-300 hover:bg-gray-900"
                >
                    Ir a Iniciar Sesión
                </Link>
            </div>
        </div>
    )
}