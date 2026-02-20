import { createFileRoute } from '@tanstack/react-router';
import { Chess } from 'chess.js';
import { useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { GameProvider, useGame } from '../context/GameContext';
import { getOrCreateAnonId } from '../lib/anonId';

export const Route = createFileRoute('/game/$gameId')({
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
  const { role, fen, status, turn, winner, connected, sendMove } = useGame();

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      if (status !== 'active') return false;
      if (role === 'spectator' || role === null) return false;
      if (role === 'white' && turn !== 'w') return false;
      if (role === 'black' && turn !== 'b') return false;

      // Local validation before sending to server
      const chess = new Chess(fen);
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
      if (!move) return false;

      sendMove(sourceSquare, targetSquare, 'q');
      return true;
    },
    [role, fen, status, turn, sendMove],
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:p-6 lg:p-8">
      {/* Status banner */}
      {status === 'waiting' && (
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

      {status === 'finished' && (
        <div className="rounded-lg border border-gray-700 bg-gray-900 px-6 py-4 text-center">
          {winner === 'draw' ? (
            <p className="text-lg font-semibold text-gray-300">
              Game over — Draw!
            </p>
          ) : (
            <p className="text-lg font-semibold text-gray-300">
              Game over —{' '}
              <span className="text-white capitalize">{winner}</span> wins!
            </p>
          )}
        </div>
      )}

      {/* Connection indicator */}
      {!connected && (
        <p className="text-sm text-yellow-400">Connecting...</p>
      )}

      {/* Role indicator */}
      {role && (
        <p className="text-sm text-gray-400">
          You are playing as{' '}
          <span className="font-medium text-gray-200 capitalize">{role}</span>
          {status === 'active' && (
            <span className="ml-2 text-gray-500">
              ({turn === 'w' ? 'White' : 'Black'}&apos;s turn)
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
            boardOrientation: role === 'black' ? 'black' : 'white',
          }}
        />
      </div>
    </div>
  );
}
