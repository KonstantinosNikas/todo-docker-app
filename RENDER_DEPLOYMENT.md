# Render Deployment Guide

This guide explains how to deploy your Todo Docker App to Render.

## Prerequisites

1. A Render account (free tier available)
2. This repository pushed to GitHub
3. GitHub Actions workflow configured (already done)

## Step 1: Create PostgreSQL Database

1. Log into your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure your database:
   - **Name**: `todo-database` (or any name you prefer)
   - **Database**: `tododb`
   - **User**: `postgres` (default)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for testing
4. Click **"Create Database"**
5. **Important**: Copy the **Internal Database URL** from the database info page
   - Format: `postgresql://username:password@hostname:port/database`
   - Example: `postgresql://postgres:password123@dpg-xyz123-a:5432/tododb`

## Step 2: Create Backend Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image from a registry"**
3. Configure the service:
   - **Image URL**: `ghcr.io/konstantinosnikas/todo-docker-app-backend:latest`
   - **Name**: `todo-backend`
   - **Region**: Same as your database
   - **Plan**: Free tier is fine
   - **Port**: `4000`

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   DATABASE_URL = [paste your Internal Database URL from Step 1]
   PORT = 4000
   NODE_ENV = production
   ```

5. Click **"Create Web Service"**

## Step 3: Create Frontend Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image from a registry"**
3. Configure the service:
   - **Image URL**: `ghcr.io/konstantinosnikas/todo-docker-app-frontend:latest`
   - **Name**: `todo-frontend`
   - **Region**: Same as your backend
   - **Plan**: Free tier is fine
   - **Port**: `5173`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://[your-backend-service-name].onrender.com
   ```
   Replace `[your-backend-service-name]` with your actual backend service URL

5. Click **"Create Web Service"**

## Step 4: Update CORS Settings

After your backend is deployed, update the allowed origins in `server/index.js`:

```javascript
const allowed = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost',
  'https://[your-frontend-service-name].onrender.com', // Add your frontend URL
]);
```

## Step 5: Set Up Deploy Hook (Optional)

To enable automatic deployments from GitHub Actions:

1. In your backend service, go to **Settings** → **Deploy Hook**
2. Copy the webhook URL
3. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
4. Add a new secret:
   - **Name**: `RENDER_DEPLOY_HOOK`
   - **Value**: [paste the webhook URL]

## Troubleshooting

### Database Connection Issues
- Ensure the `DATABASE_URL` environment variable is set correctly
- Use the **Internal Database URL**, not the external one
- Check that database and backend are in the same region

### CORS Errors
- Update the allowed origins in your backend code
- Redeploy after making changes

### Port Issues
- Backend should use port `4000`
- Frontend should use port `5173`
- Make sure the PORT environment variable is set

### Image Not Found
- Ensure your GitHub Actions workflow ran successfully
- Check that images were pushed to GitHub Container Registry
- Verify image names are lowercase

## Manual Deployment

If you need to deploy manually without GitHub Actions:

```bash
# Build and push images manually
docker build -t ghcr.io/konstantinosnikas/todo-docker-app-backend:latest ./server
docker build -t ghcr.io/konstantinosnikas/todo-docker-app-frontend:latest ./client

docker push ghcr.io/konstantinosnikas/todo-docker-app-backend:latest
docker push ghcr.io/konstantinosnikas/todo-docker-app-frontend:latest
```

Then trigger a redeploy in Render Dashboard.