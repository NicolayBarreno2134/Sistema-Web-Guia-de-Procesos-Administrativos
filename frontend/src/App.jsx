import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import VisualizadorPasos from "./pages/VisualizadorPasos";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/procesos/:procesoId/pasos" element={<VisualizadorPasos />} />
            <Route path="*" element={<Inicio />} />
        </Routes>
    </BrowserRouter>
);

export default App;
