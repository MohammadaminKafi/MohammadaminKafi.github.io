# syntax=docker/dockerfile:1

FROM node:22.23.2-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS dev
COPY . .
EXPOSE 4321
CMD ["npm", "run", "dev"]

FROM base AS test
COPY . .
CMD ["npm", "run", "check"]

FROM mcr.microsoft.com/playwright:v1.62.1-noble AS e2e
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "test:e2e"]

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS preview
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
