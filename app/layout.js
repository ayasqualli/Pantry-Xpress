"use client";

import { SpeedInsights } from "@vercel/speed-insights/next"  // Speed analytics for Vercel Deployement

import "./globals.css"
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Button, Container, Paper, Box, Image } from "@mui/material";
import Link from 'next/link';
import { Inter } from 'next/font/google'
import Head from 'next/head';
import theme from './theme';

const inter = Inter({ subsets: ['latin'] })

const Layout = ({ children }) => {
  return (
    <html>
      <Head>
        <title>Pantry Xpress</title>
        <meta name="description" content="Manage your pantry with ease" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Pantry Xpress
              </Typography>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
            </Toolbar>
          </AppBar>
          <Container>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
