// Kathana Fan Tools community metrics — Cloudflare Worker + D1.
// NOT DEPLOYED merely by committing this file.
// Design: visits counted once per browser per calendar day; likes once per browser
// (persistently), downloads count link clicks once per browser per day.
// All counts are estimates, not verified unique people/completed downloads.
// Never use this endpoint for collection of passwords or player accounts.
const KNOWN = new Set(["home","event-mini"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ZIP_URL = "https://apxinfinity.github.io/kathana-taney-calculator/event-mini/downloads/Kathana-Event-Mini-v0.8.zip";
const DAILY_LIMIT = {visit:200,like:50,download:100};

function headers(origin) {
  return {
    "Access-Control-Allow-Origin":origin,
    "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
    "Vary":"Origin",
    "Cache-Control":"no-store",
    "X-Content-Type-Options":"nosniff"
  };
}
function json(data,status,origin) {
  return new Response(JSON.stringify(data),{
    status,headers:{...headers(origin),"Content-Type":"application/json; charset=utf-8"}
  });
}
async function digest(value) {
  const bytes=new TextEncoder().encode(value);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function dayKey(){return new Date().toISOString().slice(0,10);}
async function fingerprint(env, request, action) {
  const ip=request.headers.get("CF-Connecting-IP")||"unknown";
  // No raw IP stored, no IP in response; daily rotating HMAC-like salt SHA-256.
  return digest(env.ABUSE_SALT+":"+dayKey()+":"+action+":"+ip);
}
async function guard(env,req,action) {
  const id=await fingerprint(env,req,action);
  const key=dayKey();
  const res=await env.DB.prepare(
    "INSERT INTO abuse(day,action,hash,n) VALUES(?,?,?,1) ON CONFLICT(day,action,hash) DO UPDATE SET n=n+1 RETURNING n"
  ).bind(key,action,id).first();
  return Number(res?.n||0)<=DAILY_LIMIT[action];
}
async function keyOf(env,visitor) {
  // Exact browser identifier is not stored. Salt MUST NOT be committed in Git.
  return digest(env.VISITOR_SALT+":"+visitor);
}
async function count(env,page) {
  const row=await env.DB.prepare("SELECT views,likes,downloads FROM page_totals WHERE page=?").bind(page).first();
  return {views:Number(row?.views||0),likes:Number(row?.likes||0),downloads:Number(row?.downloads||0)};
}
async function stats(env,page,visitor) {
  const totals=await count(env,page);
  let liked=false;
  if(visitor && UUID.test(visitor)) {
    const hashed=await keyOf(env,visitor);
    liked=!!(await env.DB.prepare("SELECT 1 AS yes FROM likes WHERE page=? AND visitor_key=?").bind(page,hashed).first());
  }
  return {ok:true,page,...totals,liked};
}
async function updateTotals(env,page,metric,table) {
  // All mutation paths use allowlisted identifiers, not user-supplied SQL fragments.
  if(!["views","likes","downloads"].includes(metric))throw Error("Invalid metric");
  if(!["daily_visits","likes","download_clicks"].includes(table))throw Error("Invalid table");
  await env.DB.prepare(
    `INSERT INTO page_totals(page,${metric}) VALUES(?,(SELECT COUNT(*) FROM ${table} WHERE page=?))
      ON CONFLICT(page) DO UPDATE SET ${metric}=(SELECT COUNT(*) FROM ${table} WHERE page=?)`
  ).bind(page,page,page).run();
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    const configured=!!env.DB && typeof env.VISITOR_SALT==="string" && env.VISITOR_SALT.length>20 &&
      typeof env.ABUSE_SALT==="string" && env.ABUSE_SALT.length>20;
    const allowedOrigin=env.ALLOWED_ORIGIN||"https://apxinfinity.github.io";
    const origin=request.headers.get("Origin");
    if(request.method==="OPTIONS") {
      if(origin!==allowedOrigin)return new Response(null,{status:403});
      return new Response(null,{status:204,headers:headers(allowedOrigin)});
    }
    if(!configured)return json({ok:false,error:"Backend not configured"},503,allowedOrigin);
    if(url.pathname==="/health")return json({ok:true},200,allowedOrigin);
    const page=url.searchParams.get("page")||"";
    if(request.method==="GET" && url.pathname==="/stats") {
      if(!KNOWN.has(page))return json({ok:false,error:"Unknown page"},404,allowedOrigin);
      const visitor=url.searchParams.get("visitor")||"";
      return json(await stats(env,page,visitor),200,allowedOrigin);
    }
    if(request.method==="GET" && url.pathname==="/download") {
      // A browser click initiates a 302 redirect to the fixed, allowlisted ZIP.
      // It measures link clicks, not completed download transfers.
      const visitor=url.searchParams.get("visitor")||"";
      if(page==="event-mini" && UUID.test(visitor) && await guard(env,request,"download")) {
        const hashed=await keyOf(env,visitor);
        await env.DB.prepare("INSERT OR IGNORE INTO download_clicks(page,visitor_key,day) VALUES(?,?,?)")
          .bind(page,hashed,dayKey()).run();
        await updateTotals(env,page,"downloads","download_clicks");
      }
      const response=Response.redirect(ZIP_URL,302);
      const h=new Headers(response.headers);h.set("Cache-Control","no-store");
      return new Response(response.body,{status:302,headers:h});
    }
    if(request.method!=="POST" || !["/visit","/like"].includes(url.pathname))
      return json({ok:false,error:"Route not found"},404,allowedOrigin);
    if(origin!==allowedOrigin)return json({ok:false,error:"Invalid origin"},403,allowedOrigin);
    const typ=url.pathname.slice(1);
    if(Number(request.headers.get("Content-Length")||0)>512)
      return json({ok:false,error:"Body too large"},413,allowedOrigin);
    let body;
    try{body=await request.json();}catch{return json({ok:false,error:"Invalid JSON"},400,allowedOrigin);}
    if(!body||typeof body!=="object"||!KNOWN.has(body.page)||!UUID.test(body.visitor||""))
      return json({ok:false,error:"Invalid page or visitor"},400,allowedOrigin);
    const visitor=await keyOf(env,body.visitor);
    const p=body.page;
    if(!await guard(env,request,typ))return json({ok:false,error:"Rate limited"},429,allowedOrigin);
    if(typ==="visit") {
      await env.DB.prepare("INSERT OR IGNORE INTO daily_visits(page,visitor_key,day) VALUES(?,?,?)")
        .bind(p,visitor,dayKey()).run();
      await updateTotals(env,p,"views","daily_visits");
    } else {
      await env.DB.prepare("INSERT OR IGNORE INTO likes(page,visitor_key) VALUES(?,?)").bind(p,visitor).run();
      await updateTotals(env,p,"likes","likes");
    }
    return json(await stats(env,p,body.visitor),200,allowedOrigin);
  }
};
