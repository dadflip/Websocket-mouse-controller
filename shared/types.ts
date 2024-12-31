export interface MotionData {
  type: 'motionData';
  alpha: number;
  beta: number;
  gamma: number;
}

export interface CursorPosition {
  type: 'cursorPosition';
  x: number;
  y: number;
}

export interface RegisterMessage {
  type: 'register';
  clientType: 'mobile' | 'desktop';
}

export type Message = MotionData | CursorPosition | RegisterMessage;
