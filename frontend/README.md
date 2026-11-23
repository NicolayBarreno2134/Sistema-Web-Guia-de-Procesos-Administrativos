# Frontend — EPN Guías

Aplicación React creada con Vite, Tailwind CSS y React Router DOM.

## Inicio local

1. Ejecuta `npm install`.
2. Copia `.env.example` a `.env` si la API no está en `http://localhost:3000/api`.
3. Ejecuta `npm run dev`.

La página inicial acepta el ID del proceso y abre `/procesos/:procesoId/pasos`. El visualizador consulta la API, ordena los pasos que recibe, presenta tiempos, dependencias, requisitos y enlaces a documentos. El avance que marca el estudiante se guarda en su navegador.
