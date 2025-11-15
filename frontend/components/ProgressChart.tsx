'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SessionSummary } from '@/lib/types';

interface ProgressChartProps {
  sessions: SessionSummary[];
}

type GroupingMode = 'session' | 'day';

export default function ProgressChart({ sessions }: ProgressChartProps) {
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('session');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (groupingMode === 'session') {
      // Group by individual sessions
      const data = sessions
        .slice()
        .reverse() // Show oldest first
        .map((session, index) => ({
          name: `Session ${index + 1}`,
          date: new Date(session.started_at).toLocaleDateString(),
          score: session.score,
        }));
      setChartData(data);
    } else {
      // Group by day and average scores
      const groupedByDay: { [key: string]: number[] } = {};

      sessions.forEach((session) => {
        const date = new Date(session.started_at).toLocaleDateString();
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(session.score);
      });

      const data = Object.entries(groupedByDay)
        .map(([date, scores]) => ({
          name: date,
          score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          sessions: scores.length,
        }))
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

      setChartData(data);
    }
  }, [sessions, groupingMode]);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Progress Chart</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setGroupingMode('session')}
            className={`px-4 py-2 rounded ${
              groupingMode === 'session'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            By Session
          </button>
          <button
            onClick={() => setGroupingMode('day')}
            className={`px-4 py-2 rounded ${
              groupingMode === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            By Day
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-blue-600">Score: {data.score}</p>
                    {data.date && <p className="text-black text-sm">{data.date}</p>}
                    {data.sessions && <p className="text-black text-sm">Sessions: {data.sessions}</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Score"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-black">
        {groupingMode === 'session' ? (
          <p>Showing individual session scores in chronological order</p>
        ) : (
          <p>Showing average scores per day</p>
        )}
      </div>
    </div>
  );
}