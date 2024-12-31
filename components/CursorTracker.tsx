'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket');
      const newSocket = io();
      
      newSocket.on('updateCursor', (data) => {
        const { beta, gamma } = data;
        // Convert orientation data to cursor position
        const x = (gamma + 90) * (window.innerWidth / 180);
        const y = (beta + 90) * (window.innerHeight / 180);
        setPosition({ x, y });
      });

      setSocket(newSocket);
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-gray-700 rounded-lg overflow-hidden">
      <div
        className="absolute w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-gray-400">Zone de suivi du curseur</p>
      </div>
    </div>
  );
}