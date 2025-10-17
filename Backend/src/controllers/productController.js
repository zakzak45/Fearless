const Product = require('../models/products');

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        let filter = { isActive: true };

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Gender filter
        if (req.query.gender) {
            filter.gender = req.query.gender;
        }

        // Brand filter
        if (req.query.brand) {
            filter.brand = new RegExp(req.query.brand, 'i');
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) {
                filter.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filter.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        // Size filter
        if (req.query.size) {
            filter['sizes.size'] = req.query.size;
        }

        // Color filter
        if (req.query.color) {
            filter['colors.color'] = new RegExp(req.query.color, 'i');
        }

        // Sort options
        let sort = {};
        switch (req.query.sort) {
            case 'price_asc':
                sort.price = 1;
                break;
            case 'price_desc':
                sort.price = -1;
                break;
            case 'name_asc':
                sort.name = 1;
                break;
            case 'name_desc':
                sort.name = -1;
                break;
            case 'rating':
                sort['rating.average'] = -1;
                break;
            case 'newest':
                sort.createdAt = -1;
                break;
            default:
                sort.createdAt = -1;
        }

        const products = await Product.find(filter)
            .select('-reviews') // Exclude reviews for list view
            .skip(skip)
            .limit(limit)
            .sort(sort);

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('reviews.user', 'username');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const { query, category, gender, minPrice, maxPrice } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let searchFilter = { isActive: true };

        // Text search
        if (query) {
            searchFilter.$text = { $search: query };
        }

        // Additional filters
        if (category) searchFilter.category = category;
        if (gender) searchFilter.gender = gender;
        if (minPrice || maxPrice) {
            searchFilter.price = {};
            if (minPrice) searchFilter.price.$gte = parseFloat(minPrice);
            if (maxPrice) searchFilter.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(searchFilter)
            .select('-reviews')
            .skip(skip)
            .limit(limit)
            .sort({ score: { $meta: 'textScore' }, createdAt: -1 });

        const total = await Product.countDocuments(searchFilter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Product already reviewed'
            });
        }

        const review = {
            user: req.user._id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);

        // Update rating
        product.rating.count = product.reviews.length;
        product.rating.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductReview
};