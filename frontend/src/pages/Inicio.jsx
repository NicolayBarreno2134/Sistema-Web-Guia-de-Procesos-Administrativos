import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";

const Inicio = () => {
    const [procesoId, setProcesoId] = useState("");
    const navigate = useNavigate();

    const abrirProceso = (event) => {
        event.preventDefault();
        if (procesoId.trim()) navigate(`/procesos/${procesoId.trim()}/pasos`);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            <BrandHeader />

            <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
                <div>
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Trámites claros, paso a paso</p>
                    <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">Encuentra los pasos y requisitos de tu trámite</h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Consulta documentos, tiempos estimados y dependencias de cada proceso administrativo de la EPN.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
                    <h2 className="text-xl font-semibold text-slate-900">Abrir visualizador de un proceso</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Ingresa el identificador del trámite para ver su ruta interactiva.</p>
                    <form onSubmit={abrirProceso} className="mt-6 space-y-4">
                        <label htmlFor="procesoId" className="block text-sm font-medium text-slate-700">Identificador del proceso</label>
                        <input id="procesoId" required value={procesoId} onChange={(event) => setProcesoId(event.target.value)} placeholder="Ej.: 6650f1..." className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                        <button type="submit" className="w-full rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900">Ver pasos del proceso</button>
                    </form>
                    <p className="mt-4 text-xs leading-5 text-slate-500">El catálogo de trámites y la búsqueda se integrarán con el módulo de procesos.</p>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-sm text-slate-500">Guías de Procesos Administrativos · Escuela Politécnica Nacional</footer>
        </main>
    );
};

export default Inicio;
