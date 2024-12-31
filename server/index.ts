import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import next from 'next';
import { parse } from 'url';
import { WebSocketHandler } from './websocket-handler.js';
import { SERVER_CONFIG } from './config.js';

const app = next({ dev: SERVER_CONFIG.dev });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });

    const wss = new WebSocketServer({ server });
    new WebSocketHandler(wss);

    server.listen(SERVER_CONFIG.port, () => {
      console.log(`> Server listening on port ${SERVER_CONFIG.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});