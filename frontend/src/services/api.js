import axios from "axios";
import { cerrarSesion, obtenerToken } from "./storeAuth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
    const token = obtenerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && obtenerToken()) {
        cerrarSesion();
        window.location.assign("/login");
    }
    return Promise.reject(error);
});

export default api;
