# Build stage
FROM node:24-bookworm AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Production stage
FROM node:24-bookworm

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/main"]
