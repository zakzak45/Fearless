const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
const validateUserRegistration = [
    body('username')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Username must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    
    handleValidationErrors
];

// User login validation
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Username must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    
    handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    handleValidationErrors
];

// Product validation
const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('discountPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Discount price must be a positive number'),
    
    body('category')
        .isIn(['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'underwear', 'sportswear', 'formal', 'casual'])
        .withMessage('Please select a valid category'),
    
    body('brand')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Brand name is required and must not exceed 50 characters'),
    
    body('gender')
        .isIn(['men', 'women', 'unisex', 'kids'])
        .withMessage('Please select a valid gender category'),
    
    body('sku')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('SKU must be between 3 and 50 characters'),
    
    handleValidationErrors
];

// Review validation
const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Comment must not exceed 500 characters'),
    
    handleValidationErrors
];

// Search validation
const validateSearch = [
    body('query')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    
    body('category')
        .optional()
        .isIn(['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'underwear', 'sportswear', 'formal', 'casual'])
        .withMessage('Please select a valid category'),
    
    body('gender')
        .optional()
        .isIn(['men', 'women', 'unisex', 'kids'])
        .withMessage('Please select a valid gender'),
    
    body('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
    
    body('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),
    
    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validateProduct,
    validateReview,
    validateSearch,
    handleValidationErrors
};