export default async function handler(req,res){
  try{
    const r = await fetch('https://public.coindcx.com/market_data/current_prices');
    const data = await r.json();
    return res.status(200).json(data);
  }catch(e){ return res.status(200).json({BTCINR:"0"}); }
}
