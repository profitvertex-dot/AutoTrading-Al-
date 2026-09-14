import crypto from 'crypto';
export default async function handler(req,res){
  try{
    const key = process.env.COINDCX_KEY || process.env.COINDCX_API_KEY;
    const secret = process.env.COINDCX_SECRET || process.env.COINDCX_API_SECRET;
    const timeStamp = Date.now();
    const body = { timestamp: timeStamp };
    const payload = Buffer.from(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const r = await fetch('https://api.coindcx.com/exchange/v1/users/balances',{method:'POST',headers:{'X-AUTH-APIKEY':key,'X-AUTH-SIGNATURE':signature},body: JSON.stringify(body)});
    const data = await r.json();
    
    // INR + BTC value
    let inrBal = parseFloat(data.find(x=>x.currency==='INR')?.balance || 0);
    let btcBal = parseFloat(data.find(x=>x.currency==='BTC')?.balance || 0);
    
    // BTC ka live price leke total nikal
    let btcPriceRes = await fetch('https://api.coindcx.com/exchange/ticker');
    let tickers = await btcPriceRes.json();
    let btcInrPrice = tickers.find(t=>t.market==='BTCINR')?.last_price || 6500000;
    
    let total = inrBal + (btcBal * btcInrPrice);
    
    return res.status(200).json({balance: total, inr: inrBal, btc: btcBal, btcPrice: btcInrPrice});
  }catch(e){ return res.status(200).json({balance: 0.01, error:e.message}); }
}
