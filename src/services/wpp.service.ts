import * as wppconnect from '@wppconnect-team/wppconnect';
import { logger } from '../utils/logger';
import { SupabaseService } from './supabase.service';

class WppService {
  private client: wppconnect.Whatsapp | null = null;
  private status: string = 'DISCONNECTED';
  private qrcode: string | null = null;
  private reconnectInterval: any = null;

  public async startSession() {
    if (this.status === 'CONNECTED') {
      logger.info('Session already connected');
      return;
    }

    try {
      this.status = 'INITIALIZING';
      this.client = await wppconnect.create({
        session: 'whatsapp-backend',
        catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
          logger.info(`Catch QR Code - attempt ${attempts}`);
          this.qrcode = base64Qr;
          this.status = 'QRCODE_READY';
        },
        statusFind: (statusSession, session) => {
          logger.info(`Status Session: ${statusSession} / Session name: ${session}`);
          this.status = statusSession;
        },
        headless: true,
        useChrome: false, // fallback to puppeteer installed Chromium
        puppeteerOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.status = 'CONNECTED';
      this.qrcode = null;
      logger.info('WhatsApp Session Connected!');

      this.setupWebhooks();

    } catch (error) {
      logger.error(error, 'Error starting WPPConnect session:');
      this.status = 'DISCONNECTED';
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setTimeout(() => {
        logger.info('Attempting to reconnect...');
        this.reconnectInterval = null;
        this.startSession();
      }, 10000); // 10 seconds retry
    }
  }

  private setupWebhooks() {
    if (!this.client) return;

    this.client.onMessage(async (message) => {
      if (!message.isGroupMsg) {
        logger.info(`New Message from ${message.from}: ${message.body}`);
        
        const phone = message.from.split('@')[0];
        
        // Save to Supabase
        await SupabaseService.saveCustomer(phone, message.sender.pushname);
        await SupabaseService.saveChat(phone, 'active');
        await SupabaseService.saveMessage({
          chat_id: phone, 
          wpp_message_id: message.id,
          body: message.body,
          type: message.type,
          from_me: false,
          timestamp: new Date(message.timestamp * 1000)
        });

        if (message.isMedia || message.isMMS) {
          try {
            const buffer = await this.client!.decryptFile(message);
            const base64 = buffer.toString('base64');
            // Save media logic
            await SupabaseService.saveMedia({
              message_id: message.id,
              mimetype: message.mimetype,
              base64: base64
            });
            logger.info(`Media saved for message ${message.id}`);
          } catch (e) {
            logger.error(e, 'Error decrypting file');
          }
        }
      }
    });

    this.client.onAck(async (ack) => {
      logger.info(`Message Ack: ${ack.id.id} - Status: ${ack.ack}`);
      // Save ack status to Supabase
      // ack status: 1 = send, 2 = received, 3 = read
    });
  }

  public getStatus() {
    return {
      status: this.status,
      qrcode: this.qrcode
    };
  }

  public async closeSession() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.status = 'DISCONNECTED';
      this.qrcode = null;
      logger.info('Session closed successfully');
    }
  }
  
  public getClient() {
    return this.client;
  }
}

export default new WppService();
