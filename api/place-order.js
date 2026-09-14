import crypto from 'crypto';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const {side} = req.body;
  const key = process.env.COINDCX_KEY || process.env.COINDCX_API_KEY;
  const secret = process.env.COINDCX_SECRET || process.env.COINDCX_API_SECRET;

  // tere ₹201 ke liye 0.00002 BTC = ~₹140 ka order lagega
  const qty = 0.00002; 

  const body = {
    market: "BTCINR",
    side: side,
    order_type: "market_order",
    total_quantity: qty,
    timestamp: Date.now()
  };
  const payload = Buffer.from(JSON.stringify(body)).toString();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  const r = await fetch('https://api.coindcx.com/exchange/v1/orders/create',{
    method:'POST',
    headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature},
    body: JSON.stringify(body)
  });
  const data = await r.json();
  return res.status(200).json(data);
}
