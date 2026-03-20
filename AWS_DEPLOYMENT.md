# AWS Deployment Guide for Purple Canvas Studio

## Prerequisites
- AWS Account with EC2 instance running
- EC2 instance: `ec2-18-206-228-28.compute-1.amazonaws.com`
- SSH access to the EC2 instance
- PostgreSQL database (RDS or on EC2)

## Step 1: Prepare Your EC2 Instance

### Connect to EC2
```bash
ssh -i your-key.pem ec2-user@ec2-18-206-228-28.compute-1.amazonaws.com
```

### Install Required Software
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL (if not using RDS)
sudo yum install -y postgresql postgresql-server postgresql-devel

# Install Git
sudo yum install -y git

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo yum install -y nginx
```

## Step 2: Set Up PostgreSQL Database

### If using PostgreSQL on EC2:
```bash
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE purple_canvas_studio;
CREATE USER admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE purple_canvas_studio TO admin;
\q
```

### If using AWS RDS:
- Create a PostgreSQL RDS instance in AWS Console
- Note the endpoint, username, and password
- Update security groups to allow connections from EC2

## Step 3: Deploy Backend

### Clone and Setup
```bash
cd /home/ec2-user
git clone your-repo-url purple_canvas_studio
cd purple_canvas_studio/backend

# Install dependencies
npm install

# Copy production environment file
cp .env.production .env

# Edit .env with actual database credentials
nano .env

# Load database env vars for migration commands
set -a
source .env
set +a

# Run database migrations (release order)
npx ts-node src/migrate-payments.ts
PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f db/migrate_painting_parties_child_age_to_varchar.sql

# Build TypeScript
npm run build
```

### Start Backend with PM2
```bash
# Start the backend
pm2 start dist/app.js --name "purple-canvas-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 4: Deploy Frontend

```bash
cd /home/ec2-user/purple_canvas_studio/frontend

# Install dependencies
npm install

# Build for production
npm run build -- --configuration production

# The build output will be in dist/Purple_Canvas_studio
```

## Step 5: Configure Nginx

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/conf.d/purple-canvas.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name ec2-18-206-228-28.compute-1.amazonaws.com;

    # Frontend
    location / {
        root /home/ec2-user/purple_canvas_studio/frontend/dist/Purple_Canvas_studio;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 6: Configure AWS Security Groups

Ensure your EC2 security group allows:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS - for future SSL)
- Port 5432 (PostgreSQL) - only from EC2 instance IP if using RDS

## Step 7: Update Frontend API URL

Update the proxy configuration or environment to point to the AWS backend:

In `frontend/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Step 8: Test the Deployment

Visit: `http://ec2-18-206-228-28.compute-1.amazonaws.com`

Test:
1. Homepage loads
2. Navigate to booking pages
3. Submit a booking form
4. Complete PayPal payment (PRODUCTION payments will charge real money!)

## Step 9: Monitor & Maintain

```bash
# View backend logs
pm2 logs purple-canvas-backend

# Restart backend
pm2 restart purple-canvas-backend

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Step 10: Set Up SSL (Recommended for Production)

```bash
# Install certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name, not IP)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Important Notes

### ⚠️ CRITICAL: PayPal Production Mode
- You've switched to **PRODUCTION PayPal credentials**
- **Real money will be charged** to customers
- Test thoroughly before going live
- Consider keeping sandbox for testing, switch to production only when ready

### Database Backups
```bash
# Backup database
pg_dump -U admin purple_canvas_studio > backup_$(date +%Y%m%d).sql

# Restore database
psql -U admin purple_canvas_studio < backup_20251231.sql
```

### Environment Variables
Never commit `.env` or `.env.production` to Git. These contain sensitive credentials.

## Troubleshooting

### Backend won't start
```bash
pm2 logs purple-canvas-backend
# Check database connection
# Verify .env variables
```

### Frontend 404 errors
```bash
# Check Nginx configuration
sudo nginx -t
sudo systemctl restart nginx
```

### Database connection errors
```bash
# Test database connection
psql -h your-db-host -U admin -d purple_canvas_studio
```

## Deployment Script

Create `deploy.sh` for easy updates:
```bash
#!/bin/bash
cd /home/ec2-user/purple_canvas_studio
git pull
cd backend
npm install

# Load DB credentials and run release-order migrations
set -a
source .env
set +a
npx ts-node src/migrate-payments.ts
PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f db/migrate_painting_parties_child_age_to_varchar.sql

npm run build
pm2 restart purple-canvas-backend
cd ../frontend
npm install
npm run build -- --configuration production
sudo systemctl reload nginx
```

Make executable:
```bash
chmod +x deploy.sh
```

Run updates:
```bash
./deploy.sh
```
