module.exports = {
  apps: [
    {
      name: "boozebunk-backend",
      // 👇 Pointing to the minified production build file
      script: "backend/trpc/dist/main.js", 
      // 👇 Running it on port 80 as your Docker container exposed
      args: "--port 8080", 
      interpreter: "bun",
      watch: false,
      // Sets the base execution directory to your trpc workspace
      cwd: '/home/booze/frontend/Boozebunk-web',
      // 👇 Points directly to your backend's .env file
      env_file: '/home/booze/frontend/Boozebunk-web/backend/trpc/.env', 
      env: {
        NODE_ENV: "production",
        // 👇 Replicating Docker's explicit pointer to the host system CA bundle
        // SSL_CERT_FILE: "/etc/ssl/certs/ca-certificates.crt"
      }
    },
    {
      name: "boozebunk-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start frontend/next --port 3000", 
      interpreter: "bun", 
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};