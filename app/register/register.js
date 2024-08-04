'use client'; // Client Component

import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Snackbar, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerWithEmailAndPassword, signInWithGoogle } from "../firebase-config";
import Layout from "../layout";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Register | Pantry Tracker';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      await registerWithEmailAndPassword(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Redirect to login page after successful registration
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box mt={5}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '20px' }}
            >
              Register
            </Button>
          </form>
          
          <Divider style={{ margin: '20px 0' }}>Or</Divider>
          
          <Button
            onClick={handleGoogleSignIn}
            variant="contained"
            color="secondary"
            fullWidth
            style={{ marginBottom: '10px' }}
          >
            Sign up with Google
          </Button>
        </Box>
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Registration successful! Redirecting to login..."
      />
    </Layout>
  );
};

export default Register;