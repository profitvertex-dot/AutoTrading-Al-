export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let r = await fetch('https://public.coindcx.com/market_data/candles?pair=B-PAXG_INR&interval=1m&limit=100');
    let data = await r.json();
    // kharab candles hatao jisse chart neeche gir raha tha
    let filtered = data.filter(c => c.close > 430000 && c.close < 450000);
    return res.json(filtered.length > 10 ? filtered : data);
  }catch(e){ return res.status(500).json({error:e.message}); }
}
