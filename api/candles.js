export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let interval = req.query.interval || '15m';
    let r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-SHIB_INR&interval=${interval}&limit=100`);
    let data = await r.json();
    
    // Agar SHIB na aaye toh BTC fallback
    if(!data || !data.length){
      r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-BTC_INR&interval=${interval}&limit=60`);
      data = await r.json();
    }
    return res.status(200).json(data);
  }catch(e){
    return res.status(200).json([]);
  }
}
