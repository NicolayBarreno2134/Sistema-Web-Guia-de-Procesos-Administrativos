import { actualizarAdminSesion, obtenerAdmin } from "./storeAuth";

export const obtenerPerfil = () => obtenerAdmin();
export const guardarPerfil = (perfil) => actualizarAdminSesion(perfil);
