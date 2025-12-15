import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BarangayOfficial {
  id: string;
  name: string;
  position: string;
}

export interface BarangaySettings {
  barangayName: string;
  barangayImage: string;
  contactPhone: string;
  contactEmail: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  googleMapsEmbed: string;
  officials: BarangayOfficial[];
  pickupSchedule: string;
  establishedYear: string;
}

interface SettingsStore {
  settings: BarangaySettings;
  updateSettings: (settings: Partial<BarangaySettings>) => void;
  addOfficial: (official: Omit<BarangayOfficial, 'id'>) => void;
  updateOfficial: (id: string, official: Partial<BarangayOfficial>) => void;
  deleteOfficial: (id: string) => void;
}

const defaultSettings: BarangaySettings = {
  barangayName: 'Barangay Darangan',
  barangayImage: '',
  contactPhone: '(123) 456-7890',
  contactEmail: 'healthcenter@brgy-darangan.gov.ph',
  addressLine1: 'Barangay Darangan Health Center',
  addressLine2: 'Main Street, Darangan',
  addressLine3: 'Municipality, Province 1234',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4479984468343!2d121.0244078!3d14.5995124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0f537%3A0x2b0e3c3d4b7e4a4d!2sManila%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1234567890',
  officials: [
    {
      id: '1',
      name: 'Hon. Juan Dela Cruz',
      position: 'Barangay Captain',
    },
    {
      id: '2',
      name: 'Maria Santos',
      position: 'Barangay Health Worker',
    },
    {
      id: '3',
      name: 'Dr. Pedro Reyes',
      position: 'Health Center Physician',
    },
  ],
  pickupSchedule: 'Monday - Friday, 8:00 AM - 5:00 PM',
  establishedYear: '1995',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addOfficial: (official) =>
        set((state) => ({
          settings: {
            ...state.settings,
            officials: [
              ...state.settings.officials,
              { ...official, id: Date.now().toString() },
            ],
          },
        })),

      updateOfficial: (id, official) =>
        set((state) => ({
          settings: {
            ...state.settings,
            officials: state.settings.officials.map((o) =>
              o.id === id ? { ...o, ...official } : o
            ),
          },
        })),

      deleteOfficial: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            officials: state.settings.officials.filter((o) => o.id !== id),
          },
        })),
    }),
    {
      name: 'barangay-settings',
    }
  )
);