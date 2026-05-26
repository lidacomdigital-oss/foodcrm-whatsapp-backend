import { Router } from 'express';
import {
  sessionStatus,
  sessionQrcode,
  sessionStart,
  sessionLogout
} from '../controllers/session.controller';

const router = Router();

router.get('/status', sessionStatus);
router.get('/qrcode', sessionQrcode);
router.post('/start', sessionStart);
router.post('/logout', sessionLogout);

export default router;
