import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const Environment = checkoutNodeJssdk.core.SandboxEnvironment;

const client = new checkoutNodeJssdk.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
);

export default client;
