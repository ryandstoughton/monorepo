import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Chess } from 'chess.js';
import { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { apiFetch } from '../lib/api';
import { getOrCreateAnonId } from '../lib/anonId';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const createGame = useCallback(async () => {
    setCreating(true);
    try {
      const { id } = await apiFetch<{ id: string }>('/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerToken: getOrCreateAnonId() }),
      });
      void navigate({ to: '/game/$gameId', params: { gameId: id } });
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
      const next = new Chess(game.fen());
      const move = next.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
      if (move === null) return false;
      setGame(next);
      return true;
    },
    [game],
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => void createGame()}
        disabled={creating}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 disabled:opacity-50"
      >
        {creating ? 'Creating...' : 'Create Multiplayer Game'}
      </button>
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
