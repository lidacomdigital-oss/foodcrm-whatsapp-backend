import { Router } from 'express';
import { sendMessage, sendMedia } from '../controllers/message.controller';

const router = Router();

router.post('/send', sendMessage);
router.post('/send-media', sendMedia);

export default router;
