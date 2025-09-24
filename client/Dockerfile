FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY COPY package.json ./

# Debug: show what we copied
RUN find /app -name "package.json" -o -name "package-lock.json" | head -10
RUN pwd && ls -la

# Install and build
RUN npm install
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
