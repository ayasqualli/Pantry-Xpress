import { createTheme, ThemeOptions } from '@mui/material/styles';

const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#ff1456', // Vibrant pink
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fcf4e8', // Light cream
      contrastText: '#000000',
    },
    background: {
      default: '#fcf4e8', // Light cream
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#4a4a4a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;