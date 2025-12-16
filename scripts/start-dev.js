import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preferredPort = 5001;

// Function to start backend and get the actual port it runs on
function startBackend() {
  return new Promise((resolve, reject) => {
    // Create a temporary file to store the actual port
    const portFile = path.join(__dirname, '../temp-backend-port.txt');

    // Start the backend server
    const backend = spawn('node', ['server/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, BACKEND_PORT: preferredPort.toString() }
    });

    // Listen for backend server start message
    backend.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);

      // Look for the port in the server output
      const portMatch = output.match(/Server is running on http:\/\/localhost:(\d+)/);
      if (portMatch) {
        const actualPort = parseInt(portMatch[1]);
        console.log(`Backend server is running on port: ${actualPort}`);

        // Write the actual port to a temporary file
        fs.writeFileSync(portFile, actualPort.toString());
        resolve({ actualPort, backendProcess: backend });
      }
    });

    backend.stderr.on('data', (data) => {
      process.stderr.write(`Backend: ${data}`);
    });

    backend.on('error', (err) => {
      console.error('Backend spawn error:', err);
      reject(err);
    });

    backend.on('close', (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Backend process exited with code ${code}`));
      }
    });
  });
}

// Main function to start both servers
async function startDevServers() {
  try {
    console.log('Starting backend server...');
    const { actualPort, backendProcess } = await startBackend();

    // Small delay to ensure backend is fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Starting frontend with proxy to backend port: ${actualPort}`);

    // Start the frontend with the actual backend port using a child process
    // This allows the Vite config to read the temp file and use the correct port
    const frontend = spawn('npx', ['vite'], {
      stdio: 'inherit',
      env: { ...process.env, BACKEND_PORT: actualPort.toString(), PORT: '3000' },
      shell: true  // Use shell to properly execute npx on Windows
    });

    frontend.on('error', (err) => {
      console.error('Frontend spawn error:', err);
    });

    // Keep the script running while both processes are alive
    frontend.on('close', (code) => {
      console.log(`Frontend process exited with code ${code}`);
      process.exit(code || 0);
    });

  } catch (error) {
    console.error('Error starting development servers:', error);
    process.exit(1);
  }
}

startDevServers();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down development servers...');
  // Clean up temp file
  const portFile = path.join(__dirname, '../temp-backend-port.txt');
  if (fs.existsSync(portFile)) {
    fs.unlinkSync(portFile);
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down development servers...');
  // Clean up temp file
  const portFile = path.join(__dirname, '../temp-backend-port.txt');
  if (fs.existsSync(portFile)) {
    fs.unlinkSync(portFile);
  }
  process.exit(0);
});