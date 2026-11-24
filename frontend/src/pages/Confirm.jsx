import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export const Confirm = () => {
    const { token } = useParams();
    const { fetchDataBackend } = useFetch();
    const [confirmado, setConfirmado] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const respuesta = await fetchDataBackend(`/confirmar/${token}`, null, "GET");
            if (respuesta) {
                setConfirmado(true);
            }
        };
        if (token) {
            verifyToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-xl font-bold text-gray-800 uppercase">
                    Smart - Sistema Guía Administrativo
                </h1>
                <p className="text-2xl text-gray-800 mt-6 font-semibold">
                    {confirmado ? "Cuenta Confirmada" : "Verificando Cuenta..."}
                </p>
                <p className="text-gray-600 mt-3">
                    {confirmado
                        ? "Tu correo electrónico ha sido verificado. Ya puedes iniciar sesión."
                        : "Validando tu token de seguridad."}
                </p>
                <Link to="/login" className="block p-3 mt-6 w-full bg-gray-800 text-white rounded-xl hover:bg-gray-900">
                    Ir a Iniciar Sesión
                </Link>
            </div>
        </div>
    );
};
