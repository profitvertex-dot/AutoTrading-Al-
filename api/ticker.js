export default async function handler(req,res){
  try{
    let r = await fetch('https://public.coindcx.com/market_data/ticker');
    let j = await r.json();
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(j);
  }catch(e){ return res.json([]); }
}
