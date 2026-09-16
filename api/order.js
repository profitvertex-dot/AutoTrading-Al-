<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AutoTrading AI GOLD</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;900&display=swap" rel="stylesheet">
<style>body{font-family:'Space Grotesk',sans-serif;background:#0A0A0F}</style>
</head>
<body class="text-white">
<div class="max-w-[480px] mx-auto min-h-screen bg-[#0A0A0F] pb-28">

  <!-- HEADER -->
  <div class="flex items-center justify-between px-5 pt-6 pb-3">
    <div class="flex items-center gap-3">
      <img src="/logo.png" class="w-11 h-11 rounded-xl bg-[#1E1E2A] border border-amber-500/20 object-cover"/>
      <div><h1 class="font-black text-[17px]">AutoTrading AI</h1><p class="text-[11px] text-amber-400 font-bold">● PAXG GOLD • LIVE</p></div>
    </div>
    <div class="flex gap-2">
      <button id="modeBtn" class="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400">DEMO</button>
      <a href="/history.html" class="w-8 h-8 rounded-full bg-[#1A1A23] border border-[#232330] flex items-center justify-center">↗</a>
    </div>
  </div>

  <!-- BALANCE + PNL -->
  <div class="mx-5 grid grid-cols-2 gap-3">
    <div class="rounded-[18px] bg-gradient-to-br from-[#1A1A23] to-[#14141C] border border-[#232330] p-4">
      <p class="text-[9px] tracking-widest text-zinc-500 font-bold">BALANCE</p>
      <h2 class="text-[24px] font-black mt-1">₹<span id="bal">477.14</span></h2>
      <p class="text-[10px] text-zinc-500 mt-1">PAXG • Min ₹100</p>
    </div>
    <div class="rounded-[18px] bg-[#12121A] border border-[#1E1E2A] p-4">
      <p class="text-[9px] tracking-widest text-zinc-500 font-bold">TODAY P&L</p>
      <h2 id="pnl" class="text-[24px] font-black mt-1 text-zinc-500">₹0.00</h2>
      <p id="pnlInfo" class="text-[10px] text-zinc-600">0 trades</p>
    </div>
  </div>

  <!-- SIGNAL BOX - KAB BUY/SELL -->
  <div id="signalBox" class="mx-5 mt-4 rounded-[16px] border p-4 flex items-center justify-between bg-zinc-900 border-zinc-800">
    <div class="flex items-center gap-3">
      <div id="signalIcon" class="w-10 h-10 rounded-full flex items-center justify-center text-[18px] bg-zinc-800">⏳</div>
      <div>
        <p id="signalText" class="font-black text-[13px]">WAIT</p>
        <p id="signalReason" class="text-[11px] text-zinc-500">Chart load ho raha hai...</p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-[9px] text-zinc-500 tracking-widest">RSI</p>
      <p id="rsiVal" class="font-black text-[16px]">--</p>
    </div>
  </div>

  <!-- AUTO TOGGLE -->
  <div class="mx-5 mt-3 rounded-[16px] bg-[#1A1A23] border border-[#232330] p-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">🤖</div>
      <div><p class="font-bold text-[13px]">Auto Trading</p><p id="autoStatus" class="text-[11px] text-zinc-500">OFF • Manual</p></div>
    </div>
    <button id="autoToggle" class="w-[52px] h-[30px] rounded-full bg-zinc-800 p-1 transition"><div id="autoDot" class="w-5 h-5 rounded-full bg-white transition-all"></div></button>
  </div>

  <!-- CHART -->
  <div class="flex items-center justify-between px-5 mt-5 mb-2">
    <h3 class="font-bold text-[13px]">PAXG/INR • ₹<span id="livePrice">432816</span></h3>
    <div class="flex gap-2">
      <button class="tf px-3 py-1 rounded-full bg-[#1E1E2A] text-[10px] font-bold border border-amber-500/30 text-amber-400" data-tf="15m">15m</button>
      <button class="tf px-3 py-1 rounded-full bg-[#1A1A23] text-[10px] font-bold text-zinc-500" data-tf="1h">1h</button>
      <button class="tf px-3 py-1 rounded-full bg-[#1A1A23] text-[10px] font-bold text-zinc-500" data-tf="1d">1D</button>
    </div>
  </div>
  <div class="mx-5 rounded-[18px] bg-[#12121A] border border-[#1E1E2A] overflow-hidden"><div id="chart" class="w-full h-[280px]"></div></div>

  <!-- BUTTONS -->
  <div class="px-5 mt-4 grid grid-cols-3 gap-3">
    <button id="buyBtn" class="h-[52px] rounded-[14px] bg-gradient-to-b from-[#22C55E] to-[#16A34A] font-black text-[13px] active:scale-95">↗ BUY</button>
    <button id="sellBtn" class="h-[52px] rounded-[14px] bg-[#1E1E2A] border border-red-500/20 text-red-400 font-black text-[13px] active:scale-95">↘ SELL</button>
    <button id="stopBtn" class="h-[52px] rounded-[14px] bg-[#1A1A23] border border-[#232330] text-zinc-400 font-bold text-[12px] active:scale-95">STOP</button>
  </div>
  <p class="text-center text-[10px] text-zinc-500 mt-2">Demo mode = bina real paise ke practice • Live = real order</p>

  <!-- TRADES -->
  <div class="px-5 mt-6">
    <div class="flex justify-between"><h3 class="font-bold text-[10px] tracking-widest text-zinc-500">LIVE TRADES</h3><a href="/history.html" class="text-[11px] font-bold text-amber-400">History →</a></div>
    <div id="trades" class="mt-3 space-y-2"></div>
  </div>
</div>

<script>
let chart,candleSeries,currentPrice=432816,autoInt=null,autoOn=false,isDemo=true;
let trades=JSON.parse(localStorage.getItem('gold_trades')||'[]');
let prices=[];

// RSI CALCULATE
function calcRSI(prices, period=14){
  if(prices.length<period) return 50;
  let gains=0,losses=0;
  for(let i=prices.length-period;i<prices.length;i++){
    let diff=prices[i]-prices[i-1];
    if(diff>=0) gains+=diff; else losses+=-diff;
  }
  if(losses===0) return 100;
  let rs=gains/losses;
  return 100-(100/(1+rs));
}

function updateSignal(){
  if(prices.length<15){return}
  let rsi=calcRSI(prices);
  document.getElementById('rsiVal').textContent=rsi.toFixed(1);
  let box=document.getElementById('signalBox'), icon=document.getElementById('signalIcon'), text=document.getElementById('signalText'), reason=document.getElementById('signalReason');

  if(rsi<30){
    box.className='mx-5 mt-4 rounded-[16px] border p-4 flex items-center justify-between bg-green-500/10 border-green-500/30';
    icon.className='w-10 h-10 rounded-full flex items-center justify-center text-[18px] bg-green-500 text-black'; icon.textContent='↗';
    text.textContent='BUY NOW'; text.className='font-black text-[13px] text-green-400';
    reason.textContent=`RSI ${rsi.toFixed(1)} • Oversold • Gold sasta hai!`; reason.className='text-[11px] text-green-300/70';
  }else if(rsi>70){
    box.className='mx-5 mt-4 rounded-[16px] border p-4 flex items-center justify-between bg-red-500/10 border-red-500/30';
    icon.className='w-10 h-10 rounded-full flex items-center justify-center text-[18px] bg-red-500 text-white'; icon.textContent='↘';
    text.textContent='SELL NOW'; text.className='font-black text-[13px] text-red-400';
    reason.textContent=`RSI ${rsi.toFixed(1)} • Overbought • Profit book karo!`; reason.className='text-[11px] text-red-300/70';
  }else{
    box.className='mx-5 mt-4 rounded-[16px] border p-4 flex items-center justify-between bg-zinc-900 border-zinc-800';
    icon.className='w-10 h-10 rounded-full flex items-center justify-center text-[18px] bg-zinc-800'; icon.textContent='⏳';
    text.textContent='WAIT'; text.className='font-black text-[13px] text-zinc-300';
    reason.textContent=`RSI ${rsi.toFixed(1)} • Neutral • Thoda ruko`; reason.className='text-[11px] text-zinc-500';
  }
}

function renderTrades(){
  let c=document.getElementById('trades'); c.innerHTML='';
  let total=0;
  if(trades.length===0){c.innerHTML='<div class="py-6 text-center text-[11px] text-zinc-600 bg-[#12121A] rounded-xl border border-dashed border-[#232330]">Abhi koi trade nahi — signal dekh ke BUY kar</div>';}
  trades.slice(0,6).forEach(t=>{
    let pnl = t.side==='buy'? (currentPrice-t.price)*t.qty : t.pnl||0;
    if(t.side==='sell') total+=t.pnl; else total+=pnl;
    let d=document.createElement('div');
    d.className='p-3 rounded-xl bg-[#12121A] border border-[#1E1E2A] flex justify-between items-center';
    d.innerHTML=`<div><p class="font-bold text-[11px] ${t.side==='buy'?'text-green-400':'text-red-400'}">${t.side.toUpperCase()} ${isDemo?'(DEMO)':'(LIVE)'} • ${t.qty.toFixed(6)}</p><p class="text-[10px] text-zinc-500">₹${t.price.toFixed(0)} → ₹${currentPrice.toFixed(0)}</p></div><div class="text-right"><p class="font-black text-[11px] ${pnl>=0?'text-green-400':'text-red-400'}">${pnl>=0?'+':''}₹${pnl.toFixed(2)}</p><p class="text-[9px] text-zinc-600">${new Date(t.time).toLocaleTimeString()}</p></div>`;
    c.appendChild(d);
  });
  document.getElementById('pnl').textContent=(total>=0?'+₹':'-₹')+Math.abs(total).toFixed(2);
  document.getElementById('pnl').className=`text-[24px] font-black mt-1 ${total>=0?'text-green-400':'text-red-400'}`;
  document.getElementById('pnlInfo').textContent=`${trades.length} trades • ${isDemo?'DEMO':'LIVE'}`;
  localStorage.setItem('gold_trades',JSON.stringify(trades));
}

async function loadChart(tf){
  document.querySelectorAll('.tf').forEach(b=>b.className=b.dataset.tf===tf?'tf px-3 py-1 rounded-full bg-[#1E1E2A] text-[10px] font-bold border border-amber-500/30 text-amber-400':'tf px-3 py-1 rounded-full bg-[#1A1A23] text-[10px] font-bold text-zinc-500');
  let r=await fetch(`/api/candles?interval=${tf}`); let data=await r.json(); if(!data.length) return;
  let formatted=data.map(c=>({time:c.time/1000,open:c.open,high:c.high,low:c.low,close:c.close})).sort((a,b)=>a.time-b.time);
  prices=formatted.map(f=>f.close); currentPrice=formatted[formatted.length-1].close;
  document.getElementById('livePrice').textContent=currentPrice.toFixed(0);
  if(!chart){
    chart=LightweightCharts.createChart(document.getElementById('chart'),{layout:{background:{color:'#12121A'},textColor:'#6B7280'},grid:{vertLines:{color:'#1E1E2A'},horzLines:{color:'#1E1E2A'}},width:document.getElementById('chart').clientWidth,height:280,priceFormat:{type:'price',precision:2}});
    candleSeries=chart.addCandlestickSeries({upColor:'#FBBF24',downColor:'#EF4444',borderVisible:false,wickUpColor:'#FBBF24',wickDownColor:'#EF4444'});
  }
  candleSeries.setData(formatted); chart.timeScale().fitContent(); updateSignal(); renderTrades();
}
loadChart('15m');
document.querySelectorAll('.tf').forEach(b=>b.onclick=()=>loadChart(b.dataset.tf));

async function doTrade(side){
  let qty=100/currentPrice;
  let trade={side, price:currentPrice, qty, time:Date.now(), pnl:0};
  if(side==='sell'){
    let lastBuy=trades.filter(t=>t.side==='buy').slice(-1)[0];
    if(lastBuy) trade.pnl=(currentPrice-lastBuy.price)*qty;
  }
  trades.unshift(trade); renderTrades();
  if(!isDemo){
    try{ await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({side})}); }catch(e){}
  }
}

document.getElementById('buyBtn').onclick=()=>doTrade('buy');
document.getElementById('sellBtn').onclick=()=>doTrade('sell');
document.getElementById('stopBtn').onclick=()=>{clearInterval(autoInt); autoOn=false; document.getElementById('autoStatus').textContent='OFF • Manual'; document.getElementById('autoToggle').className='w-[52px] h-[30px] rounded-full bg-zinc-800 p-1'; document.getElementById('autoDot').style.transform='translateX(0)';};
document.getElementById('modeBtn').onclick=(e)=>{
  isDemo=!isDemo; e.target.textContent=isDemo?'DEMO':'LIVE'; e.target.className=isDemo?'px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400':'px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-black text-green-400';
  renderTrades();
};
document.getElementById('autoToggle').onclick=()=>{
  autoOn=!autoOn;
  if(autoOn){
    document.getElementById('autoToggle').className='w-[52px] h-[30px] rounded-full bg-amber-500 p-1';
    document.getElementById('autoDot').style.transform='translateX(22px)';
    document.getElementById('autoStatus').textContent='ON • Auto by RSI';
    autoInt=setInterval(()=>{
      let rsi=calcRSI(prices);
      if(rsi<32) doTrade('buy');
      else if(rsi>72) doTrade('sell');
    },60000);
  }else{ document.getElementById('stopBtn').click(); }
};
renderTrades();
</script>
</body>
</html>
