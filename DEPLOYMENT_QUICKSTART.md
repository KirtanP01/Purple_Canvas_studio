# 🚀 Quick AWS Deployment Guide

## ✅ What's Been Updated

1. **PayPal**: Switched to **PRODUCTION** credentials
   - Client ID: `AfuuTRgOsH2964InMYq6Or9DEC53KGK33MXoUBSvr2bSswAs1B4mU5UnxR1Xyis_rQbo3igSGHYw9aq9`
   - ⚠️ **WARNING**: Real payments will be charged!

2. **Frontend**: Updated to use production PayPal
3. **Backend**: Created `.env.production` file
4. **Deployment**: Created AWS deployment scripts and documentation

## 🎯 Quick Deploy Steps

### 1. Connect to Your EC2 Instance
```bash
ssh -i your-key.pem ec2-user@ec2-18-206-228-28.compute-1.amazonaws.com
```

### 2. Upload Your Code
```bash
# Option A: Using Git (recommended)
git clone your-repo-url purple_canvas_studio

# Option B: Using SCP from your local machine
scp -i your-key.pem -r "Purple_Canvas_studio" ec2-user@ec2-18-206-228-28.compute-1.amazonaws.com:~/
```

### 3. Follow the Full Deployment Guide
See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for complete step-by-step instructions.

## 📋 Files Created for Deployment

- `backend/.env.production` - Production environment configuration
- `frontend/src/environments/environment.prod.ts` - Production API endpoint
- `AWS_DEPLOYMENT.md` - Complete deployment instructions
- `deploy.sh` - Quick deployment script for updates
- `backend/.gitignore` - Prevents committing sensitive files

## ⚠️ IMPORTANT BEFORE DEPLOYING

### 1. Test Locally First
The frontend now uses **PRODUCTION PayPal**. Test carefully!

### 2. Update Database Connection
Edit `backend/.env.production` with your AWS database details:
```env
DB_HOST=your-aws-rds-endpoint.rds.amazonaws.com
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
```

### 3. Run Database Migration
On AWS, run:
```bash
cd backend

# 1) Payments migration
npx ts-node src/migrate-payments.ts

# 2) painting_parties.child_age type alignment migration (idempotent)
set -a
source .env
set +a
PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f db/migrate_painting_parties_child_age_to_varchar.sql
```

### 4. Update CORS
In `backend/.env.production`, update:
```env
FRONTEND_URL=http://ec2-18-206-228-28.compute-1.amazonaws.com
```

Or if you have a domain:
```env
FRONTEND_URL=https://www.purplecanvasstudio.com
```

## 🧪 Testing Production PayPal

**CRITICAL**: Production PayPal charges real money!

### Test Checklist:
- [ ] Use a small test amount first
- [ ] Verify PayPal account receives payment
- [ ] Check database records are created correctly
- [ ] Test cancellation flow
- [ ] Test error handling

### Recommended Approach:
1. Keep sandbox credentials for testing environment
2. Use production only on live AWS deployment
3. Consider having separate staging environment

## 🔄 Switching Between Sandbox and Production

### To switch back to Sandbox (for testing):

**Backend** (`backend/.env`):
```env
PAYPAL_CLIENT_ID=Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv
PAYPAL_CLIENT_SECRET=EHLUGBXyRmcWNeN_ZdFHOe7gDKnueuh1meSktKsyZZTOkLYZMM-LEWt76echsV4XoiZFcFCGe96SrnyY
```

**Frontend** (all booking components):
```typescript
private readonly PAYPAL_CLIENT_ID = 'Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv';
```

## 📞 Support Checklist

Before going live:
- [ ] Test all booking forms
- [ ] Test all PayPal payment flows
- [ ] Verify email notifications work (if implemented)
- [ ] Check booking confirmations are saved
- [ ] Test on mobile devices
- [ ] Set up monitoring/alerts
- [ ] Have backup/recovery plan
- [ ] Document customer support process

## 🛠️ Quick Commands Reference

```bash
# View backend logs
pm2 logs purple-canvas-backend

# Restart backend
pm2 restart purple-canvas-backend

# Rebuild frontend
cd frontend && npm run build -- --configuration production

# Check Nginx status
sudo systemctl status nginx

# View Nginx errors
sudo tail -f /var/log/nginx/error.log

# Database backup
pg_dump -U admin purple_canvas_studio > backup.sql
```

## 📈 Next Steps After Deployment

1. **Get a domain name** (recommended)
2. **Set up SSL certificate** (required for production)
3. **Configure email notifications**
4. **Set up monitoring** (CloudWatch, etc.)
5. **Create backup strategy**
6. **Add error tracking** (Sentry, etc.)

## 🆘 Troubleshooting

### PayPal button not showing
- Check browser console for errors
- Verify Client ID is correct
- Check network tab for blocked requests

### Backend connection errors
- Check security groups allow port 5000
- Verify backend is running: `pm2 status`
- Check logs: `pm2 logs purple-canvas-backend`

### Database errors
- Verify connection string in `.env.production`
- Check migrations ran successfully
- Test direct database connection

---

**Need help?** See the full [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) guide.
