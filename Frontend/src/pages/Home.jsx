import { Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();

    const categories = [
        {
            title: 'Men',
            image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500',
            path: '/products?gender=men',
        },
        {
            title: 'Women',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
            path: '/products?gender=women',
        },
        {
            title: 'Kids',
            image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500',
            path: '/products?gender=kids',
        },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                        Be Fearless. Be You.
                    </Typography>
                    <Typography variant="h5" paragraph>
                        Discover premium clothing that defines your style
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/products')}
                        sx={{ mt: 2 }}
                    >
                        Shop Now
                    </Button>
                </Container>
            </Box>

            {/* Categories Section */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
                    Shop by Category
                </Typography>
                <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                    Find your perfect style
                </Typography>

                <Grid container spacing={4}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.title}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 8,
                                    },
                                }}
                                onClick={() => navigate(category.path)}
                            >
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={category.image}
                                    alt={category.title}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="h3" textAlign="center" fontWeight="bold">
                                        {category.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Features Section */}
            <Box sx={{ bgcolor: 'background.default', py: 8 }}>
                <Container>
                    <Grid container spacing={4} textAlign="center">
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                🚚 Free Shipping
                            </Typography>
                            <Typography color="text.secondary">
                                On orders over $100
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                🔄 Easy Returns
                            </Typography>
                            <Typography color="text.secondary">
                                30-day return policy
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                💳 Secure Payment
                            </Typography>
                            <Typography color="text.secondary">
                                100% secure transactions
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;