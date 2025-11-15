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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-6">Problem Settings</h2>

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
          <label htmlFor="addition_enabled" className="text-lg font-semibold text-black">
            Addition
          </label>
        </div>
        {settings.addition_enabled && (
          <div className="ml-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">First Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.addition_min1}
                onChange={(e) => updateSetting('addition_min1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.addition_max1}
                onChange={(e) => updateSetting('addition_max1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">Second Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.addition_min2}
                onChange={(e) => updateSetting('addition_min2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.addition_max2}
                onChange={(e) => updateSetting('addition_max2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
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
          <label htmlFor="subtraction_enabled" className="text-lg font-semibold text-black">
            Subtraction
          </label>
        </div>
        {settings.subtraction_enabled && (
          <div className="ml-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">First Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.subtraction_min1}
                onChange={(e) => updateSetting('subtraction_min1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.subtraction_max1}
                onChange={(e) => updateSetting('subtraction_max1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">Second Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.subtraction_min2}
                onChange={(e) => updateSetting('subtraction_min2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.subtraction_max2}
                onChange={(e) => updateSetting('subtraction_max2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
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
          <label htmlFor="multiplication_enabled" className="text-lg font-semibold text-black">
            Multiplication
          </label>
        </div>
        {settings.multiplication_enabled && (
          <div className="ml-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">First Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.multiplication_min1}
                onChange={(e) => updateSetting('multiplication_min1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.multiplication_max1}
                onChange={(e) => updateSetting('multiplication_max1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">Second Number:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.multiplication_min2}
                onChange={(e) => updateSetting('multiplication_min2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.multiplication_max2}
                onChange={(e) => updateSetting('multiplication_max2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="0"
              />
              <span className="text-sm text-black">)</span>
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
          <label htmlFor="division_enabled" className="text-lg font-semibold text-black">
            Division
          </label>
        </div>
        {settings.division_enabled && (
          <div className="ml-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">Divisor:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.division_min1}
                onChange={(e) => updateSetting('division_min1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="1"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.division_max1}
                onChange={(e) => updateSetting('division_max1', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="1"
              />
              <span className="text-sm text-black">)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black w-24">Quotient:</span>
              <span className="text-sm text-black">(</span>
              <input
                type="number"
                value={settings.division_min2}
                onChange={(e) => updateSetting('division_min2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="1"
              />
              <span className="text-sm text-black">to</span>
              <input
                type="number"
                value={settings.division_max2}
                onChange={(e) => updateSetting('division_max2', parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded text-black"
                min="1"
              />
              <span className="text-sm text-black">)</span>
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