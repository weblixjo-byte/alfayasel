'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash, X, Save, Sparkles } from 'lucide-react';
import { getStoreSettings, updateStoreSettings } from '@/lib/actions/settings';

export default function SettingsPage() {
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const res = await getStoreSettings();
      if (res.success && res.settings) {
        setBanners(res.settings.heroBanners || []);
      } else {
        setError(res.error || 'Failed to load store settings');
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleAddBanner = () => {
    setError('');
    const cleanUrl = newBanner.trim();
    if (!cleanUrl) return;

    if (banners.includes(cleanUrl)) {
      setError('This banner image path is already added.');
      return;
    }

    setBanners([...banners, cleanUrl]);
    setNewBanner('');
  };

  const handleRemoveBanner = (index: number) => {
    setBanners(banners.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const res = await updateStoreSettings(banners);
    if (res.success) {
      setSuccess('Storefront banner settings updated successfully!');
    } else {
      setError(res.error || 'Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Store Settings</h1>
          <p className="text-xs text-gray-500 mt-1">Manage storefront banners and slider components</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Notifications */}
      {error && <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200">{error}</div>}
      {success && <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Banners List & Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" /> Hero Section Slider Banners
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Add image paths for your homepage slider. These images must be located in your public uploads folder (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded text-brand-600">/images/slider-1.jpg</code> or relative web paths). Banners will be displayed in the order shown below.
            </p>

            {/* Input field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                placeholder="e.g. /images/slider-1.jpg"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black font-mono text-gray-700"
              />
              <button
                type="button"
                onClick={handleAddBanner}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors border border-gray-200"
              >
                <Plus className="w-4.5 h-4.5" /> Add
              </button>
            </div>

            {/* Banners List */}
            {loading ? (
              <div className="text-center text-xs text-gray-400 py-8">Loading settings data...</div>
            ) : banners.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-8 border border-dashed border-gray-200 rounded-lg">No active banners. Add one above!</div>
            ) : (
              <div className="space-y-3 pt-2">
                {banners.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors">
                    <span className="font-mono text-xs text-gray-600 truncate max-w-lg select-all">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBanner(idx)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-white border border-transparent hover:border-gray-100 transition-all"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Info Panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Instructions</h4>
            <ul className="text-xs text-gray-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>Upload banner images to the <code className="bg-white px-1 py-0.5 rounded border">public/images/</code> folder in your codebase.</li>
              <li>Reference them here using relative paths like <code className="bg-white px-1 py-0.5 rounded border">/images/your-banner.jpg</code>.</li>
              <li>Make sure to click **Save Settings** in the top right to apply the changes to the storefront database.</li>
              <li>Banners are automatically responsive and render on both Arabic and English storefront versions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
