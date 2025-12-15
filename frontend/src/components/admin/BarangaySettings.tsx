import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Save, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export function BarangaySettings() {
  const { settings, updateSettings, addOfficial, updateOfficial, deleteOfficial } =
    useSettingsStore();
  const [editingOfficialId, setEditingOfficialId] = useState<string | null>(null);
  const [showAddOfficial, setShowAddOfficial] = useState(false);
  const [officialForm, setOfficialForm] = useState({ name: '', position: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleAddOfficial = () => {
    if (officialForm.name && officialForm.position) {
      addOfficial(officialForm);
      setOfficialForm({ name: '', position: '' });
      setShowAddOfficial(false);
    }
  };

  const handleUpdateOfficial = () => {
    if (editingOfficialId && officialForm.name && officialForm.position) {
      updateOfficial(editingOfficialId, officialForm);
      setOfficialForm({ name: '', position: '' });
      setEditingOfficialId(null);
    }
  };

  const startEditOfficial = (id: string) => {
    const official = settings.officials.find((o) => o.id === id);
    if (official) {
      setOfficialForm({ name: official.name, position: official.position });
      setEditingOfficialId(id);
      setShowAddOfficial(true);
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Save className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Barangay Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl mb-4">Barangay Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Barangay Name</label>
            <input
              type="text"
              value={settings.barangayName}
              onChange={(e) => updateSettings({ barangayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Barangay Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.barangayImage}
                onChange={(e) => updateSettings({ barangayImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                onClick={() => alert('Upload functionality can be integrated with a file upload service')}
              >
                <ImageIcon className="w-4 h-4" />
                Upload
              </button>
            </div>
            {settings.barangayImage && (
              <img
                src={settings.barangayImage}
                alt="Barangay preview"
                className="mt-2 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Established Year</label>
            <input
              type="text"
              value={settings.establishedYear}
              onChange={(e) => updateSettings({ establishedYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => updateSettings({ contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateSettings({ contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Address Line 1</label>
            <input
              type="text"
              value={settings.addressLine1}
              onChange={(e) => updateSettings({ addressLine1: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={settings.addressLine2}
              onChange={(e) => updateSettings({ addressLine2: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Address Line 3</label>
            <input
              type="text"
              value={settings.addressLine3}
              onChange={(e) => updateSettings({ addressLine3: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Location / Google Maps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl mb-4">Location</h2>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Google Maps Embed URL</label>
          <textarea
            value={settings.googleMapsEmbed}
            onChange={(e) => updateSettings({ googleMapsEmbed: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste the Google Maps embed URL here..."
          />
          <p className="text-xs text-gray-500 mt-2">
            To get the embed URL: Go to Google Maps → Search location → Click Share → Embed a map → Copy the src URL from the iframe
          </p>
        </div>
      </div>

      {/* Pickup Schedule */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl mb-4">Pickup Schedule</h2>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Order Pickup Hours</label>
          <input
            type="text"
            value={settings.pickupSchedule}
            onChange={(e) => updateSettings({ pickupSchedule: e.target.value })}
            placeholder="e.g., Monday - Friday, 8:00 AM - 5:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Barangay Officials */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Barangay Officials</h2>
          <button
            onClick={() => {
              setShowAddOfficial(!showAddOfficial);
              setEditingOfficialId(null);
              setOfficialForm({ name: '', position: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Official
          </button>
        </div>

        {showAddOfficial && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm mb-3">{editingOfficialId ? 'Edit Official' : 'Add New Official'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={officialForm.name}
                  onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={officialForm.position}
                  onChange={(e) => setOfficialForm({ ...officialForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={() => {
                    setShowAddOfficial(false);
                    setEditingOfficialId(null);
                    setOfficialForm({ name: '', position: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingOfficialId ? handleUpdateOfficial : handleAddOfficial}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingOfficialId ? 'Update' : 'Add'} Official
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {settings.officials.map((official) => (
            <div
              key={official.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p>{official.name}</p>
                <p className="text-sm text-gray-600">{official.position}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditOfficial(official.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteOfficial(official.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
