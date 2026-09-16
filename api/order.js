import crypto from 'crypto';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const {side} = req.body;
  const API_KEY=process.env.COINDCX_KEY;
  const API_SECRET=process.env.COINDCX_SECRET;
  try{
    const ts=Date.now();
    // SHIBINR ka minimum 100000 hai, hum 150000 bhej rahe hain = ~₹200, tere ₹482 me ho jayega
    let qty = 150000; 
    
    const bodyObj={
      timestamp: ts,
      market: 'SHIBINR',
      side: side,
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
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(j);
  }catch(e){ return res.json({success:false, error:e.message}); }
}
