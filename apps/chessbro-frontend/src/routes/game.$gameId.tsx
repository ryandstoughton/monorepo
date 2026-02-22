import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chess } from "chess.js";
import { useCallback, useState } from "react";
import { Chessboard } from "react-chessboard";
import { GameProvider } from "../context/GameContext";
import { useGame } from "../context/useGame";
import { apiFetch } from "../lib/api";
import { getOrCreateAnonId } from "../lib/anonId";

export const Route = createFileRoute("/game/$gameId")({
  component: GamePage,
});

function GamePage() {
  const { gameId } = Route.useParams();
  const playerToken = getOrCreateAnonId();

  return (
    <GameProvider gameId={gameId} playerToken={playerToken}>
      <GameBoard gameId={gameId} />
    </GameProvider>
  );
}

function GameBoard({ gameId }: { gameId: string }) {
  const {
    role,
    fen,
    status,
    turn,
    winner,
    connected,
    sendMove,
    myRematchRequested,
    opponentRematchRequested,
    requestRematch,
  } = useGame();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  const createNewGame = useCallback(async () => {
    setCreating(true);
    try {
      const { id } = await apiFetch<{ id: string }>("/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerToken: getOrCreateAnonId() }),
      });
      void navigate({ to: "/game/$gameId", params: { gameId: id } });
    } finally {
      setCreating(false);
    }
  }, [navigate]);

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      if (status !== "active") return false;
      if (role === "spectator" || role === null) return false;
      if (role === "white" && turn !== "w") return false;
      if (role === "black" && turn !== "b") return false;

      // Local validation before sending to server
      const chess = new Chess(fen);
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) return false;

      sendMove(sourceSquare, targetSquare, "q");
      return true;
    },
    [role, fen, status, turn, sendMove],
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:p-6 lg:p-8">
      {/* Status banner */}
      {status === "waiting" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-lg text-gray-300">Waiting for opponent...</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={gameUrl}
              className="w-72 rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300"
            />
            <button
              className="rounded-md border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              onClick={() => void navigator.clipboard.writeText(gameUrl)}
            >
              Copy link
            </button>
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-700 bg-gray-900 px-8 py-6 text-center">
          {winner === "draw" ? (
            <>
              <p className="text-2xl font-bold text-gray-100">Draw!</p>
              <p className="text-sm text-gray-400">The game ended in a draw.</p>
            </>
          ) : winner === role ? (
            <>
              <p className="text-2xl font-bold text-white">You won!</p>
              <p className="text-sm text-gray-400">
                Congratulations, you beat your opponent.
              </p>
            </>
          ) : role === "spectator" ? (
            <p className="text-2xl font-bold text-gray-100">
              <span className="capitalize">{winner}</span> wins!
            </p>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-400">You lost.</p>
              <p className="text-sm text-gray-500">Better luck next time.</p>
            </>
          )}

          {/* Rematch status */}
          {role !== "spectator" &&
            opponentRematchRequested &&
            !myRematchRequested && (
              <p className="text-sm font-medium text-green-400">
                Your opponent wants a rematch!
              </p>
            )}
          {role !== "spectator" &&
            myRematchRequested &&
            !opponentRematchRequested && (
              <p className="text-sm text-gray-400">
                Waiting for opponent to accept...
              </p>
            )}

          <div className="mt-1 flex gap-3">
            {role !== "spectator" && (
              <button
                onClick={requestRematch}
                disabled={myRematchRequested}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                Rematch
              </button>
            )}
            <button
              onClick={() => void createNewGame()}
              disabled={creating}
              className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {creating ? "Creating..." : "New Game"}
            </button>
            <button
              onClick={() => void navigate({ to: "/" })}
              className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              Go Home
            </button>
          </div>
        </div>
      )}

      {/* Connection indicator */}
      {!connected && <p className="text-sm text-yellow-400">Connecting...</p>}

      {/* Role indicator */}
      {role && (
        <p className="text-sm text-gray-400">
          You are playing as{" "}
          <span className="font-medium text-gray-200 capitalize">{role}</span>
          {status === "active" && (
            <span className="ml-2 text-gray-500">
              ({turn === "w" ? "White" : "Black"}&apos;s turn)
            </span>
          )}
        </p>
      )}

      {/* Board */}
      <div className="w-full max-w-lg">
        <Chessboard
          options={{
            position: fen,
            onPieceDrop,
            boardOrientation: role === "black" ? "black" : "white",
          }}
        />
      </div>
    </div>
  );
}
