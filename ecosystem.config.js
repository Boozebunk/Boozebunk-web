module.exports = {
  apps: [
    {
      name: "boozebunk-backend",
      script: "backend/trpc/src/main.ts",
      args: "--port 8080", // 👈 Passes --port 8080 to your script
      interpreter: "bun",
      watch: false,
      env: {
        // This forces PM2 to load your local .env file
        DOTENV_CONFIG_PATH: './.env' 
      }
    },
    {
      name: "boozebunk-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start frontend/next --port 3000", // Serves the built Next.js app
      interpreter: "bun", // Using bun to serve or standard node
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
