// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of the user info
interface User {
  _id: string;
  name: string;
  email: string;
}

// Define the shape of the store's state
interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,

      // Action: login
      // This will be called when the user successfully logs in or signs up
      login: (user, token) => {
        set({ user, token });
      },

      // Action: logout
      // This will clear the user data and token from the state and localStorage
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      // Configuration for persistence
      name: 'auth-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);