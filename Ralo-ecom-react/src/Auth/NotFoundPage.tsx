// src/components/NotFoundPage.tsx
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material'; // Import an icon for the home button

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh', // Take up most of the viewport height
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom
                    sx={{
                        fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                        fontWeight: 'bold',
                        color: 'error.main', // Using Material-UI's error color
                    }}
                >
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom
                    sx={{ mb: 3, color: 'text.secondary' }}
                >
                    Page Not Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 5, maxWidth: 500 }}>
                    We're sorry, the page you requested could not be found. Please check the URL or return to the homepage.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGoHome}
                    startIcon={<HomeIcon />}
                >
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;