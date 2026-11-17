import Administrador from "../models/Administrador.js";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

const crearTokenSesion = (administrador) => jwt.sign(
    { sub: administrador._id.toString(), rol: administrador.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

const enviarCorreoRecuperacion = async (email, enlace) => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
        throw new Error("La configuración SMTP está incompleta");
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
    });

    await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: "Recuperación de contraseña",
        text: `Para cambiar tu contraseña, abre este enlace (válido por 15 minutos): ${enlace}`,
        html: `<p>Solicitaste cambiar tu contraseña.</p><p><a href="${enlace}">Restablecer contraseña</a></p><p>El enlace vence en 15 minutos.</p>`
    });
};

// 1. Registro de Administrador
const registro = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        const verificarEmailBDD = await Administrador.findOne({ email });
        if (verificarEmailBDD) {
            return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }

        const nuevoAdministrador = new Administrador(req.body);
        nuevoAdministrador.password = await nuevoAdministrador.encryptPassword(password);
        const token = nuevoAdministrador.createToken();

        await nuevoAdministrador.save();

        res.status(201).json({
            msg: "Revisa tu correo electrónico para confirmar tu cuenta",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor al registrar el administrador" });
    }
};

// 2. Confirmar cuenta mediante token
const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }

        const administradorBDD = await Administrador.findOne({ token });
        if (!administradorBDD) {
            return res.status(404).json({ msg: "La cuenta ya ha sido confirmada o el token es inválido" });
        }

        administradorBDD.token = null;
        administradorBDD.confirmEmail = true;
        await administradorBDD.save();

        res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al confirmar el correo" });
    }
};

// 3. Inicio de sesión (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        const administradorBDD = await Administrador.findOne({ email }).select("-status -__v -updatedAt -createdAt");
        if (!administradorBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
        }

        if (!administradorBDD.confirmEmail) {
            return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta antes de iniciar sesión" });
        }

        const verificarPassword = await administradorBDD.matchPassword(password);
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Lo sentimos, el password no es el correcto" });
        }

        const { nombre, apellido, direccion, celular, _id, rol } = administradorBDD;
        const token = crearTokenSesion(administradorBDD);

        res.status(200).json({
            token,
            tokenType: "Bearer",
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
            _id,
            nombre,
            apellido,
            direccion,
            celular,
            email: administradorBDD.email,
            rol
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor al iniciar sesión" });
    }
};

// 4. Solicitar recuperación de contraseña
const solicitarRecuperacion = async (req, res) => {
    try {
        const email = req.body?.email?.trim().toLowerCase();
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" });

        const administrador = await Administrador.findOne({ email });
        // Respuesta uniforme para no revelar qué correos están registrados.
        if (!administrador) {
            return res.status(200).json({ msg: "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña" });
        }

        const token = randomBytes(32).toString("hex");
        administrador.passwordResetToken = createHash("sha256").update(token).digest("hex");
        administrador.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await administrador.save();

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
        const enlace = `${frontendUrl}/reset/${token}`;
        await enviarCorreoRecuperacion(administrador.email, enlace);

        return res.status(200).json({ msg: "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña" });
    } catch (error) {
        console.error("Error al solicitar recuperación:", error.message);
        return res.status(500).json({ msg: "No se pudo enviar el correo de recuperación. Verifica la configuración SMTP" });
    }
};

// 5. Comprobar vigencia del token de recuperación
const comprobarTokenRecuperacion = async (req, res) => {
    try {
        const tokenHash = createHash("sha256").update(req.params.token || "").digest("hex");
        const administrador = await Administrador.findOne({
            passwordResetToken: tokenHash,
            passwordResetExpires: { $gt: new Date() }
        }).select("+passwordResetToken +passwordResetExpires");

        if (!administrador) return res.status(400).json({ msg: "El enlace es inválido o ha vencido" });
        return res.status(200).json({ msg: "Token válido" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al comprobar el token" });
    }
};

// 6. Guardar nueva contraseña y consumir el token
const restablecerPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
        }

        const tokenHash = createHash("sha256").update(req.params.token || "").digest("hex");
        const administrador = await Administrador.findOne({
            passwordResetToken: tokenHash,
            passwordResetExpires: { $gt: new Date() }
        }).select("+passwordResetToken +passwordResetExpires");

        if (!administrador) return res.status(400).json({ msg: "El enlace es inválido o ha vencido" });

        administrador.password = await administrador.encryptPassword(password);
        administrador.passwordResetToken = null;
        administrador.passwordResetExpires = null;
        await administrador.save();

        return res.status(200).json({ msg: "Contraseña actualizada correctamente. Ya puedes iniciar sesión" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al restablecer la contraseña" });
    }
};

export {
    registro,
    confirmarMail,
    login,
    solicitarRecuperacion,
    comprobarTokenRecuperacion,
    restablecerPassword
};
