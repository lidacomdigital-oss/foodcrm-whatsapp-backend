import { Request, Response } from 'express';
import wppService from '../services/wpp.service';

export const sessionStatus = (req: Request, res: Response) => {
  const status = wppService.getStatus();
  res.json(status);
};

export const sessionQrcode = (req: Request, res: Response) => {
  const status = wppService.getStatus();
  if (status.qrcode) {
    res.json({ qrcode: status.qrcode });
  } else {
    res.status(404).json({ message: 'QR Code not available yet or already connected', status: status.status });
  }
};

export const sessionStart = async (req: Request, res: Response) => {
  try {
    wppService.startSession();
    res.json({ message: 'Session start initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
};

export const sessionLogout = async (req: Request, res: Response) => {
  try {
    await wppService.closeSession();
    res.json({ message: 'Session closed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close session' });
  }
};
