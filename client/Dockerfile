# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application in preview mode (production)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
