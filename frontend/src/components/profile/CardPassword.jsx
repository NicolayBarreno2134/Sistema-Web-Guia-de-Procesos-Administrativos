import { useState } from "react";
import PropTypes from "prop-types";

const CardPassword = ({ onSave, loading }) => {
    const [form, setForm] = useState({ passwordActual: "", passwordNuevo: "", confirmar: "" });
    const enviar = (event) => {
        event.preventDefault();
        if (form.passwordNuevo !== form.confirmar) return;
        onSave({ passwordActual: form.passwordActual, passwordNuevo: form.passwordNuevo }, () => setForm({ passwordActual: "", passwordNuevo: "", confirmar: "" }));
    };
    return <form onSubmit={enviar} className="mt-8 space-y-4 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Cambiar contraseña</h2>
        <label className="block text-sm font-medium text-slate-700">Contraseña actual<input type="password" autoComplete="current-password" minLength={8} required value={form.passwordActual} onChange={(e) => setForm({ ...form, passwordActual: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium text-slate-700">Nueva contraseña<input type="password" autoComplete="new-password" minLength={8} required value={form.passwordNuevo} onChange={(e) => setForm({ ...form, passwordNuevo: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium text-slate-700">Confirmar contraseña<input type="password" autoComplete="new-password" minLength={8} required value={form.confirmar} onChange={(e) => setForm({ ...form, confirmar: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        {form.confirmar && form.passwordNuevo !== form.confirmar && <p role="alert" className="text-sm text-red-700">Las contraseñas no coinciden.</p>}
        <button disabled={loading || form.passwordNuevo !== form.confirmar} className="rounded-lg border border-emerald-800 px-4 py-2 font-semibold text-emerald-900 disabled:opacity-50">{loading ? "Actualizando..." : "Actualizar contraseña"}</button>
    </form>;
};

export default CardPassword;

CardPassword.propTypes = { onSave: PropTypes.func.isRequired, loading: PropTypes.bool.isRequired };
