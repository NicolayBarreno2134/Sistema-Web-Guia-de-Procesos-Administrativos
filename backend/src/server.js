import "dotenv/config";
import cors from "cors";
import express from "express";
<<<<<<< HEAD
import dotenv from "dotenv";
import cors from "cors";
import pasosRoutes from "./routes/pasosRoutes.js";
import administradorRoutes from "./routes/administradorRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => res.send("API Smart - Sistema Guía Administrativo"));
app.use("/api/pasos", pasosRoutes);
app.use("/api", administradorRoutes);

app.use((req, res) => res.status(404).json({ msg: "Endpoint no encontrado - 404" }));

export default app;
=======
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
>>>>>>> 28223bc516a70ce86dca49c335cbad7a76aa11d2
