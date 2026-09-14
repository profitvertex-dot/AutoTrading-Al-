import crypto from 'crypto';
export default async function handler(req,res){
  try{
    const key = process.env.COINDCX_KEY;
    const secret = process.env.COINDCX_SECRET;
    if(!key || !secret) return res.status(500).json({error:"Keys missing"});
    const body = { timestamp: Math.floor(Date.now()) };
    const payload = Buffer.from(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const r = await fetch('https://api.coindcx.com/exchange/v1/users/balances', {
      method: 'POST',
      headers: { 'X-AUTH-APIKEY': key, 'X-AUTH-SIGNATURE': signature, 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    res.json(data);
  }catch(e){ res.status(500).json({error:e.message}) }
}
