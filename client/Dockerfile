# client/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copy only dependency manifests first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client app
COPY . .

# Build the Vite app
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]