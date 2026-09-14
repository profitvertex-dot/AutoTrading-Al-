export default async function handler(req,res){
  try{
    const key = process.env.COINDCX_KEY;
    const secret = process.env.COINDCX_SECRET;
    const crypto = await import('crypto');
    const body = JSON.stringify({});
    const payload = crypto.createHash('sha256').update(body).digest('hex');
    const ts = Date.now();
    const sigString = ts + "GET" + "/exchange/v1/users/balances" + payload;
    const signature = crypto.createHmac('sha256', secret).update(sigString).digest('hex');
    
    const r = await fetch('https://api.coindcx.com/exchange/v1/users/balances',{
      headers: {
        'X-AUTH-APIKEY': key,
        'X-AUTH-SIGNATURE': signature,
        'X-AUTH-TIMESTAMP': ts.toString()
      }
    });
    const data = await r.json();
    return res.status(200).json(data);
  }catch(e){ return res.status(500).json({error: e.message}); }
}
