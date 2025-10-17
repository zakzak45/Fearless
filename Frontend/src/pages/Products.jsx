import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Pagination,
    CircularProgress,
    Rating,
    IconButton,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        category: '',
        gender: '',
        sort: 'newest',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        fetchProducts();
    }, [page, filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                ...filters,
            };
            const response = await api.get('/products', { params });
            setProducts(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && products.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Typography variant="h3" gutterBottom fontWeight="bold">
                Shop All Products
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={filters.category}
                                label="Category"
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="shirts">Shirts</MenuItem>
                                <MenuItem value="pants">Pants</MenuItem>
                                <MenuItem value="dresses">Dresses</MenuItem>
                                <MenuItem value="jackets">Jackets</MenuItem>
                                <MenuItem value="shoes">Shoes</MenuItem>
                                <MenuItem value="accessories">Accessories</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={filters.gender}
                                label="Gender"
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="men">Men</MenuItem>
                                <MenuItem value="women">Women</MenuItem>
                                <MenuItem value="unisex">Unisex</MenuItem>
                                <MenuItem value="kids">Kids</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={filters.sort}
                                label="Sort By"
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                <MenuItem value="rating">Highest Rated</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Min Price"
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Max Price"
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Products Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : products.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="text.secondary">
                        No products found
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={
                                                product.images?.[0]?.url ||
                                                'https://via.placeholder.com/300x400?text=No+Image'
                                            }
                                            alt={product.name}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        />
                                        {product.discountPrice && (
                                            <Chip
                                                label={`-${Math.round(
                                                    ((product.price - product.discountPrice) / product.price) * 100
                                                )}%`}
                                                color="error"
                                                size="small"
                                                sx={{ position: 'absolute', top: 10, right: 10 }}
                                            />
                                        )}
                                        <IconButton
                                            sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'white' }}
                                            size="small"
                                        >
                                            <FavoriteBorder />
                                        </IconButton>
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { color: 'primary.main' },
                                            }}
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {product.brand}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Rating value={product.rating?.average || 0} readOnly size="small" />
                                            <Typography variant="caption" color="text.secondary">
                                                ({product.rating?.count || 0})
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {product.discountPrice ? (
                                                <>
                                                    <Typography variant="h6" color="error" fontWeight="bold">
                                                        ${product.discountPrice.toFixed(2)}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ textDecoration: 'line-through' }}
                                                    >
                                                        ${product.price.toFixed(2)}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography variant="h6" fontWeight="bold">
                                                    ${product.price.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>

                                    <CardActions>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<ShoppingCart />}
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Products;