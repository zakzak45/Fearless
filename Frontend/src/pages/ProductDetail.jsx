import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    Rating,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    CircularProgress,
    Alert,
    Avatar,
    Paper,
} from '@mui/material';
import {
    ShoppingCart,
    Favorite,
    FavoriteBorder,
    LocalShipping,
    Security,
    Loop,
} from '@mui/icons-material';
import { api } from '../api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { addToCart } = useCartStore();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data);
            if (response.data.data.colors?.length > 0) {
                setSelectedColor(response.data.data.colors[0].color);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setError('Please select a size');
            return;
        }
        if (!selectedColor) {
            setError('Please select a color');
            return;
        }

        try {
            await addToCart({
                productId: product._id,
                quantity,
                size: selectedSize,
                color: selectedColor,
            });
            setSuccess('Added to cart successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to add to cart');
        }
    };

    const handleSubmitReview = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/products/${id}/reviews`, review);
            setSuccess('Review submitted successfully!');
            setReview({ rating: 5, comment: '' });
            fetchProduct();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Container>
                <Alert severity="error">Product not found</Alert>
            </Container>
        );
    }

    const finalPrice = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Grid container spacing={4}>
                {/* Product Images */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={
                                product.images?.[selectedImage]?.url ||
                                'https://via.placeholder.com/600x800?text=No+Image'
                            }
                            alt={product.name}
                            sx={{ height: 600, objectFit: 'cover' }}
                        />
                    </Card>
                    <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                        {product.images?.map((image, index) => (
                            <Card
                                key={index}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    cursor: 'pointer',
                                    border: selectedImage === index ? 2 : 0,
                                    borderColor: 'primary.main',
                                }}
                                onClick={() => setSelectedImage(index)}
                            >
                                <CardMedia
                                    component="img"
                                    image={image.url}
                                    alt={image.alt}
                                    sx={{ height: '100%', objectFit: 'cover' }}
                                />
                            </Card>
                        ))}
                    </Box>
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                    <Typography variant="overline" color="text.secondary">
                        {product.brand}
                    </Typography>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        {product.name}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Rating value={product.rating?.average || 0} readOnly />
                        <Typography variant="body2" color="text.secondary">
                            ({product.rating?.count || 0} reviews)
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Typography variant="h4" fontWeight="bold" color={hasDiscount ? 'error' : 'inherit'}>
                            ${finalPrice.toFixed(2)}
                        </Typography>
                        {hasDiscount && (
                            <>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ textDecoration: 'line-through' }}
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Chip
                                    label={`Save ${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                                    color="error"
                                />
                            </>
                        )}
                    </Box>

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Size Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Size</InputLabel>
                        <Select
                            value={selectedSize}
                            label="Size"
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            {product.sizes?.map((sizeObj) => (
                                <MenuItem
                                    key={sizeObj.size}
                                    value={sizeObj.size}
                                    disabled={sizeObj.stock === 0}
                                >
                                    {sizeObj.size} {sizeObj.stock === 0 ? '(Out of Stock)' : `(${sizeObj.stock} available)`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Color Selection */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                            Color: {selectedColor}
                        </Typography>
                        <Box display="flex" gap={1}>
                            {product.colors?.map((colorObj) => (
                                <Box
                                    key={colorObj.color}
                                    onClick={() => setSelectedColor(colorObj.color)}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: colorObj.colorCode || colorObj.color.toLowerCase(),
                                        border: selectedColor === colorObj.color ? 3 : 1,
                                        borderColor: selectedColor === colorObj.color ? 'primary.main' : 'grey.300',
                                        cursor: 'pointer',
                                        '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Quantity */}
                    <TextField
                        type="number"
                        label="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1 }}
                        sx={{ mb: 2, width: 150 }}
                    />

                    {/* Add to Cart Button */}
                    <Box display="flex" gap={2} mb={3}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<ShoppingCart />}
                            onClick={handleAddToCart}
                            disabled={product.totalStock === 0}
                        >
                            {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                        <Button variant="outlined" size="large">
                            <Favorite />
                        </Button>
                    </Box>

                    {/* Features */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <LocalShipping color="primary" />
                                <Typography variant="body2">Free shipping on orders over $50</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Loop color="primary" />
                                <Typography variant="body2">30-day return policy</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Security color="primary" />
                                <Typography variant="body2">Secure payment</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Product Details */}
                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Product Details
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Category:</strong> {product.category}
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Gender:</strong> {product.gender}
                        </Typography>
                        {product.material && (
                            <Typography variant="body2" paragraph>
                                <strong>Material:</strong> {product.material}
                            </Typography>
                        )}
                        {product.careInstructions && (
                            <Typography variant="body2" paragraph>
                                <strong>Care Instructions:</strong> {product.careInstructions}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Reviews Section */}
            <Box mt={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Customer Reviews
                </Typography>

                {/* Add Review */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Write a Review
                    </Typography>
                    <Rating
                        value={review.rating}
                        onChange={(e, value) => setReview({ ...review, rating: value })}
                        size="large"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Your Review"
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleSubmitReview}>
                        Submit Review
                    </Button>
                </Paper>

                {/* Reviews List */}
                {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => (
                        <Paper key={index} sx={{ p: 3, mb: 2 }}>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Avatar>{review.user?.username?.[0]?.toUpperCase()}</Avatar>
                                <Box>
                                    <Typography variant="subtitle2">{review.user?.username || 'Anonymous'}</Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                </Box>
                            </Box>
                            <Typography variant="body2">{review.comment}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(review.date).toLocaleDateString()}
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
                )}
            </Box>
        </Container>
    );
};

export default ProductDetail;