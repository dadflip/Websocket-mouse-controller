export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface Client {
  id: string;
  type?: 'mobile' | 'desktop';
}