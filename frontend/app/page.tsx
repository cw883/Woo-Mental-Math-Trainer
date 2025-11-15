'use client';

import { useState, useEffect } from 'react';
import GameSession from '@/components/GameSession';
import SettingsForm from '@/components/SettingsForm';
import SessionHistory from '@/components/SessionHistory';
import Leaderboard from '@/components/Leaderboard';
import Auth from '@/components/Auth';
import { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/problemGenerator';
import { api } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

type View = 'game' | 'settings' | 'history' | 'results' | 'leaderboard';

export default function Home() {
  const { user, isLoading: userLoading } = useUser();
  const [currentView, setCurrentView] = useState<View>('game');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [lastScore, setLastScore] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await api.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to load settings, using defaults:', error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsInitialized(true);
    }
  };

  const handleSaveSettings = async (newSettings: Settings) => {
    try {
      await api.updateSettings(newSettings);
      setSettings(newSettings);
      setCurrentView('game');
      // Reload the page to start a new session with new settings
      window.location.reload();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleSessionComplete = (_sessionId: number, score: number) => {
    setLastScore(score);
    setCurrentView('results');
  };

  const handlePlayAgain = () => {
    window.location.reload(); // Instant restart like Zetamac
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8 items-center">
              <button
                onClick={() => setCurrentView('game')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'game'
                    ? 'bg-gray-900 text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Play
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'leaderboard'
                    ? 'bg-gray-900 text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'history'
                    ? 'bg-gray-900 text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'settings'
                    ? 'bg-gray-900 text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
            </div>
            <div className="flex items-center">
              <Auth />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'game' && (
        <GameSession settings={settings} onComplete={handleSessionComplete} />
      )}

      {currentView === 'settings' && (
        <div className="py-12">
          <SettingsForm
            initialSettings={settings}
            onSave={handleSaveSettings}
            onCancel={() => setCurrentView('game')}
          />
        </div>
      )}

      {currentView === 'history' && <SessionHistory />}

      {currentView === 'leaderboard' && (
        <div className="py-12 max-w-4xl mx-auto px-4">
          <Leaderboard />
        </div>
      )}

      {currentView === 'results' && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
            <div className="text-7xl font-bold text-blue-600 mb-8">{lastScore}</div>
            <p className="text-black mb-8">correct answers</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
              >
                Play Again
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit Settings
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
