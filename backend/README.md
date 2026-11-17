# Autenticación del backend

## Configuración local

1. Copia `.env.example` como `.env` dentro de `backend`.
2. Configura `MONGODB_URI_LOCAL` y reemplaza `JWT_SECRET` por una clave aleatoria larga.
3. Completa las variables SMTP con una cuenta autorizada para enviar correo. El enlace de recuperación apunta a `FRONTEND_URL` y vence en 15 minutos.
4. Desde esta carpeta ejecuta `npm install` y luego `npm run dev`.
5. En `frontend`, configura `VITE_API_URL=http://localhost:3000/api` (puedes copiar `frontend/.env.example`) y ejecuta `npm install` y `npm run dev`.

No subas los archivos `.env` ni claves SMTP/JWT al repositorio.

## Rutas de autenticación

Todas las rutas están bajo `/api`:

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/login` | Valida credenciales y devuelve un JWT tipo Bearer. |
| `POST` | `/recuperar-password` | Recibe `{ "email": "..." }` y envía un enlace de recuperación. |
| `GET` | `/verificar-token-recuperacion/:token` | Comprueba que el token exista y no haya vencido. |
| `POST` | `/restablecer-password/:token` | Recibe `{ "password": "..." }`, guarda el hash bcrypt y consume el token. |

Los tokens de recuperación se guardan como hash SHA-256 y solo pueden usarse una vez. Las contraseñas nuevas requieren al menos 8 caracteres.
