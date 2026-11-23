import { Router } from "express";
import { registro, confirmEmail } from "../controllers/administrador_controller.js";

const router = Router();

router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);

export default router;