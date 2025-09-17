import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider
        appearance={{
          variables: {
            colorBackground: '#1A1F2B', // Clerk card background
            colorText: '#E2E8F0', // Main text
            colorInputBackground: '#111827', // Input fields
            colorInputText: '#E2E8F0',
            colorPrimary: '#6C63FF', // Clerk uses this in some buttons
          },
          elements: {
            formButtonPrimary: {
              backgroundColor: '#6C63FF',
              color: '#E2E8F0',
              '&:hover, &:focus, &:active': {
                backgroundColor: '#7B6CFF',
              },
            },
          },
        }}
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        signInUrl="/signin"
        signUpUrl="/signup"
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
