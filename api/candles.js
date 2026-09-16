export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let pair='I-PAXG_INR';
    let r = await fetch(`https://public.coindcx.com/market_data/candles?pair=${pair}&interval=${req.query.interval||'15m'}&limit=100`);
    let j = await r.json(); return res.json(j);
  }catch(e){ return res.json([]); }
}
