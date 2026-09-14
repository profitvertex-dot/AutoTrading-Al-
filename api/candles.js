export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let r=await fetch('https://public.coindcx.com/market_data/candles?pair=B-BTC_INR&interval=1m&limit=100');
    let d=await r.json(); res.status(200).json(d);
  }catch(e){res.status(500).json([]);}
}
