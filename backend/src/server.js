import express from "express";
import dotenv from "dotenv";
import routerAdministradores from "./routers/administrador_routes.js";

const app = express();
dotenv.config();

// Middlewares
app.use((req, res, next) => {
    const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
    if (req.headers.origin === allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});
app.use(express.json());

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => res.send({ message: "Bienvenido a la API de Smart - Sistema Guía Administrativo" }));
app.use("/api", routerAdministradores);

app.use((req, res) => res.status(404).json({ msg: "Endpoint no encontrado - 404" }));

export default app;
