FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite app
RUN npm run build

# Expose the port Vite preview uses
EXPOSE 5173

# Run the app in preview mode
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]