import apiInstance from './axios';

// Export the API instance directly
export const api = apiInstance;

// User API endpoints
export const userAPI = {
  // Register new user
  register: (userData) => apiInstance.post('/users/register', userData),
  
  // Login user
  login: (credentials) => apiInstance.post('/users/login', credentials),
  
  // Get user profile
  getProfile: () => apiInstance.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => apiInstance.put('/users/profile', userData),
  
  // Change password
  changePassword: (passwords) => apiInstance.put('/users/change-password', passwords),
};

// Product API endpoints
export const productAPI = {
  // Get all products with filters
  getProducts: (params) => apiInstance.get('/products', { params }),
  
  // Search products
  searchProducts: (query) => apiInstance.get('/products/search', { params: query }),
  
  // Get single product
  getProductById: (id) => apiInstance.get(`/products/${id}`),
  
  // Add product review
  addReview: (productId, review) => apiInstance.post(`/products/${productId}/reviews`, review),
  
  // Admin: Create product
  createProduct: (productData) => apiInstance.post('/products', productData),
  
  // Admin: Update product
  updateProduct: (id, productData) => apiInstance.put(`/products/${id}`, productData),
  
  // Admin: Delete product
  deleteProduct: (id) => apiInstance.delete(`/products/${id}`),
};

// Cart API endpoints
export const cartAPI = {
  // Get user cart
  getCart: () => apiInstance.get('/cart'),
  
  // Add item to cart
  addToCart: (item) => apiInstance.post('/cart/add', item),
  
  // Update cart item
  updateCartItem: (itemId, quantity) => apiInstance.put('/cart/update', { itemId, quantity }),
  
  // Remove item from cart
  removeFromCart: (itemId) => apiInstance.delete(`/cart/remove/${itemId}`),
  
  // Clear cart
  clearCart: () => apiInstance.delete('/cart/clear'),
};

export default { userAPI, productAPI, cartAPI };