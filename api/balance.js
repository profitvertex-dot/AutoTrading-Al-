import crypto from 'crypto';
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 if(req.method==='OPTIONS') return res.status(200).end();
 const {mode}=req.body||{};
 if(mode==='demo') return res.json([{currency:'INR',balance:'10000'},{currency:'PAXG',balance:'0.001'}]);
 try{
  const key=process.env.COINDCX_KEY, secret=process.env.COINDCX_SECRET;
  if(!key) return res.json([{currency:'INR',balance:'482.22',note:'KEY NOT SET IN VERCEL'},{currency:'PAXG',balance:'0'}]);
  const body={timestamp:Date.now()};
  const payload=Buffer.from(JSON.stringify(body)).toString('base64');
  const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');
  const r=await fetch('https://api.coindcx.com/exchange/v1/users/balances',{method:'POST',headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':sig},body:JSON.stringify({payload,signature:sig})});
  const d=await r.json();
  res.json(d);
 }catch(e){res.json({error:e.message})}
}
