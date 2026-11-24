import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import Administrador from "../models/Administrador.js";

const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const adminBDD = await Administrador.findOne({ email: email.trim().toLowerCase() });
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

    return res.status(200).json({
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

const solicitarRecuperacion = async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" });
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
        return res.status(503).json({ msg: "La recuperación por correo no está configurada en este servidor" });
    }
    try {
        const administrador = await Administrador.findOne({ email });
        const msg = "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña";
        if (!administrador) return res.status(200).json({ msg });

        const token = randomBytes(32).toString("hex");
        administrador.passwordResetToken = createHash("sha256").update(token).digest("hex");
        administrador.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await administrador.save();

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
        const enlace = `${frontendUrl}/reset/${token}`;
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
        });
        await transporter.sendMail({
            from: SMTP_FROM, to: administrador.email, subject: "Recuperación de contraseña",
            text: `Abre este enlace para cambiar tu contraseña (válido por 15 minutos): ${enlace}`,
            html: `<p>Solicitaste cambiar tu contraseña.</p><p><a href="${enlace}">Restablecer contraseña</a></p><p>El enlace vence en 15 minutos.</p>`
        });
        return res.status(200).json({ msg });
    } catch (error) {
        console.error("Error al solicitar recuperación:", error.message);
        return res.status(500).json({ msg: "No se pudo enviar el correo de recuperación" });
    }
};

const verificarTokenRecuperacion = async (req, res) => {
    try {
        const hash = createHash("sha256").update(req.params.token || "").digest("hex");
        const administrador = await Administrador.findOne({
            passwordResetToken: hash, passwordResetExpires: { $gt: new Date() }
        }).select("+passwordResetToken +passwordResetExpires");
        if (!administrador) return res.status(400).json({ msg: "El enlace es inválido o ha vencido" });
        return res.status(200).json({ msg: "Token válido" });
    } catch (error) {
        console.error("Error al verificar token de recuperación:", error);
        return res.status(500).json({ msg: "No se pudo verificar el enlace" });
    }
};

const nuevoPassword = async (req, res) => {
    const { password } = req.body || {};
    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
    }
    try {
        const hash = createHash("sha256").update(req.params.token || "").digest("hex");
        const administrador = await Administrador.findOne({
            passwordResetToken: hash, passwordResetExpires: { $gt: new Date() }
        }).select("+passwordResetToken +passwordResetExpires");
        if (!administrador) return res.status(400).json({ msg: "El enlace es inválido o ha vencido" });
        administrador.password = await administrador.encryptPassword(password);
        administrador.passwordResetToken = null;
        administrador.passwordResetExpires = null;
        await administrador.save();
        return res.status(200).json({ msg: "Contraseña actualizada correctamente. Ya puedes iniciar sesión" });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        return res.status(500).json({ msg: "No se pudo actualizar la contraseña" });
    }
};

export { login, solicitarRecuperacion, verificarTokenRecuperacion, nuevoPassword };
