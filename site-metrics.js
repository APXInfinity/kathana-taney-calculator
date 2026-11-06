/* Shared, privacy-minimized public engagement counters for home and event-mini pages.
   No third-party tracking. Only an opaque random UUID is stored on this browser.
   Server holds hashed pseudonyms; see counter-backend/README.md. */
(() => {
  "use strict";
  const cfg = window.KATHANA_METRICS_CONFIG || {};
  const base = typeof cfg.apiBase === "string" ? cfg.apiBase.trim().replace(/\/$/, "") : "";
  const page = document.body?.dataset.metricPage || "home";
  const allowedPages = new Set(["home", "event-mini"]);
  if (!allowedPages.has(page)) return;
  const $ = (sel) => document.querySelector(sel);
  const status = $("#metricsStatus");
  const like = $("#likeWidget");
  const download = $("#downloadWidget");
  const slug = page;
  function info(s) { if (status) status.textContent=s; }
  function put(s,n) { const el=$(s); if (el) el.textContent=Number.isSafeInteger(n)&&n>=0?n.toLocaleString("en-US"):"—"; }
  function uuid() {
    try {
      let value=localStorage.getItem("kathana-fan-metrics-visitor-v1");
      if (value && /^[0-9a-f-]{36}$/.test(value)) return value;
      value=crypto.randomUUID();localStorage.setItem("kathana-fan-metrics-visitor-v1",value);
      return value;
    } catch { return crypto.randomUUID(); }
  }
  if(!base || !/^https:\/\/[-a-z0-9.]+(?::443)?$/i.test(base)){
    if (like) { like.disabled=true; like.title="Counter server not configured"; }
    info("Community counters pending activation. No invented numbers are displayed.");
    return;
  }
  const visitor=uuid();
  let liked=false;
  async function request(path,method="GET",body) {
    const res=await fetch(base+path,{
      method,mode:"cors",cache:"no-store",
      headers:body?{"Content-Type":"application/json"}:{},
      body:body?JSON.stringify(body):undefined,
      signal:AbortSignal.timeout(10000)
    });
    if(!res.ok) throw Error("Counters unavailable");
    const out=await res.json();
    if(!out.ok) throw Error("Counters unavailable");
    return out;
  }
  async function refresh(){
    const data=await request("/stats?page="+encodeURIComponent(slug)+"&visitor="+encodeURIComponent(visitor));
    put("[data-metric-views]",data.views);
    put("[data-metric-downloads]",data.downloads);
    put("[data-metric-likes]",data.likes);
    liked=!!data.liked;
    if(like){like.disabled=liked;like.textContent=liked?"👍 Liked":"👍 Like";}
  }
  async function start(){
    try {
      await request("/visit","POST",{page:slug,visitor});
      await refresh();
      info("Visits count approximate distinct browsers per day. Download clicks are not confirmed completed downloads.");
    } catch {
      put("[data-metric-views]",NaN);put("[data-metric-downloads]",NaN);put("[data-metric-likes]",NaN);
      if(like)like.disabled=true;
      info("Community counters temporarily unavailable.");
    }
  }
  if(like) {
    like.disabled=true;
    like.addEventListener("click",async()=>{
      if(liked)return;like.disabled=true;
      try{const out=await request("/like","POST",{page:slug,visitor});liked=!!out.liked;await refresh();}
      catch{info("Unable to save your thumbs-up. Try again later.");like.disabled=false;}
    });
  }
  if(download && slug==="event-mini"){
    // A valid configured backend counts the CLICK then redirects to an immutable fixed ZIP.
    // A temporarily offline backend could block the link; keep direct fallback on modifier-click.
    download.addEventListener("click",(ev)=>{
      if(ev.defaultPrevented||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
      const actual=download.href;
      download.href=base+"/download?page=event-mini&visitor="+encodeURIComponent(visitor);
      setTimeout(()=>{download.href=actual;},700);
    });
  }
  start();
})();