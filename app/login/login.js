"use client";

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  document.title = 'Login | Pantry Tracker';
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with email:", error);
      setError(error.message || "Failed to sign in. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  if (loading) {
    return <Box mt={4}><Typography>Loading...</Typography></Box>;
  }

  if (user) {
    return <Box mt={4}><Typography>Redirecting to dashboard...</Typography></Box>;
  }

  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" mb={2}>Login</Typography>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <form onSubmit={handleEmailLogin} style={{ width: '100%', maxWidth: '300px' }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Login with Email
        </Button>
      </form>
      <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} sx={{ mt: 2, maxWidth: '300px' }}>
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;