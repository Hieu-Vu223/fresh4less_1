// server.js
const express = require('express');
import dotenv from 'dotenv';
import cors from 'cors';
import refundOrderRoute from './routes/refundOrder.js';  // Import the refund route

dotenv.config();
const app = express();

// Configure CORS to allow requests only from the frontend
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your frontend origin if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only necessary HTTP methods
  credentials: true, // Allow cookies to be sent with requests if needed
};

app.use(cors(corsOptions)); // Apply CORS with options

app.use(express.json());  // Support JSON in requests

// Use the refund route
app.use('/api/paypal', refundOrderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
