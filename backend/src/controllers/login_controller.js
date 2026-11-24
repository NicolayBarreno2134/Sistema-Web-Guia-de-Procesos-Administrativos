import jwt from "jsonwebtoken";
import Administrador from "../models/Administrador.js";

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const adminBDD = await Administrador.findOne({ email });
    if (!adminBDD) {
        return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    if (!adminBDD.confirmEmail) {
        return res.status(403).json({ msg: "Debes confirmar tu cuenta antes de iniciar sesión" });
    }

    if (!adminBDD.status) {
        return res.status(403).json({ msg: "Tu cuenta se encuentra desactivada" });
    }

    const passwordValido = await adminBDD.matchPassword(password);
    if (!passwordValido) {
        return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ msg: "El servidor no tiene configurado JWT_SECRET" });
    }

    const token = jwt.sign(
        { id: adminBDD._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
        msg: "Inicio de sesión exitoso",
        token,
        admin: {
            id: adminBDD._id,
            nombre: adminBDD.nombre,
            apellido: adminBDD.apellido,
            email: adminBDD.email
        }
    });
};

export { login };