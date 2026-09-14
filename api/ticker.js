export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  try{
    let r=await fetch('https://public.coindcx.com/exchange/ticker');
    let d=await r.json(); res.status(200).json(d);
  }catch(e){
    let cg=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr').then(x=>x.json());
    res.status(200).json([{market:'BTCINR',last_price:cg.bitcoin.inr}]);
  }
}
