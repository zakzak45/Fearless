import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          const response = await api.post('/users/login', credentials);
          const { token, ...user } = response.data.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true });
        try {
          const response = await api.post('/users/register', userData);
          const { token, ...user } = response.data.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (userData) => {
        set((state) => {
          const updatedUser = { ...state.user, ...userData };
          return { user: updatedUser };
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);