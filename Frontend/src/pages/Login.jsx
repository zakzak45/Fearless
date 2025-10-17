import { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    Alert,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { userAPI } from '../api';
import { useAuthStore } from '../store/authStore';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            const response = await userAPI.login(data);

            if (response.success) {
                setAuth(response.data, response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                        Login to your Fearless account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            margin="normal"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link component={RouterLink} to="/register" underline="hover">
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;