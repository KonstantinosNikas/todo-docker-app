# Todo Docker App

A full-stack todo application built with React (frontend), Node.js/Express (backend), and PostgreSQL (database), containerized with Docker and deployed on Render.

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: CSS modules
- **Port**: 8080 (production) / 5173 (development)
- **Container**: Node.js 20 Alpine

### Backend (Server)
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with pg library
- **Port**: 4000
- **Container**: Node.js 18 Alpine
- **Features**: 
  - CORS enabled for cross-origin requests
  - Health check endpoint
  - Graceful shutdown handling
  - Database connection retry logic

### Database
- **Type**: PostgreSQL 15
- **Tables**: `todos` (id, text, created_at)
- **Connection**: SSL-enabled for production

## 📁 Project Structure

```
todo-docker-app/
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Styling
│   │   └── main.jsx           # React entry point
│   ├── public/
│   ├── Dockerfile             # Frontend container config
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── server/                     # Node.js backend
│   ├── index.js               # Express server with API endpoints
│   ├── Dockerfile             # Backend container config
│   └── package.json           # Backend dependencies
├── .github/workflows/
│   └── deploy.yml             # CI/CD pipeline for automated deployment
├── docker-compose.yml         # Local development setup
├── RENDER_DEPLOYMENT.md       # Detailed deployment guide
└── README.md                  # This file
```

## 🚀 API Endpoints

### Health Check
- `GET /health` - Check database connection and server status

### Todo Operations
- `GET /todos` - Fetch all todos (ordered by newest first)
- `POST /todos` - Create a new todo
  ```json
  { "text": "Your todo text here" }
  ```
- `DELETE /todos/:id` - Delete a specific todo by ID

## 🛠️ Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Local Development with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/KonstantinosNikas/todo-docker-app.git
   cd todo-docker-app
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000
   - Database: localhost:5432

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Local Development without Docker

1. **Start PostgreSQL database**
   ```bash
   # Using Docker for just the database
   docker run -d --name postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=tododb \
     -p 5432:5432 postgres:15
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Frontend setup** (in another terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🌐 Production Deployment

### Automated Deployment (Recommended)

The project uses GitHub Actions for continuous deployment to Render:

1. **Push to main branch** triggers automatic deployment
2. **Docker images** are built and pushed to GitHub Container Registry
3. **Render services** are automatically updated with new images

### Manual Deployment

For manual deployment instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

## 🔧 Environment Variables

### Backend (.env or Render environment)
```bash
DATABASE_URL=postgresql://username:password@host:5432/database
NODE_ENV=production
PORT=4000
```

### Frontend (Render environment)
```bash
PORT=8080
```

## 🐳 Docker Configuration

### Multi-Stage Builds
- **Frontend**: Builds with Vite, serves with preview mode
- **Backend**: Production-optimized with only necessary dependencies
- **Database**: Official PostgreSQL image with health checks

### Build Arguments
The Dockerfile supports flexible build contexts:
```bash
# From repo root
docker build -f client/Dockerfile --build-arg PACKAGE_PATH=client -t frontend .

# From client directory
cd client && docker build -t frontend .
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **Checkout code** from repository
2. **Setup Docker Buildx** for multi-platform builds
3. **Login to GHCR** (GitHub Container Registry)
4. **Build & Push Backend** image with caching
5. **Build & Push Frontend** image with caching
6. **Trigger Render deployment** via webhook

### Image Naming Convention
- Backend: `ghcr.io/konstantinosnikas/todo-docker-app-backend:latest`
- Frontend: `ghcr.io/konstantinosnikas/todo-docker-app-frontend:latest`
- Tags: `latest` and commit SHA for versioning

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4000/health
```

### API Testing
```bash
# Get all todos
curl http://localhost:4000/todos

# Create a todo
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Test todo"}'

# Delete a todo (replace 1 with actual ID)
curl -X DELETE http://localhost:4000/todos/1
```

## 🔒 Security Features

- **CORS Configuration**: Allows requests only from authorized origins
- **SSL/TLS**: Database connections use SSL in production
- **Environment Variables**: Sensitive data stored securely
- **Health Checks**: Docker containers monitor their own health
- **Graceful Shutdown**: Proper cleanup on container termination

## 📊 Monitoring & Logging

### Application Logs
- Backend logs database connections and API requests
- Frontend logs build and runtime information
- Docker Compose shows all service logs together

### Health Monitoring
- `/health` endpoint for backend status
- Database connection retry logic with exponential backoff
- Docker health checks for all services

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL environment variable
   - Ensure PostgreSQL service is running
   - Verify network connectivity between services

2. **CORS Errors**
   - Update allowed origins in server/index.js
   - Check frontend URL configuration

3. **Docker Build Failures**
   - Clear Docker cache: `docker system prune -a`
   - Check Dockerfile syntax and file paths
   - Verify .dockerignore isn't excluding necessary files

4. **Port Conflicts**
   - Change ports in docker-compose.yml
   - Check for processes using the same ports

### Debug Commands
```bash
# Check running containers
docker ps

# View container logs
docker logs <container-name>

# Execute commands inside container
docker exec -it <container-name> sh

# Check Docker networks
docker network ls
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test locally
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Application**: [Deployed on Render](https://your-app-name.onrender.com)
- **Backend API**: [API Documentation](https://your-backend.onrender.com/health)
- **GitHub Repository**: [Source Code](https://github.com/KonstantinosNikas/todo-docker-app)
- **Docker Images**: [GitHub Container Registry](https://github.com/KonstantinosNikas/todo-docker-app/pkgs/container/todo-docker-app-backend)

---

**Built with ❤️ using React, Node.js, PostgreSQL, and Docker**