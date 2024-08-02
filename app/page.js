"use client";

import { Container, Typography, Button, Box, Paper, useTheme, useMediaQuery } from "@mui/material";
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = 'Home | Pantry Tracker';
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      background: theme.palette.background.default,
    }}>
      <Paper elevation={6} sx={{ 
        p: { xs: 3, md: 6 }, 
        width: '100%',
        background: theme.palette.background.paper,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center',
          gap: 4,
        }}>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.primary.main,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              mb: 2,
            }}>
              Welcome to Pantry Xpress
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: theme.palette.text.secondary,
              mb: 3,
            }}>
              Manage your pantry with ease and efficiency
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, color: theme.palette.text.primary }}>
              Pantry Xpress is your ultimate solution for keeping track of your food inventory,
              reducing waste, and simplifying your grocery shopping experience.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}>
              <Button 
                variant="contained" 
                component={Link} 
                href="/login" 
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                component={Link} 
                href="/register" 
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: { xs: '300px', md: '400px' },
            width: '100%',
          }}>
            <Image
              src="/Pantry-Xpress.png"
              alt="Pantry Xpress Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}