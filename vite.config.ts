import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const vitePort = parseInt(env.VITE_PORT || '3000', 10);

  // Determine if we're in development or production environment
  const isDevelopment = mode === 'development';

  let backendUrl;
  if (isDevelopment) {
    // In development, try to get the actual backend port from a temporary file, fallback to default
    let backendPort = parseInt(env.BACKEND_PORT || '5001', 10);
    const portFile = path.join(__dirname, 'temp-backend-port.txt');

    if (fs.existsSync(portFile)) {
      const actualPort = fs.readFileSync(portFile, 'utf8').trim();
      backendPort = parseInt(actualPort, 10);
    }
    backendUrl = `http://localhost:${backendPort}`;
  } else {
    // In production, use the production backend API URL
    // This should be set in your Vercel environment variables
    backendUrl = env.VITE_PROD_API_URL || 'https://your-backend-url.onrender.com';
  }

  console.log(`Vite Proxy: Proxying API requests to ${backendUrl}`);

  return {
    server: {
      host: "::",
      port: vitePort, // Vite dev server port
      proxy: isDevelopment ? {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
        },
      } : undefined, // No proxy in production since we'll use the actual API URL
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    define: {
      // Pass the production API URL to the frontend
      'process.env.VITE_PROD_API_URL': JSON.stringify(env.VITE_PROD_API_URL || 'https://your-backend-url.onrender.com'),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
