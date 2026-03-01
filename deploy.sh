#!/bin/bash
# Quick Deployment Script for Purple Canvas Studio

echo "🚀 Starting deployment to AWS..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Deploy Backend
echo "🔧 Building and deploying backend..."
cd backend
npm install --production
npm run build
pm2 restart purple-canvas-backend || pm2 start dist/app.js --name "purple-canvas-backend"
cd ..

# Deploy Frontend
echo "🎨 Building and deploying frontend..."
cd frontend
npm install
npm run build -- --configuration production
cd ..

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Visit: http://ec2-18-206-228-28.compute-1.amazonaws.com"

# Show backend logs
echo "📊 Backend logs:"
pm2 logs purple-canvas-backend --lines 20
