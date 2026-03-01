# PayPal Integration - Implementation Checklist

## ☑️ Pre-Implementation (Done ✅)
- [x] Backend payment controller created
- [x] Backend routes configured
- [x] Database migration script created
- [x] Frontend PayPal service created
- [x] All booking components updated
- [x] Payment UI and styling added

## 📋 Your Action Items

### Step 1: Get PayPal Credentials
- [ ] Go to https://developer.paypal.com/
- [ ] Log in (or create account)
- [ ] Navigate to "My Apps & Credentials"
- [ ] Create new app or select existing
- [ ] Copy **Sandbox** Client ID
- [ ] Copy **Sandbox** Client Secret
- [ ] Save credentials securely

### Step 2: Configure Backend
- [ ] Open `backend/.env` file (create if doesn't exist)
- [ ] Add PayPal credentials:
  ```env
  PAYPAL_CLIENT_ID=your_sandbox_client_id_here
  PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
  NODE_ENV=development
  FRONTEND_URL=http://localhost:4200
  ```
- [ ] Save the file
- [ ] **IMPORTANT**: Make sure `.env` is in `.gitignore`

### Step 3: Run Database Migration
- [ ] Open terminal in project root
- [ ] Run migration:
  ```bash
  psql -U postgres -d your_database_name -f backend/db/add_payment_fields.sql
  ```
- [ ] Verify no errors
- [ ] Check tables updated with new columns

### Step 4: Update Frontend Components
- [ ] Open: `frontend/src/app/pages/art-class-booking/art-class-booking.component.ts`
- [ ] Find line 37 (in `loadPayPalScript()`)
- [ ] Replace `YOUR_PAYPAL_CLIENT_ID` with your actual Client ID
- [ ] Repeat for `birthday-party-booking.component.ts`
- [ ] Repeat for `painting-party-booking.component.ts`

### Step 5: Verify Pricing (Optional)
- [ ] Open: `frontend/src/app/config/pricing.config.ts`
- [ ] Confirm prices:
  - Art Class: $50.00
  - Birthday Party: $150.00
  - Painting Party: $100.00
- [ ] Adjust if needed

### Step 6: Test Backend
- [ ] Open terminal in `backend/` folder
- [ ] Run: `npm install` (if needed)
- [ ] Run: `npm start`
- [ ] Verify server starts without errors
- [ ] Check console for any warnings

### Step 7: Test Frontend
- [ ] Open terminal in `frontend/` folder
- [ ] Run: `npm install` (if needed)
- [ ] Run: `npm start`
- [ ] Verify compilation successful
- [ ] Open browser to http://localhost:4200

### Step 8: End-to-End Testing

#### Test Art Class Booking:
- [ ] Navigate to art class booking page
- [ ] Fill out the form completely
- [ ] Click "Continue to Payment"
- [ ] Verify booking created in database
- [ ] Verify PayPal button appears
- [ ] Click PayPal button
- [ ] Log in with sandbox test account
- [ ] Complete payment
- [ ] Verify success message
- [ ] Check database for payment details

#### Test Birthday Party Booking:
- [ ] Navigate to birthday party booking page
- [ ] Fill out the form
- [ ] Complete payment flow
- [ ] Verify in database

#### Test Painting Party Booking:
- [ ] Navigate to painting party booking page
- [ ] Fill out the form
- [ ] Complete payment flow
- [ ] Verify in database

### Step 9: Create PayPal Test Accounts
- [ ] Go to https://developer.paypal.com/dashboard/accounts
- [ ] Create a test "Personal" account (buyer)
- [ ] Note the email and password
- [ ] Use this account to test payments

### Step 10: Verify Database Updates
- [ ] Open your database client
- [ ] Check `art_classes` table for payment fields
- [ ] Check `birthday_parties` table
- [ ] Check `painting_parties` table
- [ ] Verify test payment data is saved correctly

### Step 11: Error Testing
- [ ] Test with invalid form data
- [ ] Test cancelled payment
- [ ] Test with network disconnected
- [ ] Verify error messages display correctly

### Step 12: Mobile Testing
- [ ] Open site on mobile device or browser dev tools
- [ ] Test booking form responsive design
- [ ] Test PayPal payment on mobile
- [ ] Verify everything works smoothly

## 🚀 Going to Production (When Ready)

### Get Live Credentials:
- [ ] In PayPal Developer Dashboard, switch to "Live"
- [ ] Copy Live Client ID
- [ ] Copy Live Client Secret

### Update Backend:
- [ ] Update `.env`:
  ```env
  PAYPAL_CLIENT_ID=your_live_client_id
  PAYPAL_CLIENT_SECRET=your_live_secret
  NODE_ENV=production
  FRONTEND_URL=https://yourdomain.com
  ```

### Update Frontend:
- [ ] Update Client ID in all 3 booking components
- [ ] Use **Live** Client ID instead of Sandbox

### Pre-Launch Testing:
- [ ] Test with very small real payment ($0.01 if possible)
- [ ] Verify payment processes correctly
- [ ] Check PayPal dashboard for transaction
- [ ] Verify database updates

### Security:
- [ ] Verify HTTPS enabled on production
- [ ] Confirm .env not in git repository
- [ ] Set up rate limiting if not already done
- [ ] Configure PayPal webhooks (recommended)

## 🆘 Troubleshooting

### PayPal Button Not Showing:
- [ ] Check browser console for errors
- [ ] Verify Client ID is correct
- [ ] Check if ad blocker is interfering
- [ ] Verify PayPal SDK loaded (check Network tab)

### Payment Not Capturing:
- [ ] Check backend logs for errors
- [ ] Verify PayPal credentials in .env
- [ ] Check database migration ran successfully
- [ ] Verify booking ID exists

### CORS Errors:
- [ ] Check proxy configuration in frontend
- [ ] Verify backend CORS settings
- [ ] Check backend is running

### Database Errors:
- [ ] Verify migration script ran
- [ ] Check database connection in .env
- [ ] Verify database user has proper permissions

## 📞 Need Help?

- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Community: https://www.paypal-community.com/
- Check backend logs: Look at terminal where backend is running
- Check frontend logs: Open browser Developer Console (F12)

## ✅ Completion

When all checkboxes are complete:
- ✨ Your system is ready to accept payments!
- 💰 Clients can pay immediately upon booking
- 🎉 No more manual deposit collection needed

Good luck! 🚀
