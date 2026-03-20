# PayPal Integration Setup Guide

## Overview
This integration allows clients to pay immediately after submitting booking forms using PayPal. The system supports three booking types:
- Art Classes ($50 enrollment fee)
- Birthday Parties ($150 deposit)
- Painting Parties ($100 deposit)

## Backend Setup

### 1. Database Migration
Run the following SQL script to add payment tracking fields:

```bash
psql -U postgres -d your_database -f backend/db/add_payment_fields.sql
```

This adds the following fields to all booking tables:
- `payment_status` (pending, completed, failed, refunded)
- `payment_amount`
- `paypal_order_id`
- `paypal_capture_id`
- `payment_date`

### 2. Environment Variables
Add the following to your backend `.env` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NODE_ENV=development  # or 'production' for live PayPal
FRONTEND_URL=http://localhost:4200
```

**To get PayPal credentials:**
1. Go to https://developer.paypal.com/
2. Log in to your PayPal Developer account
3. Go to "My Apps & Credentials"
4. Create a new app (or use existing)
5. Copy the Client ID and Secret from Sandbox (development) or Live (production)

### 3. Backend Dependencies
Ensure you have the PayPal SDK installed:

```bash
cd backend
npm install @paypal/checkout-server-sdk
```

### 4. Start Backend Server
```bash
cd backend
npm start
```

## Frontend Setup

### 1. Update PayPal Client ID
In each booking component TypeScript file, replace `YOUR_PAYPAL_CLIENT_ID` with your actual PayPal Client ID:

**Files to update:**
- `frontend/src/app/pages/art-class-booking/art-class-booking.component.ts`
- `frontend/src/app/pages/birthday-party-booking/birthday-party-booking.component.ts`
- `frontend/src/app/pages/painting-party-booking/painting-party-booking.component.ts`

Replace this line:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
```

With:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=AYourActualClientID&currency=USD';
```

### 2. Configure Pricing
Pricing is configured in `frontend/src/app/config/pricing.config.ts`:

```typescript
export const BOOKING_PRICES = {
  artClass: 50.00,
  birthdayParty: 150.00,
  paintingParty: 100.00
};
```

Modify these values according to your pricing structure.

### 3. Start Frontend Server
```bash
cd frontend
npm start
```

## How It Works

### User Flow:
1. **Client fills out booking form** → All required information
2. **Clicks "Continue to Payment"** → Booking is created in database (status: pending)
3. **PayPal payment interface appears** → Client completes payment
4. **Payment is captured** → Booking status updated to "confirmed"
5. **Confirmation message** → Client redirected to home page

### Payment States:
- **Pending**: Booking created, payment not completed
- **Completed**: Payment successfully captured
- **Failed**: Payment attempt failed
- **Refunded**: Payment refunded (manual process)

## API Endpoints

### Payment Endpoints:
- `POST /api/payments/create-order` - Create PayPal order
- `POST /api/payments/capture-order` - Capture payment after approval
- `GET /api/payments/order/:orderID` - Get order details

### Booking Payment Update:
- `POST /api/art-classes/:id/payment` - Update art class payment
- `POST /api/birthday-parties/:id/payment` - Update birthday party payment
- `POST /api/painting-parties/:id/payment` - Update painting party payment

## Testing

### Sandbox Testing:
1. Use PayPal Sandbox credentials in development
2. Create test buyer accounts at https://developer.paypal.com/dashboard/accounts
3. Use sandbox test credit cards provided by PayPal
4. All payments are simulated - no real money is transferred

### Test Cards (Sandbox):
PayPal provides test accounts - use these to simulate payments without real money.

## Production Deployment

### Before Going Live:
1. ✅ Switch to **Live** PayPal credentials in `.env`
2. ✅ Update `NODE_ENV=production`
3. ✅ Replace Sandbox Client ID in frontend components
4. ✅ Test thoroughly with small real transactions
5. ✅ Set up webhook handlers for payment notifications (recommended)
6. ✅ Implement proper error logging and monitoring

### Security Checklist:
- ✅ Never commit PayPal credentials to Git
- ✅ Use environment variables for all secrets
- ✅ Validate all payment amounts server-side
- ✅ Implement rate limiting on payment endpoints
- ✅ Use HTTPS in production
- ✅ Implement proper error handling

## Customization

### Change Payment Amounts:
Edit `frontend/src/app/config/pricing.config.ts`

### Add New Booking Types:
1. Create controller with `updatePayment` method
2. Add route: `router.post('/:id/payment', controller.updatePayment)`
3. Create frontend component with PayPal integration
4. Add pricing to `pricing.config.ts`

### Modify Payment Flow:
- Payment UI: Edit component HTML/CSS
- Payment logic: Edit component TypeScript `initPayPalButton()`
- Backend processing: Edit `payment.ts` controller

## Troubleshooting

### PayPal SDK Not Loading:
- Check browser console for errors
- Verify Client ID is correct
- Check for ad blockers blocking PayPal scripts

### Payment Not Capturing:
- Verify backend environment variables
- Check backend logs for errors
- Ensure database migrations ran successfully

### CORS Issues:
- Verify backend proxy configuration
- Check allowed origins in backend CORS settings

## Support
For PayPal-specific issues, consult:
- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal SDK GitHub: https://github.com/paypal/Checkout-NodeJS-SDK

For integration issues, check:
- Backend logs in terminal
- Browser developer console
- Network tab for API calls
