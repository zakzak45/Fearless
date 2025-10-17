import { Container, Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    textAlign: 'center',
                }}
            >
                <SentimentDissatisfied sx={{ fontSize: 120, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h1" fontWeight="bold" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/')}>
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;