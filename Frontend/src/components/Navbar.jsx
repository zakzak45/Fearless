import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container } from '@mui/material';
import { ShoppingCart, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { cart } = useCartStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" color="primary" elevation={2}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            mr: 4,
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                                opacity: 0.8,
                            },
                        }}
                    >
                        FEARLESS
                    </Typography>

                    {/* Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Button color="inherit" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/products">
                            Products
                        </Button>
                    </Box>

                    {/* Right Side Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Cart Icon */}
                        <IconButton
                            size="large"
                            color="inherit"
                            component={Link}
                            to="/cart"
                            aria-label={`cart with ${cart?.totalItems || 0} items`}
                        >
                            <Badge badgeContent={cart?.totalItems || 0} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <>
                                <IconButton
                                    size="large"
                                    color="inherit"
                                    component={Link}
                                    to="/profile"
                                    aria-label="account"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/register"
                                    sx={{ ml: 1 }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;