'use client'

import { useState, useEffect, useRef } from 'react';
import { WebSocketClient } from '../shared/websocket';
import { MotionData, CursorPosition } from '../shared/types';

export default function DesktopInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ type: 'cursorPosition', x: 0, y: 0 });
  const wsRef = useRef<WebSocketClient | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocketClient('ws://localhost:8080');
    wsRef.current = ws;

    ws.connect().then(() => {
      setIsConnected(true);
      ws.send({ type: 'register', clientType: 'desktop' });
    }).catch((error) => {
      console.error('WebSocket connection failed:', error);
    });

    ws.onMessage((message) => {
      if (message.type === 'motionData') {
        updateCursorPosition(message);
      }
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.send({ type: 'register', clientType: 'desktop' });
      }
    };
  }, []);

  const updateCursorPosition = (motionData: MotionData) => {
    if (cursorRef.current) {
      const sensitivity = 0.5;
      const newX = cursorPosition.x + motionData.gamma * sensitivity;
      const newY = cursorPosition.y + motionData.beta * sensitivity;

      const boundedX = Math.max(0, Math.min(newX, window.innerWidth));
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight));

      setCursorPosition({ type: 'cursorPosition', x: boundedX, y: boundedY });
      cursorRef.current.style.transform = `translate(${boundedX}px, ${boundedY}px)`;

      if (wsRef.current) {
        wsRef.current.send({ type: 'cursorPosition', x: boundedX, y: boundedY });
      }
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gray-100">
      <div className="absolute top-4 left-4 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Desktop Interface</h1>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <p>Cursor Position: ({Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)})</p>
      </div>
      <div
        ref={cursorRef}
        className="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
