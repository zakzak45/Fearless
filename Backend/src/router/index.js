const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

// API routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

// API info route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Fearless Clothing Brand API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            products: '/api/products',
            cart: '/api/cart'
        },
        documentation: {
            users: {
                'POST /api/users/register': 'Register new user',
                'POST /api/users/login': 'Login user',
                'GET /api/users/profile': 'Get user profile (auth required)',
                'PUT /api/users/profile': 'Update user profile (auth required)',
                'PUT /api/users/change-password': 'Change password (auth required)',
                'GET /api/users': 'Get all users (admin only)',
                'GET /api/users/:id': 'Get user by ID (admin only)',
                'DELETE /api/users/:id': 'Delete user (admin only)',
                'PUT /api/users/:id/role': 'Update user role (admin only)'
            },
            products: {
                'GET /api/products': 'Get all products with filtering',
                'GET /api/products/search': 'Search products',
                'GET /api/products/:id': 'Get product by ID',
                'POST /api/products': 'Create product (admin only)',
                'PUT /api/products/:id': 'Update product (admin only)',
                'DELETE /api/products/:id': 'Delete product (admin only)',
                'POST /api/products/:id/reviews': 'Add product review (auth required)'
            },
            cart: {
                'GET /api/cart': 'Get user cart (auth required)',
                'POST /api/cart/add': 'Add item to cart (auth required)',
                'PUT /api/cart/update': 'Update cart item quantity (auth required)',
                'DELETE /api/cart/remove/:itemId': 'Remove item from cart (auth required)',
                'DELETE /api/cart/clear': 'Clear cart (auth required)'
            }
        }
    });
});

module.exports = router;