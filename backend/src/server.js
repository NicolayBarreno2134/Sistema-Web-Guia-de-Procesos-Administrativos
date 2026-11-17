import "dotenv/config";
import cors from "cors";
import express from "express";
import pasosRoutes from "./routes/pasosRoutes.js";

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ mensaje: "API de Guías de Procesos Administrativos" }));
app.use("/api/pasos", pasosRoutes);

app.use((error, _req, res, _next) => {
    console.error("Error inesperado:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
});

export default app;
