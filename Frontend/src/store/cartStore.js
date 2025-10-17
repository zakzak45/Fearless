import { create } from 'zustand';
import { api } from '../api';

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addToCart: async (item) => {
    set({ loading: true });
    try {
      const response = await api.post('/cart/add', item);
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    set({ loading: true });
    try {
      const response = await api.put('/cart/update', { itemId, quantity });
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    set({ loading: true });
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ loading: true });
    try {
      const response = await api.delete('/cart/clear');
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));