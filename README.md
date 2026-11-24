# Sistema Web Guía de Procesos Administrativos

Sistema web para consultar guías de procesos administrativos de la Escuela Politécnica Nacional (EPN). Está dividido en un backend (API REST) y un frontend (aplicación web).

## Tecnologías

**Backend**
- Node.js con Express 5
- MongoDB con Mongoose
- bcryptjs para cifrado de contraseñas
- jsonwebtoken para la sesión (JWT)
- dotenv y cors

**Frontend**
- React 18 con Vite
- React Router
- Axios
- react-toastify para notificaciones
- Tailwind CSS
- react-icons

## Estructura principal

```
backend/
├── src/
│   ├── config/         # Conexión a MongoDB
│   ├── controllers/    # Lógica de cada módulo
│   ├── models/         # Esquemas de Mongoose
│   ├── routes/         # Definición de endpoints
│   ├── index.js        # Punto de entrada
│   └── server.js       # Configuración de Express
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Hooks personalizados (useFetch)
│   ├── pages/          # Vistas de la aplicación
│   └── services/       # api.js y storeAuth.jsx
```

## Requisitos

- Node.js 18 o superior
- MongoDB en ejecución en local (o una URI de MongoDB Atlas)

## Configuración

### Backend

1. Entra a la carpeta `backend` e instala dependencias:

   ```
   npm install
   ```

2. Crea un archivo `.env` a partir de `.env.example` y completa los valores:

   | Variable | Descripción |
   |----------|-------------|
   | `PORT` | Puerto de la API (por defecto 3000) |
   | `MONGODB_URI` | URI de conexión a MongoDB |
   | `FRONTEND_URL` | URL del frontend (por defecto `http://localhost:5173`) |
   | `JWT_SECRET` | Clave secreta para firmar los tokens. Debe ser larga y no compartirse |
   | `JWT_EXPIRES_IN` | Duración de la sesión, por ejemplo `1d` |

3. Ejecuta el servidor:

   ```
   npm run dev
   ```

### Frontend

1. Entra a la carpeta `frontend` e instala dependencias:

   ```
   npm install
   ```

2. Crea un archivo `.env` a partir de `.env.example`:

   | Variable | Descripción |
   |----------|-------------|
   | `VITE_API_URL` | URL base de la API, por ejemplo `http://localhost:3000/api` |

3. Ejecuta la aplicación:

   ```
   npm run dev
   ```

   Se abre en `http://localhost:5173`.

> Los archivos `.env` no se suben al repositorio. Cada integrante debe crear el suyo.

## Funcionalidades implementadas

### Registro de administradores
- Registro con nombre, apellido, dirección, celular, correo y contraseña.
- La contraseña se guarda cifrada con bcrypt.
- Se genera un token de confirmación que se devuelve en la respuesta (solo para pruebas).

### Confirmación de cuenta
- El administrador confirma su cuenta visitando el enlace con el token.
- Una vez confirmada, el token se elimina de la base de datos.

### Inicio de sesión
- Valida correo y contraseña.
- Rechaza cuentas no confirmadas y cuentas desactivadas.
- Devuelve un JWT válido por el tiempo definido en `JWT_EXPIRES_IN`.
- En el frontend, la sesión se guarda en `localStorage` mediante `storeAuth.jsx`.

### Visualización de pasos
- Vista `/pasos` para mostrar los pasos y requisitos de un proceso.

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Verifica que la API responde |
| POST | `/api/registro` | Registra un administrador |
| GET | `/api/confirmar/:token` | Confirma la cuenta |
| POST | `/api/login` | Inicia sesión y devuelve el JWT |
| GET | `/api/pasos` | Rutas del módulo de pasos |

## Rutas del frontend

| Ruta | Vista |
|------|-------|
| `/` | Inicio |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/confirm/:token` | Confirmación de cuenta |
| `/pasos` | Pasos y requisitos del proceso |
