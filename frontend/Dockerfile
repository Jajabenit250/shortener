FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "dev"]

# Production build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build application
RUN npm run build

# Production image
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy production dependencies and built app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./

# Expose port
EXPOSE 3000

# Start in production mode
CMD ["npm", "start"]
