# Use Bun’s official image
FROM oven/bun:1.2.16

# 1) Set working dir
WORKDIR /app

# 2) Copy lockfile & package.json (for cache)
COPY bun.lock .

COPY backend/trpc/package.json package.json

# 3) Install prod deps
RUN bun install

# 4) Copy backend code *into /app*, preserving its src/
COPY backend/trpc .

# 5) Build from entrypoint at /app/src/main.ts
RUN bun build \
    --entrypoints src/main.ts \
    --outdir dist \
    --target bun \
    --minify

# 6) Expose & run
EXPOSE 80

HEALTHCHECK --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD curl -f http://localhost/health || exit 1

CMD ["bun", "run", "dist/main.js"]