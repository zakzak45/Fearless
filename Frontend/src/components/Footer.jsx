import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            FEARLESS
                        </Typography>
                        <Typography variant="body2">
                            Premium clothing brand for the bold and fearless.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/products" color="inherit" underline="hover">
                                Products
                            </Link>
                            <Link href="/about" color="inherit" underline="hover">
                                About Us
                            </Link>
                            <Link href="/contact" color="inherit" underline="hover">
                                Contact
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Follow Us
                        </Typography>
                        <Box>
                            <IconButton color="inherit" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="YouTube">
                                <YouTube />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} Fearless. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;