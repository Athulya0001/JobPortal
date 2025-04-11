import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import store from './Redux/store'
import './index.css'
import App from './App'
import { ThemeProvider } from './Context/ThemeContext';
import InitUser from './utils/InitUser';
import { JobProvider } from './Context/jobContext';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ClerkProvider publishableKey={clerkPubKey}>
          <Provider store={store}>
            <InitUser>
              <JobProvider>
                <App />
              </JobProvider>
            </InitUser>
          </Provider>
        </ClerkProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);