const { spawn } = require('child_process');
const net = require('net');

function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve);
    });
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}

async function startServer() {
  const port = await findAvailablePort(3000);
  console.log(`Starting server on port ${port}`);
  
  const child = spawn('react-scripts', ['start'], {
    env: { ...process.env, PORT: port },
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

startServer(); 