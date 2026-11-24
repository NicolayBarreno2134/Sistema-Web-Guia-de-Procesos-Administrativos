import { Router } from "express";
import { actualizarAdministrador, actualizarPassword, perfil, registro, confirmEmail } from "../controllers/administrador_controller.js";
import verificarAutenticacion from "../middleware/verificarAutenticacion.js";

const router = Router();

router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/perfil", verificarAutenticacion, perfil);
router.put("/administrador/:id", verificarAutenticacion, actualizarAdministrador);
router.put("/administrador/actualizarpassword", verificarAutenticacion, actualizarPassword);

export default router;
