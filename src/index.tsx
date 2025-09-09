import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme } from './theme/index';
import { validateSupabaseConfig, isSupabaseConfigured } from './config/supabase';
import App from './App';
import './index.css';

// Validate Supabase configuration on startup
if (isSupabaseConfigured()) {
  validateSupabaseConfig();
} else {
  console.warn('⚠️ Supabase is not configured. Please set REACT_APP_USE_SUPABASE_AUTH=true and add your Supabase credentials.');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

