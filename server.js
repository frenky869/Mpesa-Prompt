require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const getAccessToken = async () => {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
};
const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
};
app.post('/api/stk-push', async (req, res) => {
    const { phoneNumber, amount } = req.body;

    // Validate input
    if (!phoneNumber || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid phone and amount are required.' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
        `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString('base64');

    try {
        const token = await getAccessToken();

        const payload = {
            BusinessShortCode: process.env.SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: process.env.SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.CALLBACK_URL,
            AccountReference: `INV${Date.now()}`,
            TransactionDesc: 'Payment for goods',
        };

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.status(200).json({
            message: 'STK Push sent! Check your phone.',
            data: response.data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initiate payment.' });
    }
});
// Root route
app.get('/', (req, res) => {
  res.send('Server is running! Welcome to M-Pesa API backend.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.post('/api/callback', (req, res) => {
    console.log('Callback received:', JSON.stringify(req.body, null, 2));
    const result = req.body.Body.stkCallback;
    const { ResultCode, ResultDesc, CheckoutRequestID } = result;

    if (ResultCode === 0) {
        console.log(`✅ Payment SUCCESS for Request: ${CheckoutRequestID}`);
        // Update your database to mark the order as "PAID" here.
    } else {
        console.log(`❌ Payment FAILED: ${ResultDesc}`);
        // Update your database to mark the order as "FAILED" here.
    }

    // Acknowledge receipt to M-Pesa
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));