# Multi-stage Dockerfile for Node.js backend
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS production-deps
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S analytics -u 1001

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=analytics:nodejs /app/dist ./dist
COPY --from=build --chown=analytics:nodejs /app/package*.json ./
COPY --from=build --chown=analytics:nodejs /app/prisma ./prisma

USER analytics

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]