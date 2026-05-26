# Whatsapp Backend Node.js

Backend isolado em Node.js com WPPConnect para integrações do WhatsApp, permitindo comunicação bidirecional com a plataforma FoodCRM Web.

## Stack Technologies
- **Node.js** com TypeScript
- **Express.js** (API REST e Webhooks Frontend)
- **WPPConnect** (Biblioteca não-oficial Web WhatsApp baseada no Puppeteer)
- **Supabase JS SDK** (Comunicação direta Server-to-Server)

## Como Desenvolver Localmente

1. Entre na pasta:
```bash
cd whatsapp-backend
```

2. Instale dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
Crie um `.env` a partir de `.env.example` e preencha as URL e SERVICE_ROLE_KEY do Supabase.

4. Inicie o Servidor Dev:
```bash
npm run dev
```
O servidor rodará na porta `3001`! No frontend do FoodCRM, a variável `VITE_WHATSAPP_API_URL` deve pontar para `http://localhost:3001/api/whatsapp`.

## Deploy no Railway

O WPPConnect exige a instalação do Chromium no contêiner para operar o Puppeteer. O Railway é uma excelente opção.

### Passos de Deploy (Railway)

1. **Suba este backend** para um repositório GitHub separado (ou subpasta).
2. **Conecte com o Railway**.
3. **Variáveis de Ambiente**:
   Configure as env vars no painel do Railway (`SUPABASE_URL`, `SUPABASE_KEY` e `PORT=3000` - o Railway usa a porta 3000 internamente).
4. **Nixpacks / Buildpack**:
   O Railway utiliza o Nixpacks automaticamente para Node. Porém, para rodar o Puppeteer, ele precisa do Chrome instalado. Adicione as seguintes variáveis de ambiente no Railway para baixar bibliotecas de SO necessárias: 
   - `NIXPACKS_APT_PKGS=chromium, libnss3, libatk-bridge2.0-0, libcups2, libdrm2, libxkbcommon0, libxcomposite1, libxdamage1, libxfixes3, libxrandr2, libgbm1, libpango-1.0-0, libcairo2, libasound2`
   - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
   - `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`
5. **Configurar o Frontend**:
   Após o deploy do backend gerar o link público, acesse o painel env da sua aplicação Web FoodCRM Vercel/CloudRun e defina `VITE_WHATSAPP_API_URL=https://sua-url-railway.up.railway.app/api/whatsapp`.
