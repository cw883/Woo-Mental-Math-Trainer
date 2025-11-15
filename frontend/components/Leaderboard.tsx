'use client';

import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { api } from '@/lib/api';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setEntries(data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <div className="text-center text-black">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-black mb-4">🏆 Top 10 Scores</h2>

      {entries.length === 0 ? (
        <div className="text-center text-black py-8">
          No scores yet. Be the first to set a record!
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={`${entry.rank}-${entry.started_at}`}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.rank <= 3 ? 'bg-gradient-to-r' : 'bg-gray-50'
              } ${
                entry.rank === 1 ? 'from-yellow-50 to-yellow-100 border border-yellow-300' :
                entry.rank === 2 ? 'from-gray-50 to-gray-100 border border-gray-300' :
                entry.rank === 3 ? 'from-orange-50 to-orange-100 border border-orange-300' :
                ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold w-8 text-center">
                  {entry.rank === 1 ? '🥇' :
                   entry.rank === 2 ? '🥈' :
                   entry.rank === 3 ? '🥉' :
                   entry.rank}
                </div>
                <div>
                  <div className="font-semibold text-black">
                    {entry.username}
                    {entry.is_anonymous && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Guest</span>
                    )}
                  </div>
                  <div className="text-sm text-black">
                    {new Date(entry.started_at).toLocaleDateString()} at{' '}
                    {new Date(entry.started_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
                <div className="text-sm text-black">{entry.duration}s</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t text-sm text-black text-center">
        Play as a guest or login to claim your spot!
      </div>
    </div>
  );
}