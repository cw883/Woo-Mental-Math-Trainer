'use client';

import { useState, useEffect } from 'react';
import { SessionSummary, Session } from '@/lib/types';
import { api } from '@/lib/api';
import ProgressChart from './ProgressChart';

type SortBy = 'date_desc' | 'date_asc' | 'score_desc' | 'score_asc';
type GroupBy = 'all' | 'default' | 'custom';

export default function SessionHistory() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('date_desc');
  const [groupBy, setGroupBy] = useState<GroupBy>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getSessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load session history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId: number) => {
    try {
      const session = await api.getSession(sessionId);
      setSelectedSession(session);
    } catch (err) {
      console.error('Failed to load session details:', err);
    }
  };

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      setDeletingId(sessionId);
      await api.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Failed to delete session');
    } finally {
      setDeletingId(null);
    }
  };

  const sortSessions = (sessions: SessionSummary[]): SessionSummary[] => {
    const sorted = [...sessions];
    switch (sortBy) {
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
      case 'score_desc':
        return sorted.sort((a, b) => b.score - a.score);
      case 'score_asc':
        return sorted.sort((a, b) => a.score - b.score);
      default:
        return sorted;
    }
  };

  const filterSessions = (sessions: SessionSummary[]): SessionSummary[] => {
    if (groupBy === 'default') {
      return sessions.filter(s => s.is_default_settings);
    } else if (groupBy === 'custom') {
      return sessions.filter(s => !s.is_default_settings);
    }
    return sessions;
  };

  const displayedSessions = sortSessions(filterSessions(sessions));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Session History</h1>

      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No sessions found. Start playing to see your history!
        </div>
      ) : (
        <>
          {/* Progress Chart */}
          <div className="mb-8">
            <ProgressChart sessions={sessions} />
          </div>

          {/* Filter and Sort Controls */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                className="px-3 py-2 border rounded-md text-gray-900"
              >
                <option value="all">All Sessions</option>
                <option value="default">Default Settings Only</option>
                <option value="custom">Custom Settings Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 border rounded-md text-gray-900"
              >
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="score_desc">Score (Highest First)</option>
                <option value="score_asc">Score (Lowest First)</option>
              </select>
            </div>
          </div>

          {/* Session List */}
          <div className="grid gap-4">
          {displayedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer relative"
              onClick={() => loadSessionDetails(session.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {session.score} correct
                    </div>
                    {session.is_default_settings && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(session.started_at)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatDuration(session.duration)}
                    </div>
                    <div className="text-sm text-gray-500">duration</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    disabled={deletingId === session.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete session"
                  >
                    {deletingId === session.id ? (
                      <span className="block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Session Details Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Session Details</h2>
                <p className="text-gray-500">
                  {formatDate(selectedSession.started_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-3xl font-bold text-blue-600">
                  {selectedSession.score}
                </div>
                <div className="text-sm text-gray-700">Correct Answers</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-3xl font-bold text-green-600">
                  {formatDuration(selectedSession.duration)}
                </div>
                <div className="text-sm text-gray-700">Duration</div>
              </div>
            </div>

            {selectedSession.problems && selectedSession.problems.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Problem Breakdown ({selectedSession.problems.length} problems)
                </h3>
                <div className="space-y-2">
                  {selectedSession.problems.map((problem, index) => (
                    <div
                      key={problem.id || index}
                      className={`p-3 rounded border ${
                        problem.is_correct
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-mono text-lg">
                            {problem.question} = {problem.answer}
                          </span>
                          {!problem.is_correct && (
                            <span className="ml-2 text-red-600">
                              (Your answer: {problem.user_answer})
                            </span>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-700">
                          <div>{(problem.time_spent_ms / 1000).toFixed(2)}s</div>
                          {problem.typo_count > 0 && (
                            <div>{problem.typo_count} typos</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
