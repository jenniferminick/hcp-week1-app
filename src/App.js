import { useState, useRef, useEffect } from "react";

const NAVY      = "#002942";
const NAVY_LIGHT= "#003a5c";
const YELLOW    = "#FEB705";
const WHITE     = "#F8FAFC";
const GRAY50    = "#F1F5F9";
const GRAY100   = "#E2E8F0";
const GRAY200   = "#CBD5E1";
const GRAY400   = "#64748B";
const GRAY600   = "#334155";
const GRAY800   = "#0F172A";
const GREEN     = "#10B981";
const RED       = "#EF4444";
const COACH_PASSCODE = "coach123";

const NAV_SECTIONS = [
  { id:"write",     label:"Write Post",     phases:["ch1","ch2","ch3","waitforcoach"] },
  { id:"grouppost", label:"Post in Groups", phases:["groups","getpost","photo","dopost","approval","replicate"] },
  { id:"leads",     label:"Work Leads",     phases:["leads","amplify"] },
];
const PHASE_LABELS = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3", waitforcoach:"Stop Here",
  groups:"1. Join a Group", getpost:"2. Get & Copy Post",
  photo:"3. Choose Photo", dopost:"4. Post It",
  approval:"5. Submit for Review", replicate:"6. Cross-Post",
  leads:"Work Leads", amplify:"Amplify",
};
const NO_NAV_PHASES = ["lane","writechoice","voice"];

const SAMPLE_ANSWERS = {
  name:"Marcus Webb", business:"Webb Home Services",
  area:"East Nashville, Donelson, and Hermitage - been working this area for going on 11 years now",
  knownFor:"slow drain detective", topServices:"drain cleaning and water heater installs",
  refuses:"I will never tell someone they need a full repipe just to run up a bill when a simple repair will fix the problem just fine",
  humanDetail:"I have been slowly restoring a 1967 candy apple red Ford Bronco I found rusting in a barn two summers ago and my son comes out to the garage every Saturday to help me wrench on it",
  localPlace:"Mas Tacos Por Favor in East Nashville",
  localActivity:"always get the chicken taco plate and eat it standing outside on the sidewalk no matter what the weather is doing",
  mission:"hot chicken in Nashville",
  whyStarted:"I got tired of watching my old boss charge elderly customers three times what a job was worth and then sleeping just fine at night - I walked out one afternoon and never looked back and it was the best decision I ever made",
  whatChanged:"Now I make it home for dinner most nights and I coached my son's baseball team this spring for the first time",
  heroCrisis:"An elderly woman called me at 7pm on Christmas Eve her heat had been out for two days and she had her three grandkids coming in from out of town the next morning and she was in tears on the phone when I picked up",
  heroSacrifice:"I drove 40 minutes out there worked two hours in the cold and only charged her for the cost of the part because I was not going to let her spend Christmas worrying about a bill",
  heroPayoff:"She grabbed my hand on the way out and told me she was going to tell everyone she knew about me and she has sent me four referrals since that night",
};

const ALL_QUESTIONS = [
  { id:"name",          num:1,    chapter:"ch1", minWords:2,  label:"Your Name",                   hint:"First and last name. Minimum 2 words.",                                                                          placeholder:"e.g. Sarah Mitchell" },
  { id:"business",      num:2,    chapter:"ch1", minWords:2,  label:"Business Name",               hint:"Business name as shown online. Minimum 2 words.",                                                                placeholder:"e.g. Mitchell Home Services" },
  { id:"area",          num:3,    chapter:"ch1", minWords:8,  label:"Where You Serve",             hint:"Cities or neighborhoods you serve and how long you have been in the area. Minimum 8 words.",                     placeholder:"e.g. East Nashville, Donelson, and Hermitage - been working this area for going on 11 years now" },
  { id:"knownFor",      num:4,    chapter:"ch1", minWords:3,  label:"Your Known For",              hint:"2-3 specific words that describe what you are the go-to person for. No generic words. Minimum 3 words.",         placeholder:"e.g. slow drain detective or same-day water heater guy" },
  { id:"topServices",   num:5,    chapter:"ch1", minWords:4,  label:"Top 2 Services",              hint:"The two services you most want to be known for. Minimum 4 words.",                                              placeholder:"e.g. drain cleaning and water heater installs" },
  { id:"refuses",       num:"5b", chapter:"ch1", minWords:15, label:"What You Refuse to Do",       hint:"One firm thing you refuse to do that others in your industry do. Minimum 15 words.",                            placeholder:"e.g. I will never tell someone they need a full repipe just to run up a bill when a simple repair will fix the problem just fine" },
  { id:"humanDetail",   num:6,    chapter:"ch2", minWords:15, label:"One Human Detail",            hint:"One real detail about you outside work with specifics like year, color, name, or context. Minimum 15 words.",   placeholder:"e.g. I have been slowly restoring a 1967 candy apple red Ford Bronco I found rusting in a barn two years ago" },
  { id:"localPlace",    num:7,    chapter:"ch2", minWords:4,  label:"Local Flavor - Place",        hint:"The actual name of one specific local place you genuinely love. Minimum 4 words.",                              placeholder:"e.g. Mas Tacos Por Favor in East Nashville" },
  { id:"localActivity", num:"7b", chapter:"ch2", minWords:10, label:"What You Do There",           hint:"Exactly what you do or always order there. Minimum 10 words.",                                                 placeholder:"e.g. always get the chicken taco plate and eat it standing outside on the sidewalk" },
  { id:"mission",       num:8,    chapter:"ch2", minWords:3,  label:"Your Mission Question",       hint:"Fill in the blank: I am on a mission to find the best blank. Minimum 3 words.",                                placeholder:"e.g. hot chicken in Nashville or breakfast taco in town" },
  { id:"whyStarted",    num:9,    chapter:"ch3", minWords:20, label:"Why You Started",             hint:"The real moment that pushed you to start your business. Be honest and specific. Minimum 20 words.",             placeholder:"e.g. I got tired of watching my old boss charge elderly customers three times what a job was worth and sleeping fine at night - I walked out and never looked back" },
  { id:"whatChanged",   num:"9b", chapter:"ch3", minWords:10, label:"What Did It Change?",         hint:"A real concrete change in your life or family since going out on your own. Minimum 10 words.",                 placeholder:"e.g. Now I make it home for dinner most nights and I coached my son's baseball team this spring" },
  { id:"heroCrisis",    num:10,   chapter:"ch3", minWords:20, label:"Hero Moment - The Crisis",    hint:"Paint the full picture of who was in trouble, what the situation looked like, what was at stake. Minimum 20 words.", placeholder:"e.g. An elderly woman called me at 7pm on Christmas Eve, her heat had been out for two days, and she had her grandkids coming in the morning" },
  { id:"heroSacrifice", num:"10b",chapter:"ch3", minWords:10, label:"Hero Moment - The Sacrifice", hint:"What you actually did or gave up. Minimum 10 words.",                                                           placeholder:"e.g. I drove 40 minutes, worked two hours, and only charged her for the cost of the part" },
  { id:"heroPayoff",    num:"10c",chapter:"ch3", minWords:10, label:"Hero Moment - The Payoff",    hint:"The real emotional reaction, theirs or yours. Minimum 10 words.",                                              placeholder:"e.g. She grabbed my hand on the way out and said she was going to tell everyone she knew about me" },
];
const ch1Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch1");
const ch2Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch2");
const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");

const INSPIRATION_EXAMPLES = {
  name:         ["Lisa Tran", "Derek Fowler", "Carlos Reyes"],
  business:     ["Tran Electrical Services", "Fowler Plumbing", "Reyes Landscaping"],
  area:         ["Brentwood, Franklin, and Spring Hill — been serving these communities for 8 years now", "North Austin and Round Rock — my family has lived here my whole life, going on 34 years"],
  knownFor:     ["same-day water heater guy", "the no-mess electrician", "lawn rescue specialist"],
  topServices:  ["panel upgrades and EV charger installs", "water heater replacement and drain cleaning", "lawn care and seasonal cleanups"],
  refuses:      ["I will never quote a job over the phone just to lock someone in and then inflate the price once I am on site", "I refuse to recommend a full replacement when a simple repair will solve the problem"],
  humanDetail:  ["I coach my daughter's soccer team every Saturday morning and we have not missed a game in three seasons rain or shine", "I have been restoring a 1972 Chevelle in my garage for two years and my teenage son has started helping me on weekends"],
  localPlace:   ["Turnip Truck Organic Market in East Nashville", "Pinewood Social in the Gulch", "Barista Parlor on Gallatin Ave"],
  localActivity:["always grab the breakfast tacos and eat them on the patio before the rush hits", "take my kids there every Sunday after church and we always split the pancakes"],
  mission:      ["breakfast burrito in Phoenix", "smash burger in Dallas", "fish tacos in San Diego"],
  whyStarted:   ["I watched my old boss talk down to customers like they were stupid for not knowing how electricity works and one day I just could not take it anymore and walked out", "After my dad got overcharged by a contractor who took advantage of him not knowing better I decided I was going to be the guy people could actually trust"],
  whatChanged:  ["I finally stopped missing my kids bedtime every night and I coached little league for the first time this spring", "My wife says I actually smile when I come home now instead of walking in exhausted and defeated"],
  heroCrisis:   ["A young mom called me on a Friday afternoon her water heater had flooded her basement and she had family coming in for a birthday party the next morning and she was completely panicked", "An elderly man called me in August his AC had been out for four days during a heat advisory and his doctor had told him to stay cool"],
  heroSacrifice:["I drove out there after my daughter's recital worked until midnight and only charged her for parts because it was the right thing to do", "I cancelled my Saturday plans and spent the whole day getting it fixed at cost"],
  heroPayoff:   ["She called me the next week just to say thank you and has sent me three referrals since then", "He shook my hand for a long time and said I reminded him of his son I still think about that"],
};

const BOOKING_SCRIPT = "I've got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";
const LEAD_TYPES = [
  { id:"like", emoji:"👍", label:"Like or Emoji", color:"#FEF9EC", border:YELLOW, simple:true,
    steps:[
      { label:"Within 24 hours, send this DM to each person who reacted", script:"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?" },
      { label:"Then follow the DM strategy based on their response", note:true },
    ]},
  { id:"comment", emoji:"💬", label:"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false,
    subtypes:[
      { id:"comment_service_q", label:"Asked about a service you offer", example:'"Do you do drain cleaning?"', publicReplies:["@[Name] great question. I do handle [service type], and quality is always guaranteed.","@[Name] yes! Whether it's [service A] or [service B], we make sure it's done right every time."], dmScript:"Hey [Name], thanks so much for commenting. I didn't want to get into the details publicly. We absolutely can help with [service]. " + BOOKING_SCRIPT },
      { id:"comment_area_q", label:"Asked about your service area", example:'"Do you service Donelson?"', publicReplies:["@[Name] great question. We do service [city name], we'd love to help you out.","@[Name] yes! Whether it's [service A] or [service B], we make sure it's done right every time."], dmScript:"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious — is there something specific going on I can help with?" },
      { id:"comment_needs_now", label:"Needs help now", example:'"I was just about to call someone!"', publicReplies:["@[Name] we'd love to help serve you and your family.","@[Name] the stars have aligned — we'd be glad to help."], dmScript:"Hey [Name], so glad you reached out. " + BOOKING_SCRIPT },
      { id:"comment_praise", label:"Praise or encouragement", example:'"Love this post! Keep it up!"', publicReplies:["@[Name] really appreciate the kind words! Makes all the long days worth it.","@[Name] thanks so much. Our community is what makes our work so rewarding."], dmScript:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you." },
      { id:"comment_testimonial", label:"Past customer or testimonial", example:'"He did great work for us last year!"', publicReplies:["@[Name] repeat customers like you are what keep me going. Grateful for your support.","@[Name] thanks for sharing your experience! Referrals and word of mouth are how small businesses like mine grow."], dmScript:"Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?" },
      { id:"comment_referral", label:"Referral or future interest", example:'"I\'ll share this with my neighbor!"', publicReplies:["@[Name] really appreciate that. Supporting local businesses helps the whole community.","@[Name] thanks so much. I'd love to earn their trust the same way I earned yours."], dmScript:"Hey [Name], really appreciate that. The best compliment someone can give us is to refer us to someone else. We'd love to help them out — could you share their name and phone number?" },
      { id:"comment_community", label:"Community connection", example:'"We need more people like you in this town!"', publicReplies:["@[Name] thank you. Our community deserves honest work and that's what I'll always stand for.","@[Name] love that! If you see me around, definitely say hi."], dmScript:"I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I'd be glad to." },
    ]},
  { id:"share", emoji:"🔁", label:"Share", color:"#F0FDF4", border:"#86EFAC", simple:true,
    steps:[
      { label:"Comment on their share", script:"@[Name] really appreciate that. Supporting local businesses helps the whole community." },
      { label:"Then send this DM", script:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you." },
    ]},
  { id:"dm", emoji:"✉️", label:"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false,
    subtypes:[
      { id:"dm_service_yes", label:"Asked about a service you offer", example:'"Do you do water heater installs?"', dmScript:"Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. We absolutely can help with [service name]. " + BOOKING_SCRIPT },
      { id:"dm_service_no", label:"Asked about a service you don't offer", example:'"Do you do roof repairs?"', dmScript:"Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. We don't provide [service] but we do provide [your services]. Is there another item on your to-do list we can help with?" },
      { id:"dm_general_q", label:"General question or area check", example:'"Do you service Hermitage?"', dmScript:"Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. [Insert your answer to their question here.]" },
      { id:"dm_needs_now", label:"Needs help now", example:'"I was just about to call someone — DMing you now!"', dmScript:"Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. " + BOOKING_SCRIPT },
      { id:"dm_praise", label:"Praise or encouragement", example:'"Way to go! Love what you\'re doing."', dmScript:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you." },
      { id:"dm_testimonial", label:"Past customer or testimonial", example:'"He did our siding last year — highly recommend!"', dmScript:"Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?" },
      { id:"dm_referral", label:"Referral or future interest", example:'"Can you help my friend?"', dmScript:"Hey, thanks so much for reaching out. I really appreciate it. The best compliment someone can give us is to refer us to someone else. We'd love to help them out — could you share their name and phone number?" },
      { id:"dm_community", label:"Community connection", example:'"We need more people like you in this town!"', dmScript:"I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I'd be glad to." },
      { id:"dm_competitor", label:"Competitor or peer", example:'"We do the same services in another town."', dmScript:"Great to hear from you, [Name]. I've found there's more than enough work to go around. If you ever have overflow jobs or something outside your focus, feel free to send them my way. I'll do the same for you." },
      { id:"dm_emotional", label:"Emotional support or values-based", example:'"I\'m so proud of you. Blessings to you!"', dmScript:"That's so kind of you, [Name]. Messages like this remind me why I started this business. Thank you for taking the time to say that." },
    ]},
];

const GOOD_PHOTOS = [
  { url:"https://i.imgur.com/F7Ur9Rf.png", label:"You with family outdoors", desc:"Real moment, face visible, natural light." },
  { url:"https://i.imgur.com/HWxgfnO.png", label:"You with your partner", desc:"Warm, approachable, human connection." },
  { url:"https://i.imgur.com/Cv43HJt.png", label:"Special life moment", desc:"Shows who you are outside of work." },
];
const BAD_PHOTOS = [
  { url:"https://i.imgur.com/l8KAdix.png", label:"Working but no face", desc:"No face = no connection. People buy from people." },
  { url:"https://i.imgur.com/vCVlGIm.png", label:"Logo or branding", desc:"Looks like an ad. Kills the neighbor feel instantly." },
  { url:"https://i.imgur.com/7rvGL6O.png", label:"No people in the photo", desc:"Nothing to connect with. You need to be in it." },
];

function wordCount(str) { return (str||"").trim().split(/\s+/).filter(Boolean).length; }

async function callClaude(messages, system) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:2000, messages };
  if (system) body.system = system;
  const r = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  const d = await r.json();
  return (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("") || "";
}
async function validateChapterAnswers(questions, answers) {
  const block = questions.map(q => "Q"+q.num+" - "+q.label+": "+(answers[q.id]||"(no answer)")).join("\n");
  const reply = await callClaude([{ role:"user", content:"You are a business coach reviewing answers for a Facebook story post. Check each for real specificity.\n\nANSWERS:\n"+block+"\n\nReturn only JSON: {\"passed\": true or false, \"feedback\": {\"questionId\": \"coaching message\"}}. Only include IDs needing improvement." }]);
  try { const clean = reply.replace(/```json|```/g,"").trim(); const s = clean.indexOf("{"); const e = clean.lastIndexOf("}"); return s !== -1 ? JSON.parse(clean.slice(s,e+1)) : {passed:true,feedback:{}}; }
  catch(e) { return {passed:true,feedback:{}}; }
}
async function findFacebookGroups(city, count) {
  const reply = await callClaude([{ role:"user", content:"Generate "+count+" realistic Facebook group names for the "+city+" area that a home service contractor could post in. Sort Public first.\n\nReturn ONLY a raw JSON array:\n[{\"name\": \"group name\", \"type\": \"Community or Homeowners or Family or Buy/Sell or Neighborhood\", \"members\": \"e.g. 4.2K\", \"privacy\": \"Public or Private\"}]" }]);
  const match = reply.match(/\[[\s\S]*?\]/); if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]); if (!Array.isArray(parsed)) return [];
    return parsed.filter(g => g.name).map(g => ({...g, url:"https://www.facebook.com/search/groups/?q="+encodeURIComponent(g.name)})).sort((a,b) => a.privacy==="Public"?-1:1);
  } catch(e) { return []; }
}
async function generateAIPost(ans) {
  const p = "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.\n\n"
    +"Answers:\n1. Name: "+(ans.name||"")+"\n2. Business: "+(ans.business||"")+"\n3. Area: "+(ans.area||"")
    +"\n4. Known For: "+(ans.knownFor||"")+"\n5. Services: "+(ans.topServices||"")+"\n5b. Refuses: "+(ans.refuses||"")
    +"\n6. Human Detail: "+(ans.humanDetail||"")+"\n7. Local Place: "+(ans.localPlace||"")+"\n7b. Activity: "+(ans.localActivity||"")
    +"\n8. Mission: "+(ans.mission||"")+"\n9. Why Started: "+(ans.whyStarted||"")+"\n9b. Changed: "+(ans.whatChanged||"")
    +"\n10. Crisis: "+(ans.heroCrisis||"")+"\n10b. Sacrifice: "+(ans.heroSacrifice||"")+"\n10c. Payoff: "+(ans.heroPayoff||"")
    +"\n\nSTRICT NO-HALLUCINATION: Only use facts from answers above.\n"
    +"RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. No em dashes. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.\n"
    +"STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Hero moment 8-12 lines, (4) Neighbor proof, (5) End ONLY with: \"Also, I'm on a mission to find the best [mission] in [city]. Any suggestions?\"\n"
    +"Output post only. No labels.";
  return await callClaude([{ role:"user", content:p }]);
}

function getWriteStatus(answers) {
  const n = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  if (n === 0) return { label:"Not Started", color:GRAY400, bg:GRAY100 };
  if (n < ALL_QUESTIONS.length) return { label:"In Progress", color:"#92400E", bg:"#FEF9EC" };
  return { label:"Done", color:"#065F46", bg:"#D1FAE5" };
}
function getGroupStatus(completedSections, coachApproved, postCount) {
  if (!completedSections.includes("grouppost") && postCount === 0 && !coachApproved) return { label:"Not Started", color:GRAY400, bg:GRAY100 };
  if (completedSections.includes("grouppost")) return { label:"Done", color:"#065F46", bg:"#D1FAE5" };
  if (coachApproved) return { label:"Needs Review", color:"#1D4ED8", bg:"#DBEAFE" };
  return { label:"In Progress", color:"#92400E", bg:"#FEF9EC" };
}
function getLeadsStatus(dmSent, stacked) {
  if (!dmSent) return { label:"Not Started", color:GRAY400, bg:GRAY100 };
  if (!stacked) return { label:"In Progress", color:"#92400E", bg:"#FEF9EC" };
  return { label:"Done", color:"#065F46", bg:"#D1FAE5" };
}
function getNextStep(answers, post, completedSections, coachApproved, postCount, dmSent, stacked) {
  const n = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  if (n === 0) return { label:"Start Writing Your Post", phase:"writechoice", emoji:"✍️" };
  if (n < ALL_QUESTIONS.length) { const nq = ALL_QUESTIONS.find(q => wordCount(answers[q.id]) < q.minWords); return { label:"Continue Writing — "+n+" of 15 done", phase:nq?nq.chapter:"ch1", emoji:"✍️" }; }
  if (!post) return { label:"Generate Your Post", phase:"getpost", emoji:"✨" };
  if (!coachApproved) return { label:"Post in Groups & Get Coach Approval", phase:"groups", emoji:"📣" };
  if (!completedSections.includes("grouppost")) return { label:"Cross-Post to 10 Groups", phase:"replicate", emoji:"🔁" };
  if (!dmSent) return { label:"Start Working Your Leads", phase:"leads", emoji:"🔥" };
  if (!stacked) return { label:"Keep Amplifying — Post More Groups", phase:"leads", emoji:"⚡" };
  return { label:"Week 1 Complete — Keep Going!", phase:"leads", emoji:"🎯" };
}

function Card({ children, style }) {
  return <div style={Object.assign({ background:WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:20 }, style||{})}>{children}</div>;
}
function Btn({ children, onClick, variant, style, disabled }) {
  const v = variant||"primary";
  const base = { border:"none", borderRadius:10, minHeight:44, minWidth:44, padding:"0 24px", fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6 };
  const vars = { primary:{background:YELLOW,color:NAVY}, secondary:{background:NAVY,color:WHITE}, success:{background:GREEN,color:WHITE}, ghost:{background:"transparent",color:GRAY400,border:"1.5px solid "+GRAY200} };
  return <button onClick={onClick} disabled={!!disabled} style={Object.assign({},base,vars[v]||vars.primary,{opacity:disabled?0.45:1},style||{})}>{children}</button>;
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
function ProgressBar({ current, total }) {
  const pct = Math.round((current/total)*100);
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:GRAY400, marginBottom:4 }}><span>{current} of {total} answered</span><span>{pct}%</span></div>
      <div style={{ background:GRAY200, borderRadius:99, height:6 }}><div style={{ background:YELLOW, borderRadius:99, height:6, width:pct+"%", transition:"width 0.4s" }} /></div>
    </div>
  );
}
function PhaseNav({ current, onNavigate, completedSections }) {
  if (NO_NAV_PHASES.includes(current)) return null;
  const activeSection = NAV_SECTIONS.find(s => s.phases.includes(current));
  if (!activeSection) return null;
  const subPhases = activeSection.phases;
  const currentSubIdx = subPhases.indexOf(current);
  const sectionPct = Math.round(((currentSubIdx+1)/subPhases.length)*100);
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
        {NAV_SECTIONS.map(section => {
          const sectionActive = section.phases.includes(current);
          const sectionDone = completedSections.includes(section.id);
          return (
            <div key={section.id} style={{ flex:1, minWidth:0 }}>
              <div onClick={() => onNavigate && onNavigate(section.phases[0])}
                style={{ background:sectionDone?GREEN:sectionActive?NAVY:GRAY200, color:sectionDone?WHITE:sectionActive?YELLOW:GRAY600, borderRadius:sectionActive?"10px 10px 0 0":10, padding:"8px 14px", fontSize:13, fontWeight:800, textAlign:"center", cursor:"pointer", transition:"all 0.2s" }}>
                {sectionDone?"✓ ":""}{section.label}
              </div>
              {sectionActive && (
                <div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderTop:"none", borderRadius:"0 0 10px 10px", padding:"8px 10px", display:"flex", flexDirection:"column", gap:5 }}>
                  {subPhases.map((p,i) => {
                    const isDone = i < currentSubIdx; const isActive = p === current;
                    return (
                      <div key={p} onClick={e => { e.stopPropagation(); onNavigate && onNavigate(p); }}
                        style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:isDone?"#D1FAE5":isActive?YELLOW:GRAY200, color:isDone?"#065F46":isActive?NAVY:GRAY400, cursor:"pointer", textAlign:"center", transition:"all 0.2s", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {isDone?"✓ ":""}{PHASE_LABELS[p]||p}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ background:GRAY200, borderRadius:99, height:10 }}>
        <div style={{ background:sectionPct===100?GREEN:YELLOW, borderRadius:99, height:10, width:sectionPct+"%", transition:"width 0.4s ease" }} />
      </div>
    </div>
  );
}

function MicBtn({ onTranscript, size, previewValue, onPreviewChange }) {
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState("");
  const recogRef = useRef(null);
  const finalRef = useRef("");
  const sz = Math.max(size||30, 44);
  const iconSz = Math.min(size||30, 22);
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = e => {
      let final = ""; let inter = "";
      for (let i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) final += e.results[i][0].transcript + " "; else inter += e.results[i][0].transcript; }
      if (final) finalRef.current = final;
      if (onPreviewChange) { const base = (previewValue||"").replace(/\[🎤.*\]$/, "").trimEnd(); if (inter) onPreviewChange(base ? base + " " + inter : inter); else if (final) onPreviewChange(base ? base + " " + final.trim() : final.trim()); }
    };
    r.onerror = e => { if (e.error==="no-speech") return; setErr(e.error==="not-allowed"?"Mic blocked.":"Mic error."); setListening(false); };
    r.onend = () => { if (recogRef._keepAlive) { try { r.start(); } catch(e) {} } };
    recogRef.current = r;
    return () => { recogRef._keepAlive = false; try { r.stop(); } catch(e) {} };
  }, []);
  function startListening() { if (!recogRef.current) return; finalRef.current = ""; setErr(""); recogRef._keepAlive = true; try { recogRef.current.start(); setListening(true); } catch(e) {} }
  function commitAndStop() {
    recogRef._keepAlive = false; try { recogRef.current.stop(); } catch(e) {}
    setListening(false);
    const result = finalRef.current.trim();
    if (result) onTranscript(result);
    finalRef.current = "";
    if (onPreviewChange && previewValue) { const base = previewValue.replace(/\s*\[🎤.*\]$/, "").trimEnd(); onPreviewChange(base); }
  }
  if (!listening) {
    return (
      <span style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:3 }}>
        <button type="button" onClick={startListening} style={{ background:GRAY100, border:"1.5px solid "+GRAY200, borderRadius:"50%", width:sz, height:sz, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}>
          <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill={GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
        </button>
        {err && <span style={{ fontSize:10, color:RED }}>{err}</span>}
      </span>
    );
  }
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
      <button type="button" disabled style={{ background:RED, border:"none", borderRadius:"50%", width:sz, height:sz, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 6px rgba(239,68,68,0.18)", flexShrink:0, cursor:"default" }}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill={WHITE}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
      </button>
      <span style={{ fontSize:10, color:RED, fontWeight:600 }}>Listening...</span>
      <button type="button" onClick={commitAndStop} style={{ background:GREEN, border:"none", borderRadius:"50%", width:sz, height:sz, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
        <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </span>
  );
}

function FbButton({ url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:WHITE, borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:700, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:6, whiteSpace:"nowrap", flexShrink:0 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 13h-5v8h-3v-8H7v-3h3V8a4 4 0 0 1 4-4h3v3h-2a1 1 0 0 0-1 1v2h3l-1 3z"/></svg>
      Open in Facebook
    </a>
  );
}
function GroupMeta({ group }) {
  return (
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:2 }}>{group.name}</div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <span style={{ background:group.privacy==="Public"?"#D1FAE5":"#FEF9EC", color:group.privacy==="Public"?"#065F46":"#92400E", borderRadius:99, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{group.privacy||"—"}</span>
        <span style={{ fontSize:11, color:GRAY400 }}>{group.members||""} {group.type}</span>
      </div>
    </div>
  );
}
function GroupActionRow({ group, onConfirmed }) {
  const [opened, setOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  if (confirmed) {
    return (
      <div style={{ background:"#F0FDF4", border:"1.5px solid #86EFAC", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>✅</span>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#065F46", fontSize:14 }}>{group.name}</div><div style={{ fontSize:12, color:"#065F46" }}>Joined — you're ready to post</div></div>
        <Btn onClick={onConfirmed} style={{ fontSize:13, padding:"8px 16px" }}>Continue →</Btn>
      </div>
    );
  }
  return (
    <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"12px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <GroupMeta group={group} />
        <div onClick={() => setOpened(true)}><FbButton url={group.url} /></div>
      </div>
      {opened && !confirmed && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid "+GRAY200, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:13, color:GRAY600 }}>Did you join the group?</span>
          <button onClick={() => setConfirmed(true)} style={{ background:YELLOW, color:NAVY, border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>I joined it →</button>
        </div>
      )}
    </div>
  );
}
function GroupPostRow({ group, num }) {
  return (
    <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
      {num && <div style={{ color:GRAY400, fontWeight:700, fontSize:12, minWidth:24 }}>{num}</div>}
      <GroupMeta group={group} />
      <FbButton url={group.url} />
    </div>
  );
}

function PhotoGuideReal() {
  return (
    <>
      <div style={{ fontWeight:700, color:GREEN, fontSize:13, marginBottom:10 }}>✅ Anti-Ad — photos like these work great:</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:24 }}>
        {GOOD_PHOTOS.map((g,i) => (
          <div key={i} style={{ border:"2.5px solid #86EFAC", borderRadius:12, overflow:"hidden", background:"#F0FDF4" }}>
            <div style={{ position:"relative", paddingBottom:"75%", background:GRAY100 }}>
              <img src={g.url} alt={g.label} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", top:6, left:6, background:GREEN, color:WHITE, borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800 }}>✓ ANTI-AD</div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontWeight:700, color:"#166534", fontSize:12, marginBottom:2 }}>{g.label}</div>
              <div style={{ fontSize:11, color:"#166534", lineHeight:1.4 }}>{g.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontWeight:700, color:RED, fontSize:13, marginBottom:10 }}>❌ Advertisement — avoid photos like these:</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
        {BAD_PHOTOS.map((b,i) => (
          <div key={i} style={{ border:"2.5px solid #FCA5A5", borderRadius:12, overflow:"hidden", background:"#FEF2F2" }}>
            <div style={{ position:"relative", paddingBottom:"75%", background:GRAY100 }}>
              <img src={b.url} alt={b.label} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", top:6, left:6, background:RED, color:WHITE, borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800 }}>✗ AD</div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontWeight:700, color:"#991B1B", fontSize:12, marginBottom:2 }}>{b.label}</div>
              <div style={{ fontSize:11, color:"#991B1B", lineHeight:1.4 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EvidenceCapture({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState("");
  const fileRef = useRef(null);
  const urlValid = url.trim().length > 8 && (url.includes("facebook.com") || url.includes("fb.com") || url.startsWith("http"));
  const hasEvidence = urlValid || !!screenshot;
  const handleFile = e => { const f = e.target.files[0]; if (f && f.type.startsWith("image/")) { setScreenshot(f); setScreenshotName(f.name); setUrl(""); } };
  return (
    <div>
      <div style={{ background:"#EFF6FF", borderRadius:12, padding:16, marginBottom:20 }}>
        <p style={{ margin:0, fontSize:13, color:NAVY, fontWeight:600, marginBottom:4 }}>Why do we need this?</p>
        <p style={{ margin:0, fontSize:13, color:GRAY600, lineHeight:1.6 }}>Your coach needs to see the live post before approving it. A URL <strong>or</strong> a screenshot — you only need one.</p>
      </div>
      <div style={{ marginBottom:20, padding:16, borderRadius:12, border:"2px solid "+(urlValid?GREEN:GRAY200), background:urlValid?"#F0FDF4":WHITE }}>
        <label style={{ display:"block", fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>Option 1 — Paste your Facebook post URL</label>
        <input type="url" value={url} onChange={e => { setUrl(e.target.value); if (screenshot) { setScreenshot(null); setScreenshotName(""); } }} placeholder="https://www.facebook.com/groups/..."
          style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(urlValid?GREEN:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit", background:"transparent" }} />
        {urlValid && <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}><span style={{ color:GREEN, fontWeight:700, fontSize:13 }}>✓ URL accepted!</span></div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ flex:1, height:1, background:GRAY200 }} /><span style={{ fontSize:12, color:GRAY400, fontWeight:700 }}>OR</span><div style={{ flex:1, height:1, background:GRAY200 }} />
      </div>
      <div style={{ marginBottom:24, padding:16, borderRadius:12, border:"2px solid "+(screenshot?GREEN:GRAY200), background:screenshot?"#F0FDF4":WHITE }}>
        <label style={{ display:"block", fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>Option 2 — Upload a screenshot</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
        {!screenshot ? (
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{ width:"100%", border:"2px dashed "+GRAY200, borderRadius:10, padding:"20px 16px", background:GRAY50, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:26 }}>📸</span>
            <span style={{ fontWeight:700, color:NAVY, fontSize:14 }}>Tap to upload screenshot</span>
          </button>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>🖼️</span>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#065F46", fontSize:14 }}>{screenshotName}</div><div style={{ fontSize:12, color:GREEN, fontWeight:600 }}>✓ Screenshot accepted!</div></div>
            <button onClick={() => { setScreenshot(null); setScreenshotName(""); }} style={{ background:"none", border:"none", color:GRAY400, fontSize:20, cursor:"pointer" }}>×</button>
          </div>
        )}
      </div>
      <Btn onClick={() => hasEvidence && onSubmit({ url:urlValid?url:null, screenshot })} disabled={!hasEvidence} style={{ width:"100%", justifyContent:"center" }}>
        {hasEvidence ? "✅ Submit for Coach Review →" : "Paste a URL or upload a screenshot to continue"}
      </Btn>
    </div>
  );
}

function CoachDashboard({ onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  async function loadData() {
    setLoading(true);
    try {
      const result = await window.storage.list("submission:", true);
      const keys = (result && result.keys) ? result.keys : [];
      const items = [];
      for (let i = 0; i < keys.length; i++) { try { const r = await window.storage.get(keys[i], true); if (r && r.value) items.push(JSON.parse(r.value)); } catch(e) {} }
      setSubmissions(items.sort((a,b) => b.timestamp - a.timestamp));
    } catch(e) { setSubmissions([]); }
    setLoading(false);
  }
  useEffect(() => { loadData(); }, []);
  const STATUS_BADGES = [
    { label:"Post Generated", bg:"#DBEAFE", fg:"#1D4ED8" },
    { label:"Needs Review",   bg:"#FEF9C3", fg:"#854D0E" },
    { label:"Coach Approved", bg:"#D1FAE5", fg:"#065F46" },
    { label:"10 Groups Done", bg:"#F3E8FF", fg:"#6B21A8" },
  ];
  const STATUS_ORDER = ["Post Generated","Needs Review","Coach Approved","10 Groups Done"];
  return (
    <div style={{ position:"fixed", inset:0, background:GRAY50, zIndex:300, overflowY:"auto" }}>
      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16 }}>Coach Dashboard</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>{submissions.length} submissions</div></div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={loadData} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>↺ Refresh</button>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>← Back</button>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 16px 60px" }}>
        {loading && <Card><p style={{ textAlign:"center", color:GRAY600, padding:40 }}>Loading...</p></Card>}
        {!loading && submissions.length === 0 && <Card><p style={{ textAlign:"center", color:GRAY600, padding:40 }}>No submissions yet.</p></Card>}
        {!loading && submissions.map((s,i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontWeight:800, color:NAVY, fontSize:17 }}>{s.name||"Unknown"}</div>
                <div style={{ fontSize:13, color:GRAY600, marginTop:2 }}>{s.business} · {s.city}</div>
                <div style={{ fontSize:12, color:GRAY400, marginTop:4 }}>{s.timestamp ? new Date(s.timestamp).toLocaleString() : "—"}</div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {STATUS_BADGES.map(badge => STATUS_ORDER.indexOf(s.status) >= STATUS_ORDER.indexOf(badge.label) ? (
                  <span key={badge.label} style={{ background:badge.bg, color:badge.fg, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>✓ {badge.label}</span>
                ) : null)}
              </div>
            </div>
            <button onClick={() => setExpanded(expanded===i?null:i)} style={{ marginTop:14, background:GRAY50, border:"1px solid "+GRAY200, borderRadius:8, padding:"6px 14px", fontSize:12, color:NAVY, fontWeight:600, cursor:"pointer" }}>
              {expanded===i?"Hide Details ▲":"View Details ▼"}
            </button>
            {expanded===i && (
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

function WaitForCoach({ answers, onContinue, onBack }) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callClaude([{ role:"user", content:
      "You are a business coach. Based on this Pro's answers, give them exactly 3 photo ideas for their Facebook post — Good, Better, and Best. Each should be one short punchy sentence. Reference actual details from their answers.\n\n" +
      "Name: " + (answers.name||"") + "\n" +
      "Human detail: " + (answers.humanDetail||"") + "\n" +
      "Local place: " + (answers.localPlace||"") + "\n" +
      "Local activity: " + (answers.localActivity||"") + "\n\n" +
      "Return ONLY this exact format, nothing else:\nGOOD: [one sentence]\nBETTER: [one sentence]\nBEST: [one sentence]"
    }]).then(r => { setSuggestion(r); setLoading(false); })
      .catch(() => { setSuggestion("GOOD: A solo shot of you at your favorite local spot.\nBETTER: You with a family member doing something you love.\nBEST: A candid real moment that shows your personality outside of work."); setLoading(false); });
  }, []);

  const suggestionLines = suggestion.split("\n").filter(Boolean);
  const tileColors = [
    { bg:"#F0FDF4", border:"#86EFAC", labelBg:GREEN,     labelColor:WHITE },
    { bg:"#EFF6FF", border:"#93C5FD", labelBg:"#3B82F6", labelColor:WHITE },
    { bg:"#FEF9EC", border:YELLOW,    labelBg:YELLOW,    labelColor:NAVY  },
  ];

  return (
    <div>
      <div style={{ background:YELLOW, borderRadius:16, padding:"24px 28px", marginBottom:20, display:"flex", alignItems:"center", gap:16, boxShadow:"0 4px 24px rgba(254,183,5,0.4)" }}>
        <div style={{ fontSize:48, flexShrink:0 }}>✋</div>
        <div>
          <h2 style={{ color:NAVY, fontSize:24, fontWeight:900, margin:"0 0 6px" }}>Stop Here — Wait for Your Session</h2>
          <p style={{ color:NAVY, fontSize:14, lineHeight:1.6, margin:0, opacity:0.8 }}>Your answers are saved. Don't go further until your Business Coach is live with you.</p>
        </div>
      </div>

      <Card>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <span style={{ fontSize:28 }}>📸</span>
          <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>Before Your Session — Find Your Photo</h3>
        </div>
        <p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, marginBottom:16 }}>Based on your answers, here are personalized photo ideas just for you:</p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
          {loading ? (
            <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:10, color:GRAY400, fontSize:13, padding:"14px 16px", background:GRAY50, borderRadius:10 }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width:16, height:16, border:"2px solid "+GRAY200, borderTopColor:NAVY, borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }} />
              Personalizing your photo suggestions...
            </div>
          ) : suggestionLines.map((line, i) => {
            const colonIdx = line.indexOf(": ");
            const label = colonIdx > -1 ? line.slice(0, colonIdx) : "";
            const text  = colonIdx > -1 ? line.slice(colonIdx + 2) : line;
            const c = tileColors[i] || tileColors[2];
            return (
              <div key={i} style={{ background:c.bg, border:"1.5px solid "+c.border, borderRadius:12, padding:"16px 14px", display:"flex", flexDirection:"column", gap:8, minWidth:0 }}>
                <span style={{ background:c.labelBg, color:c.labelColor, borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800, alignSelf:"flex-start", whiteSpace:"nowrap" }}>{label}</span>
                <span style={{ fontSize:12, color:NAVY, lineHeight:1.5 }}>{text}</span>
              </div>
            );
          })}
        </div>

        <p style={{ color:GRAY600, fontSize:13, fontWeight:600, marginBottom:12 }}>Here's what works and what doesn't:</p>
        <PhotoGuideReal />
        <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 16px", fontSize:13, color:NAVY, lineHeight:1.7, marginTop:20 }}>
          💡 <strong>Pro tip:</strong> Pull up your camera roll right now and find 2-3 options. Have it ready to upload the moment your session starts.
        </div>
      </Card>

      <Card style={{ background:NAVY }}>
        <h3 style={{ color:YELLOW, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>What happens in your session:</h3>
        {[
          { num:1, text:"Your coach reviews your answers with you" },
          { num:2, text:"AI generates your trust-building Facebook post" },
          { num:3, text:"You post it live in 10 local Facebook groups together" },
        ].map(s => (
          <div key={s.num} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
            <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{s.num}</div>
            <p style={{ margin:0, fontSize:14, color:WHITE, paddingTop:3, lineHeight:1.6 }}>{s.text}</p>
          </div>
        ))}
      </Card>

      <Card style={{ background:NAVY }}>
        <h3 style={{ color:YELLOW, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>What happens in your session:</h3>
        {[
          { num:1, text:"Your coach reviews your answers with you" },
          { num:2, text:"AI generates your trust-building Facebook post" },
          { num:3, text:"You post it live in 10 local Facebook groups together" },
        ].map(s => (
          <div key={s.num} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
            <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{s.num}</div>
            <p style={{ margin:0, fontSize:14, color:WHITE, paddingTop:3, lineHeight:1.6 }}>{s.text}</p>
          </div>
        ))}
      </Card>

      <Card style={{ textAlign:"center", background:GRAY50, border:"2px solid "+YELLOW }}>
        <p style={{ color:NAVY, fontWeight:700, fontSize:15, margin:"0 0 16px" }}>Ready? Only click this when your coach is with you.</p>
        <Btn onClick={onContinue} style={{ margin:"0 auto" }}>I'm in my session — let's continue →</Btn>
      </Card>
      <div style={{ textAlign:"center", marginTop:8 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer", textDecoration:"underline" }}>← Go back and edit my answers</button>
      </div>
    </div>
  );
}

function VoiceMode({ onComplete }) {
  const [turn, setTurn] = useState("coach");
  const [qIdx, setQIdx] = useState(0);
  const [voiceAnswers, setVoiceAnswers] = useState({});
  const [coachText, setCoachText] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [micErr, setMicErr] = useState("");
  const [rerecordId, setRerecordId] = useState(null);
  const recogRef = useRef(null);
  const listeningRef = useRef(false);
  const processingRef = useRef(false);
  const qIdxRef = useRef(0);
  const rerecordRef = useRef(null);
  const mountedRef = useRef(true);
  const transcriptRef = useRef("");
  useEffect(() => { qIdxRef.current = qIdx; }, [qIdx]);
  useEffect(() => { rerecordRef.current = rerecordId; }, [rerecordId]);
  useEffect(() => { transcriptRef.current = userTranscript; }, [userTranscript]);
  useEffect(() => () => { mountedRef.current = false; stopMic(); }, []);
  const answeredCount = Object.keys(voiceAnswers).length;
  const currentQ = rerecordRef.current ? ALL_QUESTIONS.find(x => x.id===rerecordRef.current) : ALL_QUESTIONS[qIdx];
  function startMic() { if (!recogRef.current || listeningRef.current) return; try { recogRef.current.start(); listeningRef.current = true; } catch(e) {} }
  function stopMic() { if (!recogRef.current) return; listeningRef.current = false; try { recogRef.current.stop(); } catch(e) {} }
  function coachSay(text, afterSpeaking) {
    if (!mountedRef.current) return;
    setCoachText(text); setTurn("coach");
    setTimeout(() => { if (!mountedRef.current) return; if (afterSpeaking) afterSpeaking(); else openMic(); }, 1000);
  }
  function openMic() { if (!mountedRef.current) return; setTurn("user"); setUserTranscript(""); transcriptRef.current = ""; startMic(); }
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = e => {
      let interim = "", final = "";
      for (let i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) final += e.results[i][0].transcript; else interim += e.results[i][0].transcript; }
      const combined = final || interim;
      if (mountedRef.current) { setUserTranscript(combined); transcriptRef.current = combined; }
    };
    r.onend = () => { if (!mountedRef.current) return; listeningRef.current = false; };
    r.onerror = e => { if (!mountedRef.current) return; listeningRef.current = false; if (e.error==="not-allowed") setMicErr("Mic blocked."); };
    recogRef.current = r;
  }, []);
  async function handleUserDone() {
    if (processingRef.current || !mountedRef.current) return;
    stopMic();
    const t = transcriptRef.current.trim();
    if (!t) { coachSay("I didn't catch that. Could you say it again?", openMic); return; }
    processingRef.current = true; setTurn("thinking");
    const q = rerecordRef.current ? ALL_QUESTIONS.find(x => x.id===rerecordRef.current) : ALL_QUESTIONS[qIdxRef.current];
    const isLast = !rerecordRef.current && qIdxRef.current === ALL_QUESTIONS.length-1;
    const nextQ = ALL_QUESTIONS[Math.min(qIdxRef.current+1, ALL_QUESTIONS.length-1)];
    let reply = "";
    try { reply = await callClaude([{ role:"user", content:"You are a warm business coach on a voice call. SHORT responses 1-2 sentences max.\n\nQuestion: "+q.label+"\nNeeded: "+q.hint+"\nMin words: "+q.minWords+"\nSaid: "+t+"\n\nIf specific and meets word count: ACCEPT: [warm sentence]. Then ask: "+nextQ.hint+"\nIf vague or short: FOLLOWUP: [one coaching question]\nUse contractions. Be warm." }]); }
    catch(e) { reply = "FOLLOWUP: Could you tell me a bit more about that?"; }
    if (!mountedRef.current) { processingRef.current = false; return; }
    const isAccept = reply.trim().toUpperCase().startsWith("ACCEPT");
    const msg = reply.replace(/^ACCEPT:\s*/i,"").replace(/^FOLLOWUP:\s*/i,"").trim();
    if (isAccept) {
      const id = rerecordRef.current || q.id;
      setVoiceAnswers(prev => ({...prev, [id]:t})); setRerecordId(null);
      if (!rerecordRef.current && isLast) { processingRef.current = false; setDone(true); setCoachText(msg||"That's everything. Amazing work."); setTurn("coach"); return; }
      if (!rerecordRef.current) setQIdx(i => i+1);
    }
    processingRef.current = false; coachSay(msg, openMic);
  }
  function handleStart() { setStarted(true); setTimeout(() => { coachSay("Hey, I'm going to walk you through 15 questions to build your story. Take your time. Let's start: " + ALL_QUESTIONS[0].hint); }, 200); }
  function handleRerecord(id) { setRerecordId(id); const q = ALL_QUESTIONS.find(x => x.id===id); coachSay("Sure, let's redo that. " + q.hint); }
  const chapterLabel = currentQ ? {ch1:"Chapter 1",ch2:"Chapter 2",ch3:"Chapter 3"}[currentQ.chapter] : "";
  return (
    <div>
      <div style={{ background:NAVY, borderRadius:16, padding:24, marginBottom:16 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ background:YELLOW, borderRadius:"50%", width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={NAVY}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
          </div>
          <div style={{ flex:1 }}>
            {turn==="thinking" ? (
              <div style={{ display:"flex", gap:6, alignItems:"center", paddingTop:10 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:YELLOW, opacity:0.6 }} />)}
              </div>
            ) : (
              <p style={{ color:WHITE, fontSize:16, margin:0, lineHeight:1.8, opacity:turn==="user"?0.7:1 }}>{coachText||(!started?"Ready when you are.":"")}</p>
            )}
          </div>
        </div>
      </div>
      {started && !done && (
        <Card style={{ textAlign:"center" }}>
          {turn==="user" && (
            <>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:RED, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 10px rgba(239,68,68,0.15)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={WHITE}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
                </div>
              </div>
              {userTranscript && (
                <div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:14, color:GRAY800, lineHeight:1.7, textAlign:"left" }}>
                  <div style={{ fontSize:11, color:GRAY400, fontWeight:600, marginBottom:4 }}>YOU'RE SAYING:</div>
                  {userTranscript}
                </div>
              )}
              <button onClick={handleUserDone} style={{ background:GREEN, color:WHITE, border:"none", borderRadius:10, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Done — submit answer
              </button>
              {micErr && <p style={{ color:RED, fontSize:12, marginTop:8 }}>{micErr}</p>}
            </>
          )}
          {turn==="coach" && <div style={{ color:GRAY400, fontSize:13, padding:"8px 0" }}>Coach is speaking...</div>}
          {turn==="thinking" && <div style={{ color:GRAY400, fontSize:13, padding:"8px 0" }}>Processing your answer...</div>}
          {currentQ && (
            <details style={{ marginTop:12, textAlign:"left" }}>
              <summary style={{ fontSize:12, color:GRAY400, cursor:"pointer" }}>{chapterLabel} · Q{currentQ.num} of {ALL_QUESTIONS.length} · <span style={{ textDecoration:"underline" }}>See question</span></summary>
              <div style={{ marginTop:8, padding:"10px 14px", background:GRAY50, borderRadius:10, fontSize:13, color:GRAY600 }}><strong style={{ color:NAVY }}>{currentQ.label}</strong><br />{currentQ.hint}</div>
            </details>
          )}
        </Card>
      )}
      {!started && <div style={{ textAlign:"center", marginTop:8 }}><Btn onClick={handleStart}>🎤 Start Voice Session</Btn><p style={{ fontSize:12, color:GRAY400, marginTop:8 }}>Make sure your volume is on.</p></div>}
      {started && answeredCount > 0 && <div style={{ marginBottom:12 }}><ProgressBar current={answeredCount} total={ALL_QUESTIONS.length} /></div>}
      {answeredCount > 0 && (
        <Card>
          <h3 style={{ color:NAVY, margin:"0 0 16px", fontSize:16 }}>Your Answers So Far</h3>
          {ALL_QUESTIONS.filter(q => voiceAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+GRAY200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{q.num}</span><span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{q.label}</span></div>
                  <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{voiceAnswers[q.id]}</p>
                </div>
                <button onClick={() => handleRerecord(q.id)} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, color:GRAY600, cursor:"pointer", flexShrink:0 }}>🎤 Redo</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {done && <div style={{ marginTop:8 }}><Btn onClick={() => onComplete(voiceAnswers)}>Continue →</Btn></div>}
    </div>
  );
}

function BatchLogger({ onLog, onBack }) {
  const [val, setVal] = useState("1");
  const n = parseInt(val)||0;
  return (
    <div>
      <p style={{ fontSize:13, fontWeight:700, color:NAVY, margin:"0 0 4px" }}>How many people did you DM?</p>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
        <input type="number" min="1" value={val} onChange={e => setVal(e.target.value)} style={{ width:80, border:"2px solid "+NAVY, borderRadius:10, padding:"10px 12px", fontSize:20, fontWeight:800, color:NAVY, outline:"none", textAlign:"center" }} />
        <Btn onClick={() => { if(n>0) onLog(n); }} disabled={n<1}>Log {n>0?n:"-"} DM{n!==1?"s":""} ✓</Btn>
      </div>
      <Btn variant="ghost" onClick={onBack}>← Back</Btn>
    </div>
  );
}

function Amplify({ city: initialCity, week1Total }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amplifyCount, setAmplifyCount] = useState(0);
  const activeCity = initialCity;
  const totalPosted = (week1Total||0) + amplifyCount;
  async function fetchGroups() {
    if (!activeCity || activeCity === "Your City") { setError("Please enter your city."); return; }
    setLoading(true); setError("");
    try { const fresh = await findFacebookGroups(activeCity, 20); setGroups(fresh); if (!fresh.length) setError("No groups found. Try a nearby city."); }
    catch(e) { setError("Could not load groups."); }
    setLoading(false);
  }
  useEffect(() => { if (activeCity && activeCity !== "Your City") fetchGroups(); }, []);
  return (
    <>
      <Card style={{ background:NAVY }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>⚡ Amplify</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>Keep the momentum going.</p></div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
            <div style={{ color:YELLOW, fontWeight:900, fontSize:28, lineHeight:1 }}>{totalPosted}</div>
            <div style={{ color:GRAY400, fontSize:11, marginTop:2 }}>total groups posted</div>
          </div>
        </div>
      </Card>
      <Card>
        <Btn variant="success" onClick={() => setAmplifyCount(c => c+1)}>+ Posted in Another Group</Btn>
        {amplifyCount > 0 && <div style={{ marginTop:14, background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:NAVY }}>🎯 {totalPosted} total groups. Keep going.</div>}
      </Card>
      <Card>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:10 }}>
          <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:0 }}>More groups near you</h3>
          <button onClick={fetchGroups} disabled={loading} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{loading?"Loading...":"↺ Refresh"}</button>
        </div>
        {error && <div style={{ background:"#FEF2F2", borderRadius:10, padding:12, color:RED, fontSize:13, marginBottom:12 }}>{error}</div>}
        {loading && <p style={{ color:GRAY600, fontSize:14, textAlign:"center", padding:24 }}>🔍 Finding groups...</p>}
        {!loading && groups.length > 0 && <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{groups.map((g,i) => <GroupPostRow key={i} group={g} num={i+2} />)}</div>}
      </Card>
    </>
  );
}

const SHIMMER_CSS = `@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`;
const CHAPTER_META = {
  ch1:{ emoji:"🙋", title:"Chapter 1 — Who You Are", why:"Before someone trusts you with their home, they need clarity on who you are and what you do. Confusion kills trust. Clarity builds credibility.", qs:ch1Qs },
  ch2:{ emoji:"🏡", title:"Chapter 2 — Your Real Life", why:"This is where we prove you are real. Bots write generic. Humans write specifics. Specific details create connection. Connection builds trust.", qs:ch2Qs },
  ch3:{ emoji:"❤️", title:"Chapter 3 — What Shaped You", why:"Quality work is expected. Trust is earned. Emotional connection separates you from any Pro will do. When people feel something, they engage.", qs:ch3Qs },
};
function ChapterProgressBar({ chapter, answers }) {
  const meta = CHAPTER_META[chapter];
  const qs = meta ? meta.qs : [];
  const answered = qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  const total = qs.length;
  const visualPct = Math.max(15, total===0?0:Math.round((answered/total)*100));
  const complete = answered===total && total>0;
  return (
    <div style={{ marginBottom:20 }}>
      <style>{SHIMMER_CSS}</style>
      <div style={{ fontSize:12, marginBottom:6 }}><span style={{ fontWeight:600, color:complete?GREEN:GRAY600 }}>{complete?"✓ Chapter complete!":answered+" of "+total+" answered"}</span></div>
      <div style={{ background:GRAY200, borderRadius:99, height:10, overflow:"hidden" }}>
        <div style={{ height:10, borderRadius:99, width:visualPct+"%", background:complete?"#10B981":YELLOW, transition:"width 0.55s cubic-bezier(0.4,0,0.2,1)", position:"relative", overflow:"hidden" }}>
          {complete && <div style={{ position:"absolute", top:0, left:0, height:"100%", width:"40%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)", animation:"shimmer 0.8s ease 0.2s 2" }} />}
        </div>
      </div>
    </div>
  );
}

function ProgressiveForm({ answers, onAnswer, onExit, onComplete, validationFeedback, validating, initialPhase, onPhaseChange }) {
  const startIdx = ALL_QUESTIONS.findIndex(q => q.chapter===initialPhase);
  const [idx, setIdx] = useState(startIdx>=0?startIdx:0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showInspo, setShowInspo] = useState(false);
  const textareaRef = useRef(null);
  const q = ALL_QUESTIONS[idx];
  const meta = CHAPTER_META[q.chapter];
  const wc = wordCount(answers[q.id]);
  const met = wc >= q.minWords;
  const isLastQ = idx === ALL_QUESTIONS.length-1;
  const isFirstQ = idx === 0;
  const totalAnswered = ALL_QUESTIONS.filter(x => wordCount(answers[x.id]) >= x.minWords).length;
  const inspoExamples = INSPIRATION_EXAMPLES[q.id] || [];

  useEffect(() => { if (visible && textareaRef.current) setTimeout(() => textareaRef.current && textareaRef.current.focus(), 320); }, [idx, visible]);
  useEffect(() => { onPhaseChange(q.chapter); }, [idx]);

  function navigate(newIdx, direction) { if (animating) return; setDir(direction); setAnimating(true); setVisible(false); setTimeout(() => { setIdx(newIdx); setVisible(true); setAnimating(false); }, 260); }
  function handleNext() { if (!met) return; if (isLastQ) { onComplete(); return; } navigate(idx+1, 1); }
  function handleBack() { if (isFirstQ) { onExit(); return; } navigate(idx-1, -1); }
  const handleMic = text => { const current = answers[q.id]||""; onAnswer(q.id, current.trim()?current.trimEnd()+" "+text:text); };
  const slideStyle = { transition:visible?"opacity 0.25s ease, transform 0.25s ease":"opacity 0.2s ease, transform 0.2s ease", opacity:visible?1:0, transform:visible?"translateX(0)":dir===1?"translateX(-40px)":"translateX(40px)" };
  const borderColor = wc===0?GRAY200:met?GREEN:RED;
  const bgColor = wc===0?WHITE:met?"#F0FDF4":"#FFF5F5";

  return (
    <div>
      <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22 }}>{meta.emoji}</span>
        <div>
          <div style={{ fontWeight:800, color:NAVY, fontSize:16 }}>{meta.title}</div>
          <div style={{ fontSize:12, color:GRAY400, marginTop:2 }}>{totalAnswered} of {ALL_QUESTIONS.length} questions answered</div>
        </div>
      </div>
      <Card style={{ minHeight:340, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={slideStyle}>
          <ChapterProgressBar chapter={q.chapter} answers={answers} />
          <div style={{ borderLeft:"4px solid "+YELLOW, background:GRAY50, borderRadius:"0 10px 10px 0", padding:"10px 14px 10px 16px", marginBottom:20 }}>
            <p style={{ margin:0, fontSize:13, color:GRAY600, fontStyle:"italic", lineHeight:1.6 }}>💡 {meta.why}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ background:validationFeedback[q.id]?RED:NAVY, color:validationFeedback[q.id]?WHITE:YELLOW, borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700 }}>Q{q.num}</span>
            <span style={{ fontWeight:800, color:validationFeedback[q.id]?RED:NAVY, fontSize:17 }}>{q.label}</span>
            <MicBtn onTranscript={handleMic} size={28} previewValue={answers[q.id]||""} onPreviewChange={v => onAnswer(q.id, v)} />
          </div>
          <p style={{ fontSize:13, color:GRAY600, margin:"0 0 10px" }}>{q.hint}</p>
          {validationFeedback[q.id] && <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:8, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#7F1D1D", lineHeight:1.7 }}>💬 {validationFeedback[q.id]}</div>}

          {/* One example always visible above textarea */}
          <p style={{ fontSize:12, color:GRAY600, fontStyle:"italic", margin:"0 0 10px" }}>{q.placeholder}</p>

          <textarea ref={textareaRef} value={answers[q.id]||""} onChange={e => onAnswer(q.id, e.target.value)} placeholder="Type your answer here..." rows={3}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+borderColor, borderRadius:10, padding:"10px 14px", fontSize:14, color:GRAY800, fontFamily:"inherit", resize:"vertical", outline:"none", background:bgColor, marginBottom:6 }} />
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, minHeight:18 }}>
            {wc > 0 ? (
              <><div style={{ flex:1, background:GRAY200, borderRadius:99, height:4, overflow:"hidden" }}><div style={{ background:met?GREEN:RED, height:4, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }} /></div><span style={{ fontSize:11, fontWeight:700, color:met?GREEN:RED, whiteSpace:"nowrap" }}>{met?"✓ ":""}{wc} / {q.minWords} words{met?"":" min"}</span></>
            ) : <span style={{ fontSize:11, color:GRAY400 }}>Minimum {q.minWords} word{q.minWords!==1?"s":""}</span>}
          </div>

          {/* More examples toggle below textarea */}
          {inspoExamples.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <button type="button" onClick={() => setShowInspo(v => !v)}
                style={{ background:"transparent", border:"2px solid "+NAVY, borderRadius:8, color:NAVY, fontSize:13, fontWeight:700, cursor:"pointer", padding:"8px 16px", display:"inline-flex", alignItems:"center", gap:6, marginBottom:showInspo?8:0 }}>
                💡 {showInspo ? "Hide examples ▲" : "Need inspiration? →"}
              </button>
              {showInspo && (
                <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:NAVY, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Examples from other Pros:</div>
                  {inspoExamples.map((ex, i) => (
                    <div key={i} style={{ fontSize:13, color:GRAY800, lineHeight:1.6, marginBottom:i < inspoExamples.length-1 ? 8 : 0, paddingBottom:i < inspoExamples.length-1 ? 8 : 0, borderBottom:i < inspoExamples.length-1 ? "1px solid #FDE68A" : "none" }}>
                      {ex}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"space-between" }}>
            <Btn variant="ghost" onClick={handleBack} style={{ fontSize:13, padding:"8px 14px" }}>← {isFirstQ?"Back":"Previous"}</Btn>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:GRAY400 }}>{idx+1} / {ALL_QUESTIONS.length}</span>
              <Btn onClick={handleNext} disabled={!met||animating}>Next →</Btn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LeadEngagement({ onBack, city, week1Total, onAmplify }) {
  const [watched, setWatched] = useState(false);
  const [active, setActive] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [log, setLog] = useState([]);
  const [jobsBooked, setJobsBooked] = useState(0);
  const [jobsInput, setJobsInput] = useState("");
  const [showJobEntry, setShowJobEntry] = useState(false);
  const activeLead = LEAD_TYPES.find(l => l.id===active);
  const activeSubtype = activeLead && subtype ? (activeLead.subtypes||[]).find(s => s.id===subtype) : null;
  function copyScript(text, idx) {
    try { const el = document.createElement("textarea"); el.value=text; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard && navigator.clipboard.writeText(text); }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  }
  function logLead(typeId, count=1) { setLog(prev => [...prev, ...Array.from({length:count}, () => ({type:typeId, timestamp:Date.now()}))]); }
  function reset() { setActive(null); setSubtype(null); }
  const sessionCounts = LEAD_TYPES.reduce((acc,t) => { acc[t.id]=log.filter(l=>l.type===t.id).length; return acc; }, {});
  const sessionTotal = log.length;
  function ScriptBlock({ text, idx }) {
    return (
      <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <p style={{ fontSize:14, color:GRAY800, lineHeight:1.8, margin:"0 0 10px", fontStyle:"italic" }}>"{text}"</p>
        <button onClick={() => copyScript(text,idx)} style={{ background:copiedIdx===idx?GREEN:NAVY, color:copiedIdx===idx?WHITE:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{copiedIdx===idx?"✓ Copied!":"📋 Copy Script"}</button>
      </div>
    );
  }
  function StepLabel({ num, text }) {
    return (
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", margin:"16px 0 8px" }}>
        <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, marginTop:1 }}>{num}</div>
        <div style={{ fontWeight:700, color:NAVY, fontSize:14, paddingTop:2 }}>{text}</div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={onBack} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
      {!watched && (
        <Card>
          <SectionHeader emoji="🎉" title="Session Complete — Now We Execute" subtitle="Watch this training video before working your leads." />
          <div style={{ background:"#EFF6FF", borderRadius:12, padding:20, marginBottom:16 }}>
            <p style={{ margin:"0 0 12px", fontSize:14, color:NAVY, fontWeight:700 }}>📹 Lead Engagement Training Video</p>
            <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:10, overflow:"hidden", marginBottom:16, background:GRAY100 }}>
              <iframe src="https://fast.wistia.net/embed/iframe/indqjc1oov?videoFoam=true" title="Lead Engagement Training" allow="autoplay; fullscreen" allowFullScreen frameBorder="0" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", borderRadius:10 }} />
            </div>
            <Btn onClick={() => setWatched(true)}>✓ I watched the video — show me the playbook</Btn>
          </div>
          <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:14 }}>
            <p style={{ fontSize:12, color:GRAY400, margin:0 }}>Already watched?{" "}<button onClick={() => setWatched(true)} style={{ background:"none", border:"none", color:NAVY, fontSize:12, fontWeight:700, cursor:"pointer", textDecoration:"underline", padding:0 }}>Skip →</button></p>
          </div>
        </Card>
      )}
      {watched && (
        <div>
          <Card style={{ background:NAVY, marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>Work Your Leads</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>Pick the type of engagement. Follow the steps. Book the job.</p></div>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:YELLOW, fontWeight:900, fontSize:24, lineHeight:1 }}>{sessionTotal}</div><div style={{ color:GRAY400, fontSize:10, marginTop:3 }}>this session</div></div>
                <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72, cursor:"pointer" }} onClick={() => setShowJobEntry(v=>!v)}>
                  <div style={{ color:GREEN, fontWeight:900, fontSize:24, lineHeight:1 }}>{jobsBooked}</div><div style={{ color:GREEN, fontSize:10, marginTop:3 }}>jobs booked ＋</div>
                </div>
              </div>
            </div>
            {showJobEntry && (
              <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ color:WHITE, fontSize:13, fontWeight:600 }}>Jobs booked from this post?</span>
                <input type="number" min="1" value={jobsInput} onChange={e => setJobsInput(e.target.value)} placeholder="e.g. 2" style={{ width:72, border:"2px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"7px 10px", fontSize:16, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", background:WHITE }} />
                <Btn onClick={() => { const n=parseInt(jobsInput); if(n>0){ setJobsBooked(b=>b+n); setJobsInput(""); setShowJobEntry(false); } }} disabled={!jobsInput||parseInt(jobsInput)<1} style={{ fontSize:13 }}>Add</Btn>
              </div>
            )}
            <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10 }}>
              <p style={{ color:WHITE, fontSize:13, margin:0 }}>⚡ <strong style={{ color:YELLOW }}>Time kills deals.</strong> First 24–48 hours are everything.</p>
            </div>
          </Card>
          {!active && (
            <Card>
              <h3 style={{ color:NAVY, fontSize:17, fontWeight:800, margin:"0 0 6px" }}>What kind of engagement did you get?</h3>
              <p style={{ color:GRAY600, fontSize:13, margin:"0 0 20px" }}>Tap one to get exact steps and scripts.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {LEAD_TYPES.map(t => (
                  <button key={t.id} onClick={() => { setActive(t.id); setSubtype(null); }} style={{ background:t.color, border:"2px solid "+t.border, borderRadius:14, padding:"18px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:6 }}>
                    <span style={{ fontSize:32 }}>{t.emoji}</span>
                    <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{t.label}</span>
                    {sessionCounts[t.id]>0 && <span style={{ fontSize:11, color:GRAY600, fontWeight:600 }}>✓ {sessionCounts[t.id]} this session</span>}
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
                <div key={i}>
                  <StepLabel num={i+1} text={step.label} />
                  {step.note ? <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:NAVY }}>Use the <strong>Direct Message</strong> playbook once they respond.</div> : <ScriptBlock text={step.script} idx={i} />}
                </div>
              ))}
              <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16 }}>
                {activeLead.id==="like" ? <BatchLogger onLog={n => { logLead("like",n); reset(); }} onBack={reset} /> : <div style={{ display:"flex", gap:10 }}><Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>✓ Mark as Worked</Btn><Btn variant="ghost" onClick={reset}>← Back</Btn></div>}
              </div>
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
              {activeLead.id==="comment" && (<div><StepLabel num={1} text="Reply publicly" />{activeSubtype.publicReplies.map((r,i) => <ScriptBlock key={i} text={r} idx={i} />)}<StepLabel num={2} text="Then immediately DM" /><ScriptBlock text={activeSubtype.dmScript} idx={99} /></div>)}
              {activeLead.id==="dm" && (<div><StepLabel num={1} text="Reply within 24 hours" /><ScriptBlock text={activeSubtype.dmScript} idx={0} /></div>)}
              <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
                <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>✓ Mark as Worked</Btn>
                <Btn variant="ghost" onClick={() => setSubtype(null)}>← Different Response</Btn>
              </div>
            </Card>
          )}
          {sessionTotal > 0 && !active && (
            <Card>
              <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>📊 This Session</h3>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                {LEAD_TYPES.map(t => sessionCounts[t.id]>0 && (
                  <div key={t.id} style={{ background:t.color, border:"1.5px solid "+t.border, borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:18 }}>{t.emoji}</span><span style={{ fontWeight:800, color:NAVY, fontSize:14 }}>{sessionCounts[t.id]}</span><span style={{ fontSize:12, color:GRAY600 }}>{t.label}</span>
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
            <Card style={{ background:"linear-gradient(135deg, #002942, #003a5c)", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
              <h3 style={{ color:YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>Done working leads for now?</h3>
              <p style={{ color:GRAY400, fontSize:13, lineHeight:1.7, margin:"0 0 20px" }}>Post in more groups to get more leads.</p>
              <Btn onClick={onAmplify} style={{ margin:"0 auto" }}>⚡ Amplify — Post in More Groups →</Btn>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [appPhase, setAppPhase] = useState("lane");
  const [answers, setAnswers] = useState({});
  const [post, setPost] = useState("");
  const [flags, setFlags] = useState({ postCount:0, coachApproved:false, tenDone:false, dmSent:false, stacked:false, completedSections:[] });
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [copiedGetpost, setCopiedGetpost] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState({});
  const [groups5, setGroups5] = useState([]);
  const [groups20, setGroups20] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [lane, setLane] = useState(null);
  const topRef = useRef(null);

  const { postCount, coachApproved, tenDone, dmSent, stacked, completedSections } = flags;
  const setFlag = (key, val) => setFlags(prev => ({...prev, [key]:val}));
  const setAnswer = (id, val) => setAnswers(prev => ({...prev, [id]:val}));
  const devFill = () => setAnswers(SAMPLE_ANSWERS);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior:"smooth" }); }, [appPhase]);

  const ch3Met = ch3Qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const city = answers.area
    ? answers.area.split(/[,\-\u2013\u2014]/)[0].replace(/\b(in the|area|been|here|for|years|going on|about|over|past|nearly|almost)\b.*/i,"").replace(/[^a-zA-Z\s]/g,"").trim()
    : manualCity.trim() || "Your City";

  useEffect(() => {
    if (appPhase==="groups" && groups5.length===0 && !groupsLoading) {
      setGroupsLoading(true); setGroupsError("");
      findFacebookGroups(city,5).then(r => { setGroups5(r); setGroupsLoading(false); if (!r.length) setGroupsError("Could not find groups. Try searching Facebook manually."); }).catch(() => { setGroupsLoading(false); setGroupsError("Search failed."); });
    }
    if (appPhase==="replicate" && groups20.length===0 && !groupsLoading) {
      setGroupsLoading(true);
      findFacebookGroups(city,20).then(r => { setGroups20(r); setGroupsLoading(false); }).catch(() => setGroupsLoading(false));
    }
  }, [appPhase]);

  async function handleValidateAndAdvance(questions, nextPhase) {
    const allMet = questions.every(q => wordCount(answers[q.id]) >= q.minWords);
    if (allMet) { setValidationFeedback({}); setAppPhase(nextPhase); return; }
    setValidating(true); setValidationFeedback({});
    let result;
    try { result = await validateChapterAnswers(questions, answers); } catch(e) { result = {passed:true,feedback:{}}; }
    setValidating(false);
    if (result.passed) { setValidationFeedback({}); setAppPhase(nextPhase); }
    else { setValidationFeedback(result.feedback||{}); const firstId = Object.keys(result.feedback||{})[0]; if (firstId) setTimeout(() => { const el = document.getElementById("qfield-"+firstId); if (el) el.scrollIntoView({behavior:"smooth",block:"center"}); }, 100); }
  }

  async function saveSubmission(a, generatedPost, status, evidence) {
    const data = a || answers;
    const name = (data.name||"Unknown").trim();
    const key = "submission:"+name.replace(/\s+/g,"_").toLowerCase()+"_"+(data.business||"biz").replace(/\s+/g,"_").toLowerCase();
    try {
      let prev = {};
      try { const ex = await window.storage.get(key, true); if (ex && ex.value) prev = JSON.parse(ex.value); } catch(e) {}
      const rec = { name, business:data.business||"", city:(data.area||manualCity||"").split(/[,\-]/)[0].replace(/[^a-zA-Z\s]/g,"").trim(), answers:data, post:generatedPost!==undefined?generatedPost:(prev.post||""), status:status||prev.status||"Post Generated", postGenerated:true, evidenceUrl:evidence?.url||prev.evidenceUrl||null, evidenceNote:evidence?.screenshot?"Screenshot uploaded":(prev.evidenceNote||null), timestamp:prev.timestamp||Date.now(), updatedAt:Date.now() };
      await window.storage.set(key, JSON.stringify(rec), true);
    } catch(e) {}
  }

  async function handleGeneratePost(ans) {
    const a = ans || answers;
    setPostLoading(true); setPostError("");
    try {
      const generated = await generateAIPost(a);
      setPost(generated);
      setFlag("completedSections", completedSections.includes("write") ? completedSections : [...completedSections,"write"]);
      await saveSubmission(a, generated, "Post Generated");
    } catch(e) { setPostError("Could not generate post. Please check your connection and try again."); }
    setPostLoading(false);
  }

  const handleVoiceComplete = va => { setAnswers(va); setAppPhase("groups"); };
  const writeStatus  = getWriteStatus(answers);
  const groupStatus  = getGroupStatus(completedSections, coachApproved, postCount);
  const leadsStatus  = getLeadsStatus(dmSent, stacked);
  const nextStep     = getNextStep(answers, post, completedSections, coachApproved, postCount, dmSent, stacked);
  const answeredCount = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;

  function StatusTag({ status }) {
    return <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:status.bg, color:status.color, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{status.label==="Done"?"✓ ":status.label==="In Progress"?"● ":status.label==="Needs Review"?"⚑ ":"○ "}{status.label}</span>;
  }

  return (
    <div style={{ minHeight:"100vh", background:GRAY50, fontFamily:"'Inter', -apple-system, sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)} />}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 8px", textAlign:"center" }}>Coach Access</h3>
            <input type="password" value={passcodeInput} onChange={e => { setPasscodeInput(e.target.value); setPasscodeError(false); }}
              onKeyDown={e => { if (e.key==="Enter") { if (passcodeInput===COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); } }}
              placeholder="Enter passcode"
              style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?RED:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }} />
            {passcodeError && <p style={{ color:RED, fontSize:12, margin:"0 0 8px" }}>Incorrect passcode.</p>}
            <Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if (passcodeInput===COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); }}>Enter Dashboard</Btn>
            <button onClick={() => { setShowCoachLogin(false); setPasscodeInput(""); setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16, lineHeight:1 }}>Business Coaching Foundations</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>Week 1 — Facebook Groups Organic Strategy</div></div>
        </div>
        {appPhase==="lane" ? (
          <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>Coach Dashboard</button>
        ) : (
          <button onClick={() => setAppPhase("lane")} style={{ background:YELLOW, border:"none", borderRadius:8, padding:"8px 18px", color:NAVY, fontSize:13, fontWeight:800, cursor:"pointer" }}>Save &amp; Exit</button>
        )}
      </div>

      <div ref={topRef} style={{ maxWidth:680, margin:"0 auto", padding:"28px 16px 60px" }}>
        <PhaseNav current={appPhase} onNavigate={id => setAppPhase(id)} completedSections={completedSections} />

        {appPhase==="lane" && (
          <div>
            <div style={{ background:NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
              <h1 style={{ color:WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>Turn Your Story Into<br /><span style={{ color:YELLOW }}>Jobs on Your Calendar</span></h1>
              <p style={{ color:GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px", maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                {["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"].map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:WHITE }}>{s}</div>)}
              </div>
            </div>
            <button onClick={() => setAppPhase(nextStep.phase)}
              style={{ width:"100%", background:YELLOW, border:"none", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:24, boxShadow:"0 4px 20px rgba(254,183,5,0.35)" }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:11, fontWeight:700, color:NAVY, opacity:0.6, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>Continue where you left off</div>
                <div style={{ fontSize:16, fontWeight:900, color:NAVY }}>{nextStep.emoji} {nextStep.label}</div>
              </div>
              <div style={{ background:NAVY, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>
            <h3 style={{ color:NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>Your Week 1 Checklist</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { phase:"writechoice", icon:"✍️", bg:NAVY,       label:"Write Post",      status:writeStatus,  desc:"Answer 15 questions. AI writes your trust-building post.", sub:"~8 min · "+answeredCount+" of 15 answered" },
                { phase:"groups",      icon:"📣", bg:NAVY_LIGHT,  label:"Post in Groups",  status:groupStatus,  desc:"Find local Facebook groups and replicate your post to 10.", sub:"~15 min · "+(postCount+(coachApproved?1:0))+" of 10 groups posted" },
                { phase:"leads",       icon:"🔥", bg:"#065F46",   label:"Work Leads",      status:leadsStatus,  desc:"Turn every like, comment, share, and DM into a booked job.", sub:"~5 min · Scripts for every engagement type" },
              ].map(item => (
                <div key={item.phase} onClick={() => setAppPhase(item.phase)} style={{ background:WHITE, borderRadius:16, boxShadow:"0 2px 12px rgba(0,41,66,0.06)", overflow:"hidden", cursor:"pointer", display:"flex" }}>
                  <div style={{ background:item.bg, width:56, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>{item.icon}</div>
                  <div style={{ padding:"14px 16px", flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}><div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{item.label}</div><StatusTag status={item.status} /></div>
                    <div style={{ fontSize:12, color:GRAY600 }}>{item.desc}</div>
                    <div style={{ fontSize:11, color:GRAY400, marginTop:4 }}>{item.sub}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", paddingRight:16 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                </div>
              ))}
            </div>
            <div style={{ background:"#FEF9EC", border:"1.5px dashed "+YELLOW, borderRadius:10, padding:"10px 16px" }}>
              <div style={{ fontSize:13, color:GRAY600, marginBottom:8 }}>🧪 <strong>Dev shortcuts</strong></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[
                  { label:"Fill Sample Answers", fn:() => { devFill(); setAppPhase("ch1"); } },
                  { label:"Skip to Stop Screen",  fn:() => { devFill(); setAppPhase("waitforcoach"); } },
                  { label:"Skip to Groups",        fn:() => { devFill(); setAppPhase("groups"); } },
                  { label:"Skip to Leads",         fn:() => { devFill(); setAppPhase("leads"); } },
                ].map((b,i) => <button key={i} onClick={b.fn} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{b.label}</button>)}
              </div>
            </div>
          </div>
        )}

        {appPhase==="writechoice" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("lane")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title="Write Your Post" subtitle="How would you like to answer the questions?" />
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <button onClick={() => { setLane("type"); setAppPhase("ch1"); }} style={{ background:WHITE, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>⌨️</div>
                  <div><div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>Type My Answers</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>Fill in each question at your own pace.</div></div>
                </button>
                <button onClick={() => { setLane("voice"); setAppPhase("voice"); }} style={{ background:NAVY, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>🎤</div>
                  <div><div style={{ fontWeight:800, color:YELLOW, fontSize:15, marginBottom:4 }}>Talk Through It</div><div style={{ fontSize:13, color:GRAY400, lineHeight:1.5 }}>Speak your answers. A coach guides you through every question.</div></div>
                </button>
              </div>
            </Card>
          </>
        )}

        {appPhase==="voice" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("writechoice")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <VoiceMode onComplete={handleVoiceComplete} />
          </>
        )}

        {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3") && (
          <ProgressiveForm answers={answers} onAnswer={setAnswer} onExit={() => setAppPhase("writechoice")} onComplete={() => setAppPhase("waitforcoach")} validationFeedback={validationFeedback} validating={validating} initialPhase={appPhase} onPhaseChange={setAppPhase} />
        )}

        {appPhase==="waitforcoach" && (
          <WaitForCoach answers={answers} onContinue={() => handleValidateAndAdvance(ALL_QUESTIONS, "groups")} onBack={() => setAppPhase("ch1")} />
        )}

        {appPhase==="groups" && (
          <Card>
            <SectionHeader emoji="🧭" title="Step 1 — Join a Group" subtitle="Find an active local Facebook group and join it. You only need one to start." />
            {!answers.area && (
              <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:NAVY }}>What city or area do you serve?</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="e.g. East Nashville" style={{ flex:1, border:"2px solid "+GRAY200, borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", fontFamily:"inherit" }} />
                  <button onClick={() => { setGroups5([]); setGroupsLoading(true); findFacebookGroups(manualCity.trim()||"Your City",5).then(r => { setGroups5(r); setGroupsLoading(false); }).catch(() => setGroupsLoading(false)); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>Search</button>
                </div>
              </div>
            )}
            {groupsLoading && <div style={{ textAlign:"center", padding:32 }}><p style={{ color:GRAY600 }}>🔍 Finding groups near {city}...</p></div>}
            {groupsError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, color:RED, fontSize:13 }}>{groupsError}</div>}
            {!groupsLoading && groups5.length > 0 && (
              <>
                <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:NAVY }}>💡 Click <strong>Open in Facebook</strong> next to a group. Join it, then come back and confirm.</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{groups5.map((g,i) => <GroupActionRow key={i} group={g} onConfirmed={() => setAppPhase("getpost")} />)}</div>
              </>
            )}
          </Card>
        )}

        {appPhase==="getpost" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("groups")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title="Step 2 — Get & Copy Your Post" />
              {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:GRAY600, fontSize:14 }}>Writing your post...</p></div>}
              {postError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{postError}</div>}
              {!postLoading && ch3Met && !post && <><p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, marginBottom:20 }}>Your story answers are ready. Tap below and we'll write your post.</p><Btn onClick={() => handleGeneratePost()}>Generate My Post →</Btn></>}
              {!postLoading && ch3Met && post && (
                <>
                  <textarea value={post} onChange={e => setPost(e.target.value)} rows={14} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:GRAY50, marginBottom:14 }} />
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
                    <Btn onClick={() => { try { const el=document.createElement("textarea"); el.value=post; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); setCopiedGetpost(true); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(post).then(()=>setCopiedGetpost(true)); } }} variant={copiedGetpost?"success":"primary"}>{copiedGetpost?"✓ Copied!":"📋 Copy Post"}</Btn>
                    <Btn variant="secondary" onClick={() => handleGeneratePost()} disabled={postLoading}>↺ Regenerate</Btn>
                  </div>
                  {copiedGetpost && (
                    <div style={{ background:"#EFF6FF", border:"1.5px solid #93C5FD", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                      <div><div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:2 }}>Post copied! 🎉</div><div style={{ fontSize:13, color:GRAY600 }}>Next up: pick a photo.</div></div>
                      <Btn onClick={() => setAppPhase("photo")}>📸 Choose My Photo →</Btn>
                    </div>
                  )}
                </>
              )}
              {!postLoading && !ch3Met && (
                <>
                  <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:16, marginBottom:20 }}>
                    <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 6px" }}>You haven't built your story yet.</p>
                    <p style={{ color:GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>Complete the 3 chapters to generate your AI-written post — or paste an existing post below.</p>
                    <Btn onClick={() => setAppPhase("writechoice")}>✍️ Write My Post</Btn>
                  </div>
                  <textarea value={post} onChange={e => setPost(e.target.value)} rows={10} placeholder="Paste your Facebook post here..." style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?NAVY:GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":GRAY50, outline:"none", marginBottom:14 }} />
                  {post && post.trim().length>=50 && <Btn onClick={() => setAppPhase("photo")}>Use This Post →</Btn>}
                </>
              )}
            </Card>
          </>
        )}

        {appPhase==="photo" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("getpost")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="📸" title="Step 3 — Choose Your Photo" subtitle="Pick one real photo of you. Your face needs to be clearly visible." />
              <PhotoGuideReal />
            </Card>
            <Btn onClick={() => setAppPhase("dopost")}>I Have My Photo Ready →</Btn>
          </>
        )}

        {appPhase==="dopost" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("photo")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="🚀" title="Step 4 — Post It" subtitle="You're ready. Follow these steps exactly." />
              {[{num:1,text:"Open the Facebook group and tap Write something"},{num:2,text:"Paste your copied post"},{num:3,text:"Attach your photo"},{num:4,text:"Tap Post"}].map(s => (
                <div key={s.num} style={{ display:"flex", gap:14, marginBottom:18, alignItems:"flex-start" }}>
                  <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, flexShrink:0 }}>{s.num}</div>
                  <p style={{ margin:0, fontSize:15, color:GRAY800, paddingTop:7, lineHeight:1.6 }}>{s.text}</p>
                </div>
              ))}
            </Card>
            <Btn onClick={() => setAppPhase("approval")}>My Post Is Live →</Btn>
          </>
        )}

        {appPhase==="approval" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("dopost")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="📋" title="Step 5 — Submit for Review" subtitle="Paste your live post URL or upload a screenshot so your coach can verify it." />
              <EvidenceCapture onSubmit={(evidence) => { setFlag("coachApproved", true); saveSubmission(answers, post, "Needs Review", evidence); setAppPhase("replicate"); }} />
            </Card>
          </>
        )}

        {appPhase==="replicate" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("approval")} style={{ fontSize:13, padding:"8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="🔁" title="Step 6 — Cross-Post to 9 More Groups" subtitle="Same post. Same photo. No edits. Hit 10 total." />
              <div style={{ background:GRAY50, borderRadius:12, padding:16, marginBottom:20 }}>
                {["Use the exact same post — do not change a single word.","Attach the exact same photo.","Do not add your phone number, website, or any contact info.","Public groups: post immediately. Private groups: join and post once approved."].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading && <p style={{ color:GRAY600, fontSize:14, textAlign:"center" }}>🔍 Loading groups...</p>}
              {!groupsLoading && groups20.length > 0 && <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>{groups20.map((g,i) => <GroupPostRow key={i} group={g} num={i+2} />)}</div>}
            </Card>
            <Card>
              <h3 style={{ color:NAVY, margin:"0 0 8px", fontSize:18 }}>How many additional groups did you post in?</h3>
              <p style={{ color:GRAY600, fontSize:13, marginTop:0, marginBottom:16 }}>You already posted in 1 — tap how many more.</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => setFlag("postCount", n)} style={{ width:48, height:48, borderRadius:10, border:"2px solid "+(postCount===n?NAVY:GRAY200), background:postCount===n?NAVY:WHITE, color:postCount===n?YELLOW:GRAY600, fontWeight:800, fontSize:16, cursor:"pointer" }}>{n}</button>
                ))}
              </div>
              {postCount>0&&postCount<9 && <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:GRAY800 }}>Posted in <strong>{postCount+1} total groups</strong>. <strong>{9-postCount} more to go.</strong></div>}
              {postCount===9&&!tenDone && <Btn onClick={() => { setFlag("tenDone",true); setFlag("completedSections",[...completedSections,"grouppost"]); saveSubmission(answers,post,"10 Groups Done"); }}>10 Groups Done! →</Btn>}
            </Card>
            {tenDone && (
              <Card style={{ background:NAVY, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🎯</div>
                <h2 style={{ color:YELLOW, fontSize:24, margin:"0 0 8px" }}>WEEK 1 GOAL ACHIEVED</h2>
                <p style={{ color:WHITE, fontSize:15, lineHeight:1.8, margin:"0 0 20px" }}>10 groups. 10 posts. Mission accomplished.</p>
                <Btn onClick={() => setAppPhase("leads")}>Open Lead Engagement →</Btn>
              </Card>
            )}
          </>
        )}

        {appPhase==="leads" && <LeadEngagement onBack={() => setAppPhase("replicate")} city={city} week1Total={postCount+1} onAmplify={() => setAppPhase("amplify")} />}

        {appPhase==="amplify" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("leads")} style={{ fontSize:13, padding:"8px 14px" }}>← Back to Work Leads</Btn></div>
            <Amplify city={city||manualCity||"Your City"} week1Total={postCount+1} />
          </>
        )}
      </div>
    </div>
  );
}