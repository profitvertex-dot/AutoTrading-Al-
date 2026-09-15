// api/candles.js - CoinDCX ko server side se laayega, CORS bypass
export default async function handler(req, res){
  try{
    // I-BTC_INR = Spot BTC/INR
    let interval = req.query.interval || '1m';
    let url = `https://public.coindcx.com/market_data/candles?pair=I-BTC_INR&interval=${interval}&limit=200`;
    let r = await fetch(url);
    let j = await r.json();
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(j);
  }catch(e){
    return res.json({error: e.message});
  }
}
