import { Router } from "express";
import { registro, confirmEmail } from "../controllers/administradorController.js";

const router = Router();

router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);

export default router;