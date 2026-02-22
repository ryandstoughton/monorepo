import { createContext } from "react";

export interface GameState {
  role: "white" | "black" | "spectator" | null;
  fen: string;
  status: string;
  turn: "w" | "b";
  winner: string | null;
  connected: boolean;
  myRematchRequested: boolean;
  opponentRematchRequested: boolean;
}

export interface GameContextValue extends GameState {
  sendMove: (from: string, to: string, promotion?: string) => void;
  requestRematch: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);
