export default async function handler(req,res){
  try{
    let interval = req.query.interval || '15m';
    // Ab SHIB ka chart ayega BTC ki jagah
    let r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-SHIB_INR&interval=${interval}&limit=60`);
    let j = await r.json();
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(j.reverse());
  }catch(e){ return res.json([]); }
}
