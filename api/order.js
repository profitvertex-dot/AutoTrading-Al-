import crypto from 'crypto';
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  try{
    const {side} = req.body;
    const key = process.env.COINDCX_KEY;
    const secret = process.env.COINDCX_SECRET;
    const body={
      market: "PAXGINR",
      side: side,
      order_type: "market_order",
      total_quantity: 500,
      timestamp: Date.now()
    };
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const r = await fetch('https://api.coindcx.com/exchange/v1/orders/create',{
      method:'POST',
      headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature,'Content-Type':'application/json'},
      body: JSON.stringify({payload, signature})
    });
    const data = await r.json();
    return res.status(200).json(data);
  }catch(e){ return res.status(500).json({error:e.message}); }
}
