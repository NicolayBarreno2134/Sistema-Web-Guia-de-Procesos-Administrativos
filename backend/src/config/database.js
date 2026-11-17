import mongoose from "mongoose";

const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Falta configurar MONGODB_URI en el archivo .env");
    await mongoose.connect(uri);
    console.log("Conexión a MongoDB establecida");
};

export default connectDatabase;
