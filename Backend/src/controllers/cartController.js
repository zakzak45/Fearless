const Cart = require('../models/Cart');
const Product = require('../models/products');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price images brand category');

        if (!cart) {
            return res.json({
                success: true,
                data: {
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                }
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size, color } = req.body;

        // Validate required fields
        if (!productId || !size || !color) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size, and color are required'
            });
        }

        // Check if product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive'
            });
        }

        // Check if size is available
        const sizeObj = product.sizes.find(s => s.size === size);
        if (!sizeObj) {
            return res.status(400).json({
                success: false,
                message: 'Size not available'
            });
        }

        // Check if color is available
        const colorObj = product.colors.find(c => c.color.toLowerCase() === color.toLowerCase());
        if (!colorObj) {
            return res.status(400).json({
                success: false,
                message: 'Color not available'
            });
        }

        // Check stock availability
        if (sizeObj.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && 
                   item.size === size && 
                   item.color.toLowerCase() === color.toLowerCase()
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            // Check stock for new quantity
            if (sizeObj.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock for requested quantity'
                });
            }
            
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({
                product: productId,
                quantity,
                size,
                color: colorObj.color,
                price: product.getFinalPrice()
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name price images brand category');

        res.json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        if (!itemId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Item ID and valid quantity are required'
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check stock availability
        const product = await Product.findById(cart.items[itemIndex].product);
        const sizeObj = product.sizes.find(s => s.size === cart.items[itemIndex].size);
        
        if (sizeObj.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price images brand category');

        res.json({
            success: true,
            message: 'Cart updated',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        await cart.populate('items.product', 'name price images brand category');

        res.json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: 'Cart cleared',
            data: cart
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
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};