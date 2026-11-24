import mongoose from "mongoose";

const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Falta configurar MONGODB_URI en el archivo .env");
    try {
        await mongoose.connect(uri);
    } catch (error) {
        if (error.message.includes("ECONNREFUSED")) {
            throw new Error("No hay un servidor MongoDB disponible en la URI configurada. Inicia MongoDB o revisa MONGODB_URI en backend/.env");
        }
        throw error;
    }
    console.log("Conexión a MongoDB establecida");
};

export default connectDatabase;
