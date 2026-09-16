export default async function handler(req,res){
  try{
    let interval = req.query.interval || '15m';
    let r = await fetch(`https://public.coindcx.com/market_data/candles?pair=I-BTC_INR&interval=${interval}&limit=60`);
    let j = await r.json();
    let clean = j.filter(c=>{
      let o=parseFloat(c.open),h=parseFloat(c.high),l=parseFloat(c.low),cl=parseFloat(c.close);
      if(!o) return false;
      let range=(h-l)/o*100;
      return range < 1.2;
    });
    res.setHeader('Access-Control-Allow-Origin','*');
    return res.json(clean);
  }catch(e){ return res.json([]); }
}
