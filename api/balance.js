import crypto from 'crypto';
export default async function handler(req,res){
  const API_KEY=process.env.COINDCX_KEY;
  const API_SECRET=process.env.COINDCX_SECRET;
  if(!API_KEY||!API_SECRET) return res.json({success:false,error:'KEY not set'});
  try{
    const ts=Date.now();
    const body=JSON.stringify({timestamp:ts});
    const sig=crypto.createHmac('sha256',API_SECRET).update(body).digest('hex');
    let r=await fetch('https://api.coindcx.com/exchange/v1/users/balances',{method:'POST',headers:{'Content-Type':'application/json','X-AUTH-APIKEY':API_KEY,'X-AUTH-SIGNATURE':sig},body});
    let j=await r.json();
    let inr=j.find(x=>x.currency=='INR');
    return res.json({success:true,balance: parseFloat(inr?.balance||0), all:j});
  }catch(e){ return res.json({success:false,error:e.message}); }
}
