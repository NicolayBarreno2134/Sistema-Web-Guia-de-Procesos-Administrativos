# Backend — EPN Guías

API Express para los pasos, requisitos y documentos asociados a cada proceso administrativo.

## Inicio local

1. Ejecuta `npm install`.
2. Copia `.env.example` a `.env` y configura `MONGODB_URI`.
3. Ejecuta `npm run dev`.

El servidor inicia en `http://localhost:3000`. Las rutas de pasos están bajo `/api/pasos`.

## API de pasos

- `POST /api/pasos`: crea un paso. Campos: `procesoId`, `titulo`, `descripcion`, `orden`; acepta también `requisitos`, `documentos`, `tiempoEstimado` y `dependencias`.
- `GET /api/pasos/proceso/:procesoId`: lista los pasos ordenados y sus requisitos/documentos.
- `PUT /api/pasos/:id`: actualiza los campos enviados del paso.

`dependencias` es una lista de IDs de otros pasos. `requisitos` es una lista de `{ titulo, descripcion, documentoUrl }`; `documentos` es una lista de `{ nombre, url }`.
