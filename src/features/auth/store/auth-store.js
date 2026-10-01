import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Session state: who is logged in and the API token. Persisted in localStorage. */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: ({ user, token }) => set({ user, token }),
      clearSession: () => set({ user: null, token: null }),
    }),
    { name: 'aqdi-auth' },
  ),
);

export const selectIsAuthenticated = (state) => Boolean(state.token);
