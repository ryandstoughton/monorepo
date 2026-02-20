import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL as string;

export function createSocket(
  gameId: string,
  playerToken: string,
): Socket {
  return io(API_URL, {
    auth: { gameId, playerToken },
    autoConnect: false,
  });
}
