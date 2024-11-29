import axios from 'axios';

export const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID; // Get client ID from environment variables
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET; // Get client secret from environment variables

  // Step 1: Check if the environment variables are defined
  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID and secret must be set in environment variables.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error retrieving PayPal access token:", error.response ? error.response.data : error.message);
    throw new Error("Failed to retrieve PayPal access token.");
  }
};
