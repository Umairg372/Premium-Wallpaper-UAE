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

  // Try to get the actual backend port from a temporary file, fallback to default
  let backendPort = parseInt(env.BACKEND_PORT || '5001', 10);
  const portFile = path.join(__dirname, 'temp-backend-port.txt');

  if (fs.existsSync(portFile)) {
    const actualPort = fs.readFileSync(portFile, 'utf8').trim();
    backendPort = parseInt(actualPort, 10);
  }

  console.log(`Vite Proxy: Proxying API requests to http://localhost:${backendPort}`);

  return {
    server: {
      host: "::",
      port: vitePort, // Vite dev server port
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
        '/uploads': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
