import crypto from 'crypto';
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  try{
    const {side}=req.body;
    const key=process.env.COINDCX_KEY;
    const secret=process.env.COINDCX_SECRET;
    const INR_AMT = 100; // GOLD minimum
    const body={side, order_type:"market_order", market:"PAXGINR", total_quantity:INR_AMT, timestamp:Date.now()};
    const payload=Buffer.from(JSON.stringify(body)).toString();
    const signature=crypto.createHmac('sha256',secret).update(payload).digest('hex');
    let r=await fetch('https://api.coindcx.com/exchange/v1/orders/create',{method:'POST', headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature}, body:JSON.stringify({payload,signature})});
    let j=await r.json(); return res.json(j);
  }catch(e){return res.status(500).json({error:e.message})}
}
