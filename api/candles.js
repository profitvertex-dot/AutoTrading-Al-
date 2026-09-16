export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let r = await fetch('https://public.coindcx.com/market_data/candles?pair=B-PAXG_INR&interval=5m&limit=100');
    let d = await r.json();
    res.json(d);
  }catch(e){ res.json([]); }
}
