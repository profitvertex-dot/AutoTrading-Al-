export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 const interval=req.query.interval||'5m';
 try{
  const r=await fetch(`https://public.coindcx.com/market_data/candles?pair=B-PAXG_INR&interval=${interval}&limit=150`);
  const d=await r.json();
  res.json(d);
 }catch(e){res.status(500).json({error:e.message})}
}
