import "dotenv/config";
import app from "./server.js";
import connectDatabase from "./config/database.js";

const port = Number(process.env.PORT) || 3000;

try {
    await connectDatabase();
    app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
} catch (error) {
    console.error("No se pudo iniciar la API:", error.message);
    process.exit(1);
}
