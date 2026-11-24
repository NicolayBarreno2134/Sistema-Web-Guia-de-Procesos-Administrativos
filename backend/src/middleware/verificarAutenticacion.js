import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

const verificarAutenticacion = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const [scheme, token] = authorization?.split(" ") || [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ msg: "Debes iniciar sesión para continuar" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ msg: "El servidor no tiene configurado JWT_SECRET" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const administrador = await Administrador.findById(payload.id || payload.sub).select("-password -token");
        if (!administrador || !administrador.status || !administrador.confirmEmail) {
            return res.status(401).json({ msg: "La sesión no es válida o la cuenta está desactivada" });
        }
        req.admin = administrador;
        return next();
    } catch {
        return res.status(401).json({ msg: "La sesión expiró o no es válida" });
    }
};

export default verificarAutenticacion;
