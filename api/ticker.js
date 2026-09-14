export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 const r=await fetch('https://api.coindcx.com/exchange/ticker');
 const data=await r.json();
 res.json(data);
}
