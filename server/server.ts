import WebSocket, { WebSocketServer } from 'ws';
import { MotionData, CursorPosition } from '../shared/types'; // Import des types partagés

// Configuration du serveur WebSocket avec options avancées
const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024,
  },
});

// Map pour stocker les connexions clients avec leur type
const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Gestion des messages reçus
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case 'register': {
          // Enregistrer le client par type
          clients.set(data.clientType, ws);
          console.log(`Registered ${data.clientType}`);
          break;
        }

        case 'motionData': {
          // Transmettre les données de mouvement au client desktop
          const desktopClient = clients.get('desktop');
          if (desktopClient) {
            desktopClient.send(JSON.stringify(data));
          }
          break;
        }

        case 'cursorPosition': {
          // Transmettre la position du curseur au client mobile
          const mobileClient = clients.get('mobile');
          if (mobileClient) {
            mobileClient.send(JSON.stringify(data));
          }
          break;
        }

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Gestion des déconnexions
  ws.on('close', () => {
    clients.forEach((client, clientType) => {
      if (client === ws) {
        clients.delete(clientType);
        console.log(`${clientType} disconnected`);
      }
    });
  });
});

console.log('WebSocket server is running on port 8080');
