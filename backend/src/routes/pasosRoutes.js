import { Router } from "express";
import { actualizarPaso, crearPaso, listarPasosPorProceso } from "../controllers/pasosController.js";

const router = Router();

router.post("/", crearPaso);
router.get("/proceso/:procesoId", listarPasosPorProceso);
router.put("/:id", actualizarPaso);

export default router;
