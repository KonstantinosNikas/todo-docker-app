# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application in preview mode (production)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
