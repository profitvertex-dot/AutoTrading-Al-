import crypto from 'crypto';
export default async function handler(req,res){
  const API_KEY=process.env.COINDCX_KEY;
  const API_SECRET=process.env.COINDCX_SECRET;
  try{
    const ts=Date.now();
    const body={timestamp:ts};
    const json=JSON.stringify(body);
    const sig=crypto.createHmac('sha256',API_SECRET).update(json).digest('hex');
    let r=await fetch('https://api.coindcx.com/exchange/v1/users/balances',{
      method:'POST',
      headers:{'Content-Type':'application/json','X-AUTH-APIKEY':API_KEY,'X-AUTH-SIGNATURE':sig},
      body: json
    });
    let j=await r.json();
    let inr=j.find?.(x=>x.currency=='INR') || j.find?.(x=>x.currency=='INR');
    // j array hai
    let inrBal = 0;
    if(Array.isArray(j)){
      let f=j.find(x=>x.currency=='INR');
      inrBal=parseFloat(f?.balance||0);
    }
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json({success:true, balance: inrBal, full:j});
  }catch(e){ return res.json({success:false, error:e.message}); }
}
