// api/order.js - REAL Buy/Sell on CoinDCX
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.json({ success: false, error: 'POST only' });

  const { side, amount } = req.body; // side = 'buy' or 'sell'
  const API_KEY = process.env.COINDCX_KEY;
  const API_SECRET = process.env.COINDCX_SECRET;

  if (!API_KEY ||!API_SECRET) return res.json({ success: false, error: 'KEY not set' });

  try {
    const timestamp = Date.now();
    // ₹200 me se ~90% se BTC le lenge, market order
    const body = {
      timestamp,
      market: 'BTCINR',
      side: side, // buy or sell
      order_type: 'market_order',
      total_quantity: 0, // hum price se lenge
      // CoinDCX market order ke liye total_qantity ya price chahiye
      // Yaha hum ₹200 me se 180 ka order bhejenge
      price_per_unit: 0
    };

    // Simple market buy - CoinDCX docs ke hisab se
    // Hum total_quantity = amount / price se nikalenge frontend se bhej rahe hai
    const orderBody = {
      timestamp,
      market: 'BTCINR',
      side: side,
      order_type: 'market_order',
      total_quantity: amount, // BTC ki quantity
    };

    const json_body = JSON.stringify(orderBody);
    const signature = crypto.createHmac('sha256', API_SECRET).update(json_body).digest('hex');

    const r = await fetch('https://api.coindcx.com/exchange/v1/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-APIKEY': API_KEY,
        'X-AUTH-SIGNATURE': signature
      },
      body: json_body
    });

    const data = await r.json();
    return res.json({ success: true, data });

  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
}
