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
const SIDEBAR_W = 220;
const HEADER_H = 56;

const NAV_SECTIONS = [
  { id:"write",     label:"Write Post",     icon:"✍️", phases:["ch1","ch2","ch3"], noSubs:true },
  { id:"grouppost", label:"Post in Groups", icon:"📣", phases:["groups","getpost","photo","dopost","approval","replicate"] },
  { id:"leads",     label:"Work Leads",     icon:"🔥", phases:["leads"] },
  { id:"amplify",   label:"Amplify",        icon:"📡", phases:["amplify"] },
];

const PHASE_LABELS = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3",
  groups:"1. Join a Group", getpost:"2. Generate Post",
  photo:"3. Add Photo", dopost:"4. Post It",
  approval:"5. Coach Approval", replicate:"6. Cross-Post",
  leads:"Work Leads", amplify:"Amplify",
};

const NO_NAV_PHASES = ["lane","writechoice","voice","celebrate"];

const SAMPLE_ANSWERS = {
  name:"Marcus Webb",
  business:"Webb Home Services",
  area:"East Nashville, TN — Donelson and Hermitage. 11 years.",
  fear:"Lack of communication. I send a quick text update any time something changes on a job so nobody is left wondering.",
  humanDetail:"Most Saturdays I am on the sidelines at my son's baseball game with a cooler and way too much sunscreen.",
  localFlavor:"Mas Tacos Por Favor in East Nashville. Always get the chicken taco plate standing outside on the sidewalk.",
  mission:"hot chicken",
  whyStarted:"I remember sitting in my truck after a call feeling sick because my old company wanted me to push a bigger job the homeowner did not need.",
  whatChanged:"I am home to eat dinner with my family instead of coming in after everyone is asleep.",
  heroMoment:"An elderly woman called me at 7pm on Christmas Eve. Her heat had been out two days and grandkids were coming. I drove 40 minutes, worked in the cold, only charged her for the part. She grabbed my hand and said she would tell everyone she knew. She has sent four referrals.",
};

const ALL_QUESTIONS = [
  { id:"name",        num:1,  chapter:"ch1", minWords:2,  validate:"name",       label:"Your Name",              question:"What is your first and last name?",                                                                                                 hint:"Write it exactly how you want it shown publicly.",                                                                                                                         examples:["Daniel Reyes","Taryn Sinnen"],                                                                                                   voiceQ:"What is your first and last name?",                                    placeholder:"e.g. Daniel Reyes" },
  { id:"business",    num:2,  chapter:"ch1", minWords:1,  validate:"business",   label:"Business Name",          question:"What is your business name as it appears online?",                                                                               hint:"Use the exact spelling and spacing people would see on Google or Facebook.",                                                                                                examples:["Reyes Heating and Air","Zach's Mobile Repair"],                                                                                  voiceQ:"What is your business name exactly as it appears on Google or Facebook?", placeholder:"e.g. Reyes Heating and Air" },
  { id:"area",        num:3,  chapter:"ch1", minWords:6,  validate:"area",       label:"Service Area",           question:"What city, state/province, and surrounding areas do you serve — and how long have you been serving them?",                      hint:"Include your main city, state or province (e.g. TN, ON), and any nearby neighborhoods. Then add how long you have been in the area.",                                     examples:["Nashville, TN — Donelson, Mt. Juliet. 14 years.","Mesa, AZ — Gilbert, Chandler. 8 years.","Toronto, ON — Scarborough, North York. 6 years."],                    voiceQ:"What city and state or province do you serve, plus surrounding areas, and how long have you been there?", placeholder:"e.g. Nashville, TN — Donelson, Mt. Juliet. 14 years." },
  { id:"fear",        num:4,  chapter:"ch1", minWords:12, validate:"fear",       label:"Customer Fear You Fix",  question:"Which homeowner fear do you focus on overcoming, and what is the one thing you do every job so customers never feel that fear?",  hint:"Pick ONE fear, then give ONE habit you do every job.",                                                                                                                      examples:["Lack of communication. I send a quick update if anything changes so nobody is left wondering.","Getting overcharged. I show options and prices before I start."],        voiceQ:"Which homeowner fear do you focus on overcoming, and what is one specific thing you do every job?", placeholder:"e.g. Lack of communication. I send a quick update any time something changes.", fearChips:["Getting overcharged","Being left with a mess","Lack of communication"] },
  { id:"humanDetail", num:5,  chapter:"ch2", minWords:6,  label:"Real Life Detail",              question:"What is one specific real life detail about you that neighbors would relate to?",                                                                hint:"Pick ONE and be specific. Family moment, hobby, weekend routine.",                                                                                                          examples:["Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen.","I am restoring a 1991 candy-green Chevy with my son."],                voiceQ:"Tell me one specific real life detail about you that neighbors would relate to.", placeholder:"e.g. Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen." },
  { id:"localFlavor", num:6,  chapter:"ch2", minWords:8,  validate:"localFlavor",label:"Local Place You Love",   question:"What is one specific local place you love, and what do you do there or always get there?",                                      hint:"Use the real name. Park, bakery, restaurant, market — anything local.",                                                                                                    examples:["Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets.","Shelby Bottoms Greenway, we ride bikes to the overlook, then get ice cream."],           voiceQ:"What is one specific local place you genuinely love? Give me the real name and what you always do there.", placeholder:"e.g. Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets." },
  { id:"mission",     num:7,  chapter:"ch2", minWords:1,  label:"Mission Fill-in",               question:"Fill in the blank: I am on a mission to find the best ______. Any suggestions?",                                                               hint:"Choose something people have strong opinions on. Keep it short.",                                                                                                           examples:["tacos","pizza","breakfast spot","coffee","donuts","BBQ"],                                                                                                               voiceQ:"Fill in this blank: I am on a mission to find the best blank in my city. What is it?", placeholder:"e.g. tacos", missionChips:["donuts","pizza","breakfast spot","coffee","tacos","BBQ"] },
  { id:"whyStarted",  num:8,  chapter:"ch3", minWords:12, label:"Why You Started",               question:"What is the real moment that pushed you to start your own business?",                                                                           hint:"Tell it like you would tell a friend. Include what you felt in that moment.",                                                                                               examples:["I got tired of watching my old boss charge elderly customers three times what a job was worth.","I missed one too many dinners and my kid asked if I was working again."], voiceQ:"Tell me the real moment that pushed you to start your own business.", placeholder:"e.g. I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a job the homeowner did not need." },
  { id:"whatChanged", num:9,  chapter:"ch3", minWords:10, label:"What Changed After",             question:"After you started your business, what is one real-life thing you can do now that you could not before?",                                        hint:"Make it something a neighbor can picture in one sentence.",                                                                                                                examples:["I am home to eat dinner with my family instead of coming in after everyone is asleep.","I can coach my kid's team on weeknights, and I do not miss games anymore."],      voiceQ:"After starting your own business, what is one real thing you can do now that you could not before?", placeholder:"e.g. I am home to eat dinner with my family instead of coming in after everyone is asleep." },
  { id:"heroMoment",  num:10, chapter:"ch3", minWords:25, validate:"hero",       label:"Hero Moment",            question:"Tell one Hero Moment story where you helped a customer. What was happening, what did you do, and what did they say or do after?", hint:"Tell it like a short scene. Include one detail you remember so it feels real.",                                                                                          examples:["A single mom had no AC during a heat wave. I found it was a capacitor, showed her the price, fixed it fast, and she said thank you for not scaring me."],               voiceQ:"Tell me one Hero Moment story — a time you went above and beyond for a customer.", placeholder:"What was happening...\nWhat did you do...\nWhat did they say or do after..." },
];

const ch1Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch1");
const ch2Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch2");
const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");

const BOOKING = "I have got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";

const LEAD_TYPES = [
  { id:"like",    emoji:"👍", label:"Like or Emoji",   color:"#FEF9EC", border:YELLOW,    simple:true,
    steps:[
      { label:"Within 24 hours, send this DM to each person who reacted", script:"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?" },
      { label:"Then follow the DM strategy based on their response", note:true }
    ]
  },
  { id:"comment", emoji:"💬", label:"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false, subtypes:[
    { id:"cs1", label:"Asked about a service you offer",    example:"Do you do drain cleaning?",        publicReplies:["@[Name] great question. I do handle [service type], and quality is always guaranteed."],     dmScript:"Hey [Name], thanks so much for commenting. We absolutely can help with [service]. "+BOOKING },
    { id:"cs2", label:"Asked about your service area",      example:"Do you service Donelson?",         publicReplies:["@[Name] great question. We do service [city name], we would love to help you out."],         dmScript:"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious, is there something specific going on I can help with?" },
    { id:"cs3", label:"Needs help now",                     example:"I was just about to call someone!", publicReplies:["@[Name] we would love to help serve you and your family."],                                  dmScript:"Hey [Name], so glad you reached out. "+BOOKING },
    { id:"cs4", label:"Praise or encouragement",            example:"Love this post! Keep it up!",      publicReplies:["@[Name] really appreciate the kind words! Makes all the long days worth it."],                dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." },
    { id:"cs5", label:"Past customer or testimonial",       example:"He did great work for us last year!", publicReplies:["@[Name] repeat customers like you are what keep me going. Grateful for your support."],   dmScript:"Your recommendation means the world to me. Do you know anyone else who could use [services]?" },
    { id:"cs6", label:"Referral or future interest",        example:"I will share this with my neighbor!", publicReplies:["@[Name] really appreciate that. Supporting local businesses helps the whole community."],  dmScript:"Hey [Name], the best compliment someone can give us is to refer us. Could you share their name and phone number?" },
    { id:"cs7", label:"Community connection",               example:"We need more people like you!",     publicReplies:["@[Name] thank you. Our community deserves honest work and that is what I will always stand for."], dmScript:"I love being part of [city/community]. If you ever need help at your place, I would be glad to." },
  ]},
  { id:"share", emoji:"🔁", label:"Share", color:"#F0FDF4", border:"#86EFAC", simple:true,
    steps:[
      { label:"Comment on their share", script:"@[Name] really appreciate that. Supporting local businesses helps the whole community." },
      { label:"Then send this DM",      script:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." }
    ]
  },
  { id:"dm", emoji:"✉️", label:"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false, subtypes:[
    { id:"ds1",  label:"Asked about a service you offer",       example:"Do you do water heater installs?",       dmScript:"Hey, thanks so much for reaching out. We absolutely can help with [service name]. "+BOOKING },
    { id:"ds2",  label:"Asked about a service you do not offer",example:"Do you do roof repairs?",               dmScript:"Hey, thanks so much for reaching out. We do not provide [service] but we do provide [your services]. Is there another item on your to-do list we can help with?" },
    { id:"ds3",  label:"General question or area check",        example:"Do you service Hermitage?",             dmScript:"Hey, thanks so much for reaching out. [Insert your answer to their question here.]" },
    { id:"ds4",  label:"Needs help now",                        example:"I was just about to call someone!",     dmScript:"Hey, thanks so much for reaching out. "+BOOKING },
    { id:"ds5",  label:"Praise or encouragement",               example:"Way to go! Love what you are doing.",   dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." },
    { id:"ds6",  label:"Past customer or testimonial",          example:"He did our siding last year!",           dmScript:"Your recommendation means the world to me. Do you know anyone else who could use [services]?" },
    { id:"ds7",  label:"Referral or future interest",           example:"Can you help my friend?",               dmScript:"Hey, thanks so much for reaching out. Could you share their name and phone number?" },
    { id:"ds8",  label:"Community connection",                  example:"We need more people like you!",         dmScript:"I love being part of [city/community]. If you ever need help at your place, I would be glad to." },
    { id:"ds9",  label:"Competitor or peer",                    example:"We do the same services in another town.", dmScript:"Great to hear from you. If you ever have overflow jobs outside your focus, feel free to send them my way." },
    { id:"ds10", label:"Emotional support or values-based",     example:"I am so proud of you. Blessings!",      dmScript:"That is so kind of you. Messages like this remind me why I started this business. Thank you." },
  ]},
];

const AUDIT_ITEMS = [
  { label:"Posted from a personal account",            doThis:"Your personal Facebook profile",                            notThat:"Your business page or a brand account",                              tip:"Facebook's algorithm shows personal posts to far more people than business pages. This is one of the most important rules." },
  { label:"Post has a hook, story, and closing question", doThis:"Starts with something real, tells a moment, ends with your mission question", notThat:"A list of services, a promo, or generic intro text", tip:"The hook grabs attention, the story builds trust, and the closing question drives comments — which drives reach." },
  { label:"Nothing was added to the post",             doThis:"Exact post as generated — word for word",                   notThat:"Phone number, email, website, or booking link added",                tip:"Adding contact info turns it into an ad. The whole strategy depends on it feeling like a neighbor post, not a sales pitch." },
  { label:"Nothing was removed from the post",         doThis:"Full post intact including the mission question at the end", notThat:"Trimmed, shortened, or missing sections",                           tip:"Every part of the post structure has a purpose. The mission question at the end is what drives comments and engagement." },
  { label:"Appropriate photo attached",                doThis:"Real photo of your face — candid, natural, personal",       notThat:"Stock photo, logo, truck only, AI-generated image, or dark selfie", tip:"The photo is the first thing people see. A real face builds instant connection. Anything else signals 'ad' and people scroll past." },
];

const GOOD_PHOTOS = ["https://i.imgur.com/F7Ur9Rf.png","https://i.imgur.com/HWxgfnO.png","https://i.imgur.com/Cv43HJt.png"];
const BAD_PHOTOS  = ["https://i.imgur.com/l8KAdix.png","https://i.imgur.com/vCVlGIm.png","https://i.imgur.com/7rvGL6O.png"];

const FILLER_REGEX = /^(i mean|uh|um|like|okay|ok|yeah|yes|no|hold on|wait|sorry|hmm|hm|ah|oh|er|right|sure|well|so|and|the|a|an|just|alright|hi|hello|hey)[\s.,!?]*$/i;

function wordCount(s) { return (s||"").trim().split(/\s+/).filter(Boolean).length; }

function validateAnswer(q, text) {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean);
  if (FILLER_REGEX.test(t)) return { ok:false, reason:"filler" };
  if (words.length < q.minWords) return { ok:false, reason:"short" };
  if (q.validate === "name") {
    const nw = t.replace(/[^a-zA-Z\s'-]/g,"").trim().split(/\s+/).filter(Boolean);
    if (nw.length < 2) return { ok:false, reason:"not_a_name" };
  }
  if (q.validate === "area") {
    const hasState = /\b([A-Z]{2})\b/.test(t) || /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|Ontario|Quebec|British Columbia|Alberta|Manitoba|Saskatchewan|Nova Scotia|New Brunswick|Newfoundland|Prince Edward Island)\b/i.test(t);
    if (!hasState) return { ok:false, reason:"missing_state" };
    if (!/\b(\d+\s*(year|yr|years|month|months|decade)|for\s+\d+|going on\s+\d+|almost\s+\d+|over\s+\d+|nearly\s+\d+|new to|just moved|building our life|\d+\+?\s*year)/i.test(t)) return { ok:false, reason:"missing_duration" };
  }
  if (q.validate === "hero") { if (words.length < 25) return { ok:false, reason:"short" }; }
  return { ok:true };
}

const FOLLOWUP_TEMPLATES = {
  name:        ["I did not catch a full name. What is your first and last name?"],
  business:    ["What is the exact name of your business as it appears on Google or Facebook?"],
  area:        { missing_state:["Please include your state or province — for example, TN, AZ, or ON."], missing_duration:["And how long have you been serving that area?"], default:["What city and state or province do you serve, and how long have you been there?"] },
  fear:        ["Pick one of the three fears and tell me one specific thing you do every job to prevent it."],
  humanDetail: ["Add one more detail. A name, a number, a place, or a year."],
  localFlavor: ["Give me the actual name of the spot and one thing you always do or order there."],
  mission:     ["Just say the one thing. Tacos, pizza, donuts, coffee, whatever people have strong opinions on."],
  whyStarted:  ["What were you actually feeling in that moment?"],
  whatChanged: ["Make it something a neighbor can picture. One real thing different in your daily life now."],
  heroMoment:  ["Add one more detail. What did they say, what did you see, or what do you still remember?"],
};

async function callClaude(messages, system) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:2000, messages };
  if (system) body.system = system;
  const isVercel = typeof window !== "undefined" && !window.location.hostname.includes("claude.ai") && window.location.hostname !== "localhost";
  const url = isVercel ? "/api/claude" : "https://api.anthropic.com/v1/messages";
  const r = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  if (!r.ok) throw new Error("API error " + r.status);
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || "API error");
  return (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("") || "";
}

function buildFacebookGroups(city, count) {
  const sfx = ["Community","Homeowners","Neighbors","Buy Sell Trade","Family Connect","Home Improvement","Local Recommendations","Moms and Dads","Real Estate","DIY Home Tips"];
  return sfx.slice(0,count).map((s,i) => ({
    name: city+" "+s,
    type: i<5?"Community":i<10?"Homeowners":"Neighborhood",
    url:  "https://www.facebook.com/groups/search/?q="+encodeURIComponent(city+" "+s),
  }));
}

async function findFacebookGroups(city, count) { return buildFacebookGroups(city, count); }

async function generateAIPost(ans) {
  const city = (ans.area||"").split(/[,.]/)[0].trim() || "my city";
  const lines = [
    "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.",
    "STRICT NO-HALLUCINATION: Use ONLY facts explicitly stated below.",
    "Answers:",
    "1. Name: "        + (ans.name||""),
    "2. Business: "    + (ans.business||""),
    "3. Area: "        + (ans.area||""),
    "4. Customer fear: "+ (ans.fear||""),
    "5. Real life detail: " + (ans.humanDetail||""),
    "6. Local flavor: "+ (ans.localFlavor||""),
    "7. Mission: "     + (ans.mission||""),
    "8. Why started: " + (ans.whyStarted||""),
    "9. What changed: "+ (ans.whatChanged||""),
    "10. Hero moment: "+ (ans.heroMoment||""),
    "RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. NEVER use em dashes or double hyphens. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.",
    "STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Fear + habit, (4) Hero moment as vivid scene, (5) Neighbor proof with real life detail + local flavor, (6) End ONLY with: Also, I am on a mission to find the best "+(ans.mission||"[mission]")+" in "+city+". Any suggestions?",
    "Output post only. No labels.",
  ];
  return await callClaude([{ role:"user", content:lines.join("\n") }]);
}

// ── Dev shortcuts ─────────────────────────────────────────────────────────────
function DevShortcuts(props) {
  var setAnswers = props.setAnswers;
  var setPost = props.setPost;
  var setAppPhase = props.setAppPhase;
  return (
    <div style={{ background:"#FEF9EC", border:"1.5px dashed "+YELLOW, borderRadius:10, padding:"10px 16px", marginTop:16 }}>
      <div style={{ fontSize:13, color:GRAY600, marginBottom:8 }}>{"🧪 Dev shortcuts"}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={function(){ setAnswers(SAMPLE_ANSWERS); setAppPhase("ch1"); }}      style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{"Fill Sample Answers"}</button>
        <button onClick={function(){ setAnswers(SAMPLE_ANSWERS); setAppPhase("getpost"); }}  style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{"Skip to Generate Post"}</button>
        <button onClick={function(){ setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("approval"); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{"Skip to Step 5"}</button>
        <button onClick={function(){ setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("leads"); }}    style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{"Skip to Leads"}</button>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={{ background:WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:20, ...(style||{}) }}>{children}</div>;
}
function Btn({ children, onClick, variant, style, disabled }) {
  const v = variant||"primary";
  const base = { border:"none", borderRadius:10, padding:"13px 24px", fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 };
  const vars = { primary:{background:YELLOW,color:NAVY}, secondary:{background:NAVY,color:WHITE}, success:{background:GREEN,color:WHITE}, ghost:{background:GRAY100,color:GRAY600} };
  return <button onClick={onClick} disabled={!!disabled} style={{ ...base, ...(vars[v]||vars.primary), opacity:disabled?0.5:1, ...(style||{}) }}>{children}</button>;
}
function CardNav({ onBack, onNext, nextDisabled, nextLabel, firstQuestion }) {
  return (
    <div style={{ display:"flex", flexDirection:"row", justifyContent:firstQuestion||!onBack?"flex-end":"space-between", alignItems:"stretch", gap:16, marginTop:24, paddingTop:20, borderTop:"1px solid "+GRAY100 }}>
      {onBack && !firstQuestion && <button onClick={onBack} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:GRAY100, color:GRAY600 }}>Back</button>}
      {onNext && <button onClick={onNext} disabled={!!nextDisabled} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:YELLOW, color:NAVY, opacity:nextDisabled?0.4:1 }}>{nextLabel||"Next"}</button>}
    </div>
  );
}
function SectionHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:32, marginBottom:8 }}>{emoji}</div>
      <h2 style={{ fontSize:22, fontWeight:800, color:NAVY, margin:0 }}>{title}</h2>
      {subtitle && <p style={{ color:GRAY600, margin:"8px 0 0", fontSize:14, lineHeight:1.6 }}>{subtitle}</p>}
    </div>
  );
}
function GroupTable({ groups, showNum }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {groups.map((g,i) => (
        <div key={i} style={{ background:i%2===0?WHITE:GRAY50, border:"1px solid "+GRAY200, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          {showNum && <div style={{ color:GRAY400, fontWeight:700, fontSize:12, minWidth:24 }}>{i+2}</div>}
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, color:NAVY, fontSize:14 }}>{g.name}</div></div>
          <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:WHITE, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, display:"inline-flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Search on Facebook
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function SidebarNav({ current, onNavigate, completedSections }) {
  const showNav = !NO_NAV_PHASES.includes(current);
  const activeSection = NAV_SECTIONS.find(s => s.phases.includes(current));
  return (
    <div style={{ position:"fixed", top:HEADER_H, left:0, bottom:0, width:SIDEBAR_W, background:NAVY, zIndex:90, overflowY:"auto", display:"flex", flexDirection:"column", boxShadow:"2px 0 12px rgba(0,0,0,0.15)", opacity:showNav?1:0, pointerEvents:showNav?"auto":"none" }}>
      <div style={{ padding:"20px 0 32px" }}>
        {NAV_SECTIONS.map(section => {
          const sectionActive = activeSection && section.id === activeSection.id;
          const sectionDone   = completedSections.includes(section.id);
          const subPhases     = section.phases;
          const currentSubIdx = subPhases.indexOf(current);
          return (
            <div key={section.id} style={{ marginBottom:4 }}>
              <button onClick={() => onNavigate(section.phases[0])}
                style={{ width:"100%", border:"none", background:"transparent", display:"flex", alignItems:"center", gap:10, padding:"11px 20px", cursor:"pointer", borderLeft:sectionActive?"3px solid "+YELLOW:"3px solid transparent" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:15, flexShrink:0 }}>{section.icon}</span>
                <span style={{ fontWeight:800, fontSize:13, flex:1, color:sectionDone?GREEN:sectionActive?YELLOW:GRAY400 }}>{sectionDone?"✓ ":""}{section.label}</span>
              </button>
              {sectionActive && !section.noSubs && subPhases.length > 1 && (
                <div style={{ marginLeft:36, marginBottom:6, position:"relative" }}>
                  <div style={{ position:"absolute", left:4, top:0, bottom:0, width:2, background:"rgba(255,255,255,0.08)", borderRadius:1 }}/>
                  {subPhases.map((p,i) => {
                    const isDone = i < currentSubIdx;
                    const isActive = p === current;
                    return (
                      <button key={p} onClick={() => onNavigate(p)}
                        style={{ width:"100%", border:"none", background:isActive?"rgba(254,183,5,0.1)":"transparent", display:"flex", alignItems:"center", gap:10, padding:"7px 12px 7px 18px", cursor:"pointer", borderRadius:"0 8px 8px 0", position:"relative" }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}>
                        <span style={{ position:"absolute", left:-1, width:10, height:10, borderRadius:"50%", background:isDone?GREEN:isActive?YELLOW:"#1e3a52", border:isActive?"2px solid "+YELLOW:isDone?"2px solid "+GREEN:"2px solid rgba(255,255,255,0.15)", boxSizing:"border-box" }}/>
                        <span style={{ fontSize:12, fontWeight:isActive?700:400, color:isActive?YELLOW:isDone?"#6EE7B7":GRAY400 }}>{isDone?"✓ ":""}{PHASE_LABELS[p]||p}</span>
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

// ── Voice Mode ────────────────────────────────────────────────────────────────
function VoiceMode({ onComplete }) {
  const S = useRef({ qIdx:0, answers:{}, rerecordId:null, busy:false, wantMic:false, followupCount:0, partialAnswers:{} });
  const [displayQIdx, setDisplayQIdx] = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState({});
  const [coachMsg, setCoachMsg] = useState("Hey! I am going to walk you through a series of questions to build your story. Tap Start and I will guide you through everything.");
  const [transcript, setTranscript] = useState("");
  const [uiStatus, setUiStatus] = useState("idle");
  const [micErr, setMicErr] = useState("");
  const recogRef = useRef(null);

  function openMic() { if (!recogRef.current||S.current.busy) return; S.current.wantMic=true; try { recogRef.current.start(); setUiStatus("listening"); setMicErr(""); } catch(_) {} }
  function closeMic() { S.current.wantMic=false; try { if (recogRef.current) recogRef.current.stop(); } catch(_) {} }
  function coachSay(msg, after) {
    S.current.busy=true; S.current.wantMic=false; closeMic(); setCoachMsg(msg); setUiStatus("speaking");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg); u.rate=0.95; u.pitch=1.05;
      const t = setTimeout(() => { window.speechSynthesis.cancel(); S.current.busy=false; if (after) after(); else openMic(); }, Math.max(3000, msg.length*65));
      u.onend  = () => { clearTimeout(t); S.current.busy=false; if (after) after(); else openMic(); };
      u.onerror= () => { clearTimeout(t); S.current.busy=false; if (after) after(); else openMic(); };
      window.speechSynthesis.speak(u);
    } else { setTimeout(() => { S.current.busy=false; if (after) after(); else openMic(); }, 500); }
  }
  async function handleAnswer(text) {
    const qi=S.current.qIdx, rid=S.current.rerecordId;
    const q = rid ? ALL_QUESTIONS.find(x=>x.id===rid) : ALL_QUESTIONS[qi];
    const isLast = !rid && qi===ALL_QUESTIONS.length-1;
    const nextQ  = isLast ? null : ALL_QUESTIONS[qi+1];
    const v = validateAnswer(q, text);
    if (!v.ok) {
      const ep = S.current.partialAnswers[q.id]||"";
      const isAdd = ["area","heroMoment","humanDetail","localFlavor","whyStarted","whatChanged","fear"].includes(q.id);
      if (isAdd && text.trim().length>3 && v.reason!=="filler" && v.reason!=="not_a_name") S.current.partialAnswers[q.id] = ep ? ep+" "+text : text;
      const tmpl = FOLLOWUP_TEMPLATES[q.id];
      const retry = q.id==="area" && v.reason==="missing_state" ? tmpl.missing_state[0]
                  : q.id==="area" && v.reason==="missing_duration" ? tmpl.missing_duration[0]
                  : Array.isArray(tmpl) ? tmpl[0] : (tmpl.default ? tmpl.default[0] : q.voiceQ);
      S.current.followupCount = (S.current.followupCount||0)+1;
      if (S.current.followupCount >= 2) { const c = ep ? ep+" "+text : text; if (c.trim().length <= 3) { S.current.busy=false; openMic(); return; } }
      else { setTranscript(""); coachSay(retry, () => openMic()); return; }
    }
    S.current.followupCount = 0;
    const partial = S.current.partialAnswers[q.id];
    const final = partial && !partial.includes(text.trim()) ? partial+" "+text : text;
    if (S.current.partialAnswers[q.id]) delete S.current.partialAnswers[q.id];
    const id = rid||q.id;
    S.current.answers = { ...S.current.answers, [id]:final };
    S.current.rerecordId = null; setDisplayAnswers({...S.current.answers}); setTranscript("");
    if (isLast) { coachSay("That is everything I need. Amazing work. Let us build your post now.", () => setUiStatus("done")); }
    else if (rid) { coachSay("Got it, answer saved.", () => openMic()); }
    else { S.current.qIdx=qi+1; setDisplayQIdx(qi+1); coachSay("Great. "+(nextQ.voiceQ||nextQ.hint), () => openMic()); }
  }
  useEffect(() => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition; if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous=false; r.interimResults=true; r.lang="en-US";
    r.onresult = e => { const l=e.results[e.results.length-1]; const t=l[0].transcript; setTranscript(t); if (!l.isFinal) return; if (!t.trim()||S.current.busy) return; S.current.busy=true; S.current.wantMic=false; setUiStatus("thinking"); handleAnswer(t.trim()); };
    r.onerror  = e => { if (e.error==="no-speech") { if (S.current.wantMic&&!S.current.busy) try{r.start();}catch(_){} return; } S.current.wantMic=false; setMicErr(e.error==="not-allowed"?"Mic blocked.":"Mic error: "+e.error); setUiStatus("idle"); };
    r.onend    = () => { if (S.current.wantMic&&!S.current.busy) { setTimeout(()=>{ if(S.current.wantMic&&!S.current.busy) try{r.start();}catch(_){} },800); } else { setUiStatus(u=>u==="listening"?"idle":u); } };
    recogRef.current = r;
    return () => { S.current.wantMic=false; S.current.busy=false; try{r.stop();}catch(_){} if(window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);
  const answered = Object.values(displayAnswers).filter(v=>v&&v.trim()).length;
  const activeQ  = (S.current.rerecordId ? ALL_QUESTIONS.find(x=>x.id===S.current.rerecordId) : ALL_QUESTIONS[displayQIdx]) || ALL_QUESTIONS[0];
  const isL=uiStatus==="listening", isT=uiStatus==="thinking", isS=uiStatus==="speaking";
  return (
    <div>
      <Card style={{ background:NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ background:YELLOW, borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:900, color:NAVY, fontSize:14 }}>AI</div>
          <div style={{ flex:1 }}>{isT ? <p style={{ color:GRAY400, fontSize:14, margin:0, fontStyle:"italic" }}>Processing...</p> : <p style={{ color:WHITE, fontSize:16, margin:0, lineHeight:1.8 }}>{coachMsg}</p>}</div>
        </div>
      </Card>
      {uiStatus!=="idle" && uiStatus!=="done" && (
        <Card>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:8, paddingBottom:8 }}>
            <button type="button" onClick={isL?closeMic:openMic} disabled={isT||isS}
              style={{ background:isL?RED:isS||isT?GRAY400:GRAY200, border:"none", borderRadius:"50%", width:80, height:80, cursor:isT||isS?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isL?"0 0 0 10px rgba(239,68,68,0.15)":"none", transition:"all 0.3s" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={isL?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
            </button>
            <span style={{ fontSize:13, color:isL?RED:isS?YELLOW:GRAY400, fontWeight:isL||isS?600:400 }}>{isL?"Listening...":isT?"Processing...":isS?"Coach speaking...":"Tap to start"}</span>
            {micErr && <span style={{ fontSize:12, color:RED }}>{micErr}</span>}
            {transcript && <div style={{ background:"#F0F7FF", border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", width:"100%", boxSizing:"border-box", fontSize:14, color:GRAY800, lineHeight:1.7 }}><div style={{ fontSize:11, color:GRAY400, marginBottom:4, fontWeight:600 }}>YOU SAID:</div>{transcript}</div>}
          </div>
          {activeQ && <div style={{ marginTop:12, padding:"12px 14px", background:GRAY50, borderRadius:10 }}><span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700, marginRight:6 }}>Q{activeQ.num}</span><span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{activeQ.question}</span></div>}
        </Card>
      )}
      {uiStatus!=="idle" && <div style={{ marginBottom:12 }}><div style={{ background:GRAY200, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:YELLOW, borderRadius:99, height:6, width:Math.round((answered/ALL_QUESTIONS.length)*100)+"%", transition:"width 0.4s" }}/></div></div>}
      {uiStatus==="idle" && <div style={{ textAlign:"center", marginTop:8 }}><Btn onClick={() => { const q=ALL_QUESTIONS[0]; coachSay("Alright, let us build your story! "+(q.voiceQ||q.hint), () => openMic()); }}>Start Voice Session</Btn></div>}
      {answered > 0 && (
        <Card>
          <h3 style={{ color:NAVY, margin:"0 0 16px", fontSize:16 }}>📝 Your Answers So Far</h3>
          {ALL_QUESTIONS.filter(q=>displayAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+GRAY200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{q.num}</span><span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{q.question}</span></div>
                  <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{displayAnswers[q.id]}</p>
                </div>
                <button onClick={() => { S.current.rerecordId=q.id; const rq=ALL_QUESTIONS.find(x=>x.id===q.id); setTranscript(""); coachSay("No problem, let us redo that. "+(rq.voiceQ||rq.hint), () => openMic()); }} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, color:GRAY600, cursor:"pointer", flexShrink:0 }}>Re-record</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {uiStatus==="done" && <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><Btn onClick={() => onComplete({...S.current.answers})}>Next →</Btn></div>}
    </div>
  );
}

// ── Get Post ──────────────────────────────────────────────────────────────────
function GetPost({ allCh3Met, post, postLoading, postError, answers, onGenerate, onSetPost, onNext, onBack, onWritePost }) {
  const [copied, setCopied]     = useState(false);
  const [everCopied, setEverCopied] = useState(false);
  const taRef = useRef(null);
  useEffect(() => {
    if (!taRef.current||!post) return;
    taRef.current.style.height="auto";
    requestAnimationFrame(() => { if (taRef.current) taRef.current.style.height=taRef.current.scrollHeight+"px"; });
  }, [post]);
  const handleCopy = () => {
    if (!post) return;
    try { const el=document.createElement("textarea"); el.value=post; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(post); }
    setCopied(true); setEverCopied(true);
  };
  useEffect(() => { if (allCh3Met && !post && !postLoading) onGenerate(answers); }, []);
  return (
    <Card>
      <SectionHeader emoji="✍️" title="Step 2 — Generate Post"/>
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
          <textarea value={post} onChange={e=>onSetPost(e.target.value)} rows={10} placeholder="Paste your Facebook post here..." style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?NAVY:GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":GRAY50, outline:"none" }}/>
        </>
      )}
      {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:GRAY600, fontSize:14 }}>Writing your post... about 15 seconds.</p></div>}
      {postError && !postLoading && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{postError} <button onClick={() => onGenerate(answers)} style={{ background:"none", border:"none", color:NAVY, fontWeight:700, cursor:"pointer", textDecoration:"underline", fontSize:13 }}>Try again</button></div>}
      {post && !postLoading && (
        <>
          <textarea ref={taRef} value={post} onChange={e => { onSetPost(e.target.value); setCopied(false); setEverCopied(false); e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"; }}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"none", background:GRAY50, outline:"none", marginBottom:14, overflow:"hidden", display:"block" }}/>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:20 }}>
            <Btn onClick={handleCopy} variant={copied?"success":"primary"}>{copied?"Copied!":"Copy Post"}</Btn>
            <button onClick={() => { setCopied(false); setEverCopied(false); onGenerate(answers); }} disabled={postLoading} style={{ background:"none", border:"2px solid "+GRAY300, borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, color:GRAY600, cursor:"pointer" }}>Regenerate</button>
          </div>
        </>
      )}
      <CardNav onBack={onBack} onNext={everCopied?onNext:undefined} nextDisabled={!everCopied} nextLabel="Next"/>
    </Card>
  );
}

// ── Type Mode ─────────────────────────────────────────────────────────────────
function TypeMode({ onComplete, savedAnswers, onAnswerChange }) {
  const [qIdx, setQIdx] = useState(() => { const f=ALL_QUESTIONS.findIndex(q=>wordCount(savedAnswers[q.id]||"")<q.minWords); return f===-1?0:f; });
  const [showError, setShowError] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState(false);
  const [inspirationExamples, setInspirationExamples] = useState([]);
  const recogRef = useRef(null);
  const [micL, setMicL] = useState(false);
  const [micErr, setMicErr] = useState("");
  const q = ALL_QUESTIONS[qIdx];
  const value = savedAnswers[q.id]||"";
  const wc = wordCount(value);
  const met = wc >= q.minWords;
  const isLast = qIdx === ALL_QUESTIONS.length-1;
  const answered = ALL_QUESTIONS.filter(q2=>wordCount(savedAnswers[q2.id]||"")>=q2.minWords).length;
  const pct = Math.round((answered/ALL_QUESTIONS.length)*100);

  useEffect(() => {
    setShowInspiration(false); setInspirationExamples([]);
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition; if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous=false; r.interimResults=false; r.lang="en-US";
    r.onresult = e => { const t=e.results[0][0].transcript; const c=savedAnswers[q.id]||""; onAnswerChange(q.id, c?c+" "+t:t); setMicL(false); };
    r.onerror  = e => { setMicL(false); setMicErr(e.error==="not-allowed"?"Mic blocked.":"Mic error."); };
    r.onend    = () => setMicL(false);
    recogRef.current = r;
    return () => { try { r.stop(); } catch(_) {} };
  }, [qIdx]);

  const toggleMic = () => { if (!recogRef.current) return; if (micL) { try{recogRef.current.stop();}catch(_){} setMicL(false); } else { try{recogRef.current.start();setMicL(true);setMicErr("");}catch(_){} } };
  const handleNext = () => { if (!met) { setShowError(true); return; } setShowError(false); if (isLast) onComplete(savedAnswers); else { setQIdx(i=>i+1); setMicErr(""); setShowError(false); } };
  const handleBack = () => { if (qIdx>0) { setQIdx(i=>i-1); setMicErr(""); setShowError(false); } };

  const handleInspiration = async () => {
    setShowInspiration(v => !v);
    if (inspirationExamples.length>0 || showInspiration) return;
    setInspirationLoading(true);
    try {
      const reply = await callClaude([{ role:"user", content:"Give 3 short vivid example answers for this question from a home service business owner:\n\nQuestion: "+q.question+"\nContext: "+q.hint+"\n\nReturn ONLY a JSON array of 3 strings. No markdown." }]);
      const cleaned = reply.replace(/```json/gi,"").replace(/```/g,"").trim();
      const s=cleaned.indexOf("["), e=cleaned.lastIndexOf("]");
      if (s!==-1&&e!==-1) { const p=JSON.parse(cleaned.slice(s,e+1)); setInspirationExamples(Array.isArray(p)?p:[]); }
    } catch(_) { setInspirationExamples(q.examples||[]); }
    setInspirationLoading(false);
  };

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ background:WHITE, borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 4px 24px rgba(0,41,66,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>Your Story Progress</span>
          <span style={{ fontWeight:800, fontSize:14, color:pct===100?GREEN:NAVY }}>{answered} / {ALL_QUESTIONS.length}</span>
        </div>
        <div style={{ background:GRAY100, borderRadius:99, height:14, overflow:"hidden", position:"relative" }}>
          <div style={{ background:pct===100?GREEN:YELLOW, borderRadius:99, height:"100%", width:pct+"%", transition:"width 0.5s ease", position:"relative" }}>
            {pct>8 && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:10, fontWeight:800, color:NAVY }}>{pct}%</span>}
          </div>
        </div>
      </div>
      <div style={{ background:WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:10 }}>
          <span style={{ background:NAVY, color:YELLOW, borderRadius:8, padding:"5px 12px", fontSize:13, fontWeight:800, flexShrink:0, marginTop:2 }}>Q{q.num}</span>
          <span style={{ fontWeight:800, color:NAVY, fontSize:18, lineHeight:1.4 }}>{q.question}</span>
        </div>
        <p style={{ fontSize:14, color:GRAY600, margin:"0 0 16px", lineHeight:1.7 }}>{q.hint}</p>
        {q.fearChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Pick the fear you focus on</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.fearChips.map((chip,i) => {
                const sel = value.toLowerCase().startsWith(chip.toLowerCase());
                return (
                  <button key={i} onClick={() => { if (sel) { onAnswerChange(q.id, value.replace(new RegExp("^"+chip+"\\.?\\s*","i"),"").trim()); } else { onAnswerChange(q.id, chip+". "+value.replace(new RegExp("^(Getting overcharged|Being left with a mess|Lack of communication)\\.?\\s*","i"),"").trim()); } }}
                    style={{ background:sel?NAVY:GRAY50, color:sel?YELLOW:GRAY800, border:"2px solid "+(sel?NAVY:GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    {sel?"✓ ":""}{chip}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {q.missionChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Quick pick</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.missionChips.map((chip,i) => (
                <button key={i} onClick={() => onAnswerChange(q.id, value===chip?"":chip)}
                  style={{ background:value===chip?NAVY:GRAY50, color:value===chip?YELLOW:GRAY800, border:"2px solid "+(value===chip?NAVY:GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  {value===chip?"✓ ":""}{chip}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Need Inspiration — above the textarea */}
        <div style={{ marginBottom:12 }}>
          <button onClick={handleInspiration} style={{ background:"transparent", border:"2px dashed "+GRAY300, borderRadius:10, padding:"8px 16px", fontSize:13, color:GRAY600, cursor:"pointer", fontWeight:600, display:"inline-flex", alignItems:"center", gap:6 }}>
            {showInspiration ? "💡 Hide inspiration" : "💡 Need inspiration?"}
          </button>
        </div>
        {showInspiration && (
          <div style={{ marginBottom:14, background:"#FFFBEB", border:"1.5px solid "+YELLOW, borderRadius:12, padding:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:GRAY600, margin:"0 0 12px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Example answers — use as a guide only</p>
            {inspirationLoading
              ? <p style={{ fontSize:13, color:GRAY400, fontStyle:"italic", margin:0 }}>Loading examples...</p>
              : (inspirationExamples.length>0 ? inspirationExamples : q.examples||[]).map((ex,i,arr) => (
                <div key={i} style={{ marginBottom:i<arr.length-1?12:0 }}>
                  <p style={{ fontSize:13, color:GRAY800, margin:0, lineHeight:1.7, fontStyle:"italic" }}>"{ex}"</p>
                  {i<arr.length-1 && <div style={{ borderTop:"1px solid "+GRAY200, marginTop:12 }}/>}
                </div>
              ))
            }
            <p style={{ fontSize:11, color:GRAY400, margin:"12px 0 0" }}>These are guides only — write your own real version.</p>
          </div>
        )}
        <div style={{ position:"relative" }}>
          <textarea value={value} onChange={e => { onAnswerChange(q.id,e.target.value); if(showError)setShowError(false); }} placeholder={q.placeholder}
            rows={q.id==="heroMoment"?6:q.id==="whyStarted"||q.id==="fear"?4:3} autoFocus
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(showError?RED:met?GREEN:GRAY200), borderRadius:12, padding:"14px 52px 14px 14px", fontSize:15, color:GRAY800, fontFamily:"inherit", resize:"vertical", outline:"none", transition:"border 0.2s", background:WHITE, lineHeight:1.8 }}/>
          <button type="button" onClick={toggleMic} style={{ position:"absolute", top:12, right:12, background:micL?RED:GRAY100, border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={micL?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
          </button>
        </div>
        {micL && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>Listening...</p>}
        {micErr && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>{micErr}</p>}
        {wc>0 && q.minWords>1 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
            <div style={{ flex:1, background:GRAY100, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:met?GREEN:YELLOW, height:6, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }}/></div>
            <span style={{ fontSize:12, fontWeight:700, color:met?GREEN:GRAY600, whiteSpace:"nowrap" }}>{met?"✓ good":wc+" / "+q.minWords+" words"}</span>
          </div>
        )}
        {showError && !met && <div style={{ background:"#FEF2F2", border:"1.5px solid #FCA5A5", borderRadius:10, padding:"10px 14px", marginTop:12, fontSize:13, color:"#991B1B", fontWeight:600 }}>Add one more detail — a name, place, number, or year.</div>}
        <CardNav onBack={qIdx>0?handleBack:undefined} onNext={handleNext} nextLabel="Next" firstQuestion={qIdx===0}/>
      </div>
    </div>
  );
}

// ── Audit Row ─────────────────────────────────────────────────────────────────
function AuditRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1.5px solid "+GRAY200, borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", background:WHITE }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{item.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#D1FAE5", color:"#065F46", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>DO</span>
              <span style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{item.doThis}</span>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>NOT</span>
              <span style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{item.notThat}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:GRAY400, fontSize:14, flexShrink:0, padding:"2px 4px" }}>{open?"▲":"▼"}</button>
      </div>
      {open && (
        <div style={{ background:"#FFFBEB", borderTop:"1px solid "+GRAY200, padding:"12px 16px", display:"flex", gap:10 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
          <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{item.tip}</p>
        </div>
      )}
    </div>
  );
}

// ── Photo Step ────────────────────────────────────────────────────────────────
function PhotoStep({ answers, onBack, onNext }) {
  const [photoIdeas, setPhotoIdeas] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function gen() {
      setLoading(true);
      try {
        const prompt = "A home service business owner filled out these details:\n- Human detail: "+(answers.humanDetail||"not provided")+"\n- Local place: "+(answers.localFlavor||"not provided")+"\n- Why started: "+(answers.whyStarted||"not provided")+"\n- Hero moment: "+(answers.heroMoment||"not provided")+"\n\nGive 3 personalized Facebook photo ideas rated Good, Better, Best. Return ONLY valid JSON, no markdown:\n{\"good\":{\"label\":\"short title\",\"desc\":\"1 sentence\"},\"better\":{\"label\":\"short title\",\"desc\":\"1 sentence tied to their details\"},\"best\":{\"label\":\"short title\",\"desc\":\"1 sentence most trust-building for them\"}}";
        const reply = await callClaude([{ role:"user", content:prompt }]);
        const cleaned = reply.replace(/```json/gi,"").replace(/```/g,"").trim();
        const s=cleaned.indexOf("{"), e=cleaned.lastIndexOf("}");
        if (s!==-1&&e!==-1) setPhotoIdeas(JSON.parse(cleaned.slice(s,e+1)));
        else throw new Error("parse");
      } catch(_) {
        setPhotoIdeas({ good:{label:"Any real photo of you",desc:"Face visible, natural light, looks like a real person."}, better:{label:"You doing something you love",desc:"A hobby, your kids' game, your local spot — something neighbors relate to."}, best:{label:"A candid moment on the job",desc:"You working, smiling, face clearly visible. Shows who you are and what you do."} });
      }
      setLoading(false);
    }
    gen();
  }, []);
  const tiers = [
    { key:"good",   badge:"GOOD",    color:"#F0FDF4", border:"#86EFAC", textColor:"#166534" },
    { key:"better", badge:"BETTER",  color:"#EFF6FF", border:"#93C5FD", textColor:"#1E40AF" },
    { key:"best",   badge:"BEST ⭐", color:"#FEF9EC", border:YELLOW,    textColor:"#92400E" },
  ];
  return (
    <Card>
      <SectionHeader emoji="📸" title="Step 3 — Choose Your Photo" subtitle="Your photo is the first thing people see. The right one doubles your engagement."/>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:12 }}>📷 Photo ideas based on your story</div>
        {loading
          ? <div style={{ textAlign:"center", padding:24, color:GRAY400, fontSize:13 }}>Generating personalized ideas...</div>
          : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {tiers.map(t => (
                <div key={t.key} style={{ background:t.color, border:"1.5px solid "+t.border, borderRadius:12, padding:"14px 12px", display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ background:t.border, color:t.textColor, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800, letterSpacing:"0.04em", alignSelf:"flex-start" }}>{t.badge}</span>
                  <div style={{ fontWeight:800, color:NAVY, fontSize:14, lineHeight:1.3 }}>{photoIdeas[t.key].label}</div>
                  <div style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{photoIdeas[t.key].desc}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700, color:GREEN, fontSize:13, marginBottom:10 }}>✅ Anti-Ad photos — these build trust</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {GOOD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #86EFAC", aspectRatio:"1", background:GRAY100 }}><img src={src} alt="Good example" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
        <div style={{ fontWeight:700, color:RED, fontSize:13, marginBottom:10 }}>❌ Ad photos — these kill trust</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {BAD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #FCA5A5", aspectRatio:"1", background:GRAY100 }}><img src={src} alt="Bad example" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
      </div>
      <CardNav onBack={onBack} onNext={onNext}/>
    </Card>
  );
}

// ── Lead Engagement ────────────────────────────────────────────────────────────
function LeadEngagement({ onBack, onAmplify }) {
  const [watched, setWatched] = useState(false);
  const [active, setActive]   = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [log, setLog]         = useState([]);
  const [jobsInput, setJobsInput] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [likeCount, setLikeCount] = useState(1);
  const activeLead    = LEAD_TYPES.find(l=>l.id===active);
  const activeSubtype = activeLead && subtype ? (activeLead.subtypes||[]).find(s=>s.id===subtype) : null;
  const sessionCounts = LEAD_TYPES.reduce((acc,lt) => { acc[lt.id]=log.filter(l=>l.type===lt.id).length; return acc; }, {});
  const sessionTotal  = log.length;

  function copyText(text, idx) {
    try { const el=document.createElement("textarea"); el.value=text; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(text); }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  }
  function logLead(tid, n) { const num=n||1; setLog(p=>[...p,...Array.from({length:num},()=>({type:tid,timestamp:Date.now()}))]); }
  function reset() { setActive(null); setSubtype(null); setLikeCount(1); }

  function ScriptBox({ text, idx }) {
    return (
      <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <p style={{ fontSize:14, color:GRAY800, lineHeight:1.8, margin:"0 0 10px", fontStyle:"italic" }}>"{text}"</p>
        <button onClick={() => copyText(text,idx)} style={{ background:copiedIdx===idx?GREEN:NAVY, color:copiedIdx===idx?WHITE:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{copiedIdx===idx?"Copied!":"Copy Script"}</button>
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
        </div>
        <CardNav onBack={onBack} onNext={() => setWatched(true)} nextLabel="Next"/>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ background:NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Work Your Leads</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>Pick the type of engagement. Follow the steps. Book the job.</p></div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:YELLOW, fontWeight:900, fontSize:24, lineHeight:1 }}>{sessionTotal}</div><div style={{ color:GRAY400, fontSize:10, marginTop:3 }}>this session</div></div>
            <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:GREEN, fontWeight:900, fontSize:24, lineHeight:1 }}>{totalJobs}</div><div style={{ color:GREEN, fontSize:10, marginTop:3 }}>jobs booked</div></div>
          </div>
        </div>
        <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(255,255,255,0.08)", borderRadius:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:WHITE, fontSize:13, fontWeight:600 }}>+ Log a booked job:</span>
          <input type="number" min="1" value={jobsInput} onChange={e=>setJobsInput(e.target.value)} placeholder="# of jobs" style={{ width:90, border:"2px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"7px 10px", fontSize:15, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", background:WHITE }}/>
          <Btn onClick={() => { const n=parseInt(jobsInput); if(n>0){setTotalJobs(j=>j+n);setJobsInput("");} }} disabled={!jobsInput||parseInt(jobsInput)<1} style={{ fontSize:13 }}>Add Jobs</Btn>
        </div>
        <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10 }}><p style={{ color:WHITE, fontSize:13, margin:0 }}>Time kills deals. First 24–48 hours are everything.</p></div>
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
                {sessionCounts[lt.id]>0 && <span style={{ fontSize:11, color:GRAY600, fontWeight:600 }}>{sessionCounts[lt.id]} this session</span>}
              </button>
            ))}
          </div>
        </Card>
      )}
      {activeLead && activeLead.simple && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← Back</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          {activeLead.steps.map((step,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontWeight:700, color:NAVY, fontSize:14, paddingTop:2 }}>{step.label}</div>
              </div>
              {step.note ? <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:NAVY }}>Use the <strong>Direct Message</strong> playbook once they respond.</div> : <ScriptBox text={step.script} idx={i}/>}
            </div>
          ))}
          {activeLead.id==="like" ? (
            <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16 }}>
              <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 12px" }}>How many people did you DM?</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <input type="number" min="1" value={likeCount} onChange={e=>setLikeCount(Math.max(1,parseInt(e.target.value)||1))} style={{ width:90, border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", fontSize:22, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", fontFamily:"inherit", background:WHITE }}/>
                <Btn variant="success" onClick={() => { logLead(activeLead.id,likeCount); reset(); }}>Log {likeCount} DM{likeCount!==1?"s":""}</Btn>
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
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← Back</button>
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
            <button onClick={() => setSubtype(null)} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← Back</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <div><div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{activeLead.label}</div><div style={{ fontSize:12, color:GRAY600 }}>{activeSubtype.label}</div></div>
          </div>
          {activeLead.id==="comment" && (
            <div>
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>1. Reply publicly</div>
              {activeSubtype.publicReplies.map((r,i) => <ScriptBox key={i} text={r} idx={i}/>)}
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"16px 0 8px" }}>2. Then immediately DM</div>
              <ScriptBox text={activeSubtype.dmScript} idx={99}/>
            </div>
          )}
          {activeLead.id==="dm" && (
            <div>
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>1. Reply within 24 hours</div>
              <ScriptBox text={activeSubtype.dmScript} idx={0}/>
            </div>
          )}
          <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
            <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>Mark as Worked</Btn>
            <Btn variant="ghost" onClick={() => setSubtype(null)}>Different Response</Btn>
          </div>
        </Card>
      )}
      {sessionTotal>0 && !active && (
        <Card>
          <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>This Session</h3>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            {LEAD_TYPES.map(lt => sessionCounts[lt.id]>0 && (
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
          <h3 style={{ color:YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>Keep the momentum going</h3>
          <p style={{ color:GRAY400, fontSize:13, lineHeight:1.7, margin:"0 0 20px" }}>Done working this batch? Head to Amplify to post in more groups.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"space-between" }}>
            <Btn variant="ghost" onClick={onBack} style={{ background:"rgba(255,255,255,0.1)", color:WHITE }}>Back</Btn>
            <Btn onClick={onAmplify}>Go to Amplify</Btn>
          </div>
        </Card>
      )}
    </>
  );
}

// ── Amplify ───────────────────────────────────────────────────────────────────
function AmplifyScreen({ onBack, city }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extra, setExtra] = useState(0);
  useEffect(() => { findFacebookGroups(city||"Your City",10).then(r=>{setGroups(r);setLoading(false);}).catch(()=>setLoading(false)); }, [city]);
  return (
    <>
      <Card style={{ background:NAVY }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Amplify</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>Keep the momentum going.</p></div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 20px", textAlign:"center" }}>
            <div style={{ color:YELLOW, fontWeight:900, fontSize:32, lineHeight:1 }}>{10+extra}</div>
            <div style={{ color:GRAY400, fontSize:11, marginTop:4 }}>total groups posted</div>
          </div>
        </div>
      </Card>
      <Card><Btn variant="success" onClick={() => setExtra(n=>n+1)}>+ Posted in Another Group</Btn></Card>
      <Card>
        <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 16px" }}>More groups near you</h3>
        {loading && <p style={{ color:GRAY600, fontSize:14 }}>Finding groups near {city}...</p>}
        {!loading && groups.length>0 && <GroupTable groups={groups} showNum={false}/>}
      </Card>
      <div style={{ marginTop:8 }}><Btn variant="ghost" onClick={onBack}>← Back</Btn></div>
    </>
  );
}

// ── Coach Dashboard ───────────────────────────────────────────────────────────
function CoachDashboard({ onClose }) {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  async function load() {
    setLoading(true);
    try {
      const r = await window.storage.list("submission:", true);
      const keys = (r&&r.keys)?r.keys:[];
      const items = [];
      for (let i=0;i<keys.length;i++) { try { const x=await window.storage.get(keys[i],true); if(x&&x.value) items.push(JSON.parse(x.value)); } catch(e) {} }
      setSubs(items.sort((a,b)=>b.timestamp-a.timestamp));
    } catch(e) { setSubs([]); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:GRAY100, zIndex:300, overflowY:"auto" }}>
      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16 }}>Coach Dashboard</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>{subs.length} submissions</div></div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={load}    style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Refresh</button>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Back</button>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 16px 60px" }}>
        {loading && <Card><p style={{ textAlign:"center", color:GRAY600, padding:40 }}>Loading...</p></Card>}
        {!loading && subs.length===0 && <Card><div style={{ textAlign:"center", padding:20 }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><p style={{ color:GRAY600 }}>No submissions yet.</p></div></Card>}
        {!loading && subs.map((s,i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontWeight:800, color:NAVY, fontSize:17 }}>{s.name||"Unknown"}</div>
                <div style={{ fontSize:13, color:GRAY600, marginTop:2 }}>{s.business} — {s.city}</div>
                <div style={{ fontSize:12, color:GRAY400, marginTop:4 }}>{s.timestamp?new Date(s.timestamp).toLocaleString():"—"}</div>
              </div>
              <span style={{ background:"#DBEAFE", color:"#1D4ED8", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.status||"Post Generated"}</span>
            </div>
            <button onClick={() => setExpanded(expanded===i?null:i)} style={{ marginTop:14, background:GRAY50, border:"1px solid "+GRAY200, borderRadius:8, padding:"6px 14px", fontSize:12, color:NAVY, fontWeight:600, cursor:"pointer" }}>{expanded===i?"Hide Details ▲":"View Details ▼"}</button>
            {expanded===i && s.post && <div style={{ marginTop:16 }}><div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:8 }}>Generated Post:</div><div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:16, fontSize:13, color:GRAY800, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.post}</div></div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Celebration ───────────────────────────────────────────────────────────────
function CelebrationScreen({ onNext, onBack }) {
  const msgs = [
    { h:"🏆 Achievement Unlocked!", s:"10 groups. 1 post. Zero sales pitches. Let's go!" },
    { h:"🎯 Mission Complete!",     s:"You showed up as a neighbor. That's the whole game." },
    { h:"🔥 Week 1 = Done!",        s:"Anti-Ad strategy executed. Leads incoming." },
  ];
  const [msg] = useState(() => msgs[Math.floor(Math.random()*msgs.length)]);
  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#002942,#003a5c)", borderRadius:20, padding:"40px 32px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:16, lineHeight:1 }}>🎯</div>
        <h1 style={{ color:YELLOW, fontSize:28, fontWeight:900, margin:"0 0 12px" }}>{msg.h}</h1>
        <p style={{ color:WHITE, fontSize:18, margin:0, fontWeight:600 }}>{msg.s}</p>
      </div>
      <Card>
        <h3 style={{ color:NAVY, fontSize:17, fontWeight:800, margin:"0 0 16px" }}>Here is what you executed this week:</h3>
        {[
          { emoji:"👥", title:"Joined 10 local Facebook groups",    desc:"You are now inside the conversations happening in your city." },
          { emoji:"✍️", title:"Created a trust-first intro post",   desc:"No sales pitch. No contact info. Just your story." },
          { emoji:"📣", title:"Posted across 10 groups",            desc:"Your face and your story are now in front of thousands of local homeowners." },
          { emoji:"👤", title:"Posted as a neighbor, not a business",desc:"Personal account. Real story. That is exactly why this works." },
        ].map((item,i) => (
          <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:GRAY50, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
            <span style={{ fontSize:24, flexShrink:0 }}>{item.emoji}</span>
            <div><div style={{ fontWeight:800, color:NAVY, fontSize:14, marginBottom:3 }}>{item.title}</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>{item.desc}</div></div>
          </div>
        ))}
        <div style={{ background:NAVY, borderRadius:14, padding:20, marginBottom:24, marginTop:8 }}>
          <p style={{ color:YELLOW, fontWeight:900, fontSize:15, margin:"0 0 8px" }}>You joined the groups. You wrote the post. You executed the Anti-Ad strategy.</p>
          <p style={{ color:WHITE, fontSize:14, margin:0, lineHeight:1.8 }}>You showed up as a neighbor, not a salesperson. Your leads are already coming in.</p>
        </div>
        <CardNav onBack={onBack} onNext={onNext} nextLabel="Next"/>
      </Card>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const isDev = typeof window !== "undefined" && window.location.search.indexOf("dev=true") !== -1;
  const [lang, setLang]                   = useState("en");
  const [appPhase, setAppPhase]           = useState("lane");
  const [answers, setAnswers]             = useState({});
  const [post, setPost]                   = useState("");
  const [postLoading, setPostLoading]     = useState(false);
  const [postError, setPostError]         = useState("");
  const [groups5, setGroups5]             = useState([]);
  const [groups20, setGroups20]           = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError]     = useState("");
  const [manualCity, setManualCity]       = useState("");
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showDashboard, setShowDashboard]   = useState(false);
  const [passcodeInput, setPasscodeInput]   = useState("");
  const [passcodeError, setPasscodeError]   = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const topRef = useRef(null);

  const showSidebar = !NO_NAV_PHASES.includes(appPhase);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior:"smooth" }); }, [appPhase]);

  const city = answers.area ? answers.area.split(/[,.]/)[0].replace(/[^a-zA-Z\s]/g,"").trim() : manualCity.trim() || "Your City";

  useEffect(() => {
    if (appPhase==="groups" && groups5.length===0 && !groupsLoading) {
      setGroupsLoading(true); setGroupsError("");
      findFacebookGroups(city,5).then(r=>{setGroups5(r);setGroupsLoading(false);}).catch(()=>{setGroupsLoading(false);setGroupsError("Search failed.");});
    }
    if (appPhase==="replicate" && groups20.length===0 && !groupsLoading) {
      setGroupsLoading(true);
      findFacebookGroups(city,10).then(r=>{setGroups20(r);setGroupsLoading(false);}).catch(()=>setGroupsLoading(false));
    }
  }, [appPhase]);

  async function saveSubmission(a, gp, status) {
    const data = a||answers;
    const name = (data.name||"Unknown").trim();
    const key  = "submission:"+name.replace(/\s+/g,"_").toLowerCase()+"_"+(data.business||"biz").replace(/\s+/g,"_").toLowerCase();
    try {
      let prev = {};
      try { const ex=await window.storage.get(key,true); if(ex&&ex.value) prev=JSON.parse(ex.value); } catch(e) {}
      const rec = { name, business:data.business||"", city:(data.area||manualCity||"").split(/[,.]/)[0].replace(/[^a-zA-Z\s]/g,"").trim(), answers:data, post:gp!==undefined?gp:(prev.post||""), status:status||prev.status||"Post Generated", postGenerated:true, timestamp:prev.timestamp||Date.now(), updatedAt:Date.now() };
      await window.storage.set(key, JSON.stringify(rec), true);
    } catch(e) {}
  }

  async function handleGeneratePost(ans) {
    const a = ans||answers;
    setPostLoading(true); setPostError("");
    try {
      const g = await generateAIPost(a);
      const c = g.replace(/\u2014/g,",").replace(/--/g,",").trim();
      if (!c||c.length<50) throw new Error("empty");
      setPost(c);
      setCompletedSections(p => p.includes("write")?p:[...p,"write"]);
      await saveSubmission(a, c, "Post Generated");
    } catch(e) { setPostError("Could not generate post. Please try again."); }
    setPostLoading(false);
  }

  const allCh3Met = ch3Qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const answeredN = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;

  return (
    <div style={{ minHeight:"100vh", background:GRAY100, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)}/>}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 16px", textAlign:"center" }}>Coach Access</h3>
            <input type="password" value={passcodeInput} onChange={e=>{setPasscodeInput(e.target.value);setPasscodeError(false);}}
              onKeyDown={e=>{if(e.key==="Enter"){if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true);}}}
              placeholder="Enter passcode" style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?RED:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }}/>
            {passcodeError && <p style={{ color:RED, fontSize:12, margin:"0 0 8px" }}>Incorrect passcode.</p>}
            <Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true); }}>Enter Dashboard</Btn>
            <button onClick={() => { setShowCoachLogin(false);setPasscodeInput("");setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer", padding:"4px 0" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:NAVY, padding:"0 20px", height:HEADER_H, display:"flex", alignItems:"center", justifyContent:"space-between", position:"fixed", top:0, left:0, right:0, zIndex:160, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:16 }}>H</div>
          <div>
            <div style={{ color:WHITE, fontWeight:800, fontSize:14, lineHeight:1 }}>Business Coaching Foundations</div>
            <div style={{ color:YELLOW, fontSize:11, fontWeight:600 }}>Week 1 — Facebook Organic Strategy</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"inline-flex", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, overflow:"hidden" }}>
            {["en","es"].map(l => <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?YELLOW:"transparent", color:lang===l?NAVY:WHITE, border:"none", padding:"5px 12px", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{l==="en"?"EN":"ES"}</button>)}
          </div>
          {appPhase==="lane" && <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Coach Dashboard</button>}
          {appPhase!=="lane" && <button onClick={() => setAppPhase("lane")} style={{ background:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", color:NAVY, fontSize:12, fontWeight:800, cursor:"pointer" }}>⌂ Home</button>}
        </div>
      </div>

      <SidebarNav current={appPhase} onNavigate={setAppPhase} completedSections={completedSections}/>

      <div style={{ paddingTop:HEADER_H, marginLeft:showSidebar?SIDEBAR_W:0, transition:"margin-left 0.2s ease", minHeight:"calc(100vh - "+HEADER_H+"px)" }}>
        <div ref={topRef} style={{ maxWidth:680, margin:"0 auto", padding:"28px 16px 60px" }}>

          {/* HOME */}
          {appPhase==="lane" && (
            <div>
              <div style={{ background:NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
                <h1 style={{ color:WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>Turn Your Story Into<br/><span style={{ color:YELLOW }}>Jobs on Your Calendar</span></h1>
                <p style={{ color:GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px" }}>Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.</p>
                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                  {["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"].map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:WHITE }}>{s}</div>)}
                </div>
              </div>
              <button onClick={() => { if(answeredN===0) setAppPhase("writechoice"); else if(!post) setAppPhase("getpost"); else setAppPhase("replicate"); }}
                style={{ width:"100%", background:YELLOW, border:"none", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:24, boxShadow:"0 4px 20px rgba(254,183,5,0.35)" }}>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:NAVY, opacity:0.6, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>Continue where you left off</div>
                  <div style={{ fontSize:16, fontWeight:900, color:NAVY }}>{answeredN===0?"Start Writing Your Post":!post?"Generate Your Post":"Cross-Post to More Groups"}</div>
                </div>
                <div style={{ background:NAVY, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </button>
              <h3 style={{ color:NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>Your Week 1 Checklist</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {[
                  { phase:"writechoice", icon:"✍️", bg:NAVY,       title:"Write Post",     desc:"Answer 10 questions. AI writes your trust-building post.", time:"~8 min",  progress:answeredN+" of 10 answered", status:answeredN===0?{l:"Not Started",bg:GRAY100,fg:GRAY400}:answeredN<10?{l:"In Progress",bg:"#FEF9EC",fg:"#92400E"}:{l:"Done",bg:"#D1FAE5",fg:"#065F46"} },
                  { phase:"groups",      icon:"📣", bg:NAVY_LIGHT,  title:"Post in Groups", desc:"Find local Facebook groups and replicate your post to 10.", time:"~15 min", progress:"10 group posts",           status:{l:"Not Started",bg:GRAY100,fg:GRAY400} },
                  { phase:"leads",       icon:"🔥", bg:"#065F46",   title:"Work Leads",     desc:"Turn every like, comment, share, and DM into a booked job.", time:"~5 min", progress:"Scripts for every type",   status:{l:"Not Started",bg:GRAY100,fg:GRAY400} },
                  { phase:"amplify",     icon:"📡", bg:"#4F46E5",   title:"Amplify",        desc:"Post in more groups to keep generating fresh leads.", time:"Ongoing",     progress:"Cast a wider net",            status:{l:"Not Started",bg:GRAY100,fg:GRAY400} },
                ].map(item => (
                  <div key={item.phase} onClick={() => setAppPhase(item.phase)} style={{ background:WHITE, borderRadius:16, boxShadow:"0 2px 12px rgba(0,41,66,0.06)", overflow:"hidden", cursor:"pointer", display:"flex" }}>
                    <div style={{ background:item.bg, width:56, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>{item.icon}</div>
                    <div style={{ padding:"14px 16px", flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{item.title}</div>
                        <span style={{ background:item.status.bg, color:item.status.fg, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{item.status.l}</span>
                      </div>
                      <div style={{ fontSize:12, color:GRAY600 }}>{item.desc}</div>
                      <div style={{ fontSize:11, color:GRAY400, marginTop:4 }}>{item.time} — {item.progress}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", paddingRight:16 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                ))}
              </div>
              {isDev && <DevShortcuts setAnswers={setAnswers} setPost={setPost} setAppPhase={setAppPhase}/>}
            </div>
          )}

          {appPhase==="writechoice" && (
            <Card>
              <SectionHeader emoji="✍️" title="Write Your Post" subtitle="How would you like to answer the questions?"/>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:8 }}>
                <button onClick={() => setAppPhase("ch1")} style={{ background:WHITE, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>⌨️</div>
                  <div><div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>Type My Answers</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>Fill in each question at your own pace. Mic icon available to dictate.</div></div>
                </button>
                <button onClick={() => setAppPhase("voice")} style={{ background:NAVY, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>🎤</div>
                  <div><div style={{ fontWeight:800, color:YELLOW, fontSize:15, marginBottom:4 }}>Talk Through It</div><div style={{ fontSize:13, color:GRAY400, lineHeight:1.5 }}>Speak your answers. An AI coach guides you through every question.</div></div>
                </button>
              </div>
              <CardNav onBack={() => setAppPhase("lane")}/>
            </Card>
          )}

          {appPhase==="voice" && <VoiceMode onComplete={va => { setAnswers(va); setAppPhase("groups"); handleGeneratePost(va); }}/>}

          {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3") && (
            <TypeMode onComplete={va => { setAnswers(va); setAppPhase("groups"); }} savedAnswers={answers} onAnswerChange={(id,val) => setAnswers(prev => ({...prev,[id]:val}))}/>
          )}

          {appPhase==="groups" && (
            <Card>
              <SectionHeader emoji="🧭" title="Step 1 — Join a Group" subtitle="Find an active local Facebook group and join it. You only need one to start."/>
              {!answers.area && (
                <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                  <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:NAVY }}>What city or area do you serve?</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={manualCity} onChange={e=>setManualCity(e.target.value)} placeholder="e.g. East Nashville" style={{ flex:1, border:"2px solid "+GRAY200, borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", fontFamily:"inherit" }}/>
                    <button onClick={() => { setGroups5([]); setGroupsError(""); setGroupsLoading(true); findFacebookGroups(manualCity||"Nashville",5).then(r=>{setGroups5(r);setGroupsLoading(false);}).catch(()=>setGroupsLoading(false)); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>Search</button>
                  </div>
                </div>
              )}
              {groupsLoading && <div style={{ textAlign:"center", padding:32 }}><p style={{ color:GRAY600 }}>Finding groups near {city}...</p></div>}
              {groupsError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{groupsError}</div>}
              {!groupsLoading && groups5.length>0 && (
                <>
                  <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:NAVY, lineHeight:1.6 }}>💡 These are search suggestions — each button opens a Facebook search for that group type in your area. Browse the results and join a public group.</div>
                  <GroupTable groups={groups5} showNum={false}/>
                </>
              )}
              <CardNav onBack={() => setAppPhase("lane")} onNext={() => setAppPhase("getpost")}/>
            </Card>
          )}

          {appPhase==="getpost" && <GetPost allCh3Met={allCh3Met} post={post} postLoading={postLoading} postError={postError} answers={answers} onGenerate={handleGeneratePost} onSetPost={setPost} onNext={() => setAppPhase("photo")} onBack={() => setAppPhase("groups")} onWritePost={() => setAppPhase("writechoice")}/>}

          {appPhase==="photo" && <PhotoStep answers={answers} onBack={() => setAppPhase("getpost")} onNext={() => setAppPhase("dopost")}/>}

          {appPhase==="dopost" && (
            <Card>
              <SectionHeader emoji="🚀" title="Step 4 — Post It" subtitle="Follow these steps exactly. Use your personal account, not your business page."/>
              <div style={{ background:"#FEF2F2", border:"1.5px solid "+RED, borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
                <div>
                  <p style={{ fontWeight:800, color:"#991B1B", fontSize:14, margin:"0 0 4px" }}>Post from your PERSONAL account, not your business page.</p>
                  <p style={{ fontSize:13, color:"#991B1B", margin:0, lineHeight:1.6 }}>Facebook shows personal posts to way more people. Log in as yourself before you post.</p>
                </div>
              </div>
              {[{num:1,text:"Open the Facebook group you joined and tap Write something"},{num:2,text:"Paste your copied post"},{num:3,text:"Attach your photo"},{num:4,text:"Tap Post"}].map(s => (
                <div key={s.num} style={{ display:"flex", gap:14, marginBottom:18, alignItems:"flex-start" }}>
                  <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, flexShrink:0 }}>{s.num}</div>
                  <p style={{ margin:0, fontSize:15, color:GRAY800, paddingTop:7, lineHeight:1.6 }}>{s.text}</p>
                </div>
              ))}
              <CardNav onBack={() => setAppPhase("photo")} onNext={() => setAppPhase("approval")}/>
            </Card>
          )}

          {appPhase==="approval" && (
            <Card>
              <SectionHeader emoji="📋" title="Step 5 — Coach Approval"/>
              <div style={{ background:"#EFF6FF", borderRadius:12, padding:20, marginBottom:24, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:10 }}>👋</div>
                <p style={{ color:NAVY, fontWeight:700, fontSize:15, margin:"0 0 8px" }}>Your post is live!</p>
                <p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, margin:0 }}>Let your coach know you are ready for your audit. Here is exactly what they will be checking.</p>
              </div>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>🔍 The Coach Audit — 5 Things We Check</div>
                <p style={{ fontSize:13, color:GRAY600, margin:"0 0 16px" }}>Tap any row to see why it matters.</p>
                {AUDIT_ITEMS.map((item,i) => <AuditRow key={i} item={item}/>)}
              </div>
              <CardNav onBack={() => setAppPhase("dopost")} onNext={() => { saveSubmission(answers,post,"Coach Approved"); setAppPhase("replicate"); }}/>
            </Card>
          )}

          {appPhase==="replicate" && (
            <Card>
              <SectionHeader emoji="🔁" title="Step 6 — Join and Cross-Post" subtitle="Find 9 more public groups, join them, and post in each one. Same post. Same photo. No edits."/>
              <div style={{ background:GRAY50, borderRadius:12, padding:16, marginBottom:24 }}>
                {["Search for local groups using the links below and join 9 more public groups.","Use the exact same post — do not change a single word.","Attach the exact same photo. Do not add your phone number, website, or any contact info.","Post immediately in each public group once you have joined."].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading && <p style={{ color:GRAY600, fontSize:14, textAlign:"center" }}>Loading group suggestions...</p>}
              {!groupsLoading && groups20.length>0 && <div style={{ marginBottom:20 }}><GroupTable groups={groups20} showNum={false}/></div>}
              <CardNav onBack={() => setAppPhase("approval")} onNext={() => { setCompletedSections(p=>p.includes("grouppost")?p:[...p,"grouppost"]); saveSubmission(answers,post,"10 Groups Done"); setAppPhase("celebrate"); }} nextLabel="Next"/>
            </Card>
          )}

          {appPhase==="celebrate" && <CelebrationScreen onNext={() => setAppPhase("leads")} onBack={() => setAppPhase("replicate")}/>}
          {appPhase==="leads"     && <LeadEngagement onBack={() => setAppPhase("celebrate")} onAmplify={() => setAppPhase("amplify")}/>}
          {appPhase==="amplify"   && <AmplifyScreen onBack={() => setAppPhase("leads")} city={city}/>}

        </div>
      </div>
    </div>
  );
}