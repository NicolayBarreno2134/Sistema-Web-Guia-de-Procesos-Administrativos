import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Forgot = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const enviar = async (event) => {
        event.preventDefault(); setError(""); setMessage(""); setLoading(true);
        try { const { data } = await api.post("/recuperar-password", { email }); setMessage(data.msg); }
        catch (requestError) { setError(requestError.response?.data?.msg || "No se pudo solicitar la recuperación"); }
        finally { setLoading(false); }
    };
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Recuperar contraseña</h1><p className="mt-2 text-sm text-slate-600">Ingresa el correo asociado a tu cuenta y te enviaremos un enlace.</p>
        <form onSubmit={enviar} className="mt-6 space-y-4"><label className="block text-sm font-medium">Correo electrónico<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><button disabled={loading} className="w-full rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white disabled:opacity-50">{loading ? "Enviando..." : "Enviar enlace"}</button></form>
        {message && <p role="status" className="mt-4 text-sm text-emerald-800">{message}</p>}{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<Link to="/login" className="mt-5 inline-block text-sm font-medium text-emerald-800 underline">Volver al inicio de sesión</Link>
    </section></main>;
};
export default Forgot;
