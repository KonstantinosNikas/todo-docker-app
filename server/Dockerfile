# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies for production
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
