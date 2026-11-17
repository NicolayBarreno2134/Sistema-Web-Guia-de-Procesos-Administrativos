import Administrador from "../models/Administrador.js";

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

        res.status(200).json({
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

export {
    registro,
    confirmarMail,
    login
};