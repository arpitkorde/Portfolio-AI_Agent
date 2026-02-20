# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# Declare the build argument
ARG VITE_GEMINI_API_KEY
# Set the environment variable so Vite can pick it up
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Cloud Run expects PORT env var, but nginx.conf is hardcoded to 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
