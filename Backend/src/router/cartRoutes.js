const express = require('express');
const router = express.Router();

// Import controller
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;