import { useState, useRef, useEffect } from "react";

const NAVY = "#002942";
const NAVY_LIGHT = "#003a5c";
const YELLOW = "#FEB705";
const WHITE = "#FFFFFF";
const GRAY50 = "#F8FAFC";
const GRAY100 = "#F1F5F9";
const GRAY200 = "#E2E8F0";
const GRAY300 = "#CBD5E1";
const GRAY400 = "#94A3B8";
const GRAY600 = "#475569";
const GRAY800 = "#1E293B";
const GREEN = "#10B981";
const RED = "#EF4444";
const COACH_PASSCODE = "coach123";

const NAV_SECTIONS = [
  { id:"write",     label:"Write Post",     phases:["ch1","ch2","ch3"] },
  { id:"grouppost", label:"Post in Groups", phases:["groups","getpost","photo","dopost","approval","replicate"] },
  { id:"leads",     label:"Work Leads",     phases:["leads","amplify"] },
];
const PHASE_LABELS = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3",
  groups:"1. Join a Group", getpost:"2. Get & Copy Post",
  photo:"3. Add Photo", dopost:"4. Post It", approval:"5. Get Approval", replicate:"6. Cross-Post",
  leads:"Work Leads", amplify:"Amplify",
};
const NO_NAV_PHASES = ["lane","writechoice","voice"];

const SAMPLE_ANSWERS = {
  name:"Marcus Webb", business:"Webb Home Services",
  area:"East Nashville, Donelson, and Hermitage. 11 years.",
  fear:"Lack of communication. I send a quick text update any time something changes on a job so nobody is left wondering.",
  humanDetail:"Most Saturdays I am on the sidelines at my son baseball game with a cooler and way too much sunscreen.",
  localFlavor:"Mas Tacos Por Favor in East Nashville. Always get the chicken taco plate standing outside on the sidewalk.",
  mission:"hot chicken",
  whyStarted:"I remember sitting in my truck after a call feeling sick because my old company wanted me to push a bigger job the homeowner did not need.",
  whatChanged:"I am home to eat dinner with my family instead of coming in after everyone is asleep.",
  heroMoment:"An elderly woman called me at 7pm on Christmas Eve. Her heat had been out two days and grandkids were coming. I drove 40 minutes, worked in the cold, only charged her for the part. She grabbed my hand and said she would tell everyone she knew. She has sent four referrals.",
};

const ALL_QUESTIONS = [
  { id:"name", num:1, chapter:"ch1", minWords:2, validate:"name", label:"Your Name", question:"What is your first and last name?", hint:"Write it exactly how you want it shown publicly.", examples:["Daniel Reyes","Taryn Sinnen"], voiceQ:"What is your first and last name, exactly how you want it shown publicly?", placeholder:"e.g. Daniel Reyes" },
  { id:"business", num:2, chapter:"ch1", minWords:1, validate:"business", label:"Business Name", question:"What is your business name as it appears online?", hint:"Use the exact spelling and spacing people would see on Google or Facebook.", examples:["Reyes Heating and Air","Zach's Mobile Repair"], voiceQ:"What is your business name exactly as it appears on Google or Facebook?", placeholder:"e.g. Reyes Heating and Air" },
  { id:"area", num:3, chapter:"ch1", minWords:6, validate:"area", label:"Service Area", question:"What is your service area, and how long have you been serving it?", hint:"List your main city plus nearby areas. Then add how long you have served there.", examples:["Nashville, Donelson, Mt. Juliet. 14 years.","Mesa, Gilbert, Chandler. 8 years."], voiceQ:"What is your service area and how long have you been serving it?", placeholder:"e.g. Nashville, Donelson, Mt. Juliet. 14 years." },
  { id:"fear", num:4, chapter:"ch1", minWords:12, validate:"fear", label:"Customer Fear You Fix", question:"Which customer fear do you focus on overcoming most, and what is the one thing you do every job so customers never feel that fear?", hint:"Pick ONE fear, then give ONE habit you do every job. Keep it simple and real.", examples:["Lack of communication. I send a quick update any time something changes so nobody is left wondering.","Getting overcharged. I show options and prices before I start and the final invoice always matches what we agreed to."], voiceQ:"Homeowners have three big fears: getting overcharged, being left with a mess, or lack of communication. Which one do you focus on overcoming, and what is one specific thing you do every job so customers never feel that fear?", placeholder:"e.g. Lack of communication. I send a quick update any time something changes.", fearChips:["Getting overcharged","Being left with a mess","Lack of communication"] },
  { id:"humanDetail", num:5, chapter:"ch2", minWords:6, label:"Real Life Detail", question:"What is one specific real life detail about you that neighbors would relate to?", hint:"Pick ONE and be specific. Family moment, hobby, weekend routine, a goal you are working on.", examples:["Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen.","I am restoring a 1991 candy-green Chevy with my son and we are slowly learning that one quick fix is always a lie."], voiceQ:"Tell me one specific real life detail about you that neighbors would relate to.", placeholder:"e.g. Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen." },
  { id:"localFlavor", num:6, chapter:"ch2", minWords:8, validate:"localFlavor", label:"Local Place You Love", question:"What is one specific local place you love, and what do you do there or always get there?", hint:"Use the real name of the place.", examples:["Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets.","Shelby Bottoms Greenway, we ride bikes to the overlook then get ice cream on the way back."], voiceQ:"What is one specific local place you genuinely love? Give me the real name and tell me what you always do or get there.", placeholder:"e.g. Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets." },
  { id:"mission", num:7, chapter:"ch2", minWords:1, label:"Mission Fill-in", question:"Fill in the blank: I am on a mission to find the best ______. Any suggestions?", hint:"Choose something people have strong opinions on. Keep it short.", examples:["tacos","pizza","breakfast spot","coffee","donuts","BBQ"], voiceQ:"Fill in this blank: I am on a mission to find the best blank in my city. What is it?", placeholder:"e.g. tacos", missionChips:["donuts","pizza","breakfast spot","coffee","tacos","BBQ"] },
  { id:"whyStarted", num:8, chapter:"ch3", minWords:12, label:"Why You Started", question:"What is the real moment that pushed you to start your own business?", hint:"Tell it like you would tell a friend. Include what you felt in that moment.", examples:["I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a bigger job the homeowner did not need.","I missed one too many dinners and my kid asked if I was working again."], voiceQ:"Tell me the real moment that pushed you to start your own business.", placeholder:"e.g. I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a job the homeowner did not need." },
  { id:"whatChanged", num:9, chapter:"ch3", minWords:10, label:"What Changed After", question:"After you started your business, what is one real-life thing you can do now that you could not before?", hint:"Make it something a neighbor can picture in one sentence.", examples:["I am home to eat dinner with my family instead of coming in after everyone is asleep.","I can coach my kid's team on weeknights and I do not miss games anymore."], voiceQ:"After starting your own business, what is one real thing you can do now that you could not do before?", placeholder:"e.g. I am home to eat dinner with my family instead of coming in after everyone is asleep." },
  { id:"heroMoment", num:10, chapter:"ch3", minWords:25, validate:"hero", label:"Hero Moment", question:"Tell one Hero Moment story where you helped a customer. What was happening, what did you do, and what did they say or do after?", hint:"Tell it like a short scene. Include one detail you remember so it feels real.", examples:["A single mom had no AC during a heat wave. I found it was a capacitor, fixed it fast, and she just exhaled and said thank you for not scaring me.","An older homeowner smelled gas and was scared. I shut everything down, found the leak, made it safe, and he kept saying nobody has ever explained it to me like that."], voiceQ:"Tell me one Hero Moment story. A time you went above and beyond for a customer. What was happening, what did you do, and what did they say or do after?", placeholder:"What was happening...\nWhat did you do...\nWhat did they say or do after..." },
];

const ch1Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch1");
const ch2Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch2");
const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");

const BOOKING = "I have got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";

const LEAD_TYPES = [
  { id:"like", emoji:"👍", label:"Like or Emoji", color:"#FEF9EC", border:YELLOW, simple:true, steps:[{label:"Within 24 hours, send this DM to each person who reacted",script:"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?"},{label:"Then follow the DM strategy based on their response",note:true}] },
  { id:"comment", emoji:"💬", label:"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false, subtypes:[
    {id:"cs1",label:"Asked about a service you offer",example:"Do you do drain cleaning?",publicReplies:["@[Name] great question. I do handle [service type], and quality is always guaranteed."],dmScript:"Hey [Name], thanks so much for commenting. We absolutely can help with [service]. "+BOOKING},
    {id:"cs2",label:"Asked about your service area",example:"Do you service Donelson?",publicReplies:["@[Name] great question. We do service [city name], we would love to help you out."],dmScript:"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious, is there something specific going on I can help with?"},
    {id:"cs3",label:"Needs help now",example:"I was just about to call someone!",publicReplies:["@[Name] we would love to help serve you and your family."],dmScript:"Hey [Name], so glad you reached out. "+BOOKING},
    {id:"cs4",label:"Praise or encouragement",example:"Love this post! Keep it up!",publicReplies:["@[Name] really appreciate the kind words! Makes all the long days worth it."],dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you."},
    {id:"cs5",label:"Past customer or testimonial",example:"He did great work for us last year!",publicReplies:["@[Name] repeat customers like you are what keep me going. Grateful for your support."],dmScript:"Your recommendation means the world to me. Do you know anyone else who could use [services]?"},
    {id:"cs6",label:"Referral or future interest",example:"I will share this with my neighbor!",publicReplies:["@[Name] really appreciate that. Supporting local businesses helps the whole community."],dmScript:"Hey [Name], the best compliment someone can give us is to refer us. Could you share their name and phone number?"},
    {id:"cs7",label:"Community connection",example:"We need more people like you!",publicReplies:["@[Name] thank you. Our community deserves honest work and that is what I will always stand for."],dmScript:"I love being part of [city/community]. If you ever need help at your place, I would be glad to."},
  ]},
  { id:"share", emoji:"🔁", label:"Share", color:"#F0FDF4", border:"#86EFAC", simple:true, steps:[{label:"Comment on their share",script:"@[Name] really appreciate that. Supporting local businesses helps the whole community."},{label:"Then send this DM",script:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you."}] },
  { id:"dm", emoji:"✉️", label:"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false, subtypes:[
    {id:"ds1",label:"Asked about a service you offer",example:"Do you do water heater installs?",dmScript:"Hey, thanks so much for reaching out. We absolutely can help with [service name]. "+BOOKING},
    {id:"ds2",label:"Asked about a service you do not offer",example:"Do you do roof repairs?",dmScript:"Hey, thanks so much for reaching out. We do not provide [service] but we do provide [your services]. Is there another item on your to-do list we can help with?"},
    {id:"ds3",label:"General question or area check",example:"Do you service Hermitage?",dmScript:"Hey, thanks so much for reaching out. [Insert your answer to their question here.]"},
    {id:"ds4",label:"Needs help now",example:"I was just about to call someone!",dmScript:"Hey, thanks so much for reaching out. "+BOOKING},
    {id:"ds5",label:"Praise or encouragement",example:"Way to go! Love what you are doing.",dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you."},
    {id:"ds6",label:"Past customer or testimonial",example:"He did our siding last year, highly recommend!",dmScript:"Your recommendation means the world to me. Do you know anyone else who could use [services]?"},
    {id:"ds7",label:"Referral or future interest",example:"Can you help my friend?",dmScript:"Hey, thanks so much for reaching out. Could you share their name and phone number?"},
    {id:"ds8",label:"Community connection",example:"We need more people like you!",dmScript:"I love being part of [city/community]. If you ever need help at your place, I would be glad to."},
    {id:"ds9",label:"Competitor or peer",example:"We do the same services in another town.",dmScript:"Great to hear from you. If you ever have overflow jobs outside your focus, feel free to send them my way."},
    {id:"ds10",label:"Emotional support or values-based",example:"I am so proud of you. Blessings to you!",dmScript:"That is so kind of you. Messages like this remind me why I started this business. Thank you."},
  ]},
];

const T = {
  en:{ voiceIntro:"Hey! I am going to walk you through a series of questions to build your story. Tap Start and I will guide you through everything.", voiceStart:"Start Voice Session", voiceDone:"That is everything I need. Amazing work. Let us build your post now.", listenHint:"Listening - speak your answer", processing:"Processing...", answeredSoFar:"Your Answers So Far", rerecord:"Re-record" },
  es:{ voiceIntro:"Hola! Voy a guiarte por una serie de preguntas.", voiceStart:"Iniciar Sesion de Voz", voiceDone:"Eso es todo. Excelente trabajo.", listenHint:"Escuchando", processing:"Procesando...", answeredSoFar:"Tus Respuestas", rerecord:"Re-grabar" },
};

const HOME_T = {
  en:{ headline1:"Turn Your Story Into", headline2:"Jobs on Your Calendar", subheadline:"Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.", stat1:"~29 min total", stat2:"10 group posts", stat3:"Real leads, real jobs", continueLabel:"Continue where you left off", cta0:"Start Writing Your Post", cta1:"Generate Your Post", cta2:"Cross-Post to More Groups", cta3:"Work Your Leads", checklistTitle:"Your Week 1 Checklist", writeTitle:"Write Post", writeDesc:"Answer 10 questions. AI writes your trust-building post.", writeTime:"~8 min", groupsTitle:"Post in Groups", groupsDesc:"Find local Facebook groups and replicate your post to 10.", groupsTime:"~15 min", leadsTitle:"Work Leads", leadsDesc:"Turn every like, comment, share, and DM into a booked job.", leadsTime:"~5 min", leadsProgress:"Scripts for every engagement type", statusNotStarted:"Not Started", statusInProgress:"In Progress", statusDone:"Done", ofAnswered:"of 10 answered", ofGroups:"of 10 groups posted", typeTitle:"Type My Answers", typeDesc:"Fill in each question at your own pace. Mic icon available.", voiceTitle:"Talk Through It", voiceDesc:"Speak your answers. An AI coach guides you through every question.", howStart:"How would you like to answer the questions?", writePostTitle:"Write Your Post" },
  es:{ headline1:"Convierte Tu Historia en", headline2:"Trabajos en Tu Calendario", subheadline:"Construye una publicacion de Facebook.", stat1:"~29 min", stat2:"10 publicaciones", stat3:"Leads reales", continueLabel:"Continuar", cta0:"Empezar", cta1:"Generar", cta2:"Publicar en Mas Grupos", cta3:"Trabajar Leads", checklistTitle:"Tu Lista", writeTitle:"Escribir", writeDesc:"10 preguntas.", writeTime:"~8 min", groupsTitle:"Publicar", groupsDesc:"Grupos locales.", groupsTime:"~15 min", leadsTitle:"Leads", leadsDesc:"Convierte cada engagement.", leadsTime:"~5 min", leadsProgress:"Scripts", statusNotStarted:"Sin Empezar", statusInProgress:"En Progreso", statusDone:"Listo", ofAnswered:"de 10", ofGroups:"de 10", typeTitle:"Escribir", typeDesc:"A tu ritmo.", voiceTitle:"Hablar", voiceDesc:"Di tus respuestas.", howStart:"Como quieres responder?", writePostTitle:"Escribe" },
};

const FILLER_REGEX = /^(i mean|uh|um|like|okay|ok|yeah|yes|no|hold on|wait|sorry|hmm|hm|ah|oh|er|right|sure|well|so|and|the|a|an|just|alright|hi|hello|hey)[\s.,!?]*$/i;

function wordCount(s) { return (s || "").trim().split(/\s+/).filter(Boolean).length; }

function validateAnswer(q, text) {
  const t = text.trim(), words = t.split(/\s+/).filter(Boolean);
  if (FILLER_REGEX.test(t)) return { ok:false, reason:"filler" };
  if (words.length < q.minWords) return { ok:false, reason:"short" };
  if (q.validate === "name") {
    const nw = t.replace(/[^a-zA-Z\s'-]/g,"").trim().split(/\s+/).filter(Boolean);
    if (nw.length < 2) return { ok:false, reason:"not_a_name" };
    if (/\b(timer|alarm|minute|second|siri|google|alexa|cancel|stop)\b/i.test(t)) return { ok:false, reason:"not_a_name" };
    if (!nw.some(w => w.length >= 2 && /^[A-Za-z]+$/.test(w))) return { ok:false, reason:"not_a_name" };
  }
  if (q.validate === "area") {
    if (!/\b(\d+\s*(year|yr|years|month|months|decade)|for\s+\d+|going on\s+\d+|almost\s+\d+|over\s+\d+|nearly\s+\d+|new to|just moved|building our life|\d+\+?\s*year)/i.test(t)) return { ok:false, reason:"missing_duration" };
  }
  if (q.validate === "localFlavor") { if (words.length < 6) return { ok:false, reason:"needs_more" }; }
  if (q.validate === "hero") { if (words.length < 25) return { ok:false, reason:"short" }; }
  return { ok:true };
}

const FOLLOWUP_TEMPLATES = {
  name: ["I did not catch a full name. What is your first and last name?"],
  business: ["What is the exact name of your business as it appears on Google or Facebook?"],
  area: { missing_duration: ["And how long have you been serving that area?"], default: ["How long have you been serving that area?"] },
  fear: ["Pick one of the three fears and tell me one specific thing you do every job to prevent it."],
  humanDetail: ["Add one more detail. A name, a number, a place, or a year."],
  localFlavor: ["Give me the actual name of the spot and one thing you always do or order there."],
  mission: ["Just say the one thing. Tacos, pizza, donuts, coffee, whatever people have strong opinions on."],
  whyStarted: ["What were you actually feeling in that moment?"],
  whatChanged: ["Make it something a neighbor can picture. One real thing different in your daily life now."],
  heroMoment: ["Add one more detail. What did they say, what did you see, or what do you still remember?"],
};

async function callClaude(messages, system) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:2000, messages };
  if (system) body.system = system;
  const isDeployed = typeof window !== "undefined" && window.location.hostname !== "localhost" && !window.location.hostname.includes("claude.ai");
  const url = isDeployed ? "/api/claude" : "https://api.anthropic.com/v1/messages";
  const r = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  const d = await r.json();
  return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("") || "";
}

async function findFacebookGroups(city, count) {
  const isDeployed = typeof window !== "undefined" && window.location.hostname !== "localhost" && !window.location.hostname.includes("claude.ai");
  if (isDeployed) {
    try {
      const prompt = "Generate " + count + " realistic Facebook group names for the " + city + " area that a home service contractor could post in. Sort Public groups first. Return ONLY a valid JSON array, no markdown:\n[{\"name\":\"Full Group Name\",\"type\":\"Community\",\"members\":\"4.2K\",\"privacy\":\"Public or Private\"}]";
      const reply = await callClaude([{ role:"user", content:prompt }]);
      const cleaned = reply.replace(/```json/gi,"").replace(/```/g,"").trim();
      const start = cleaned.indexOf("["), end = cleaned.lastIndexOf("]");
      if (start === -1 || end === -1) throw new Error("no array");
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("empty");
      return parsed.filter(g => g.name).map(g => ({ ...g, url:"https://www.facebook.com/groups/search/?q=" + encodeURIComponent(g.name) }));
    } catch(err) {}
  }
  return buildFacebookGroups(city, count);
}

function buildFacebookGroups(city, count) {
  const suffixes = [
    "Community", "Homeowners", "Neighbors", "Buy Sell Trade", "Family Connect",
    "Home Improvement", "Local Recommendations", "Moms and Dads", "Real Estate",
    "DIY Home Tips", "Small Business Network", "Weekend Warriors", "Local Events",
    "Community Watch", "Local Foodies", "Pet Owners", "Backyard Gardeners",
    "New Residents", "Outdoor Adventures", "Volunteer Network",
  ];
  return suffixes.slice(0, count).map((suffix, i) => ({
    name: city + " " + suffix,
    type: i < 5 ? "Community" : i < 10 ? "Homeowners" : "Neighborhood",
    privacy: i % 3 === 1 ? "Private" : "Public",
    members: (Math.floor(Math.random() * 18) + 1) + "." + Math.floor(Math.random() * 9) + "K",
    url: "https://www.facebook.com/groups/search/?q=" + encodeURIComponent(city + " " + suffix),
  }));
}

function findFacebookGroups(city, count) {
  return Promise.resolve(buildFacebookGroups(city, count));
}

async function generateAIPost(ans) {
  const city = (ans.area || "").split(/[,.]/)[0].trim() || "my city";
  const prompt = [
    "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.",
    "STRICT NO-HALLUCINATION: Use ONLY facts explicitly stated below.",
    "Answers:",
    "1. Name: " + (ans.name || ""),
    "2. Business: " + (ans.business || ""),
    "3. Area: " + (ans.area || ""),
    "4. Customer fear: " + (ans.fear || ""),
    "5. Real life detail: " + (ans.humanDetail || ""),
    "6. Local flavor: " + (ans.localFlavor || ""),
    "7. Mission: " + (ans.mission || ""),
    "8. Why started: " + (ans.whyStarted || ""),
    "9. What changed: " + (ans.whatChanged || ""),
    "10. Hero moment: " + (ans.heroMoment || ""),
    "RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. No em dashes. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.",
    "STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Fear + habit, (4) Hero moment as vivid scene, (5) Neighbor proof with real life detail + local flavor, (6) End ONLY with: Also, I am on a mission to find the best " + (ans.mission || "[mission]") + " in " + city + ". Any suggestions?",
    "Output post only. No labels.",
  ].join("\n");
  return await callClaude([{ role:"user", content:prompt }]);
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={{ background:WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:20, ...(style||{}) }}>{children}</div>;
}

function Btn({ children, onClick, variant, style, disabled }) {
  const v = variant || "primary";
  const base = { border:"none", borderRadius:10, padding:"13px 24px", fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 };
  const vars = { primary:{ background:YELLOW, color:NAVY }, secondary:{ background:NAVY, color:WHITE }, success:{ background:GREEN, color:WHITE }, ghost:{ background:GRAY100, color:GRAY600 } };
  return <button onClick={onClick} disabled={!!disabled} style={{ ...base, ...(vars[v]||vars.primary), opacity:disabled?0.5:1, ...(style||{}) }}>{children}</button>;
}

function CardNav({ onBack, onNext, nextDisabled, nextLabel, backLabel, firstQuestion }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const containerStyle = { display:"flex", flexDirection:isMobile&&!firstQuestion?"column-reverse":"row", justifyContent:firstQuestion?"flex-end":"space-between", alignItems:"stretch", gap:16, marginTop:24, paddingTop:20, borderTop:"1px solid "+GRAY100 };
  const baseBtn = { border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", minHeight:60, width:isMobile&&!firstQuestion?"100%":"auto", padding:isMobile?"0 24px":"0 28px" };
  return (
    <div style={containerStyle}>
      {onBack && !firstQuestion && <button onClick={onBack} style={{ ...baseBtn, background:GRAY100, color:GRAY600 }}>{backLabel || "Back"}</button>}
      {onNext && <button onClick={onNext} disabled={!!nextDisabled} style={{ ...baseBtn, background:YELLOW, color:NAVY, opacity:nextDisabled?0.4:1 }}>{nextLabel || "Next"}</button>}
    </div>
  );
}

function BottomNav({ onBack, onNext, nextDisabled, nextLabel }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:90, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(8px)", borderTop:"2px solid "+GRAY200, padding:"14px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      {onBack ? <Btn variant="ghost" onClick={onBack} style={{ minWidth:110 }}>Back</Btn> : <div/>}
      {onNext ? <Btn variant="primary" onClick={onNext} disabled={!!nextDisabled} style={{ minWidth:110 }}>{nextLabel || "Next"}</Btn> : <div/>}
    </div>
  );
}

function NavSpacer() { return <div style={{ height:80 }}/>; }

function SectionHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:32, marginBottom:8 }}>{emoji}</div>
      <h2 style={{ fontSize:22, fontWeight:800, color:NAVY, margin:0 }}>{title}</h2>
      {subtitle && <p style={{ color:GRAY600, margin:"8px 0 0", fontSize:14, lineHeight:1.6 }}>{subtitle}</p>}
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display:"inline-flex", border:"2px solid "+NAVY, borderRadius:10, overflow:"hidden", marginBottom:20 }}>
      {["en","es"].map(l => <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?NAVY:WHITE, color:lang===l?YELLOW:NAVY, border:"none", padding:"7px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>{l==="en"?"English":"Espanol"}</button>)}
    </div>
  );
}

function PhaseNav({ current, onNavigate, completedSections }) {
  if (NO_NAV_PHASES.includes(current)) return null;
  const activeSection = NAV_SECTIONS.find(s => s.phases.includes(current));
  if (!activeSection) return null;
  const isWrite = activeSection.id === "write";
  const subPhases = activeSection.phases;
  const currentSubIdx = subPhases.indexOf(current);
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", gap:10, alignItems:"stretch" }}>
        {NAV_SECTIONS.map(section => {
          const sectionActive = section.phases.includes(current);
          const sectionDone = completedSections.includes(section.id);
          return (
            <div key={section.id} style={{ flex:1, minWidth:0 }}>
              <div onClick={() => onNavigate && onNavigate(section.phases[0])} style={{ background:sectionDone?GREEN:sectionActive?NAVY:GRAY200, color:sectionDone?WHITE:sectionActive?YELLOW:GRAY600, borderRadius:sectionActive&&!isWrite?"10px 10px 0 0":10, padding:"10px 14px", fontSize:13, fontWeight:800, textAlign:"center", cursor:"pointer", userSelect:"none" }}>
                {sectionDone ? "✓ " : ""}{section.label}
              </div>
              {sectionActive && !isWrite && (
                <div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderTop:"none", borderRadius:"0 0 10px 10px", padding:"10px", display:"flex", flexDirection:"column", gap:8 }}>
                  {subPhases.map((p, i) => {
                    const isDone = i < currentSubIdx, isActive = p === current;
                    return (
                      <button key={p} onClick={e => { e.stopPropagation(); onNavigate && onNavigate(p); }} style={{ width:"100%", minHeight:54, border:"none", borderRadius:8, fontSize:14, fontWeight:700, background:isDone?"#D1FAE5":isActive?YELLOW:GRAY200, color:isDone?"#065F46":isActive?NAVY:GRAY400, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px", textAlign:"center", lineHeight:1.3, boxShadow:isActive?"0 2px 8px rgba(254,183,5,0.35)":"none", transition:"all 0.15s" }}>
                        {isDone ? "✓ " : ""}{PHASE_LABELS[p] || p}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupTable({ groups, showNum }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {groups.map((g, i) => (
        <div key={i} style={{ background:i%2===0?WHITE:GRAY50, border:"1px solid "+GRAY200, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          {showNum && <div style={{ color:GRAY400, fontWeight:700, fontSize:12, minWidth:24 }}>{i+2}</div>}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:2 }}>{g.name}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ background:g.privacy==="Public"?"#D1FAE5":"#FEF9EC", color:g.privacy==="Public"?"#065F46":"#92400E", borderRadius:99, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{g.privacy || "—"}</span>
              <span style={{ fontSize:11, color:GRAY400 }}>{g.members || ""} {g.type}</span>
            </div>
          </div>
          <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:WHITE, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, display:"inline-flex", alignItems:"center", gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Open in Facebook
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Voice Mode ────────────────────────────────────────────────────────────────
function VoiceMode({ onComplete, lang }) {
  const t = T[lang] || T.en;
  const ttsLang = lang === "es" ? "es-ES" : "en-US";
  const S = useRef({ qIdx:0, answers:{}, rerecordId:null, busy:false, wantMic:false, followupCount:0, partialAnswers:{}, forcedAccept:null });
  const currentAudioRef = useRef(null);
  const [displayQIdx, setDisplayQIdx] = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState({});
  const [coachMsg, setCoachMsg] = useState(t.voiceIntro);
  const [transcript, setTranscript] = useState("");
  const [uiStatus, setUiStatus] = useState("idle");
  const [micErr, setMicErr] = useState("");
  const [paused, setPaused] = useState(false);
  const recogRef = useRef(null);

  function openMic() {
    if (!recogRef.current || S.current.busy) return;
    S.current.wantMic = true;
    try { recogRef.current.start(); setUiStatus("listening"); setMicErr(""); } catch(_) {}
  }
  function closeMic() {
    S.current.wantMic = false;
    try { if (recogRef.current) recogRef.current.stop(); } catch(_) {}
  }
  function coachSay(msg, afterSpeak) {
    S.current.busy = true; S.current.wantMic = false; closeMic();
    setCoachMsg(msg); setUiStatus("speaking");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = ttsLang; u.rate = 0.95; u.pitch = 1.05;
      const safety = setTimeout(() => { window.speechSynthesis.cancel(); S.current.busy = false; if (afterSpeak) afterSpeak(); else openMic(); }, Math.max(3000, msg.length * 65));
      u.onend = () => { clearTimeout(safety); S.current.busy = false; if (afterSpeak) afterSpeak(); else openMic(); };
      u.onerror = () => { clearTimeout(safety); S.current.busy = false; if (afterSpeak) afterSpeak(); else openMic(); };
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => { S.current.busy = false; if (afterSpeak) afterSpeak(); else openMic(); }, 500);
    }
  }
  function pauseSession() {
    setPaused(true); closeMic();
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    S.current.busy = false; S.current.wantMic = false; setUiStatus("idle");
  }
  function resumeSession() {
    setPaused(false);
    const q = S.current.rerecordId ? ALL_QUESTIONS.find(x => x.id === S.current.rerecordId) : ALL_QUESTIONS[S.current.qIdx];
    coachSay("Welcome back! Let us pick up where we left off. " + (q.voiceQ || q.hint), () => openMic());
  }

  async function handleAnswer(text) {
    const qIdx = S.current.qIdx, rerecordId = S.current.rerecordId;
    const q = rerecordId ? ALL_QUESTIONS.find(x => x.id === rerecordId) : ALL_QUESTIONS[qIdx];
    const isLast = !rerecordId && qIdx === ALL_QUESTIONS.length - 1;
    const nextQ = isLast ? null : ALL_QUESTIONS[qIdx + 1];
    const validation = validateAnswer(q, text);
    if (!validation.ok) {
      const isAdditive = ["area","heroMoment","humanDetail","localFlavor","whyStarted","whatChanged","fear"].includes(q.id);
      const ep = S.current.partialAnswers[q.id] || "";
      if (isAdditive && text.trim().length > 3 && validation.reason !== "filler" && validation.reason !== "not_a_name") S.current.partialAnswers[q.id] = ep ? ep + " " + text : text;
      const templates = FOLLOWUP_TEMPLATES[q.id];
      let retryMsg = q.id === "area" && validation.reason === "missing_duration" ? templates.missing_duration[0] : validation.reason === "not_a_name" || validation.reason === "filler" ? (Array.isArray(templates) ? templates[0] : templates.default[0]) : (Array.isArray(templates) ? templates[0] : (templates.default ? templates.default[0] : q.voiceQ));
      S.current.followupCount = (S.current.followupCount || 0) + 1;
      if (S.current.followupCount >= 2) {
        const combined = ep ? ep + " " + text : text;
        if (combined.trim().length > 3) S.current.forcedAccept = combined;
        else { S.current.busy = false; openMic(); return; }
      } else {
        setTranscript(""); coachSay(retryMsg, () => openMic()); return;
      }
    }
    S.current.followupCount = 0;
    const partial = S.current.partialAnswers[q.id], forcedAccept = S.current.forcedAccept;
    const finalText = forcedAccept || (partial && !partial.includes(text.trim()) ? partial + " " + text : text);
    if (S.current.partialAnswers[q.id]) delete S.current.partialAnswers[q.id];
    if (S.current.forcedAccept) S.current.forcedAccept = null;
    const nextVoiceQ = rerecordId ? null : (nextQ ? (nextQ.voiceQ || nextQ.hint) : null);
    const sysPrompt = "You are a warm conversational business coach. NEVER use filler words: Perfect, Love that, Great, Awesome, Got it, Amazing, Wonderful. React to ONE specific detail. 1-2 sentences max. " + (rerecordId ? "Confirm their answer is saved and move on naturally." : ("Ask EXACTLY: " + (nextVoiceQ || "[end]") + ". NEVER introduce new subjects.")) + " Start with ACCEPT.";
    const userPrompt = "They answered Q" + q.num + " (" + q.label + ").\nAnswer: \"" + finalText + "\"\n" + (isLast ? "Last question. Start with ACCEPT then say: " + t.voiceDone : rerecordId ? "Re-recorded answer. Start with ACCEPT, briefly confirm it sounds good." : "Start with ACCEPT, react briefly, then ask: " + nextVoiceQ);
    let reply = "";
    try {
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 9000));
      reply = await Promise.race([callClaude([{ role:"user", content:userPrompt }], sysPrompt), timeout]);
    } catch(_) { reply = "ACCEPT " + (nextVoiceQ || t.voiceDone); }
    if (!reply) { S.current.busy = false; openMic(); return; }
    const msg = reply.replace(/^ACCEPT\s*/i, "").trim();
    const id = rerecordId || q.id;
    S.current.answers = { ...S.current.answers, [id]:finalText };
    S.current.rerecordId = null;
    setDisplayAnswers({ ...S.current.answers });
    setTranscript("");
    if (isLast) {
      const fa = { ...S.current.answers };
      coachSay(msg || t.voiceDone, () => { setUiStatus("done"); setDisplayAnswers(fa); });
    } else if (rerecordId) {
      coachSay(msg, () => openMic());
    } else {
      S.current.qIdx = qIdx + 1;
      setDisplayQIdx(qIdx + 1);
      coachSay(msg, () => openMic());
    }
  }

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous = false; r.interimResults = true; r.lang = ttsLang;
    r.onresult = e => {
      const latest = e.results[e.results.length - 1];
      const it = latest[0].transcript;
      setTranscript(it);
      if (!latest.isFinal) return;
      if (!it.trim() || S.current.busy) return;
      S.current.busy = true; S.current.wantMic = false; setUiStatus("thinking");
      handleAnswer(it.trim());
    };
    r.onerror = e => {
      if (e.error === "no-speech") { if (S.current.wantMic && !S.current.busy) try { r.start(); } catch(_) {} return; }
      S.current.wantMic = false; setMicErr(e.error === "not-allowed" ? "Mic blocked." : "Mic error: " + e.error); setUiStatus("idle");
    };
    r.onend = () => {
      if (S.current.wantMic && !S.current.busy && !paused) { setTimeout(() => { if (S.current.wantMic && !S.current.busy) try { r.start(); } catch(_) {} }, 800); } else { setUiStatus(u => u === "listening" ? "idle" : u); }
    };
    recogRef.current = r;
    return () => { S.current.wantMic = false; S.current.busy = false; try { r.stop(); } catch(_) {} if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, [lang]);

  function handleStart() {
    const first = ALL_QUESTIONS.findIndex(q => !S.current.answers[q.id]);
    const idx = first === -1 ? 0 : first;
    S.current.qIdx = idx; setDisplayQIdx(idx); S.current.followupCount = 0;
    const q = ALL_QUESTIONS[idx];
    const intro = idx > 0 ? "Welcome back! " + (q.voiceQ || q.hint) : "Alright, let us build your story! Just talk to me like a friend. Here we go: " + (q.voiceQ || q.hint);
    coachSay(intro, () => openMic());
  }

  function handleRerecord(id) {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    S.current.busy = false; S.current.wantMic = false; closeMic();
    S.current.rerecordId = id; S.current.followupCount = 0;
    const q = ALL_QUESTIONS.find(x => x.id === id);
    setTranscript("");
    setTimeout(() => { coachSay("No problem, let us redo that one. " + (q.voiceQ || q.hint), () => openMic()); }, 200);
  }

  const answeredCount = Object.values(displayAnswers).filter(v => v && v.trim()).length;
  const activeQ = (S.current.rerecordId ? ALL_QUESTIONS.find(x => x.id === S.current.rerecordId) : ALL_QUESTIONS[displayQIdx]) || ALL_QUESTIONS[0];
  const isListening = uiStatus === "listening", isThinking = uiStatus === "thinking", isSpeaking = uiStatus === "speaking";

  return (
    <div>
      <Card style={{ background:NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ background:YELLOW, borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={NAVY}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
          </div>
          <div style={{ flex:1 }}>
            {isThinking ? <p style={{ color:GRAY400, fontSize:14, margin:0, fontStyle:"italic" }}>{t.processing}</p> : <p style={{ color:WHITE, fontSize:16, margin:0, lineHeight:1.8 }}>{coachMsg}</p>}
          </div>
        </div>
      </Card>
      {paused && (
        <Card style={{ textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⏸️</div>
          <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 8px" }}>Session Paused</h3>
          <p style={{ color:GRAY600, fontSize:14, margin:"0 0 20px" }}>Your answers are saved.</p>
          <Btn onClick={resumeSession}>Resume Session</Btn>
        </Card>
      )}
      {!paused && uiStatus !== "idle" && uiStatus !== "done" && (
        <Card>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:8, paddingBottom:8 }}>
            <div style={{ position:"relative" }}>
              <button type="button" onClick={isListening ? closeMic : openMic} disabled={isThinking || isSpeaking} style={{ background:isListening?RED:isSpeaking||isThinking?GRAY400:GRAY200, border:"none", borderRadius:"50%", width:80, height:80, cursor:isThinking||isSpeaking?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isListening?"0 0 0 10px rgba(239,68,68,0.15)":"none", transition:"all 0.3s" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill={isListening?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
              </button>
              {isSpeaking && <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:"3px solid "+YELLOW, opacity:0.6 }}/>}
            </div>
            <span style={{ fontSize:13, color:isListening?RED:isSpeaking?YELLOW:GRAY400, fontWeight:isListening||isSpeaking?600:400, textAlign:"center" }}>{isListening ? t.listenHint : isThinking ? t.processing : isSpeaking ? "Coach speaking..." : "Tap to start listening"}</span>
            {micErr && <span style={{ fontSize:12, color:RED, textAlign:"center", maxWidth:280 }}>{micErr}</span>}
            {transcript && <div style={{ background:"#F0F7FF", border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", width:"100%", boxSizing:"border-box", fontSize:14, color:GRAY800, lineHeight:1.7 }}><div style={{ fontSize:11, color:GRAY400, marginBottom:4, fontWeight:600 }}>YOU SAID:</div>{transcript}</div>}
            <button onClick={pauseSession} style={{ marginTop:4, background:"none", border:"1.5px solid "+GRAY300, borderRadius:8, padding:"6px 18px", fontSize:12, color:GRAY600, cursor:"pointer", fontWeight:600 }}>Pause Session</button>
          </div>
          {activeQ && (
            <div style={{ marginTop:12, padding:"12px 14px", background:GRAY50, borderRadius:10 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                <span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{activeQ.num}</span>
                <span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{activeQ.question}</span>
              </div>
              <p style={{ fontSize:12, color:GRAY600, margin:"0 0 8px", lineHeight:1.5 }}>{activeQ.hint}</p>
              {activeQ.examples && activeQ.examples.length > 0 && (
                <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:8 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:GRAY400, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Examples</p>
                  {activeQ.examples.map((ex, i) => <p key={i} style={{ fontSize:12, color:GRAY800, margin:"0 0 4px", lineHeight:1.5, fontStyle:"italic" }}>"{ex}"</p>)}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
      {!paused && uiStatus !== "idle" && (
        <div style={{ marginBottom:12, marginTop:8 }}>
          <div style={{ background:GRAY200, borderRadius:99, height:6, overflow:"hidden" }}>
            <div style={{ background:YELLOW, borderRadius:99, height:6, width:Math.round((answeredCount/ALL_QUESTIONS.length)*100)+"%", transition:"width 0.4s" }}/>
          </div>
        </div>
      )}
      {uiStatus === "idle" && !paused && <div style={{ textAlign:"center", marginTop:8 }}><Btn onClick={handleStart}>{t.voiceStart}</Btn></div>}
      {answeredCount > 0 && (
        <Card>
          <h3 style={{ color:NAVY, margin:"0 0 16px", fontSize:16 }}>📝 {t.answeredSoFar}</h3>
          {ALL_QUESTIONS.filter(q => displayAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+GRAY200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                    <span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{q.num}</span>
                    <span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{q.question}</span>
                  </div>
                  <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{displayAnswers[q.id]}</p>
                </div>
                <button onClick={() => handleRerecord(q.id)} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, color:GRAY600, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>{t.rerecord}</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {uiStatus === "done" && <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><Btn variant="primary" onClick={() => onComplete({ ...S.current.answers })}>Next</Btn></div>}
    </div>
  );
}

// ── Get & Copy Post ───────────────────────────────────────────────────────────
function GetPost({ allCh3Met, post, postLoading, postError, answers, onGenerate, onSetPost, onNext, onBack, onWritePost }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current || !post) return;
    textareaRef.current.style.height = "auto";
    requestAnimationFrame(() => { if (textareaRef.current) textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; });
  }, [post]);

  const handleCopy = () => {
    if (!post) return;
    try { const el = document.createElement("textarea"); el.value = post; el.style.position = "fixed"; el.style.opacity = "0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard && navigator.clipboard.writeText(post); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => { if (allCh3Met && !post && !postLoading) onGenerate(answers); }, []);

  return (
    <Card>
      <SectionHeader emoji="✍️" title="Step 2 — Get & Copy Your Post" subtitle="We will write your post from your answers. Read it over, edit anything off, then copy it."/>
      {!allCh3Met && !post && (
        <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:16, marginBottom:20 }}>
          <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 6px" }}>You will need a post to continue.</p>
          <p style={{ color:GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>Go back to Write Post to build your story, or paste an existing post below.</p>
          <Btn onClick={onWritePost}>Write My Post</Btn>
        </div>
      )}
      {!allCh3Met && (
        <>
          <p style={{ fontSize:13, fontWeight:600, color:NAVY, margin:"0 0 8px" }}>Or paste your existing post here:</p>
          <textarea value={post} onChange={e => onSetPost(e.target.value)} rows={10} placeholder="Paste your Facebook post here..." style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?NAVY:GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":GRAY50, outline:"none" }}/>
        </>
      )}
      {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:GRAY600, fontSize:14, marginBottom:4 }}>Writing your post...</p><p style={{ color:GRAY400, fontSize:13 }}>This takes about 15 seconds.</p></div>}
      {postError && !postLoading && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{postError}</div>}
      {post && !postLoading && (
        <>
          <textarea ref={textareaRef} value={post} onChange={e => { onSetPost(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"none", background:GRAY50, outline:"none", marginBottom:14, overflow:"hidden", display:"block" }}/>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:20 }}>
            <Btn onClick={handleCopy} variant={copied?"success":"primary"}>{copied ? "Copied!" : "Copy Post"}</Btn>
            <button onClick={() => onGenerate(answers)} disabled={postLoading} style={{ background:"none", border:"2px solid "+GRAY300, borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, color:GRAY600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>Regenerate</button>
          </div>
        </>
      )}
      <CardNav onBack={onBack} onNext={copied ? onNext : undefined} nextDisabled={!copied} nextLabel="Next: Add Photo"/>
    </Card>
  );
}

// ── Type Mode ─────────────────────────────────────────────────────────────────
function TypeMode({ onComplete, lang, savedAnswers, onAnswerChange }) {
  const [qIdx, setQIdx] = useState(() => { const first = ALL_QUESTIONS.findIndex(q => wordCount(savedAnswers[q.id] || "") < q.minWords); return first === -1 ? 0 : first; });
  const [showError, setShowError] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState(false);
  const [inspirationExamples, setInspirationExamples] = useState([]);
  const recogRef = useRef(null);
  const [micListening, setMicListening] = useState(false);
  const [micErr, setMicErr] = useState("");
  const q = ALL_QUESTIONS[qIdx], value = savedAnswers[q.id] || "", wc = wordCount(value), met = wc >= q.minWords, isLast = qIdx === ALL_QUESTIONS.length - 1;
  const answeredCount = ALL_QUESTIONS.filter(q2 => wordCount(savedAnswers[q2.id] || "") >= q2.minWords).length;
  const pct = Math.round((answeredCount / ALL_QUESTIONS.length) * 100);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous = false; r.interimResults = false; r.lang = "en-US";
    r.onresult = e => { const text = e.results[0][0].transcript; const current = savedAnswers[q.id] || ""; onAnswerChange(q.id, current ? current + " " + text : text); setMicListening(false); };
    r.onerror = e => { setMicListening(false); setMicErr(e.error === "not-allowed" ? "Mic blocked." : "Mic error: " + e.error); };
    r.onend = () => setMicListening(false);
    recogRef.current = r;
    return () => { try { r.stop(); } catch(_) {} };
  }, [qIdx]);

  const toggleMic = () => {
    if (!recogRef.current) return;
    if (micListening) { try { recogRef.current.stop(); } catch(_) {} setMicListening(false); }
    else { try { recogRef.current.start(); setMicListening(true); setMicErr(""); } catch(_) {} }
  };

  const handleInspiration = async () => {
    setShowInspiration(v => !v);
    if (inspirationExamples.length > 0 || showInspiration) return;
    setInspirationLoading(true);
    try {
      const reply = await callClaude([{ role:"user", content:"Give 3 short vivid example answers for this question from a home service business owner:\n\nQuestion: " + q.question + "\nContext: " + q.hint + "\n\nReturn ONLY a JSON array of 3 strings. No markdown." }]);
      const cleaned = reply.replace(/```json/gi,"").replace(/```/g,"").trim();
      const s = cleaned.indexOf("["), e = cleaned.lastIndexOf("]");
      if (s !== -1 && e !== -1) { const p = JSON.parse(cleaned.slice(s, e+1)); setInspirationExamples(Array.isArray(p) ? p : []); }
    } catch(_) { setInspirationExamples(q.examples || []); }
    setInspirationLoading(false);
  };

  const handleNext = () => {
    if (!met) { setShowError(true); return; }
    setShowError(false);
    if (isLast) { onComplete(savedAnswers); }
    else { setQIdx(i => i+1); setShowInspiration(false); setInspirationExamples([]); setMicErr(""); setShowError(false); }
  };
  const handleBack = () => {
    if (qIdx > 0) { setQIdx(i => i-1); setShowInspiration(false); setInspirationExamples([]); setMicErr(""); setShowError(false); }
  };

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ background:WHITE, borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 4px 24px rgba(0,41,66,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>Your Story Progress</span>
          <span style={{ fontWeight:800, fontSize:14, color:pct===100?GREEN:NAVY }}>{answeredCount} / {ALL_QUESTIONS.length} answered</span>
        </div>
        <div style={{ background:GRAY100, borderRadius:99, height:18, overflow:"hidden", position:"relative" }}>
          <div style={{ background:pct===100?GREEN:"linear-gradient(90deg,#FEB705,#f5a800)", borderRadius:99, height:"100%", width:pct+"%", transition:"width 0.5s ease", position:"relative" }}>
            {pct > 8 && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:11, fontWeight:800, color:NAVY }}>{pct}%</span>}
          </div>
        </div>
      </div>
      <div style={{ background:WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:10 }}>
          <span style={{ background:NAVY, color:YELLOW, borderRadius:8, padding:"5px 12px", fontSize:13, fontWeight:800, flexShrink:0, marginTop:2 }}>Q{q.num}</span>
          <span style={{ fontWeight:800, color:NAVY, fontSize:18, lineHeight:1.4 }}>{q.question}</span>
        </div>
        <p style={{ fontSize:14, color:GRAY600, margin:"0 0 16px", lineHeight:1.7 }}>{q.hint}</p>
        <div style={{ marginBottom:16 }}>
          <button onClick={handleInspiration} style={{ background:"transparent", border:"2px dashed "+GRAY300, borderRadius:10, padding:"7px 16px", fontSize:13, color:GRAY600, cursor:"pointer", fontWeight:600, display:"inline-flex", alignItems:"center", gap:6 }}>
            💡 {showInspiration ? "Hide inspiration" : "Need inspiration?"}
          </button>
          {showInspiration && (
            <div style={{ marginTop:10, background:"#FFFBEB", border:"1.5px solid "+YELLOW, borderRadius:12, padding:18 }}>
              <p style={{ fontSize:11, fontWeight:700, color:GRAY600, margin:"0 0 12px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Example answers — use as a guide only</p>
              {inspirationLoading ? <p style={{ fontSize:13, color:GRAY400, fontStyle:"italic", margin:0 }}>Loading...</p> : (inspirationExamples.length > 0 ? inspirationExamples : q.examples || []).map((ex, i, arr) => (
                <div key={i} style={{ marginBottom:i < arr.length-1 ? 12 : 0 }}>
                  <p style={{ fontSize:13, color:GRAY800, margin:0, lineHeight:1.7, fontStyle:"italic" }}>"{ex}"</p>
                  {i < arr.length-1 && <div style={{ borderTop:"1px solid "+GRAY200, marginTop:12 }}/>}
                </div>
              ))}
            </div>
          )}
        </div>
        {q.fearChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Pick the fear you focus on</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.fearChips.map((chip, i) => { const selected = value.toLowerCase().includes(chip.toLowerCase()); return (<button key={i} onClick={() => { if (!value.toLowerCase().includes(chip.toLowerCase())) onAnswerChange(q.id, chip + ". " + value); }} style={{ background:selected?NAVY:GRAY50, color:selected?YELLOW:GRAY800, border:"2px solid "+(selected?NAVY:GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{selected ? "✓ " : ""}{chip}</button>); })}
            </div>
          </div>
        )}
        {q.missionChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Quick pick</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.missionChips.map((chip, i) => (<button key={i} onClick={() => onAnswerChange(q.id, chip)} style={{ background:value===chip?NAVY:GRAY50, color:value===chip?YELLOW:GRAY800, border:"2px solid "+(value===chip?NAVY:GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{value===chip ? "✓ " : ""}{chip}</button>))}
            </div>
          </div>
        )}
        <div style={{ position:"relative" }}>
          <textarea value={value} onChange={e => { onAnswerChange(q.id, e.target.value); if (showError) setShowError(false); }} placeholder={q.placeholder} rows={q.id==="heroMoment"?6:q.id==="whyStarted"||q.id==="fear"?4:3} autoFocus style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(showError?RED:met?GREEN:GRAY200), borderRadius:12, padding:"14px 52px 14px 14px", fontSize:15, color:GRAY800, fontFamily:"inherit", resize:"vertical", outline:"none", transition:"border 0.2s", background:WHITE, lineHeight:1.8 }}/>
          <button type="button" onClick={toggleMic} style={{ position:"absolute", top:12, right:12, background:micListening?RED:GRAY100, border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={micListening?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
          </button>
        </div>
        {micListening && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>Listening...</p>}
        {micErr && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>{micErr}</p>}
        {wc > 0 && q.minWords > 1 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
            <div style={{ flex:1, background:GRAY100, borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ background:met?GREEN:YELLOW, height:6, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:met?GREEN:GRAY600, whiteSpace:"nowrap" }}>{met ? "good" : wc + " / " + q.minWords + " words"}</span>
          </div>
        )}
        {wc === 0 && <p style={{ fontSize:12, color:GRAY400, margin:"6px 0 0" }}>Minimum {q.minWords} word{q.minWords!==1?"s":""} required</p>}
        {showError && !met && <div style={{ background:"#FEF2F2", border:"1.5px solid #FCA5A5", borderRadius:10, padding:"10px 14px", marginTop:12, fontSize:13, color:"#991B1B", fontWeight:600 }}>Add one more detail like a name, place, number, or year.</div>}
        <CardNav onBack={qIdx > 0 ? handleBack : undefined} onNext={handleNext} nextLabel={isLast ? "Generate Post" : "Next"} firstQuestion={qIdx === 0}/>
      </div>
    </div>
  );
}

// ── Lead Engagement ────────────────────────────────────────────────────────────
function LeadEngagement({ onBack, onAmplify }) {
  const [watched, setWatched] = useState(false);
  const [active, setActive] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [log, setLog] = useState([]);
  const [jobsInput, setJobsInput] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [likeCount, setLikeCount] = useState(1);
  const activeLead = LEAD_TYPES.find(l => l.id === active);
  const activeSubtype = activeLead && subtype ? (activeLead.subtypes || []).find(s => s.id === subtype) : null;
  const sessionCounts = LEAD_TYPES.reduce((acc, lt) => { acc[lt.id] = log.filter(l => l.type === lt.id).length; return acc; }, {});
  const sessionTotal = log.length;

  function copyText(text, idx) {
    try { const el = document.createElement("textarea"); el.value = text; el.style.position = "fixed"; el.style.opacity = "0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard && navigator.clipboard.writeText(text); }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  }
  function logLead(typeId, n) { const num = n || 1; const entries = []; for (let i = 0; i < num; i++) entries.push({ type:typeId, timestamp:Date.now() }); setLog(p => [...p, ...entries]); }
  function reset() { setActive(null); setSubtype(null); setLikeCount(1); }

  function ScriptBox({ text, idx }) {
    return (
      <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <p style={{ fontSize:14, color:GRAY800, lineHeight:1.8, margin:"0 0 10px", fontStyle:"italic" }}>"{text}"</p>
        <button onClick={() => copyText(text, idx)} style={{ background:copiedIdx===idx?GREEN:NAVY, color:copiedIdx===idx?WHITE:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{copiedIdx===idx ? "Copied!" : "Copy Script"}</button>
      </div>
    );
  }
  function StepNum({ n, text }) {
    return (
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", margin:"16px 0 8px" }}>
        <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, marginTop:1 }}>{n}</div>
        <div style={{ fontWeight:700, color:NAVY, fontSize:14, paddingTop:2 }}>{text}</div>
      </div>
    );
  }

  if (!watched) {
    return (
      <Card>
        <SectionHeader emoji="🎉" title="Session Complete — Now We Execute" subtitle="Watch this training video before working your leads."/>
        <div style={{ background:"#EFF6FF", borderRadius:12, padding:16, marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, color:NAVY, fontWeight:600 }}>Lead Engagement Training Video</p>
          <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:10, overflow:"hidden", marginBottom:14 }}>
            <iframe src="https://fast.wistia.net/embed/iframe/indqjc1oov?autoPlay=false" title="Lead Engagement Training" allowFullScreen style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none", borderRadius:10 }}/>
          </div>
          <Btn onClick={() => setWatched(true)}>I watched the video — show me the playbook</Btn>
        </div>
        <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:12 }}>
          <p style={{ fontSize:12, color:GRAY400, margin:0 }}>Already watched? <button onClick={() => setWatched(true)} style={{ background:"none", border:"none", color:NAVY, fontSize:12, fontWeight:700, cursor:"pointer", textDecoration:"underline", padding:0 }}>Skip</button></p>
        </div>
        <CardNav onBack={onBack} onNext={() => setWatched(true)} nextLabel="Next"/>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ background:NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Work Your Leads</h2>
            <p style={{ color:GRAY400, fontSize:13, margin:0 }}>Pick the type of engagement. Follow the steps. Book the job.</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:YELLOW, fontWeight:900, fontSize:24, lineHeight:1 }}>{sessionTotal}</div><div style={{ color:GRAY400, fontSize:10, marginTop:3 }}>this session</div></div>
            <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:GREEN, fontWeight:900, fontSize:24, lineHeight:1 }}>{totalJobs}</div><div style={{ color:GREEN, fontSize:10, marginTop:3 }}>jobs booked</div></div>
          </div>
        </div>
        <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(255,255,255,0.08)", borderRadius:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:WHITE, fontSize:13, fontWeight:600 }}>+ Log a booked job:</span>
          <input type="number" min="1" value={jobsInput} onChange={e => setJobsInput(e.target.value)} placeholder="# of jobs" style={{ width:90, border:"2px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"7px 10px", fontSize:15, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", background:WHITE }}/>
          <Btn onClick={() => { const n = parseInt(jobsInput); if (n > 0) { setTotalJobs(j => j+n); setJobsInput(""); } }} disabled={!jobsInput || parseInt(jobsInput) < 1} style={{ fontSize:13 }}>Add Jobs</Btn>
        </div>
        <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10 }}><p style={{ color:WHITE, fontSize:13, margin:0 }}>Time kills deals. First 24-48 hours are everything.</p></div>
      </Card>
      {!active && (
        <Card>
          <h3 style={{ color:NAVY, fontSize:17, fontWeight:800, margin:"0 0 6px" }}>What kind of engagement did you get?</h3>
          <p style={{ color:GRAY600, fontSize:13, margin:"0 0 20px" }}>Tap one to get exact steps and scripts.</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {LEAD_TYPES.map(lt => (
              <button key={lt.id} onClick={() => { setActive(lt.id); setSubtype(null); }} style={{ background:lt.color, border:"2px solid "+lt.border, borderRadius:14, padding:"18px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:32 }}>{lt.emoji}</span>
                <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{lt.label}</span>
                {sessionCounts[lt.id] > 0 && <span style={{ fontSize:11, color:GRAY600, fontWeight:600 }}>{sessionCounts[lt.id]} this session</span>}
              </button>
            ))}
          </div>
        </Card>
      )}
      {activeLead && activeLead.simple && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>Back</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          {activeLead.steps.map((step, i) => (
            <div key={i}>
              <StepNum n={i+1} text={step.label}/>
              {step.note ? <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:NAVY }}>Use the <strong>Direct Message</strong> playbook once they respond.</div> : <ScriptBox text={step.script} idx={i}/>}
            </div>
          ))}
          {activeLead.id === "like" ? (
            <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16 }}>
              <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 12px" }}>How many people did you DM?</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <input type="number" min="1" value={likeCount} onChange={e => setLikeCount(Math.max(1, parseInt(e.target.value)||1))} style={{ width:90, border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", fontSize:22, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", fontFamily:"inherit", background:WHITE }}/>
                <Btn variant="success" onClick={() => { logLead(activeLead.id, likeCount); reset(); }}>Log {likeCount} DM{likeCount!==1?"s":""}</Btn>
              </div>
              <Btn variant="ghost" onClick={reset}>Back</Btn>
            </div>
          ) : (
            <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
              <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>Mark as Worked</Btn>
              <Btn variant="ghost" onClick={reset}>Back</Btn>
            </div>
          )}
        </Card>
      )}
      {activeLead && !activeLead.simple && !subtype && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>Back</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          <p style={{ color:GRAY600, fontSize:13, margin:"0 0 16px" }}>What did they say?</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {activeLead.subtypes.map(s => (
              <button key={s.id} onClick={() => setSubtype(s.id)} style={{ background:activeLead.color, border:"1.5px solid "+activeLead.border, borderRadius:12, padding:"12px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:3 }}>
                <span style={{ fontWeight:700, color:NAVY, fontSize:14 }}>{s.label}</span>
                <span style={{ fontSize:12, color:GRAY600, fontStyle:"italic" }}>{s.example}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
      {activeLead && !activeLead.simple && activeSubtype && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setSubtype(null)} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>Back</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <div><div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{activeLead.label}</div><div style={{ fontSize:12, color:GRAY600 }}>{activeSubtype.label}</div></div>
          </div>
          {activeLead.id === "comment" && (
            <div>
              <StepNum n={1} text="Reply publicly"/>
              {activeSubtype.publicReplies.map((r, i) => <ScriptBox key={i} text={r} idx={i}/>)}
              <StepNum n={2} text="Then immediately DM"/>
              <ScriptBox text={activeSubtype.dmScript} idx={99}/>
            </div>
          )}
          {activeLead.id === "dm" && (
            <div>
              <StepNum n={1} text="Reply within 24 hours"/>
              <ScriptBox text={activeSubtype.dmScript} idx={0}/>
            </div>
          )}
          <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
            <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>Mark as Worked</Btn>
            <Btn variant="ghost" onClick={() => setSubtype(null)}>Different Response</Btn>
          </div>
        </Card>
      )}
      {sessionTotal > 0 && !active && (
        <Card>
          <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>This Session</h3>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            {LEAD_TYPES.map(lt => sessionCounts[lt.id] > 0 && (
              <div key={lt.id} style={{ background:lt.color, border:"1.5px solid "+lt.border, borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>{lt.emoji}</span>
                <span style={{ fontWeight:800, color:NAVY, fontSize:14 }}>{sessionCounts[lt.id]}</span>
                <span style={{ fontSize:12, color:GRAY600 }}>{lt.label}</span>
              </div>
            ))}
          </div>
          <div style={{ background:NAVY, borderRadius:12, padding:16 }}>
            <p style={{ color:YELLOW, fontWeight:700, margin:"0 0 4px", fontSize:14 }}>Every path leads to a DM. Every DM is a chance to book a job.</p>
            <p style={{ color:WHITE, fontSize:13, margin:0 }}>Keep going. The first 48 hours are everything.</p>
          </div>
        </Card>
      )}
      {!active && (
        <Card style={{ background:"linear-gradient(135deg,#002942,#003a5c)", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
          <h3 style={{ color:YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>Done working leads for now?</h3>
          <p style={{ color:GRAY400, fontSize:13, lineHeight:1.7, margin:"0 0 20px" }}>Post in more groups to get more leads.</p>
          <Btn onClick={onAmplify} style={{ margin:"0 auto" }}>Amplify — Post in More Groups</Btn>
        </Card>
      )}
      <BottomNav onBack={onBack}/>
      <NavSpacer/>
    </>
  );
}

// ── Amplify ────────────────────────────────────────────────────────────────────
function AmplifyScreen({ onBack, city, totalPosted }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [extraPosted, setExtraPosted] = useState(0);
  const total = totalPosted + extraPosted;
  function loadGroups() { setLoading(true); setError(""); findFacebookGroups(city || "Your City", 20).then(r => { setGroups(r); setLoading(false); if (!r.length) setError("Could not load groups."); }).catch(() => { setLoading(false); setError("Could not load groups."); }); }
  useEffect(() => { loadGroups(); }, [city]);
  return (
    <>
      <Card style={{ background:NAVY }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Amplify</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>Keep the momentum going.</p></div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 20px", textAlign:"center", minWidth:90 }}><div style={{ color:YELLOW, fontWeight:900, fontSize:32, lineHeight:1 }}>{total}</div><div style={{ color:GRAY400, fontSize:11, marginTop:4 }}>total groups posted</div></div>
        </div>
      </Card>
      <Card><Btn variant="success" onClick={() => setExtraPosted(n => n+1)} style={{ fontSize:14 }}>+ Posted in Another Group</Btn></Card>
      <Card>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:0 }}>More groups near you</h3>
          <button onClick={loadGroups} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Refresh</button>
        </div>
        {loading && <p style={{ color:GRAY600, fontSize:14 }}>Finding groups near {city}...</p>}
        {error && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, color:RED, fontSize:13 }}>{error}</div>}
        {!loading && groups.length > 0 && <GroupTable groups={groups} showNum={false}/>}
      </Card>
      <BottomNav onBack={onBack}/>
      <NavSpacer/>
    </>
  );
}

// ── Coach Dashboard ────────────────────────────────────────────────────────────
function CoachDashboard({ onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [testMsg, setTestMsg] = useState("");
  async function loadData() { setLoading(true); try { const result = await window.storage.list("submission:", true); const keys = (result && result.keys) ? result.keys : []; const items = []; for (let i = 0; i < keys.length; i++) { try { const r = await window.storage.get(keys[i], true); if (r && r.value) items.push(JSON.parse(r.value)); } catch(e) {} } setSubmissions(items.sort((a, b) => b.timestamp - a.timestamp)); } catch(e) { setSubmissions([]); } setLoading(false); }
  async function doTestSave() { setTestMsg("Saving..."); try { await window.storage.set("submission:test_pro", JSON.stringify({ name:"Test Pro", business:"Test Biz", city:"Nashville", answers:{}, post:"Test post", status:"Post Generated", postGenerated:true, timestamp:Date.now(), updatedAt:Date.now() }), true); setTestMsg("Saved! Click Refresh."); setTimeout(loadData, 600); } catch(e) { setTestMsg("Error: " + e.message); } }
  useEffect(() => { loadData(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:GRAY100, zIndex:300, overflowY:"auto" }}>
      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}><div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div><div><div style={{ color:WHITE, fontWeight:800, fontSize:16, lineHeight:1 }}>Coach Dashboard</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>{submissions.length} submissions</div></div></div>
        <div style={{ display:"flex", gap:8 }}><button onClick={loadData} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Refresh</button><button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Back</button></div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 16px 60px" }}>
        {loading && <Card><p style={{ textAlign:"center", color:GRAY600, padding:40 }}>Loading...</p></Card>}
        {!loading && submissions.length === 0 && (
          <Card>
            <div style={{ textAlign:"center", padding:20 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <p style={{ color:GRAY600, fontSize:14, marginBottom:20 }}>No submissions yet.</p>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={doTestSave} style={{ background:YELLOW, color:NAVY, border:"none", borderRadius:10, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Write Test Entry</button>
                <button onClick={loadData} style={{ background:NAVY, color:WHITE, border:"none", borderRadius:10, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>Refresh</button>
              </div>
              {testMsg && <p style={{ marginTop:14, fontWeight:700, fontSize:13, color:testMsg.startsWith("Saving")?GRAY400:testMsg.startsWith("Error")?RED:GREEN }}>{testMsg}</p>}
            </div>
          </Card>
        )}
        {!loading && submissions.map((s, i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
              <div><div style={{ fontWeight:800, color:NAVY, fontSize:17 }}>{s.name || "Unknown"}</div><div style={{ fontSize:13, color:GRAY600, marginTop:2 }}>{s.business} — {s.city}</div><div style={{ fontSize:12, color:GRAY400, marginTop:4 }}>{s.timestamp ? new Date(s.timestamp).toLocaleString() : "—"}</div></div>
              <span style={{ background:"#DBEAFE", color:"#1D4ED8", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.status || "Post Generated"}</span>
            </div>
            <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ marginTop:14, background:GRAY50, border:"1px solid "+GRAY200, borderRadius:8, padding:"6px 14px", fontSize:12, color:NAVY, fontWeight:600, cursor:"pointer" }}>{expanded === i ? "Hide Details" : "View Details"}</button>
            {expanded === i && (
              <div style={{ marginTop:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  {ALL_QUESTIONS.filter(q => s.answers && s.answers[q.id]).map(q => (
                    <div key={q.id} style={{ background:GRAY50, borderRadius:10, padding:"10px 12px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:GRAY400, marginBottom:3 }}>Q{q.num} {q.label}</div>
                      <div style={{ fontSize:13, color:GRAY800, lineHeight:1.5 }}>{s.answers[q.id]}</div>
                    </div>
                  ))}
                </div>
                {s.post && <div><div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:8 }}>Generated Post:</div><div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:16, fontSize:13, color:GRAY800, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.post}</div></div>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [appPhase, setAppPhase] = useState("lane");
  const [lang, setLang] = useState("en");
  const [answers, setAnswers] = useState({});
  const [post, setPost] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [groups5, setGroups5] = useState([]);
  const [groups20, setGroups20] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [tenDone, setTenDone] = useState(false);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [autoSaved, setAutoSaved] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const topRef = useRef(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    try { const raw = localStorage.getItem("draft:answers"); if (raw) { const saved = JSON.parse(raw); if (saved && saved.answers && Object.keys(saved.answers).length > 0) { setAnswers(saved.answers); if (saved.post) setPost(saved.post); if (typeof saved.postCount === "number") setPostCount(saved.postCount); setDraftRestored(true); setTimeout(() => setDraftRestored(false), 4000); } } } catch(e) {}
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { try { localStorage.setItem("draft:answers", JSON.stringify({ answers, post, postCount })); setAutoSaved(true); setTimeout(() => setAutoSaved(false), 2000); } catch(e) {} }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [answers, post, postCount]);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior:"smooth" }); }, [appPhase]);

  const city = answers.area ? answers.area.split(/[,.]/)[0].replace(/[^a-zA-Z\s]/g,"").trim() : manualCity.trim() || "Your City";

  useEffect(() => {
    if (appPhase === "groups" && groups5.length === 0 && !groupsLoading) { setGroupsLoading(true); setGroupsError(""); findFacebookGroups(city, 5).then(r => { setGroups5(r); setGroupsLoading(false); if (!r.length) setGroupsError("Could not find groups. Try searching Facebook manually."); }).catch(() => { setGroupsLoading(false); setGroupsError("Search failed."); }); }
    if (appPhase === "replicate" && groups20.length === 0 && !groupsLoading) { setGroupsLoading(true); findFacebookGroups(city, 20).then(r => { setGroups20(r); setGroupsLoading(false); }).catch(() => setGroupsLoading(false)); }
  }, [appPhase]);

  async function saveSubmission(a, generatedPost, status) {
    const data = a || answers; const name = (data.name || "Unknown").trim();
    const key = "submission:" + name.replace(/\s+/g,"_").toLowerCase() + "_" + (data.business || "biz").replace(/\s+/g,"_").toLowerCase();
    try { let prev = {}; try { const ex = await window.storage.get(key, true); if (ex && ex.value) prev = JSON.parse(ex.value); } catch(e) {} const rec = { name, business:data.business||"", city:(data.area||manualCity||"").split(/[,.]/)[0].replace(/[^a-zA-Z\s]/g,"").trim(), answers:data, post:generatedPost!==undefined?generatedPost:(prev.post||""), status:status||prev.status||"Post Generated", postGenerated:true, timestamp:prev.timestamp||Date.now(), updatedAt:Date.now() }; await window.storage.set(key, JSON.stringify(rec), true); } catch(e) {}
  }

  async function handleGeneratePost(ans) {
    const a = ans || answers; setPostLoading(true); setPostError("");
    try { const generated = await generateAIPost(a); if (!generated || generated.trim().length < 50) throw new Error("empty response"); setPost(generated); setCompletedSections(prev => prev.includes("write") ? prev : [...prev, "write"]); await saveSubmission(a, generated, "Post Generated"); }
    catch(e) { setPostError("Could not generate post. Please try again."); }
    setPostLoading(false);
  }

  const allCh3Met = ch3Qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const ht = HOME_T[lang] || HOME_T.en;
  const answeredN = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;

  return (
    <div style={{ minHeight:"100vh", background:GRAY100, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)}/>}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 8px", textAlign:"center" }}>Coach Access</h3>
            <p style={{ color:GRAY600, fontSize:13, textAlign:"center", margin:"0 0 20px" }}>Enter your passcode to view the dashboard.</p>
            <input type="password" value={passcodeInput} onChange={e => { setPasscodeInput(e.target.value); setPasscodeError(false); }} onKeyDown={e => { if (e.key === "Enter") { if (passcodeInput === COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); } }} placeholder="Enter passcode" style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?RED:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }}/>
            {passcodeError && <p style={{ color:RED, fontSize:12, margin:"0 0 8px" }}>Incorrect passcode.</p>}
            <Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if (passcodeInput === COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); }}>Enter Dashboard</Btn>
            <button onClick={() => { setShowCoachLogin(false); setPasscodeInput(""); setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer", padding:"4px 0" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16, lineHeight:1 }}>Business Coaching Foundations</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>Week 1 — Facebook Organic Strategy</div></div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {appPhase === "lane" && <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Coach Dashboard</button>}
          {appPhase !== "lane" && (
            <>
              {autoSaved && <span style={{ color:"rgba(255,255,255,0.6)", fontSize:12, display:"flex", alignItems:"center", gap:5 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Saved</span>}
              <button onClick={() => setAppPhase("lane")} style={{ background:YELLOW, border:"none", borderRadius:8, padding:"8px 18px", color:NAVY, fontSize:13, fontWeight:800, cursor:"pointer" }}>Save and Exit</button>
            </>
          )}
        </div>
      </div>

      {draftRestored && <div style={{ background:GREEN, color:WHITE, textAlign:"center", padding:"10px 16px", fontSize:13, fontWeight:700 }}>Your answers were restored — right where you left off.</div>}

      <div ref={topRef} style={{ maxWidth:960, margin:"0 auto", padding:"28px 32px 60px" }}>
        <PhaseNav current={appPhase} onNavigate={id => setAppPhase(id)} completedSections={completedSections}/>

        {appPhase === "lane" && (
          <div>
            <div style={{ background:NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
              <h1 style={{ color:WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>{ht.headline1}<br/><span style={{ color:YELLOW }}>{ht.headline2}</span></h1>
              <p style={{ color:GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px", maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>{ht.subheadline}</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>{[ht.stat1, ht.stat2, ht.stat3].map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:WHITE }}>{s}</div>)}</div>
            </div>
            <button onClick={() => { if (answeredN===0) setAppPhase("writechoice"); else if (!post) setAppPhase("getpost"); else if (postCount<9) setAppPhase("replicate"); else setAppPhase("leads"); }} style={{ width:"100%", background:YELLOW, border:"none", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:24, boxShadow:"0 4px 20px rgba(254,183,5,0.35)" }}>
              <div style={{ textAlign:"left" }}><div style={{ fontSize:11, fontWeight:700, color:NAVY, opacity:0.6, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>{ht.continueLabel}</div><div style={{ fontSize:16, fontWeight:900, color:NAVY }}>{answeredN===0?ht.cta0:!post?ht.cta1:postCount<9?ht.cta2:ht.cta3}</div></div>
              <div style={{ background:NAVY, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
            </button>
            <h3 style={{ color:NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>{ht.checklistTitle}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { phase:"writechoice", icon:"✍️", bg:NAVY, title:ht.writeTitle, desc:ht.writeDesc, time:ht.writeTime, progress:answeredN+" "+ht.ofAnswered, status:answeredN===0?{label:ht.statusNotStarted,bg:GRAY100,fg:GRAY400}:answeredN<10?{label:ht.statusInProgress,bg:"#FEF9EC",fg:"#92400E"}:{label:ht.statusDone,bg:"#D1FAE5",fg:"#065F46"} },
                { phase:"groups", icon:"📣", bg:NAVY_LIGHT, title:ht.groupsTitle, desc:ht.groupsDesc, time:ht.groupsTime, progress:(postCount+1)+" "+ht.ofGroups, status:postCount===9?{label:ht.statusDone,bg:"#D1FAE5",fg:"#065F46"}:postCount>0?{label:ht.statusInProgress,bg:"#FEF9EC",fg:"#92400E"}:{label:ht.statusNotStarted,bg:GRAY100,fg:GRAY400} },
                { phase:"leads", icon:"🔥", bg:"#065F46", title:ht.leadsTitle, desc:ht.leadsDesc, time:ht.leadsTime, progress:ht.leadsProgress, status:{label:ht.statusNotStarted,bg:GRAY100,fg:GRAY400} },
              ].map(item => (
                <div key={item.phase} onClick={() => setAppPhase(item.phase)} style={{ background:WHITE, borderRadius:16, boxShadow:"0 2px 12px rgba(0,41,66,0.06)", overflow:"hidden", cursor:"pointer", display:"flex" }}>
                  <div style={{ background:item.bg, width:56, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>{item.icon}</div>
                  <div style={{ padding:"14px 16px", flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}><div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{item.title}</div><span style={{ background:item.status.bg, color:item.status.fg, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{item.status.label}</span></div>
                    <div style={{ fontSize:12, color:GRAY600 }}>{item.desc}</div>
                    <div style={{ fontSize:11, color:GRAY400, marginTop:4 }}>{item.time} — {item.progress}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", paddingRight:16 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}><LangToggle lang={lang} setLang={setLang}/></div>
          </div>
        )}

        {appPhase === "writechoice" && (
          <>
            <Card>
              <SectionHeader emoji="✍️" title={ht.writePostTitle} subtitle={ht.howStart}/>
              <LangToggle lang={lang} setLang={setLang}/>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:8 }}>
                <button onClick={() => setAppPhase("ch1")} style={{ background:WHITE, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>⌨️</div>
                  <div><div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>{ht.typeTitle}</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>{ht.typeDesc}</div></div>
                </button>
                <button onClick={() => setAppPhase("voice")} style={{ background:NAVY, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>🎤</div>
                  <div><div style={{ fontWeight:800, color:YELLOW, fontSize:15, marginBottom:4 }}>{ht.voiceTitle}</div><div style={{ fontSize:13, color:GRAY400, lineHeight:1.5 }}>{ht.voiceDesc}</div></div>
                </button>
              </div>
            </Card>
            <BottomNav onBack={() => setAppPhase("lane")}/>
            <NavSpacer/>
          </>
        )}

        {appPhase === "voice" && (
          <>
            <VoiceMode onComplete={va => { setAnswers(va); setAppPhase("getpost"); }} lang={lang}/>
            <div style={{ marginTop:16 }}><Btn variant="ghost" onClick={() => setAppPhase("writechoice")}>Back</Btn></div>
          </>
        )}

        {(appPhase === "ch1" || appPhase === "ch2" || appPhase === "ch3") && (
          <TypeMode onComplete={va => { setAnswers(va); setAppPhase("getpost"); }} lang={lang} savedAnswers={answers} onAnswerChange={(id, val) => setAnswers(prev => ({ ...prev, [id]:val }))}/>
        )}

        {appPhase === "groups" && (
          <Card>
            <SectionHeader emoji="🧭" title="Step 1 — Join a Group" subtitle="Find an active local Facebook group and join it. You only need one to start."/>
            {!answers.area && (
              <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:NAVY }}>What city or area do you serve?</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="e.g. East Nashville" style={{ flex:1, border:"2px solid "+GRAY200, borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", fontFamily:"inherit" }}/>
                  <button onClick={() => { setGroups5([]); setGroupsError(""); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>Search</button>
                </div>
              </div>
            )}
            {groupsLoading && <div style={{ textAlign:"center", padding:32 }}><p style={{ color:GRAY600 }}>Finding groups near {city}...</p></div>}
            {groupsError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{groupsError}</div>}
            {!groupsLoading && groups5.length > 0 && (
              <><div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:NAVY, lineHeight:1.6 }}>Click a group name to open Facebook. Find it, click in, and join.</div><GroupTable groups={groups5} showNum={false}/></>
            )}
            <CardNav onBack={() => setAppPhase("lane")} onNext={() => setAppPhase("getpost")}/>
          </Card>
        )}

        {appPhase === "getpost" && <GetPost allCh3Met={allCh3Met} post={post} postLoading={postLoading} postError={postError} answers={answers} onGenerate={handleGeneratePost} onSetPost={setPost} onNext={() => setAppPhase("photo")} onBack={() => setAppPhase("groups")} onWritePost={() => setAppPhase("writechoice")}/>}

        {appPhase === "photo" && (
          <Card>
            <SectionHeader emoji="📸" title="Step 3 — Choose Your Photo" subtitle="Your photo is the first thing people see. The right one doubles your engagement."/>
            <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>💡</span>
              <div><p style={{ fontWeight:800, color:NAVY, fontSize:14, margin:"0 0 4px" }}>Pro Tip: Find these photos before your first session!</p><p style={{ fontSize:13, color:GRAY600, margin:0, lineHeight:1.6 }}>Scroll your camera roll now and save 2-3 options. The best posts go live fast.</p></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
              {[
                { tier:"Good", bg:"#D1FAE5", fg:"#065F46", rec:false, title:"Solo shot on the job", desc:"You on a job site, in front of your truck, or holding tools. Face clearly visible, natural lighting." },
                { tier:"Better", bg:"#DBEAFE", fg:"#1D4ED8", rec:false, title:"You with someone real", desc:"You with a family member, neighbor, or happy customer." },
                { tier:"Best", bg:NAVY, fg:YELLOW, rec:true, title:"Photo that proves the post", desc:"A photo matching something in your post — your local spot, your hobby, or a moment from your story." },
              ].map((ti, i) => (
                <div key={i} style={{ borderRadius:14, border:"2px solid "+(ti.rec?NAVY:GRAY200), display:"flex", flexDirection:"column", background:WHITE, overflow:"hidden", boxShadow:ti.rec?"0 6px 24px rgba(0,41,66,0.2)":"none" }}>
                  <div style={{ background:ti.bg, padding:"11px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:900, color:ti.fg, fontSize:15 }}>{ti.tier}</span>
                    {ti.rec && <span style={{ fontSize:10, color:YELLOW, fontWeight:800, background:"rgba(255,255,255,0.15)", borderRadius:99, padding:"2px 8px" }}>RECOMMENDED</span>}
                  </div>
                  <div style={{ padding:16, flex:1 }}><p style={{ fontWeight:800, color:NAVY, fontSize:14, margin:"0 0 8px" }}>{ti.title}</p><p style={{ fontSize:13, color:GRAY600, margin:0, lineHeight:1.65 }}>{ti.desc}</p></div>
                </div>
              ))}
            </div>

            <CardNav onBack={() => setAppPhase("getpost")} onNext={() => setAppPhase("dopost")}/>
          </Card>
        )}

        {appPhase === "dopost" && (
          <Card>
            <SectionHeader emoji="🚀" title="Step 4 — Post It" subtitle="You are ready. Follow these steps exactly in the Facebook group."/>
            {[{num:1,text:"Open the Facebook group you joined and tap Write something"},{num:2,text:"Paste your copied post"},{num:3,text:"Attach your photo"},{num:4,text:"Tap Post"}].map(s => (
              <div key={s.num} style={{ display:"flex", gap:14, marginBottom:18, alignItems:"flex-start" }}>
                <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, flexShrink:0 }}>{s.num}</div>
                <p style={{ margin:0, fontSize:15, color:GRAY800, paddingTop:7, lineHeight:1.6 }}>{s.text}</p>
              </div>
            ))}
            <CardNav onBack={() => setAppPhase("photo")} onNext={() => setAppPhase("approval")}/>
          </Card>
        )}

        {appPhase === "approval" && (
          <Card>
            <SectionHeader emoji="📋" title="Step 5 — Coach Approval" subtitle="Let your coach know you are ready for your post audit."/>
            <div style={{ background:"#EFF6FF", borderRadius:12, padding:24, marginBottom:24, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:10 }}>👋</div>
              <p style={{ color:NAVY, fontWeight:700, fontSize:15, margin:"0 0 8px" }}>Your post is live!</p>
              <p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, margin:0 }}>Let your coach know you are ready for your audit. Once reviewed and approved, tap Next below.</p>
            </div>
            <CardNav onBack={() => setAppPhase("dopost")} onNext={() => { saveSubmission(answers, post, "Coach Approved"); setAppPhase("replicate"); }}/>
          </Card>
        )}

        {appPhase === "replicate" && (
          <>
            <Card>
              <SectionHeader emoji="🔁" title="Step 6 — Cross-Post to 9 More Groups" subtitle="Same post. Same photo. No edits. Hit 10 total to complete your Week 1 goal."/>
              <div style={{ background:GRAY50, borderRadius:12, padding:16, marginBottom:20 }}>
                {["Use the exact same post — do not change a single word.", "Attach the exact same photo.", "Do not add your phone number, website, or any contact info.", "Public groups: post immediately. Private groups: join and post once approved."].map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading && <p style={{ color:GRAY600, fontSize:14, textAlign:"center" }}>Loading groups...</p>}
              {!groupsLoading && groups20.length > 0 && <div style={{ marginBottom:20 }}><GroupTable groups={groups20} showNum={true}/></div>}
            </Card>
            <Card>
              <h3 style={{ color:NAVY, margin:"0 0 8px", fontSize:18 }}>How many additional groups did you post in?</h3>
              <p style={{ color:GRAY600, fontSize:13, marginTop:0, marginBottom:16 }}>You already posted in 1 — tap how many more you completed.</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (<button key={n} onClick={() => setPostCount(n)} style={{ width:48, height:48, borderRadius:10, border:"2px solid "+(postCount===n?NAVY:GRAY200), background:postCount===n?NAVY:WHITE, color:postCount===n?YELLOW:GRAY600, fontWeight:800, fontSize:16, cursor:"pointer" }}>{n}</button>))}
              </div>
              {postCount > 0 && postCount < 9 && <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:GRAY800 }}>Posted in <strong>{postCount+1} total groups</strong>. <strong>{9-postCount} more to go.</strong></div>}
              {postCount === 9 && !tenDone && <Btn variant="success" onClick={() => { setTenDone(true); setCompletedSections(prev => prev.includes("grouppost") ? prev : [...prev, "grouppost"]); saveSubmission(answers, post, "10 Groups Done"); }}>10 Groups Done!</Btn>}
              <CardNav onBack={() => setAppPhase("approval")} onNext={() => setAppPhase("leads")} nextDisabled={postCount < 9}/>
            </Card>
            {tenDone && (
              <Card style={{ background:NAVY, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🎯</div>
                <h2 style={{ color:YELLOW, fontSize:24, margin:"0 0 8px" }}>WEEK 1 GOAL ACHIEVED</h2>
                <p style={{ color:WHITE, fontSize:15, lineHeight:1.8, margin:"0 0 20px" }}>10 groups. 10 posts. Mission accomplished.</p>
                <Btn onClick={() => setAppPhase("leads")}>Open Lead Engagement</Btn>
              </Card>
            )}
          </>
        )}

        {appPhase === "leads" && <LeadEngagement onBack={() => setAppPhase("replicate")} onAmplify={() => setAppPhase("amplify")}/>}
        {appPhase === "amplify" && <AmplifyScreen onBack={() => setAppPhase("leads")} city={city} totalPosted={postCount+1}/>}
      </div>
    </div>
  );
}