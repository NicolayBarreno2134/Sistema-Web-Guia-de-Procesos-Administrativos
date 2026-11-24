import Administrador from "../models/Administrador.js";
import nodemailer from "nodemailer";

const registro = async (req, res) => {
    try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || password.length < 8 || !req.body.nombre?.trim() || !req.body.apellido?.trim()) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    const emailNormalizado = email.trim().toLowerCase();
    const verificarEmailBDD = await Administrador.findOne({ email: emailNormalizado });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    }

    const nuevoAdmin = new Administrador({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        celular: req.body.celular,
        email: emailNormalizado,
        password
    });
    nuevoAdmin.password = await nuevoAdmin.encryptPassword(password);
    const token = nuevoAdmin.createToken();
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    const smtpConfigurado = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD && SMTP_FROM;
    if (smtpConfigurado) {
        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
        const enlace = `${frontendUrl}/confirm/${token}`;
        const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASSWORD } });
        await transporter.sendMail({
            from: SMTP_FROM, to: emailNormalizado, subject: "Confirma tu cuenta de Guías Administrativas",
            text: `Confirma tu cuenta abriendo este enlace: ${enlace}`,
            html: `<p>Gracias por registrarte.</p><p><a href="${enlace}">Confirmar mi cuenta</a></p>`
        });
    }
    await nuevoAdmin.save();

    return res.status(201).json({
        msg: smtpConfigurado ? "Revisa tu correo electrónico para confirmar tu cuenta" : "Cuenta registrada. Usa el enlace de confirmación para activarla",
        ...(!smtpConfigurado && { token })
    });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        console.error("Error al registrar administrador:", error);
        return res.status(500).json({ msg: "No se pudo completar el registro" });
    }
};

const confirmEmail = async (req, res) => {
    try {
    const { token } = req.params;
    const adminBDD = await Administrador.findOne({ token });
    if (!adminBDD) {
        return res.status(404).json({ msg: "Token no válido o la cuenta ya ha sido confirmada" });
    }
    adminBDD.token = null;
    adminBDD.confirmEmail = true;
    await adminBDD.save();

    return res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
    } catch (error) {
        console.error("Error al confirmar cuenta:", error);
        return res.status(500).json({ msg: "No se pudo confirmar la cuenta" });
    }
};

const perfil = (req, res) => res.status(200).json({ administrador: req.admin });

const actualizarAdministrador = async (req, res) => {
    if (String(req.admin._id) !== req.params.id) {
        return res.status(403).json({ msg: "Solo puedes actualizar tu propio perfil" });
    }
    const camposPermitidos = ["nombre", "apellido", "direccion", "celular"];
    const cambios = Object.fromEntries(Object.entries(req.body || {}).filter(([campo]) => camposPermitidos.includes(campo)));
    if (!Object.keys(cambios).length) return res.status(400).json({ msg: "No se recibieron datos válidos para actualizar" });
    if (Object.values(cambios).some((valor) => typeof valor !== "string" || !valor.trim())) {
        return res.status(400).json({ msg: "Los datos del perfil no pueden estar vacíos" });
    }
    try {
        const administrador = await Administrador.findByIdAndUpdate(
            req.admin._id,
            Object.fromEntries(Object.entries(cambios).map(([campo, valor]) => [campo, valor.trim()])),
            { new: true, runValidators: true, select: "-password -token" }
        );
        return res.status(200).json({ msg: "Perfil actualizado correctamente", administrador });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return res.status(500).json({ msg: "No se pudo actualizar el perfil" });
    }
};

const actualizarPassword = async (req, res) => {
    const { passwordActual, passwordNuevo } = req.body || {};
    if (typeof passwordActual !== "string" || typeof passwordNuevo !== "string" || passwordNuevo.length < 8) {
        return res.status(400).json({ msg: "Ingresa tu contraseña actual y una nueva de al menos 8 caracteres" });
    }
    try {
        const administrador = await Administrador.findById(req.admin._id);
        if (!await administrador.matchPassword(passwordActual)) {
            return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
        }
        administrador.password = await administrador.encryptPassword(passwordNuevo);
        await administrador.save();
        return res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        return res.status(500).json({ msg: "No se pudo actualizar la contraseña" });
    }
};

export { registro, confirmEmail, perfil, actualizarAdministrador, actualizarPassword };
