import { Link } from "react-router-dom";

const BrandHeader = () => (
    <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link to="/" className="text-lg font-bold tracking-tight text-emerald-900">EPN <span className="font-medium text-slate-500">| Guías administrativas</span></Link>
            <Link to="/" className="text-sm font-medium text-emerald-800 hover:underline">Explorar procesos</Link>
        </div>
    </header>
);

export default BrandHeader;
