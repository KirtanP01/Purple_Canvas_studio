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

# Run idempotent schema migration for painting_parties.child_age
echo "🗄️ Running DB migration: painting_parties.child_age -> VARCHAR(20)..."
if [ -f .env ]; then
	set -a
	source .env
	set +a
fi

if ! command -v psql >/dev/null 2>&1; then
	echo "❌ psql command not found. Install PostgreSQL client tools before deployment."
	exit 1
fi

export PGPASSWORD="${DB_PASSWORD:-}"
psql -v ON_ERROR_STOP=1 \
	-h "${DB_HOST:-localhost}" \
	-p "${DB_PORT:-5432}" \
	-U "${DB_USER:-postgres}" \
	-d "${DB_NAME:-purple_canvas_studio}" \
	-f db/migrate_painting_parties_child_age_to_varchar.sql
unset PGPASSWORD

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
