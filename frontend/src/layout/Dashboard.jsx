import { Link, Outlet, useNavigate } from "react-router-dom";
import { cerrarSesion, obtenerAdmin } from "../services/storeAuth";

const Dashboard = () => {
    const navigate = useNavigate();
    const administrador = obtenerAdmin();
    const salir = () => { cerrarSesion(); navigate("/login", { replace: true }); };

    return <div className="min-h-screen bg-slate-50">
        <nav aria-label="Navegación del panel" className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
                    <Link to="/dashboard" className="mr-2 text-lg font-bold tracking-tight text-emerald-900">EPN <span className="font-medium text-slate-500">| Guías administrativas</span></Link>
                    <Link to="/dashboard">Inicio</Link>
                    <Link to="/dashboard/profile">Mi perfil</Link>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-600">{administrador?.nombre} {administrador?.apellido}</span>
                    <button type="button" onClick={salir} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">Cerrar sesión</button>
                </div>
            </div>
        </nav>
        <Outlet />
    </div>;
};

export default Dashboard;
