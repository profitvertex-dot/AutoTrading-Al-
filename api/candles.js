export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let r=await fetch('https://public.coindcx.com/market_data/candles?pair=B-PAXG_INR&interval=1m&limit=50');
    let data=await r.json();
    let filtered=data.filter(c=>c.close>430000 && c.high<450000 && c.low>420000);
    return res.json(filtered);
  }catch(e){ return res.status(500).json([]); }
}
