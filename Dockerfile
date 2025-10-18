# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Astro project
RUN npm run build

# Stage 2 — Serve (lightweight image)
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built site
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies (Astro preview needs a few)
RUN npm ci --omit=dev

# Expose the default preview port
EXPOSE 4321

# Start Astro preview (serves static files)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
