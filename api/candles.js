export default async function handler(req,res){
  try{
    let interval = req.query.interval || '15m';
    // SHIB ka data
    let r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-SHIB_INR&interval=${interval}&limit=100`);
    let j = await r.json();
    if(!j || j.length==0){
      // agar SHIB fail toh BTC fallback
      r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-BTC_INR&interval=${interval}&limit=60`);
      j = await r.json();
    }
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(j.reverse());
  }catch(e){ 
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json([]); 
  }
}
