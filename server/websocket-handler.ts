import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { WebSocketMessage, Client } from './types.js';

export class WebSocketHandler {
  private clients = new Map<string, { ws: WebSocket; client: Client }>();

  constructor(private wss: WebSocketServer) {
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const clientId = Math.random().toString(36).substring(7);
    this.clients.set(clientId, { 
      ws,
      client: { id: clientId }
    });
    
    console.log(`Client connected: ${clientId}`);

    ws.on('message', (message) => this.handleMessage(clientId, message));
    ws.on('close', () => this.handleDisconnection(clientId));
    ws.on('error', (error) => this.handleError(clientId, error));
  }

  private handleMessage(clientId: string, message: Buffer): void {
    try {
      const data = JSON.parse(message.toString()) as WebSocketMessage;
      
      if (data.type === 'register') {
        const clientData = this.clients.get(clientId);
        if (clientData) {
          clientData.client.type = data.clientType;
          this.clients.set(clientId, clientData);
        }
      }
      
      this.broadcast(clientId, data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  private handleDisconnection(clientId: string): void {
    this.clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  }

  private handleError(clientId: string, error: Error): void {
    console.error(`Error from client ${clientId}:`, error);
  }

  private broadcast(senderId: string, data: WebSocketMessage): void {
    this.clients.forEach(({ ws, client }, clientId) => {
      if (clientId !== senderId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}