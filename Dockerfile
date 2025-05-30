FROM node:20-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
EXPOSE 3000

# Build the image in two stages: builder and production
FROM base AS builder
WORKDIR /app

# Copy package.json y package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build of the Next.js application
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy package.json y package-lock.json
COPY --from=builder /app/package.json ./

# Copy package-lock.json
COPY --from=builder /app/node_modules ./node_modules

# Copy built Next.js application
COPY --from=builder /app/.next ./.next

# Copy public directory
COPY --from=builder /app/public ./public

# Create a non-root user and group
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

CMD ["npm", "start"]
