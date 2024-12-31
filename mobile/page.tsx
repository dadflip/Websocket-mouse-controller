'use client'

import { useState, useEffect, useRef } from 'react';
import { WebSocketClient } from '../shared/websocket';
import { MotionData } from '../shared/types';

export default function MobileInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const wsRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const ws = new WebSocketClient('ws://localhost:8080');
    wsRef.current = ws;

    ws.connect().then(() => {
      setIsConnected(true);
      ws.send({ type: 'register', clientType: 'mobile' });
    }).catch((error) => {
      console.error('WebSocket connection failed:', error);
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.send({ type: 'register', clientType: 'mobile' });
      }
    };
  }, []);

  const handleCalibrate = () => {
    setIsCalibrated(true);
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    window.addEventListener('devicemotion', handleMotion);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    window.removeEventListener('devicemotion', handleMotion);
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    if (wsRef.current && event.rotationRate) {
      const motionData: MotionData = {
        type: 'motionData',
        alpha: event.rotationRate.alpha || 0,
        beta: event.rotationRate.beta || 0,
        gamma: event.rotationRate.gamma || 0,
      };
      wsRef.current.send(motionData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Motion Control Mouse</h1>
        <div className="mb-4">
          <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
          <p>Calibration: {isCalibrated ? 'Calibrated' : 'Not Calibrated'}</p>
          <p>Tracking: {isTracking ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleCalibrate}
            disabled={!isConnected || isCalibrated}
          >
            Calibrate
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleStartTracking}
            disabled={!isConnected || !isCalibrated || isTracking}
          >
            Start Tracking
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleStopTracking}
            disabled={!isTracking}
          >
            Stop Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
