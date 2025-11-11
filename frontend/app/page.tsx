'use client';

import { useState, useEffect } from 'react';
import GameSession from '@/components/GameSession';
import SettingsForm from '@/components/SettingsForm';
import SessionHistory from '@/components/SessionHistory';
import { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/problemGenerator';
import { api } from '@/lib/api';

type View = 'game' | 'settings' | 'history' | 'results';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('game');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [lastSessionId, setLastSessionId] = useState<number | null>(null);
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

  const handleSessionComplete = (sessionId: number, score: number) => {
    setLastSessionId(sessionId);
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
      {currentView !== 'game' && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8 items-center">
                <button
                  onClick={() => setCurrentView('game')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'game'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Play
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'settings'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'history'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

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

      {currentView === 'results' && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
            <div className="text-7xl font-bold text-blue-600 mb-8">{lastScore}</div>
            <p className="text-gray-600 mb-8">correct answers</p>

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

      {/* Global settings button (only show during game) */}
      {currentView === 'game' && (
        <button
          onClick={() => setCurrentView('settings')}
          className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
