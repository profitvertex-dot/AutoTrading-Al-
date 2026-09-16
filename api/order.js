import crypto from 'crypto';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({success:false, error:'POST only'});
  const {side, amount} = req.body;
  const API_KEY=process.env.COINDCX_KEY;
  const API_SECRET=process.env.COINDCX_SECRET;
  try{
    const ts=Date.now();
    // CoinDCX minimum ~0.0002 BTC = ~1500 INR, isliye hum 0.0002 bhej rahe hain
    let qty = amount;
    if(qty < 0.0002) qty = 0.0002;

    const bodyObj={
      timestamp: ts,
      market: 'BTCINR',
      side: side, // buy / sell
      order_type: 'market_order',
      total_quantity: qty.toString()
    };
    const json=JSON.stringify(bodyObj);
    const sig=crypto.createHmac('sha256',API_SECRET).update(json).digest('hex');
    let r=await fetch('https://api.coindcx.com/exchange/v1/orders/create',{
      method:'POST',
      headers:{'Content-Type':'application/json','X-AUTH-APIKEY':API_KEY,'X-AUTH-SIGNATURE':sig},
      body: json
    });
    let j=await r.json();
    console.log("ORDER RES:", j);
    return res.json(j);
  }catch(e){ return res.json({success:false, error:e.message}); }
}
