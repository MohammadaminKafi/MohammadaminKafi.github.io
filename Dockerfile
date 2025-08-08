# syntax=docker/dockerfile:1

# Base layer with dependencies installed
FROM node:20-alpine AS base
WORKDIR /app

# Install deps first for better Docker layer caching
COPY package*.json ./
RUN npm install --loglevel verbose

# Copy the rest of the project
COPY . .

# Expose dev port
EXPOSE 4321

# Development target (hot reload)
FROM base AS dev
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true
# "-- --host" ensures the dev server binds to 0.0.0.0 inside the container
CMD ["npm","run","dev"]

# Build target
FROM base AS build
RUN npm run build

# Production image: serve static files with Nginx
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]