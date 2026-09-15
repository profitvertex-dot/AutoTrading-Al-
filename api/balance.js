// api/balance.js
import crypto from 'crypto';

export default async function handler(req, res) {
  const API_KEY = process.env.COINDCX_KEY;
  const API_SECRET = process.env.COINDCX_SECRET;

  if (!API_KEY ||!API_SECRET) {
    return res.status(500).json({ success: false, error: 'API Key not set in Vercel' });
  }

  const payload = {
    timestamp: Date.now()
  };
  const payloadStr = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', API_SECRET).update(payloadStr).digest('hex');

  try {
    const response = await fetch('https://api.coindcx.com/exchange/v1/users/balances', {
      method: 'GET',
      headers: {
        'X-AUTH-APIKEY': API_KEY,
        'X-AUTH-SIGNATURE': signature,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (Array.isArray(data)) {
      let inrBal = data.find(c => c.currency === 'INR');
      let total = inrBal? parseFloat(inrBal.balance) : 0;
      return res.json({ success: true, balance: total, raw: data });
    } else {
      return res.json({ success: false, error: JSON.stringify(data) });
    }
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
}
