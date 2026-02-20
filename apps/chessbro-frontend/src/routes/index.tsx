import { createFileRoute } from "@tanstack/react-router";
import { Chess } from "chess.js";
import { useCallback, useState } from "react";
import { Chessboard } from "react-chessboard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [game, setGame] = useState(() => new Chess());

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      const next = new Chess(game.fen());
      const move = next.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move === null) return false;
      setGame(next);
      return true;
    },
    [game],
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg">
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop,
          }}
        />
      </div>
    </div>
  );
}
