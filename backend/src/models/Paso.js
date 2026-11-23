import mongoose from "mongoose";

const requisitoSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true, default: "" },
    documentoUrl: { type: String, trim: true, default: "" }
}, { _id: true });

const documentoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }
}, { _id: false });

const pasoSchema = new mongoose.Schema({
    procesoId: { type: mongoose.Schema.Types.ObjectId, ref: "Proceso", required: true, index: true },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    orden: { type: Number, required: true, min: 1 },
    requisitos: { type: [requisitoSchema], default: [] },
    documentos: { type: [documentoSchema], default: [] },
    tiempoEstimado: { type: String, trim: true, default: "Por confirmar" },
    dependencias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paso" }]
}, { timestamps: true });

pasoSchema.index({ procesoId: 1, orden: 1 }, { unique: true });

export default mongoose.model("Paso", pasoSchema);
