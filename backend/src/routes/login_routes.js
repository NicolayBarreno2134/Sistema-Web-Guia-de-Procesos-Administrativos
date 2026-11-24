import { Router } from "express";
import { login, nuevoPassword, solicitarRecuperacion, verificarTokenRecuperacion } from "../controllers/login_controller.js";

const router = Router();

router.post("/login", login);
router.post("/recuperar-password", solicitarRecuperacion);
router.get("/recuperar-password/:token", verificarTokenRecuperacion);
router.post("/nuevo-password/:token", nuevoPassword);

export default router;
