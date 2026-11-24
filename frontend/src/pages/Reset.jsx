import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Reset = () => {
    const { token } = useParams(); const navigate = useNavigate();
    const [valido, setValido] = useState(false); const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState(""); const [error, setError] = useState("");
    const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
    useEffect(() => { api.get(`/recuperar-password/${token}`).then(() => setValido(true)).catch((e) => setError(e.response?.data?.msg || "El enlace no es válido o venció")); }, [token]);
    const enviar = async (event) => {
        event.preventDefault(); setError("");
        if (password !== confirmar) { setError("Las contraseñas no coinciden"); return; }
        setLoading(true);
        try { const { data } = await api.post(`/nuevo-password/${token}`, { password }); setMessage(data.msg); setTimeout(() => navigate("/login", { replace: true }), 1500); }
        catch (e) { setError(e.response?.data?.msg || "No se pudo cambiar la contraseña"); }
        finally { setLoading(false); }
    };
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Nueva contraseña</h1>
        {valido && <form onSubmit={enviar} className="mt-6 space-y-4"><label className="block text-sm font-medium">Nueva contraseña<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-medium">Confirmar contraseña<input type="password" autoComplete="new-password" minLength={8} required value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><button disabled={loading || !password || password !== confirmar} className="w-full rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white disabled:opacity-50">{loading ? "Guardando..." : "Guardar contraseña"}</button></form>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-4 text-sm text-emerald-800">{message}</p>}<Link to="/forgot" className="mt-5 inline-block text-sm font-medium text-emerald-800 underline">Solicitar otro enlace</Link>
    </section></main>;
};
export default Reset;
