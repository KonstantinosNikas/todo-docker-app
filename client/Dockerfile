FROM node:18-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
RUN npm run build

EXPOSE 5173

# Start the application in preview mode (production)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
