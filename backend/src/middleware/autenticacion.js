import jwt from "jsonwebtoken";

const autenticar = (req, res, next) => {
    const [esquema, token] = (req.headers.authorization || "").split(" ");
    if (esquema !== "Bearer" || !token) {
        return res.status(401).json({ msg: "Debes iniciar sesión para continuar" });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ msg: "La sesión es inválida o ha vencido" });
    }
};

export default autenticar;
