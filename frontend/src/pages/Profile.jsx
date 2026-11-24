import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardPassword from "../components/profile/CardPassword";
import FormProfile from "../components/profile/FormProfile";
import api from "../services/api";
import { guardarPerfil } from "../services/storeProfile";

const Profile = () => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        api.get("/perfil").then(({ data }) => { setPerfil(data.administrador); guardarPerfil(data.administrador); })
            .catch((error) => toast.error(error.response?.data?.msg || "No se pudo cargar el perfil"));
    }, []);
    const guardar = async (datos) => {
        setLoading(true);
        try {
            const { data } = await api.put(`/administrador/${perfil._id}`, datos);
            setPerfil(data.administrador); guardarPerfil(data.administrador); toast.success(data.msg);
        } catch (error) { toast.error(error.response?.data?.msg || "No se pudo actualizar el perfil"); }
        finally { setLoading(false); }
    };
    const guardarPassword = async (datos, onSuccess) => {
        setLoading(true);
        try { const { data } = await api.put("/administrador/actualizarpassword", datos); toast.success(data.msg); onSuccess(); }
        catch (error) { toast.error(error.response?.data?.msg || "No se pudo actualizar la contraseña"); }
        finally { setLoading(false); }
    };

    return <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="mb-6 text-3xl font-bold text-slate-950">Mi perfil</h1>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {perfil ? <><FormProfile perfil={perfil} onSave={guardar} loading={loading} /><CardPassword onSave={guardarPassword} loading={loading} /></> : <p role="status">Cargando perfil...</p>}
        </section>
    </main>;
};

export default Profile;
