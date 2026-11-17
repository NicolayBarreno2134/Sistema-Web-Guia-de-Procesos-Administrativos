import express from "express";
import dotenv from "dotenv";
import routerAdministradores from "./routers/administrador_routes.js";

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());

// Permitir peticiones desde el frontend (CORS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => res.send({ message: "Bienvenido a la API de Smart - Sistema Guía Administrativo" }));
app.use("/api", routerAdministradores);

app.use((req, res) => res.status(404).json({ msg: "Endpoint no encontrado - 404" }));

export default app;