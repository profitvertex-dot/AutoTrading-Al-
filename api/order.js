import crypto from 'crypto';
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 const {side,mode}=req.body;
 if(mode==='demo') return res.json({status:'DEMO ORDER SUCCESS',side});
 try{
  const key=process.env.COINDCX_KEY, secret=process.env.COINDCX_SECRET;
  const body={market:"PAXGINR",side,order_type:"market_order",total_quantity:500,timestamp:Date.now()};
  const payload=Buffer.from(JSON.stringify(body)).toString('base64');
  const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');
  const r=await fetch('https://api.coindcx.com/exchange/v1/orders/create',{method:'POST',headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':sig},body:JSON.stringify({payload,signature:sig})});
  const d=await r.json();
  res.json(d);
 }catch(e){res.status(500).json({error:e.message})}
}
