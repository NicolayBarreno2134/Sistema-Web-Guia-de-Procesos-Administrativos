import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pasosRoutes from "./routes/pasosRoutes.js";
import administradorRoutes from "./routes/administrador_routes.js";
import loginRoutes from "./routes/login_routes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => res.send("API Smart - Sistema Guía Administrativo"));
app.use("/api/pasos", pasosRoutes);
app.use("/api", administradorRoutes);
app.use("/api", loginRoutes);

app.use((req, res) => res.status(404).json({ msg: "Endpoint no encontrado - 404" }));

export default app;
