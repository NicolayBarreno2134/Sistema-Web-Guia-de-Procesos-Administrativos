import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const administradorSchema = new Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    direccion: { type: String, trim: true, default: null },
    celular: { type: String, trim: true, default: null },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: true },
    token: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    passwordResetToken: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false }
}, {
    timestamps: true
});

administradorSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

administradorSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

administradorSchema.methods.createToken = function () {
    const tokenGenerado = randomBytes(32).toString("hex");
    this.token = tokenGenerado;
    return tokenGenerado;
};

export default model("Administrador", administradorSchema);
