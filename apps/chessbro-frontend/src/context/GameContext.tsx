import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import { createSocket } from "../lib/socket";
import { GameContext, type GameState } from "./game-context";

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function GameProvider({
  gameId,
  playerToken,
  children,
}: {
  gameId: string;
  playerToken: string;
  children: ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<GameState>({
    role: null,
    fen: INITIAL_FEN,
    status: "waiting",
    turn: "w",
    winner: null,
    connected: false,
    myRematchRequested: false,
    opponentRematchRequested: false,
  });

  useEffect(() => {
    const socket = createSocket(gameId, playerToken);
    socketRef.current = socket;

    socket.on("connect", () => {
      setState((s) => ({ ...s, connected: true }));
    });

    socket.on("disconnect", () => {
      setState((s) => ({ ...s, connected: false }));
    });

    socket.on(
      "game-joined",
      (data: {
        role: "white" | "black" | "spectator";
        fen: string;
        status: string;
        turn: "w" | "b";
      }) => {
        setState((s) => ({
          ...s,
          role: data.role,
          fen: data.fen,
          status: data.status,
          turn: data.turn,
        }));
      },
    );

    socket.on("player-joined", () => {
      setState((s) => ({ ...s, status: "active" }));
    });

    socket.on("rematch-requested", () => {
      setState((s) => ({ ...s, opponentRematchRequested: true }));
    });

    socket.on(
      "rematch-started",
      (data: {
        role: "white" | "black" | "spectator";
        fen: string;
        turn: "w" | "b";
        status: string;
      }) => {
        setState((s) => ({
          ...s,
          role: data.role,
          fen: data.fen,
          turn: data.turn,
          status: data.status,
          winner: null,
          myRematchRequested: false,
          opponentRematchRequested: false,
        }));
      },
    );

    socket.on(
      "move-made",
      (data: {
        from: string;
        to: string;
        fen: string;
        turn: "w" | "b";
        status: string;
        winner?: string;
      }) => {
        setState((s) => ({
          ...s,
          fen: data.fen,
          turn: data.turn,
          status: data.status,
          winner: data.winner ?? null,
        }));
      },
    );

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [gameId, playerToken]);

  const sendMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      socketRef.current?.emit("move", { gameId, from, to, promotion });
    },
    [gameId],
  );

  const requestRematch = useCallback(() => {
    setState((s) => ({ ...s, myRematchRequested: true }));
    socketRef.current?.emit("rematch", { gameId });
  }, [gameId]);

  return (
    <GameContext.Provider value={{ ...state, sendMove, requestRematch }}>
      {children}
    </GameContext.Provider>
  );
}
