import crypto from 'crypto';
export default async function handler(req,res){
  try{
    const key = process.env.COINDCX_KEY || process.env.COINDCX_API_KEY;
    const secret = process.env.COINDCX_SECRET || process.env.COINDCX_API_SECRET;
    if(!key || !secret) return res.status(200).json({balance: 100011, demo:true});

    const timeStamp = Date.now();
    const body = { timestamp: timeStamp };
    const payload = Buffer.from(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const r = await fetch('https://api.coindcx.com/exchange/v1/users/balances',{
      method:'POST',
      headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature},
      body: JSON.stringify(body)
    });
    const data = await r.json();
    let inr = data.find(x=>x.currency==='INR')?.balance || 0;
    return res.status(200).json({balance: parseFloat(inr), raw:data});
  }catch(e){
    return res.status(200).json({balance: 100011, error:e.message});
  }
}
