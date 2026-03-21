import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const paypalEnv = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const Environment = paypalEnv === 'live'
  ? checkoutNodeJssdk.core.LiveEnvironment
  : checkoutNodeJssdk.core.SandboxEnvironment;

const client = new checkoutNodeJssdk.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
);

export default client;
