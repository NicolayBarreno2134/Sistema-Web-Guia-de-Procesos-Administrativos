import mongoose from "mongoose";
import Paso from "../models/Paso.js";

const camposEditables = [
    "procesoId", "titulo", "descripcion", "orden", "requisitos", "documentos", "tiempoEstimado", "dependencias"
];

export const crearPaso = async (req, res) => {
    try {
        const paso = await Paso.create(req.body);
        return res.status(201).json({ msg: "Paso creado correctamente", paso });
    } catch (error) {
        if (["ValidationError", "CastError"].includes(error.name) || error.code === 11000) {
            return res.status(400).json({ msg: "Revisa los datos: el paso y su orden deben ser válidos y únicos" });
        }
        console.error("Error al crear paso:", error);
        return res.status(500).json({ msg: "No se pudo crear el paso" });
    }
};

export const listarPasosPorProceso = async (req, res) => {
    const { procesoId } = req.params;
    if (!mongoose.isValidObjectId(procesoId)) {
        return res.status(400).json({ msg: "El identificador del proceso no es válido" });
    }
    try {
        const pasos = await Paso.find({ procesoId }).sort({ orden: 1 });
        return res.status(200).json({ pasos });
    } catch (error) {
        console.error("Error al listar pasos:", error);
        return res.status(500).json({ msg: "No se pudieron consultar los pasos" });
    }
};

export const actualizarPaso = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ msg: "El identificador del paso no es válido" });
    }
    const cambios = Object.fromEntries(
        Object.entries(req.body || {}).filter(([campo]) => camposEditables.includes(campo))
    );
    if (Object.keys(cambios).length === 0) {
        return res.status(400).json({ msg: "No se recibieron campos válidos para actualizar" });
    }
    if (cambios.dependencias?.some((dependencia) => String(dependencia) === req.params.id)) {
        return res.status(400).json({ msg: "Un paso no puede depender de sí mismo" });
    }
    try {
        const paso = await Paso.findByIdAndUpdate(req.params.id, cambios, { new: true, runValidators: true });
        if (!paso) return res.status(404).json({ msg: "No se encontró el paso" });
        return res.status(200).json({ msg: "Paso actualizado correctamente", paso });
    } catch (error) {
        if (["ValidationError", "CastError"].includes(error.name) || error.code === 11000) {
            return res.status(400).json({ msg: "Los datos del paso no son válidos o el orden ya está ocupado" });
        }
        console.error("Error al actualizar paso:", error);
        return res.status(500).json({ msg: "No se pudo actualizar el paso" });
    }
};
