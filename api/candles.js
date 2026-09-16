export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    const r = await fetch('https://public.coindcx.com/market_data/candles?pair=B-PAXG_INR&interval=1m&limit=100');
    const data = await r.json();
    return res.json(data);
  }catch(e){ return res.status(500).json({error:e.message}); }
}
