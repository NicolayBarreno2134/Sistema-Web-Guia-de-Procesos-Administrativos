import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const FormProfile = ({ perfil, onSave, loading }) => {
    const [form, setForm] = useState({ nombre: "", apellido: "", direccion: "", celular: "" });
    useEffect(() => {
        if (perfil) setForm({ nombre: perfil.nombre || "", apellido: perfil.apellido || "", direccion: perfil.direccion || "", celular: perfil.celular || "" });
    }, [perfil]);
    const cambiar = (event) => setForm((actual) => ({ ...actual, [event.target.name]: event.target.value }));

    return <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-4">
        {[ ["nombre", "Nombre"], ["apellido", "Apellido"], ["direccion", "Dirección"], ["celular", "Celular"] ].map(([name, label]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}
            <input name={name} value={form[name]} onChange={cambiar} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>)}
        <label className="block text-sm font-medium text-slate-700">Correo electrónico
            <input value={perfil?.email || ""} disabled className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500" />
        </label>
        <button disabled={loading} className="rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white disabled:opacity-60">{loading ? "Guardando..." : "Guardar perfil"}</button>
    </form>;
};

export default FormProfile;

FormProfile.propTypes = {
    perfil: PropTypes.shape({ nombre: PropTypes.string, apellido: PropTypes.string, direccion: PropTypes.string, celular: PropTypes.string, email: PropTypes.string }).isRequired,
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};
