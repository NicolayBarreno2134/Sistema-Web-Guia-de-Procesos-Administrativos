import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Inicio from "./pages/Inicio";
import VisualizadorPasos from "./pages/VisualizadorPasos";
import { Register } from "./pages/Register";
import { Confirm } from "./pages/Confirm";

function App() {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/pasos" element={<VisualizadorPasos />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirm/:token" element={<Confirm />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;