import crypto from 'crypto';
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    const key=process.env.COINDCX_KEY, secret=process.env.COINDCX_SECRET;
    const body={timestamp:Date.now()};
    const payload=Buffer.from(JSON.stringify(body)).toString('base64');
    const signature=crypto.createHmac('sha256',secret).update(payload).digest('hex');
    let r=await fetch('https://api.coindcx.com/exchange/v1/users/balances',{
      method:'POST', headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature,'Content-Type':'application/json'},
      body:JSON.stringify({payload,signature})
    });
    let data=await r.json();
    return res.json(data);
  }catch(e){ return res.json({error:e.message}); }
}
