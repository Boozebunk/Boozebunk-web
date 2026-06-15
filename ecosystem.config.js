module.exports = {
  apps: [
    {
      name: "boozebunk-backend",
      script: "backend/trpc/src/main.ts",
      args: "--port 8080", 
      interpreter: "bun",
      watch: false,
      cwd: '/home/booze/frontend/Boozebunk-web',
      // 👇 This tells PM2 to read this file and inject its variables into Bun
      env_file: '/home/booze/frontend/Boozebunk-web/backend/trpc/.env', 
      env: {
        NODE_ENV: "production"
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