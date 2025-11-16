# ---- Stage 1: Build the Astro site (This stage is perfect, no changes needed) ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies using 'ci' for reproducible builds
RUN npm ci

# Copy the rest of the source code
COPY . .

# Pass in build-time secrets/arguments if needed
ARG VITE_SANITY_PROJECT_ID
ENV VITE_SANITY_PROJECT_ID=${VITE_SANITY_PROJECT_ID}

# Build the static site into the /app/dist directory
RUN npm run build

# ---- Stage 2: Serve the static files with Nginx (The Production Stage) ----
FROM nginx:stable-alpine

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built static files from the 'builder' stage into the Nginx webroot
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (the default Nginx port)
EXPOSE 80

# The default Nginx command will start the server automatically.
# CMD ["nginx", "-g", "daemon off;"] is the default and does not need to be specified.