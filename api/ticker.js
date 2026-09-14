export default async function handler(req,res){
  const r = await fetch('https://public.coindcx.com/market_data/current_prices');
  const data = await r.json();
  res.json(data);
}
