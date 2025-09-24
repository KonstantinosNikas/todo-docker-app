# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Build arg για να υποστηρίξουμε διαφορετικά contexts
ARG PACKAGE_PATH=.

# 1) Φέρνουμε μόνο τα package αρχεία για καλύτερο cache
COPY ${PACKAGE_PATH}/package*.json ./

# 2) Εγκατάσταση deps (χρησιμοποίησε npm install αν δεν έχεις package-lock.json)
RUN npm install

# 3) Τώρα φέρνουμε όλο τον κώδικα
COPY ${PACKAGE_PATH}/ ./

# 4) Build
RUN npm run build

# 5) Render: άσε τη θύρα να έρθει από το περιβάλλον
ENV PORT=8080
EXPOSE 8080

# 6) Vite preview να ακούει στο $PORT
CMD ["npm","run","preview","--","--host","0.0.0.0","--port","$PORT"]
