import { Router } from "express";
import { actualizarPaso, crearPaso, listarPasosPorProceso } from "../controllers/pasosController.js";
import verificarAutenticacion from "../middleware/verificarAutenticacion.js";

const router = Router();
router.use(verificarAutenticacion);

router.post("/", crearPaso);
router.get("/proceso/:procesoId", listarPasosPorProceso);
router.put("/:id", actualizarPaso);

export default router;
