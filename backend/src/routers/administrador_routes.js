import { Router } from 'express';
import {
    registro,
    confirmarMail,
    login,
    solicitarRecuperacion,
    comprobarTokenRecuperacion,
    restablecerPassword
} from '../controllers/administrador_controller.js';

const router = Router();

router.post('/registro', registro);
router.get('/confirmar/:token', confirmarMail);
router.post('/login', login);
router.post('/recuperar-password', solicitarRecuperacion);
router.get('/verificar-token-recuperacion/:token', comprobarTokenRecuperacion);
router.post('/restablecer-password/:token', restablecerPassword);

export default router;
