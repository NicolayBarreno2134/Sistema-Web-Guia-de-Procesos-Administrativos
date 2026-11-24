import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Inicio from "./pages/Inicio";
import VisualizadorPasos from "./pages/VisualizadorPasos";
import { Register } from "./pages/Register";
import { Confirm } from "./pages/Confirm";
import { Login } from "./pages/Login";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Dashboard from "./layout/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route element={<PublicRoute />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot" element={<Forgot />} />
                        <Route path="/reset/:token" element={<Reset />} />
                    </Route>
                    <Route path="/confirm/:token" element={<Confirm />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />}>
                            <Route index element={<Inicio inDashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="procesos/:procesoId/pasos" element={<VisualizadorPasos inDashboard />} />
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/procesos/:procesoId/pasos" element={<Dashboard />}>
                            <Route index element={<VisualizadorPasos inDashboard />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
