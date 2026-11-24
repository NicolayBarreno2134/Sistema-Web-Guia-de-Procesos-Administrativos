const TOKEN_KEY = "token_admin";
const ADMIN_KEY = "datos_admin";

export const guardarSesion = (token, admin) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const obtenerToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const obtenerAdmin = () => {
    const datos = localStorage.getItem(ADMIN_KEY);
    return datos ? JSON.parse(datos) : null;
};

export const estaAutenticado = () => {
    return Boolean(obtenerToken());
};

export const cerrarSesion = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
};