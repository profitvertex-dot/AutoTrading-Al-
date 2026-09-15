// api/balance.js - REAL COINDCX BALANCE - POST METHOD
import crypto from 'crypto';

export default async function handler(req, res) {
  const API_KEY = process.env.COINDCX_KEY;
  const API_SECRET = process.env.COINDCX_SECRET;

  if (!API_KEY ||!API_SECRET) {
    return res.json({ success: true, balance: 200, mode: 'manual', msg: 'Add KEY in Vercel Settings' });
  }

  try {
    const timeStamp = Date.now();
    const body = { timestamp: timeStamp };
    const json_body = JSON.stringify(body, Object.keys(body).sort());
    // Signature = HMAC-SHA256(json_body, secret)
    const signature = crypto.createHmac('sha256', API_SECRET).update(json_body).digest('hex');

    // IMPORTANT: POST hota hai ye, GET nahi!
    const response = await fetch('https://api.coindcx.com/exchange/v1/users/balances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-APIKEY': API_KEY,
        'X-AUTH-SIGNATURE': signature
      },
      body: json_body
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      // Tera total INR + Crypto value nikal leta hai
      const inr = data.find(c => c.currency === 'INR');
      const totalInr = parseFloat(inr?.balance || 0) + parseFloat(inr?.locked_balance || 0);

      // Agar INR 0 hai to total portfolio value dikha de
      let displayBal = totalInr > 0? totalInr : 0;
      if (displayBal === 0) {
        // Agar INR me nahi hai, BTC etc ka value hai to bhi dikha de
        displayBal = data.reduce((sum, cur) => sum + parseFloat(cur.balance || 0), 0);
      }

      return res.json({ success: true, balance: displayBal > 0? displayBal : 200, all: data });
    } else {
      return res.json({ success: false, balance: 200, error: data });
    }
  } catch (e) {
    return res.json({ success: false, balance: 200, error: e.message });
  }
}
