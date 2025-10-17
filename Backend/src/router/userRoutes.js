const express = require('express');
const router = express.Router();

// Import controllers
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole
} = require('../controllers/userController');

// Import middleware
const { protect, admin } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimitMiddleware');
const {
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validatePasswordChange
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', authLimiter, validateUserRegistration, registerUser);
router.post('/login', authLimiter, validateUserLogin, loginUser);

// Protected routes (authenticated users)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);
router.put('/change-password', protect, passwordResetLimiter, validatePasswordChange, changePassword);

// Admin only routes
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;