import express from "express";
import dotenv from "dotenv";
import routerAdministradores from "./routers/administrador_routes.js";

// Inicializaciones
const app = express();

// Configuraciones
dotenv.config();

// Middlewares
app.use(express.json());

// Variables globales
app.set("port", process.env.PORT || 3000);

// Rutas
app.get("/", (req, res) => res.send({ message: "Bienvenido a la API de Smart - Sistema Guía Administrativo" }));
app.use("/api", routerAdministradores);

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ msg: "Endpoint no encontrado - 404" }));

export default app;