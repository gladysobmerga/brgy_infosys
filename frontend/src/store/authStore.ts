import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  address?: string;
  contactNumber?: string;
  createdAt: string;
}

interface AuthStore {
  currentUser: User | null;
  users: User[];
  authView: 'landing' | 'admin-login' | 'user-auth';
  
  login: (email: string, password: string) => boolean;
  register: (data: {
    email: string;
    password: string;
    name: string;
    address: string;
    contactNumber: string;
  }) => boolean;
  logout: () => void;
  setAuthView: (view: 'landing' | 'admin-login' | 'user-auth') => void;
}

// Default admin account
const defaultAdmin: User = {
  id: 'admin1',
  email: 'admin@barangay.gov',
  name: 'Barangay Admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// Simple password storage (in production, use proper encryption)
const passwords: Record<string, string> = {
  'admin@barangay.gov': 'admin123',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [defaultAdmin],
      authView: 'landing',

      login: (email, password) => {
        const users = get().users;
        const user = users.find((u) => u.email === email);
        
        if (!user) {
          return false;
        }

        if (passwords[email] !== password) {
          return false;
        }

        set({ currentUser: user, authView: 'landing' });
        return true;
      },

      register: (data) => {
        const users = get().users;
        
        // Check if email already exists
        if (users.find((u) => u.email === data.email)) {
          return false;
        }

        const newUser: User = {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          role: 'user',
          address: data.address,
          contactNumber: data.contactNumber,
          createdAt: new Date().toISOString(),
        };

        // Store password
        passwords[data.email] = data.password;

        set({ 
          users: [...users, newUser],
          currentUser: newUser,
          authView: 'landing',
        });
        return true;
      },

      logout: () => set({ currentUser: null, authView: 'landing' }),
      
      setAuthView: (view) => set({ authView: view }),
    }),
    {
      name: 'auth-storage',
    }
  )
);