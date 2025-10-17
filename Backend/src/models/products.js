const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0,
        default: null
    },
    category: {
        type: String,
        required: true,
        enum: [
            "shirts", 
            "pants", 
            "dresses", 
            "jackets", 
            "shoes", 
            "accessories", 
            "underwear",
            "sportswear",
            "formal",
            "casual"
        ]
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["men", "women", "unisex", "kids"]
    },
    sizes: [{
        size: {
            type: String,
            required: true,
            enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "6", "7", "8", "9", "10", "11", "12", "28", "30", "32", "34", "36", "38", "40", "42"]
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],
    colors: [{
        color: {
            type: String,
            required: true,
            trim: true
        },
        colorCode: {
            type: String,
            trim: true
        }
    }],
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    material: {
        type: String,
        trim: true
    },
    careInstructions: {
        type: String,
        trim: true
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    sku: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    totalStock: {
        type: Number,
        min: 0,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, gender: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ isActive: 1 });


ProductSchema.pre('save', function(next) {
    this.totalStock = this.sizes.reduce((total, sizeObj) => total + sizeObj.stock, 0);
    this.updatedAt = Date.now();
    next();
});


ProductSchema.methods.isInStock = function(size = null) {
    if (size) {
        const sizeObj = this.sizes.find(s => s.size === size);
        return sizeObj ? sizeObj.stock > 0 : false;
    }
    return this.totalStock > 0;
};


ProductSchema.methods.getFinalPrice = function() {
    return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
};


ProductSchema.methods.updateStock = function(size, quantity) {
    const sizeObj = this.sizes.find(s => s.size === size);
    if (sizeObj) {
        sizeObj.stock = Math.max(0, sizeObj.stock + quantity);
        this.totalStock = this.sizes.reduce((total, s) => total + s.stock, 0);
    }
};

module.exports = mongoose.model("Product", ProductSchema);
