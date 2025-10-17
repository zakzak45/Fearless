import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Tab,
    Tabs,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { Person, ShoppingBag, Security } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { api } from '../api';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [tabValue, setTabValue] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        address: '',
        phone: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || '',
                email: user.email || '',
                address: user.address || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.put('/users/profile', profileData);
            updateUser(response.data.data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
                My Account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Grid container spacing={4}>
                {/* Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                margin: '0 auto',
                                mb: 2,
                                bgcolor: 'primary.main',
                                fontSize: 40,
                            }}
                        >
                            {user?.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                            {user?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email}
                        </Typography>
                        <Chip
                            label={user?.role === 'admin' ? 'Admin' : 'Customer'}
                            color={user?.role === 'admin' ? 'error' : 'primary'}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={9}>
                    <Paper>
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab icon={<Person />} label="Profile" />
                            <Tab icon={<Security />} label="Security" />
                            <Tab icon={<ShoppingBag />} label="Orders" />
                        </Tabs>

                        {/* Profile Tab */}
                        {tabValue === 0 && (
                            <Box component="form" onSubmit={handleProfileUpdate} sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Profile Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Username"
                                            value={profileData.username}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, username: e.target.value })
                                            }
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            multiline
                                            rows={3}
                                            value={profileData.address}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, address: e.target.value })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, phone: e.target.value })
                                            }
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ mt: 3 }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        )}

                        {/* Security Tab */}
                        {tabValue === 1 && (
                            <Box component="form" onSubmit={handlePasswordChange} sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Change Password
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                    }
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    type="password"
                                    label="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                    }
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                    }
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? 'Changing Password...' : 'Change Password'}
                                </Button>
                            </Box>
                        )}

                        {/* Orders Tab */}
                        {tabValue === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Order History
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Card>
                                    <CardContent>
                                        <Typography variant="body1" color="text.secondary" align="center">
                                            No orders yet. Start shopping to see your order history here!
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;