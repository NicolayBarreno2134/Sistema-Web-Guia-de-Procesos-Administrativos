import { Router } from 'express';
import {
    registro,
    confirmarMail,
    login,
    solicitarRecuperacion,
    comprobarTokenRecuperacion,
    restablecerPassword,
    visualizarPerfil,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/administrador_controller.js';
import autenticar from '../middleware/autenticacion.js';

const router = Router();

router.post('/registro', registro);
router.get('/confirmar/:token', confirmarMail);
router.post('/login', login);
router.post('/recuperar-password', solicitarRecuperacion);
router.get('/verificar-token-recuperacion/:token', comprobarTokenRecuperacion);
router.post('/restablecer-password/:token', restablecerPassword);
router.get('/perfil', autenticar, visualizarPerfil);
router.put('/perfil', autenticar, actualizarPerfil);
router.put('/perfil/password', autenticar, actualizarPassword);

export default router;
