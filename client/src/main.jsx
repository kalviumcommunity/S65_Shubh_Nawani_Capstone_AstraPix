import { scan } from "react-scan"; // must be imported before React and React DOM
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

scan({
  enabled: true,
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      retry: false // Disable retries
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);