module.exports = {
  apps: [
    {
      name: "boozebunk-backend",
      script: "backend/trpc/src/main.ts", // Path to your backend entry point
      interpreter: "bun",                // Tells PM2 to run via Bun runtime
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "boozebunk-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start frontend/next --port 3000",  // Serves the built Next.js app
      interpreter: "bun",                       // Using bun to serve or standard node
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};