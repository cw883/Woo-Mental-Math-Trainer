'use client';

import { useState } from 'react';
import { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/problemGenerator';

interface SettingsFormProps {
  initialSettings?: Settings;
  onSave: (settings: Settings) => void;
  onCancel?: () => void;
}

export default function SettingsForm({ initialSettings, onSave, onCancel }: SettingsFormProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings || DEFAULT_SETTINGS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Problem Settings</h2>

      {/* Addition Settings */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="addition_enabled"
            checked={settings.addition_enabled}
            onChange={(e) => updateSetting('addition_enabled', e.target.checked)}
            className="w-5 h-5 mr-3"
          />
          <label htmlFor="addition_enabled" className="text-lg font-semibold">
            Addition
          </label>
        </div>
        {settings.addition_enabled && (
          <div className="flex gap-4 ml-8">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Min</label>
              <input
                type="number"
                value={settings.addition_min}
                onChange={(e) => updateSetting('addition_min', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max</label>
              <input
                type="number"
                value={settings.addition_max}
                onChange={(e) => updateSetting('addition_max', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Subtraction Settings */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="subtraction_enabled"
            checked={settings.subtraction_enabled}
            onChange={(e) => updateSetting('subtraction_enabled', e.target.checked)}
            className="w-5 h-5 mr-3"
          />
          <label htmlFor="subtraction_enabled" className="text-lg font-semibold">
            Subtraction
          </label>
        </div>
        {settings.subtraction_enabled && (
          <div className="flex gap-4 ml-8">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Min</label>
              <input
                type="number"
                value={settings.subtraction_min}
                onChange={(e) => updateSetting('subtraction_min', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max</label>
              <input
                type="number"
                value={settings.subtraction_max}
                onChange={(e) => updateSetting('subtraction_max', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Multiplication Settings */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="multiplication_enabled"
            checked={settings.multiplication_enabled}
            onChange={(e) => updateSetting('multiplication_enabled', e.target.checked)}
            className="w-5 h-5 mr-3"
          />
          <label htmlFor="multiplication_enabled" className="text-lg font-semibold">
            Multiplication
          </label>
        </div>
        {settings.multiplication_enabled && (
          <div className="flex gap-4 ml-8">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Min</label>
              <input
                type="number"
                value={settings.multiplication_min}
                onChange={(e) => updateSetting('multiplication_min', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max</label>
              <input
                type="number"
                value={settings.multiplication_max}
                onChange={(e) => updateSetting('multiplication_max', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Division Settings */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="division_enabled"
            checked={settings.division_enabled}
            onChange={(e) => updateSetting('division_enabled', e.target.checked)}
            className="w-5 h-5 mr-3"
          />
          <label htmlFor="division_enabled" className="text-lg font-semibold">
            Division
          </label>
        </div>
        {settings.division_enabled && (
          <div className="flex gap-4 ml-8">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Min</label>
              <input
                type="number"
                value={settings.division_min}
                onChange={(e) => updateSetting('division_min', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Max</label>
              <input
                type="number"
                value={settings.division_max}
                onChange={(e) => updateSetting('division_max', parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded text-gray-900"
                min="1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save & Start
        </button>
      </div>
    </form>
  );
}
