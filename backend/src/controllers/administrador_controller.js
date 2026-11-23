import Administrador from "../models/Administrador.js";

const registro = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    const verificarEmailBDD = await Administrador.findOne({ email });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    }

    const nuevoAdmin = new Administrador(req.body);
    nuevoAdmin.password = await nuevoAdmin.encryptPassword(password);
    const token = nuevoAdmin.createToken();
    await nuevoAdmin.save();

    res.status(200).json({
        msg: "Revisa tu correo electrónico para confirmar tu cuenta",
        token // Útil para pruebas directas en Postman/Frontend si no hay SMTP configurado
    });
};

const confirmEmail = async (req, res) => {
    const { token } = req.params;
    const adminBDD = await Administrador.findOne({ token });
    if (!adminBDD) {
        return res.status(404).json({ msg: "Token no válido o la cuenta ya ha sido confirmada" });
    }
    adminBDD.token = null;
    adminBDD.confirmEmail = true;
    await adminBDD.save();

    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};

export { registro, confirmEmail };