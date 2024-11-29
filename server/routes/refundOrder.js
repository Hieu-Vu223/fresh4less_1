// server/routes/refundOrder.js
import express from 'express';
import axios from 'axios';
import { getPayPalAccessToken } from '../utils/paypal';
import { authMiddleware } from './authMiddleware'; // Middleware to verify merchant authentication

const router = express.Router();

router.post('/refund', authMiddleware, async (req, res) => {
  const { paypalOrderId } = req.body;

  if (!paypalOrderId) {
    return res.status(400).json({ success: false, message: 'PayPal Order ID is required.' });
  }

  try {
    // Retrieve PayPal API access token
    const accessToken = await getPayPalAccessToken();
    
    // Make request to PayPal API to refund the transaction
    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/payments/captures/${paypalOrderId}/refund`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Refund failed:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: error.response ? error.response.data.message : "Refund failed" });
  }
});

export default router;
