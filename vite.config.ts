import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import detectPort from 'detect-port';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const vitePort = parseInt(env.VITE_PORT || '3000', 10);
  const preferredBackendPort = parseInt(env.BACKEND_PORT || '5001', 10);
  const actualBackendPort = await detectPort(preferredBackendPort);

  if (actualBackendPort !== preferredBackendPort) {
    console.log(`Vite Proxy: Port ${preferredBackendPort} was in use, will proxy API requests to ${actualBackendPort}.`);
  }

  return {
    server: {
      host: "::",
      port: vitePort, // Vite dev server port
      proxy: {
        '/api': {
          target: `http://localhost:${actualBackendPort}`,
          changeOrigin: true,
        },
        '/uploads': {
          target: `http://localhost:${actualBackendPort}`,
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
