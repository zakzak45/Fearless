import { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    IconButton,
    TextField,
    Divider,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCartStore();
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItem(itemId, newQuantity);
        } catch (err) {
            setError('Failed to update cart');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeFromCart(itemId);
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
        } catch (err) {
            setError('Failed to clear cart');
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Please Login to View Cart
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/login')}>
                    Login
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!cart || cart.items?.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Your Cart is Empty
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Looks like you haven't added anything to your cart yet
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/products')}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="h3" gutterBottom fontWeight="bold">
                Shopping Cart
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
            </Typography>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} lg={8}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Items</Typography>
                        <Button color="error" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </Box>

                    {cart.items.map((item) => (
                        <Card key={item._id} sx={{ mb: 2, p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Product Image */}
                                <Grid item xs={12} sm={3}>
                                    <CardMedia
                                        component="img"
                                        image={
                                            item.product?.images?.[0]?.url ||
                                            'https://via.placeholder.com/150?text=No+Image'
                                        }
                                        alt={item.product?.name}
                                        sx={{
                                            height: 150,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/products/${item.product._id}`)}
                                    />
                                </Grid>

                                {/* Product Info */}
                                <Grid item xs={12} sm={5}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                        onClick={() => navigate(`/products/${item.product._id}`)}
                                    >
                                        {item.product?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Brand: {item.product?.brand}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Size: {item.size}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Color: {item.color}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        ${item.price.toFixed(2)}
                                    </Typography>
                                </Grid>

                                {/* Quantity Controls */}
                                <Grid item xs={12} sm={3}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Remove />
                                        </IconButton>
                                        <TextField
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val > 0) {
                                                    handleUpdateQuantity(item._id, val);
                                                }
                                            }}
                                            size="small"
                                            sx={{ width: 60, textAlign: 'center' }}
                                            inputProps={{ style: { textAlign: 'center' } }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                        >
                                            <Add />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Grid>

                                {/* Remove Button */}
                                <Grid item xs={12} sm={1}>
                                    <IconButton color="error" onClick={() => handleRemoveItem(item._id)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Order Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Subtotal:</Typography>
                            <Typography>${cart.totalPrice.toFixed(2)}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Shipping:</Typography>
                            <Typography color="success.main">
                                {cart.totalPrice >= 50 ? 'FREE' : '$5.00'}
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Tax (10%):</Typography>
                            <Typography>${(cart.totalPrice * 0.1).toFixed(2)}</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="h6" fontWeight="bold">
                                Total:
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                ${(
                                    cart.totalPrice +
                                    (cart.totalPrice >= 50 ? 0 : 5) +
                                    cart.totalPrice * 0.1
                                ).toFixed(2)}
                            </Typography>
                        </Box>

                        {cart.totalPrice < 50 && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Add ${(50 - cart.totalPrice).toFixed(2)} more to get FREE shipping!
                            </Alert>
                        )}

                        <Button variant="contained" fullWidth size="large" sx={{ mb: 2 }}>
                            Proceed to Checkout
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;