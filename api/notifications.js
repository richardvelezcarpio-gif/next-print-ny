import webpush from "web-push";
import { requireAdmin } from "./_admin-auth.js";

const table = "portal_push_subscriptions";
const configured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const pushReady = () => Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
const emailReady = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
export default async function handler(req, res) {
  const session = requireAdmin(req, res); if (!session) return;
  const action = String(req.query?.action || req.body?.action || "status");
  if (req.method === "GET") return res.status(200).json({ pushConfigured:pushReady(), emailConfigured:emailReady(), publicKey:process.env.VAPID_PUBLIC_KEY || "", connected:false });
  if (action === "subscribe") return subscribe(req, res, session);
  if (action === "unsubscribe") return unsubscribe(req, res, session);
  if (action === "test-push") return testPush(req, res, session);
  if (action === "test-email") return testEmail(req, res);
  res.status(400).json({ error:"Unknown notification action" });
}
async function subscribe(req,res,session){ const subscription=req.body?.subscription; if(!subscription?.endpoint||!subscription?.keys?.p256dh||!subscription?.keys?.auth)return res.status(400).json({error:"Invalid push subscription"}); if(!configured())return res.status(503).json({error:"Supabase is not configured"}); const rows=await db(`${table}?endpoint=eq.${encodeURIComponent(subscription.endpoint)}&select=id`); if(rows[0])return res.status(200).json({connected:true,duplicate:true}); await db(table,{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({admin_email:session.email,endpoint:subscription.endpoint,subscription})});res.status(201).json({connected:true}); }
async function unsubscribe(req,res){ const endpoint=String(req.body?.endpoint||"");if(!endpoint)return res.status(400).json({error:"Endpoint required"});if(configured())await db(`${table}?endpoint=eq.${encodeURIComponent(endpoint)}`,{method:"DELETE"});res.status(200).json({connected:false}); }
async function testPush(req,res,session){ if(!pushReady())return res.status(503).json({error:"VAPID is not configured"});if(!configured())return res.status(503).json({error:"Supabase is not configured"});webpush.setVapidDetails("mailto:nextprintny@gmail.com",process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);const rows=await db(`${table}?admin_email=eq.${encodeURIComponent(session.email)}&select=*`);let sent=0;for(const row of rows){try{await webpush.sendNotification(row.subscription,JSON.stringify({preview:"Test notification from Next Print NY",url:"/admin-portal.html"}));sent++;}catch(error){if([404,410].includes(error.statusCode))await db(`${table}?id=eq.${row.id}`,{method:"DELETE"});}}res.status(200).json({sent,lastNotificationAt:new Date().toISOString()}); }
async function testEmail(req,res){if(!emailReady())return res.status(503).json({error:"Email notifications are not configured"});const to=process.env.ADMIN_NOTIFICATION_EMAIL||"nextprintny@gmail.com";const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to,subject:"Next Print NY — Test notification",html:"<p>Next Print NY Web Chat notification test.</p>"})});const body=await response.json();res.status(response.ok?200:502).json({sent:response.ok,id:body.id||null});}
async function db(path,options={}){const response=await fetch(`${process.env.SUPABASE_URL.replace(/\/$/,"")}/rest/v1/${path}`,{...options,headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,"Content-Type":"application/json",...(options.headers||{})}});if(!response.ok)throw new Error("Supabase failure");return response.status===204?[]:response.json();}
