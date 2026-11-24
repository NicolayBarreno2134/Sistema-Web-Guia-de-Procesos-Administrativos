import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../services/api";
import BrandHeader from "../components/BrandHeader";

const leerProgreso = (procesoId) => {
    try { return JSON.parse(localStorage.getItem(`progreso-${procesoId}`) || "{}"); }
    catch { return {}; }
};

const VisualizadorPasos = ({ inDashboard = false }) => {
    const { procesoId } = useParams();
    const [pasos, setPasos] = useState([]);
    const [progreso, setProgreso] = useState(() => leerProgreso(procesoId));
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setProgreso(leerProgreso(procesoId));
        let activo = true;
        setCargando(true);
        setError("");
        api.get(`/pasos/proceso/${procesoId}`)
            .then(({ data }) => { if (activo) setPasos(data.pasos); })
            .catch((requestError) => {
                if (activo) setError(requestError.response?.data?.msg || "No se pudieron cargar los pasos. Intenta nuevamente.");
            })
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [procesoId]);

    const completados = useMemo(() => new Set(pasos.filter((paso) => progreso[paso._id]?.completado).map((paso) => paso._id)), [pasos, progreso]);
    const totalRequisitos = pasos.reduce((total, paso) => total + paso.requisitos.length, 0);
    const requisitosMarcados = pasos.reduce((total, paso) => total + paso.requisitos.filter((requisito) => progreso[paso._id]?.requisitos?.includes(requisito._id)).length, 0);
    const porcentaje = totalRequisitos ? Math.round((requisitosMarcados / totalRequisitos) * 100) : (pasos.length ? Math.round((completados.size / pasos.length) * 100) : 0);

    const guardarProgreso = (actualizar) => {
        setProgreso((actual) => {
            const siguiente = actualizar(actual);
            localStorage.setItem(`progreso-${procesoId}`, JSON.stringify(siguiente));
            return siguiente;
        });
    };

    const marcarRequisito = (paso, requisitoId) => guardarProgreso((actual) => {
        const requisitos = new Set(actual[paso._id]?.requisitos || []);
        requisitos.has(requisitoId) ? requisitos.delete(requisitoId) : requisitos.add(requisitoId);
        const pasoCompleto = paso.requisitos.length > 0 && paso.requisitos.every((requisito) => requisitos.has(requisito._id));
        return { ...actual, [paso._id]: { requisitos: [...requisitos], completado: pasoCompleto } };
    });

    const marcarPasoSinRequisitos = (paso) => guardarProgreso((actual) => ({
        ...actual,
        [paso._id]: { ...actual[paso._id], completado: !actual[paso._id]?.completado }
    }));

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {!inDashboard && <BrandHeader />}

            <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Ruta del trámite</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Pasos y requisitos</h1>
                <p className="mt-2 break-all text-sm text-slate-500">Proceso: {procesoId}</p>

                {!cargando && !error && pasos.length > 0 && <section aria-label="Progreso del trámite" className="mt-7 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-slate-800">Tu progreso</span><span className="font-medium text-emerald-800">{porcentaje}%</span></div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${porcentaje}%` }} /></div>
                    <p className="mt-2 text-xs text-slate-500">{completados.size} de {pasos.length} pasos completados</p>
                </section>}

                {cargando && <p role="status" className="mt-10 text-slate-600">Cargando pasos del proceso...</p>}
                {error && <div role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</div>}
                {!cargando && !error && pasos.length === 0 && <div className="mt-8 rounded-xl border border-slate-200 bg-white p-7 text-slate-600">Este proceso todavía no tiene pasos publicados.</div>}

                <ol className="mt-8 space-y-5">
                    {pasos.map((paso, indice) => {
                        const bloqueado = paso.dependencias.some((dependencia) => !completados.has(String(dependencia)));
                        const completo = Boolean(progreso[paso._id]?.completado);
                        return <li key={paso._id} className={`relative rounded-xl border bg-white p-5 shadow-sm md:p-7 ${bloqueado ? "border-slate-200 opacity-65" : "border-slate-200"}`}>
                            <div className="flex gap-4">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${completo ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-900"}`}>{completo ? "✓" : indice + 1}</div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h2 className="text-lg font-semibold text-slate-950">{paso.titulo}</h2>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Tiempo estimado: {paso.tiempoEstimado}</span>
                                    </div>
                                    <p className="mt-2 leading-6 text-slate-600">{paso.descripcion}</p>

                                    {paso.dependencias.length > 0 && <section className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                                        <h3 className="font-semibold">Dependencias</h3>
                                        <ul className="mt-1 list-inside list-disc">{paso.dependencias.map((dependencia) => {
                                            const pasoPrevio = pasos.find((candidato) => candidato._id === String(dependencia));
                                            return <li key={String(dependencia)}>{pasoPrevio?.titulo || "Paso previo"} {completados.has(String(dependencia)) ? "✓" : "· pendiente"}</li>;
                                        })}</ul>
                                        {bloqueado && <p className="mt-1">Completa las dependencias para continuar.</p>}
                                    </section>}

                                    {paso.requisitos.length > 0 && <section className="mt-5">
                                        <h3 className="text-sm font-semibold text-slate-800">Requisitos y documentos</h3>
                                        <ul className="mt-3 space-y-3">
                                            {paso.requisitos.map((requisito) => {
                                                const marcado = Boolean(progreso[paso._id]?.requisitos?.includes(requisito._id));
                                                return <li key={requisito._id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                                                    <input id={`req-${requisito._id}`} type="checkbox" disabled={bloqueado} checked={marcado} onChange={() => marcarRequisito(paso, requisito._id)} className="mt-1 h-4 w-4 accent-emerald-700" />
                                                    <div className="min-w-0"><label htmlFor={`req-${requisito._id}`} className="cursor-pointer text-sm font-medium text-slate-800">{requisito.titulo}</label>
                                                        {requisito.descripcion && <p className="mt-1 text-sm text-slate-600">{requisito.descripcion}</p>}
                                                        {requisito.documentoUrl && <a href={requisito.documentoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-emerald-800 underline">Abrir documento relacionado</a>}
                                                    </div>
                                                </li>;
                                            })}
                                        </ul>
                                    </section>}

                                    {paso.documentos.length > 0 && <section className="mt-5"><h3 className="text-sm font-semibold text-slate-800">Documentos descargables</h3><ul className="mt-2 flex flex-wrap gap-3">{paso.documentos.map((documento) => <li key={`${documento.nombre}-${documento.url}`}><a href={documento.url} target="_blank" rel="noreferrer" className="inline-flex rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50">↓ {documento.nombre}</a></li>)}</ul></section>}

                                    {!bloqueado && paso.requisitos.length === 0 && <button type="button" onClick={() => marcarPasoSinRequisitos(paso)} className={`mt-5 rounded-lg px-4 py-2 text-sm font-semibold ${completo ? "border border-emerald-700 text-emerald-800" : "bg-emerald-800 text-white hover:bg-emerald-900"}`}>{completo ? "Paso completado ✓ · Deshacer" : "Marcar paso como completado"}</button>}
                                </div>
                            </div>
                        </li>;
                    })}
                </ol>
            </div>
        </main>
    );
};

export default VisualizadorPasos;

VisualizadorPasos.propTypes = { inDashboard: PropTypes.bool };
