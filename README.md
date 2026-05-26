# WhatsApp Backend API with WPPConnect & Supabase

This is a modern Node.js backend to connect and manage WhatsApp automation using `@wppconnect-team/wppconnect` securely linked and synced to a Supabase PostgreSQL Database. It exposes standard REST endpoints for managing the session and sending/receiving messages.

## Features
* **Separate Backend:** Clean Node.js API with Express.
* **WPPConnect Integration:** Stable WhatsApp Web connection using Puppeteer.
* **Supabase Webhooks & Persistence:** Messages, Media, Chat status and customer contacts are saved directly into your Supabase database.
* **Automated Reconnection:** Smart resilience inside `WppService`.
* **Container/Cloud Ready:** Supports `0.0.0.0` binding, optimized for Railway App deployment.

## Endpoints

- `GET /health` : Check health
- `GET /session/status` : Get Whatsapp connection status
- `GET /session/qrcode` : Base64 QR Code string returned to be scanned
- `POST /session/start` : Start/Restart session engine
- `POST /session/logout` : Quit browser and clean session
- `POST /messages/send` : `{ "phone": "551199999999", "message": "hello" }`
- `POST /messages/send-media` : `{ "phone": "551199999999", "filename": "doc.pdf", "b64": "base64content..." }`

## Database Requirements (Supabase Schema)

You must create these 4 tables in your Supabase project:
1. `customers`: `phone` (pk), `name`, `updated_at`
2. `chats`: `phone` (pk), `status`, `updated_at`
3. `messages`: `id` (serial pk), `chat_id`, `wpp_message_id`, `body`, `type`, `from_me` (bool), `timestamp` 
4. `media`: `id` (serial pk), `message_id`, `mimetype`, `base64`

*(Tip: In production, upload media to a Storage Bucket and save the URL over the `base64` text)*

## Deploy to Railway

1. Push this specific repository to your GitHub.
2. In Railway, click **New Project** > **Deploy from GitHub repo**.
3. Select this repository.
4. Add the following **Environment Variables** in Railway config:
   * `SUPABASE_URL` = (your supabase project API URL)
   * `SUPABASE_ANON_KEY` = (your supabase anon/service key)
   * `PORT` = `3000`
5. *IMPORTANT:* Railway automatically detects `npm run build` and `npm start` based on the package.json.
6. Under Settings > Deploy > Build Command: Ensure it is `npm run build` or let Nixpacks auto-detect it.
7. Click **Deploy**.

 Railway will automatically install dependencies, build using esbuild, and run the server using `npm start`.

## Running Locally

```bash
npm install
npm run dev
```
