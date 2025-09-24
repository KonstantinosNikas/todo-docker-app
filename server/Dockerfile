# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies using npm ci for production builds
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
