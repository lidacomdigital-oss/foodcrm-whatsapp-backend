import { Request, Response } from 'express';
import wppService from '../services/wpp.service';
import { SupabaseService } from '../services/supabase.service';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required' });
    }

    const client = wppService.getClient();
    if (!client) {
      return res.status(500).json({ error: 'WhatsApp client is not connected' });
    }

    const result = await client.sendText(`${phone}@c.us`, message);
    
    // Save outbound message to supabase
    await SupabaseService.saveMessage({
      chat_id: phone,
      wpp_message_id: result.id,
      body: message,
      type: 'chat',
      from_me: true,
      timestamp: new Date()
    });

    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
};

export const sendMedia = async (req: Request, res: Response) => {
  try {
    const { phone, b64, filename, caption } = req.body;
    
    if (!phone || !b64 || !filename) {
      return res.status(400).json({ error: 'Phone, b64, and filename are required' });
    }

    const client = wppService.getClient();
    if (!client) {
      return res.status(500).json({ error: 'WhatsApp client is not connected' });
    }

    const result = await client.sendFileFromBase64(`${phone}@c.us`, b64, filename, caption);

    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send media' });
  }
};
