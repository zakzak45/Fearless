const express = require('express');
const router = express.Router();

// Import middleware
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const { searchLimiter } = require('../middleware/rateLimitMiddleware');
const { validateProduct, validateReview, validateSearch } = require('../middleware/validationMiddleware');

// Product controller
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductReview,
    searchProducts
} = require('../controllers/productController');

// Public routes
router.get('/', searchLimiter, getProducts); // Get all products with filtering
router.get('/search', searchLimiter, validateSearch, searchProducts); // Search products
router.get('/:id', getProductById); // Get single product

// Protected routes (authenticated users)
router.post('/:id/reviews', protect, validateReview, addProductReview); // Add review

// Admin only routes
router.post('/', protect, admin, validateProduct, createProduct); // Create product
router.put('/:id', protect, admin, validateProduct, updateProduct); // Update product
router.delete('/:id', protect, admin, deleteProduct); // Delete product

module.exports = router;