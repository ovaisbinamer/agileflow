// File: client/src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socketInstance = null;

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance || !socketInstance.connected) {
      socketInstance = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on('connect', () => {
        console.log(`[Socket] Connected: ${socketInstance.id}`);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log(`[Socket] Disconnected: ${reason}`);
      });

      socketInstance.on('connect_error', (err) => {
        console.error(`[Socket] Connection error: ${err.message}`);
      });
    }

    socketRef.current = socketInstance;

    return () => {};
  }, []);

  return socketRef.current;
};

export default useSocket;