let entryPrice = null;
async function updateAll(){
  try{
    // 1. Balance
    const balRes = await fetch('/api/balance');
    const bal = await balRes.json();
    if(bal.inr!==undefined){
      document.getElementById('totalBal').innerText = (parseFloat(bal.inr) + parseFloat(bal.btc||0)* 6000000).toFixed(2);
      document.getElementById('inrBal').innerText = '₹'+parseFloat(bal.inr).toFixed(2);
      document.getElementById('btcBal').innerText = parseFloat(bal.btc||0).toFixed(5);
    }
    // 2. Price + RSI Logic
    const priceRes = await fetch('https://api.coindcx.com/exchange/ticker');
    const all = await priceRes.json();
    const btc = all.find(c=>c.market==='BTCINR');
    const price = parseFloat(btc.last_price);

    // simple RSI calc history from localStorage
    let hist = JSON.parse(localStorage.getItem('phist')||'[]');
    hist.push(price);
    if(hist.length>20) hist.shift();
    localStorage.setItem('phist', JSON.stringify(hist));

    let rsi = 50;
    if(hist.length>14){
      let gains=0, losses=0;
      for(let i=1;i<hist.length;i++){
        let diff = hist[i]-hist[i-1];
        if(diff>0) gains+=diff; else losses-=diff;
      }
      let rs = gains/(losses||1);
      rsi = 100 - (100/(1+rs));
    }

    let signal='HOLD', conf=50, icon='⚪';
    if(rsi<38){ signal='BUY'; conf=85; icon='🟢'; }
    else if(rsi>62){ signal='SELL'; conf=75; icon='🔴'; }
    else { signal='HOLD'; conf=50; icon='⚪'; }

    document.getElementById('signalText').innerText = signal;
    document.getElementById('rsiVal').innerText = rsi.toFixed(1);
    document.getElementById('entryVal').innerText = entryPrice? '$'+entryPrice.toFixed(0) : '--';
    document.getElementById('confVal').innerText = conf;
    document.getElementById('confBar').style.width = conf+'%';
    document.getElementById('signalIcon').innerText = icon;

    document.getElementById('logs').innerHTML = `[${new Date().toLocaleTimeString()}] Price: ₹${price.toFixed(0)} | RSI: ${rsi.toFixed(1)} | Signal: ${signal} ${conf}%<br>` + document.getElementById('logs').innerHTML;

  }catch(e){ console.log(e) }
}
setInterval(updateAll, 3000);
updateAll();

document.getElementById('toggleBtn').onclick = () => {
  const s = document.getElementById('botStatus');
  if(s.innerText==='STOP'){
    s.innerText='RUNNING'; s.className='px-4 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30';
    document.getElementById('toggleBtn').innerText='STOP BOT ⏹️';
  } else {
    s.innerText='STOP'; s.className='px-4 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30';
    document.getElementById('toggleBtn').innerText='START BOT 🚀';
  }
}
