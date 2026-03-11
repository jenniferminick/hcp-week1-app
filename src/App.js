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
  { id: "write", label: "Write Post", phases: ["ch1","ch2","ch3"] },
  { id: "grouppost", label: "Post in Groups", phases: ["groups","getpost","copypost","photo","dopost","approval","replicate"] },
  { id: "leads", label: "Work Leads", phases: ["leads","amplify"] },
];
const PHASE_LABELS = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3",
  groups:"1. Join a Group", getpost:"2. Get Your Post", copypost:"3. Copy Post",
  photo:"4. Add Photo", dopost:"5. Post It", approval:"6. Get Approval", replicate:"7. Cross-Post",
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
  whyStarted:"I got tired of watching my old boss charge elderly customers three times what a job was worth and then sleeping just fine at night - I walked out one afternoon and never looked back",
  whatChanged:"Now I make it home for dinner most nights and I coached my son's baseball team this spring for the first time",
  heroCrisis:"An elderly woman called me at 7pm on Christmas Eve her heat had been out for two days and she had her three grandkids coming in from out of town the next morning",
  heroSacrifice:"I drove 40 minutes out there worked two hours in the cold and only charged her for the cost of the part",
  heroPayoff:"She grabbed my hand on the way out and told me she was going to tell everyone she knew about me and she has sent me four referrals since that night",
};

const ALL_QUESTIONS = [
  {id:"name",         num:1,    chapter:"ch1", minWords:2,  label:"Your Name",                   voiceQ:"What's your full name?",                                                                                         hint:"What's your first and last name?",                                                                               placeholder:"e.g. Sarah Mitchell"},
  {id:"business",     num:2,    chapter:"ch1", minWords:2,  label:"Business Name",               voiceQ:"What's the name of your business?",                                                                              hint:"What's the name of your business, exactly as it appears online?",                                               placeholder:"e.g. Mitchell Home Services"},
  {id:"area",         num:3,    chapter:"ch1", minWords:8,  label:"Where You Serve",             voiceQ:"What cities or neighborhoods do you serve, and how long have you been working in that area?",                    hint:"What cities or neighborhoods do you serve, and how long have you been in the area?",                            placeholder:"e.g. East Nashville, Donelson, and Hermitage - 11 years"},
  {id:"knownFor",     num:4,    chapter:"ch1", minWords:3,  label:"Your Known For",              voiceQ:"If someone was describing you to a neighbor, what would they say you're the go-to person for? Give me 2 or 3 specific words — nothing generic like reliable or honest.",hint:"If a neighbor was recommending you, what 2-3 specific words would they use? Avoid generic words.",placeholder:"e.g. slow drain detective"},
  {id:"topServices",  num:5,    chapter:"ch1", minWords:4,  label:"Top 2 Services",              voiceQ:"What are the two services you most want to be known for?",                                                        hint:"What are the two services you most want to be known for?",                                                      placeholder:"e.g. drain cleaning and water heater installs"},
  {id:"refuses",      num:"5b", chapter:"ch1", minWords:15, label:"What You Refuse to Do",       voiceQ:"What's one thing you flat-out refuse to do that other people in your industry do? Be real about it.",           hint:"What's one thing you flat-out refuse to do that others in your industry do? Be specific.",                      placeholder:"e.g. I will never tell someone they need a full repipe just to run up a bill"},
  {id:"humanDetail",  num:6,    chapter:"ch2", minWords:15, label:"One Human Detail",            voiceQ:"Tell me something real about you outside of work — a hobby, a project, something you're into. Give me the specifics, like the year, the color, the name.",hint:"What's something real about you outside of work? Give specifics — the year, the color, the name.",          placeholder:"e.g. I have been slowly restoring a 1967 candy apple red Ford Bronco"},
  {id:"localPlace",   num:7,    chapter:"ch2", minWords:4,  label:"Local Flavor - Place",        voiceQ:"What's one specific local spot you genuinely love — a restaurant, a park, a coffee shop? Give me the actual name.",hint:"What's one specific local spot you genuinely love? Give the actual name.",                                      placeholder:"e.g. Mas Tacos Por Favor in East Nashville"},
  {id:"localActivity",num:"7b", chapter:"ch2", minWords:10, label:"What You Do There",           voiceQ:"What do you always do or order when you're there? Paint the picture for me.",                                    hint:"What do you always do or order when you're there? Paint the picture.",                                          placeholder:"e.g. always get the chicken taco plate and eat it standing outside"},
  {id:"mission",      num:8,    chapter:"ch2", minWords:3,  label:"Your Mission Question",       voiceQ:"Finish this sentence: I'm on a mission to find the best blank in my city.",                                      hint:"Finish this sentence: I'm on a mission to find the best _______ in my city.",                                  placeholder:"e.g. hot chicken in Nashville"},
  {id:"whyStarted",   num:9,    chapter:"ch3", minWords:20, label:"Why You Started",             voiceQ:"Tell me the real story of why you started your business. What was the moment that pushed you? Don't sugarcoat it.",hint:"What's the real reason you started your business? What was the moment that pushed you?",                        placeholder:"e.g. I got tired of watching my old boss charge elderly customers three times what a job was worth"},
  {id:"whatChanged",  num:"9b", chapter:"ch3", minWords:10, label:"What Did It Change?",         voiceQ:"What actually changed in your life or your family when you made that decision?",                                 hint:"What actually changed in your life or your family when you made that decision?",                                placeholder:"e.g. Now I make it home for dinner most nights"},
  {id:"heroCrisis",   num:10,   chapter:"ch3", minWords:20, label:"Hero Moment - The Crisis",    voiceQ:"Tell me about a time you went above and beyond for a customer. Set the scene — who was in trouble, what was going on, what was at stake?",hint:"Tell me about a time you went above and beyond. Who was in trouble, what was at stake?",                        placeholder:"e.g. An elderly woman called me at 7pm on Christmas Eve"},
  {id:"heroSacrifice",num:"10b",chapter:"ch3", minWords:10, label:"Hero Moment - The Sacrifice", voiceQ:"What did you actually do or give up to help them?",                                                              hint:"What did you actually do or give up to help them?",                                                            placeholder:"e.g. I drove 40 minutes, worked two hours, and only charged her for the part"},
  {id:"heroPayoff",   num:"10c",chapter:"ch3", minWords:10, label:"Hero Moment - The Payoff",    voiceQ:"What was the reaction — from them or from you? What did that moment feel like?",                                 hint:"What was the reaction — from them or from you? What did that moment feel like?",                                placeholder:"e.g. She grabbed my hand on the way out"},
];

const ch1Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch1");
const ch2Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch2");
const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");

const BOOKING = "I have got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";

const LEAD_TYPES = [
  { id:"like", emoji:"👍", label:"Like or Emoji", color:"#FEF9EC", border:YELLOW, simple:true,
    steps:[
      { label:"Within 24 hours, send this DM to each person who reacted", script:"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?" },
      { label:"Then follow the DM strategy based on their response", note:true },
    ]},
  { id:"comment", emoji:"💬", label:"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false,
    subtypes:[
      { id:"cs1", label:"Asked about a service you offer",    example:'"Do you do drain cleaning?"',           publicReplies:["@[Name] great question. I do handle [service type], and quality is always guaranteed.","@[Name] yes! Whether it is service A or service B, we make sure it is done right every time."], dmScript:"Hey [Name], thanks so much for commenting. I did not want to get into the details publicly. We absolutely can help with [service]. "+BOOKING },
      { id:"cs2", label:"Asked about your service area",      example:'"Do you service Donelson?"',            publicReplies:["@[Name] great question. We do service [city name], we would love to help you out."], dmScript:"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious, is there something specific going on I can help with?" },
      { id:"cs3", label:"Needs help now",                     example:'"I was just about to call someone!"',   publicReplies:["@[Name] we would love to help serve you and your family.","@[Name] the stars have aligned, we would be glad to help."], dmScript:"Hey [Name], so glad you reached out. "+BOOKING },
      { id:"cs4", label:"Praise or encouragement",            example:'"Love this post! Keep it up!"',         publicReplies:["@[Name] really appreciate the kind words! Makes all the long days worth it.","@[Name] thanks so much. Our community is what makes our work so rewarding."], dmScript:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we are doing is connecting with people. If you ever need help with [services], I would be glad to take care of you." },
      { id:"cs5", label:"Past customer or testimonial",       example:'"He did great work for us last year!"', publicReplies:["@[Name] repeat customers like you are what keep me going. Grateful for your support."], dmScript:"Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?" },
      { id:"cs6", label:"Referral or future interest",        example:'"I will share this with my neighbor!"', publicReplies:["@[Name] really appreciate that. Supporting local businesses helps the whole community."], dmScript:"Hey [Name], really appreciate that. The best compliment someone can give us is to refer us to someone else. We would love to help them out. Could you share their name and phone number?" },
      { id:"cs7", label:"Community connection",               example:'"We need more people like you!"',       publicReplies:["@[Name] thank you. Our community deserves honest work and that is what I will always stand for."], dmScript:"I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I would be glad to." },
    ]},
  { id:"share", emoji:"🔁", label:"Share", color:"#F0FDF4", border:"#86EFAC", simple:true,
    steps:[
      { label:"Comment on their share", script:"@[Name] really appreciate that. Supporting local businesses helps the whole community." },
      { label:"Then send this DM", script:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we are doing is connecting with people. If you ever need help with [services], I would be glad to take care of you." },
    ]},
  { id:"dm", emoji:"✉️", label:"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false,
    subtypes:[
      { id:"ds1",  label:"Asked about a service you offer",        example:'"Do you do water heater installs?"',               dmScript:"Hey, thanks so much for reaching out. I really appreciate it. I was not sure how that post would land, so it means a lot that it resonated. We absolutely can help with [service name]. "+BOOKING },
      { id:"ds2",  label:"Asked about a service you do not offer", example:'"Do you do roof repairs?"',                        dmScript:"Hey, thanks so much for reaching out. I really appreciate it. We do not provide [service] but we do provide [your services]. Is there another item on your to-do list we can help with?" },
      { id:"ds3",  label:"General question or area check",         example:'"Do you service Hermitage?"',                      dmScript:"Hey, thanks so much for reaching out. I really appreciate it. [Insert your answer to their question here.]" },
      { id:"ds4",  label:"Needs help now",                         example:'"I was just about to call someone!"',              dmScript:"Hey, thanks so much for reaching out. I really appreciate it. "+BOOKING },
      { id:"ds5",  label:"Praise or encouragement",                example:'"Way to go! Love what you are doing."',            dmScript:"Hey [Name], really appreciate the encouragement. Means a lot to know the work we are doing is connecting with people. If you ever need help with [services], I would be glad to take care of you." },
      { id:"ds6",  label:"Past customer or testimonial",           example:'"He did our siding last year, highly recommend!"', dmScript:"Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?" },
      { id:"ds7",  label:"Referral or future interest",            example:'"Can you help my friend?"',                        dmScript:"Hey, thanks so much for reaching out. The best compliment someone can give us is to refer us to someone else. We would love to help them out. Could you share their name and phone number?" },
      { id:"ds8",  label:"Community connection",                   example:'"We need more people like you!"',                  dmScript:"I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I would be glad to." },
      { id:"ds9",  label:"Competitor or peer",                     example:'"We do the same services in another town."',       dmScript:"Great to hear from you, [Name]. I have found there is more than enough work to go around. If you ever have overflow jobs outside your focus, feel free to send them my way. I will do the same for you." },
      { id:"ds10", label:"Emotional support or values-based",      example:'"I am so proud of you. Blessings to you!"',        dmScript:"That is so kind of you, [Name]. Messages like this remind me why I started this business. Thank you for taking the time to say that." },
    ]},
];

const T = {
  en: {
    voiceIntro:"Hey! I'm going to walk you through a series of questions to build your story. Tap Start and I'll guide you through everything.",
    voiceStart:"Start Voice Session",
    voiceDone:"That's everything I need. Amazing work. Let's build your post now.",
    voiceContinue:"Continue to Post in Groups →",
    listenHint:"Listening — speak your answer",
    processing:"Processing...",
    answeredSoFar:"Your Answers So Far",
    rerecord:"🎤 Re-record",
    seeQuestion:"See current question",
  },
  es: {
    voiceIntro:"¡Hola! Voy a guiarte por una serie de preguntas para construir tu historia.",
    voiceStart:"Iniciar Sesión de Voz",
    voiceDone:"Eso es todo. Excelente trabajo.",
    voiceContinue:"Continuar →",
    listenHint:"Escuchando — di tu respuesta",
    processing:"Procesando...",
    answeredSoFar:"Tus Respuestas Hasta Ahora",
    rerecord:"🎤 Re-grabar",
    seeQuestion:"Ver pregunta actual",
  },
};

const Q_ES = {
  name:{label:"Tu Nombre",hint:"¿Cuál es tu nombre completo?"},
  business:{label:"Nombre del Negocio",hint:"¿Cómo se llama tu negocio?"},
  area:{label:"Dónde Trabajas",hint:"¿Qué ciudades atiendes y cuánto tiempo llevas?"},
  knownFor:{label:"Por qué te conocen",hint:"¿Con qué 2-3 palabras específicas te describirían?"},
  topServices:{label:"Top 2 Servicios",hint:"¿Cuáles son los dos servicios principales?"},
  refuses:{label:"Lo que te niegas a hacer",hint:"¿Qué te niegas a hacer que otros hacen?"},
  humanDetail:{label:"Un Detalle Humano",hint:"¿Algo real sobre ti fuera del trabajo? Sé específico."},
  localPlace:{label:"Lugar Local",hint:"¿Un lugar local específico que amas? El nombre real."},
  localActivity:{label:"Qué Haces Allí",hint:"¿Qué siempre haces o pides ahí?"},
  mission:{label:"Tu Misión",hint:"Completa: Estoy en misión de encontrar el mejor ___ en mi ciudad."},
  whyStarted:{label:"Por qué Empezaste",hint:"¿La verdadera razón por la que empezaste?"},
  whatChanged:{label:"¿Qué Cambió?",hint:"¿Qué cambió en tu vida o familia?"},
  heroCrisis:{label:"Momento Héroe - La Crisis",hint:"¿Cuéntame de una vez que fuiste más allá?"},
  heroSacrifice:{label:"Momento Héroe - El Sacrificio",hint:"¿Qué hiciste o sacrificaste?"},
  heroPayoff:{label:"Momento Héroe - El Resultado",hint:"¿Cuál fue la reacción?"},
};

function wordCount(s){ return (s||"").trim().split(/\s+/).filter(Boolean).length; }

async function callClaude(messages, system){
  const body = {model:"claude-sonnet-4-20250514", max_tokens:2000, messages};
  if (system) body.system = system;
  const r = await fetch("https://api.anthropic.com/v1/messages", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
  const d = await r.json();
  return (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("") || "";
}

// TTS: calls /api/tts (server route reads OPENAI_API_KEY from env), falls back to browser.
async function ttsSpeak(text, lang, onEnd){
  const done = () => { if (onEnd) onEnd(); };
  try {
    const res = await fetch("/api/tts", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text, lang}),
    });
    if (!res.ok) throw new Error("no tts route");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); done(); };
    audio.onerror = () => { URL.revokeObjectURL(url); done(); };
    await audio.play();
    return;
  } catch(e){}
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang||"en-US"; u.rate = 0.95; u.pitch = 1.05;
    const safety = setTimeout(() => { window.speechSynthesis.cancel(); done(); }, Math.max(3000, text.length*65));
    u.onend  = () => { clearTimeout(safety); done(); };
    u.onerror = () => { clearTimeout(safety); done(); };
    window.speechSynthesis.speak(u);
  } else { done(); }
}

async function findFacebookGroups(city, count){
  const reply = await callClaude([{role:"user", content:"Generate "+count+" realistic Facebook group names for the "+city+" area that a home service contractor could post in. Sort Public first.\n\nReturn ONLY a raw JSON array:\n[{\"name\":\"group name\",\"type\":\"Community or Homeowners or Family or Buy/Sell or Neighborhood\",\"members\":\"e.g. 4.2K\",\"privacy\":\"Public or Private\"}]"}]);
  const match = reply.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try {
    const p = JSON.parse(match[0]);
    return Array.isArray(p) ? p.filter(g=>g.name).map(g=>({...g,url:"https://www.facebook.com/search/groups/?q="+encodeURIComponent(g.name)})).sort((a,b)=>a.privacy==="Public"?-1:1) : [];
  } catch(e){ return []; }
}

async function generateAIPost(ans){
  const p = "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.\n\n"
    +"Answers:\n1. Name: "+(ans.name||"")+"\n2. Business: "+(ans.business||"")+"\n3. Area: "+(ans.area||"")
    +"\n4. Known For: "+(ans.knownFor||"")+"\n5. Services: "+(ans.topServices||"")+"\n5b. Refuses: "+(ans.refuses||"")
    +"\n6. Human Detail: "+(ans.humanDetail||"")+"\n7. Local Place: "+(ans.localPlace||"")+"\n7b. Activity: "+(ans.localActivity||"")
    +"\n8. Mission: "+(ans.mission||"")+"\n9. Why Started: "+(ans.whyStarted||"")+"\n9b. Changed: "+(ans.whatChanged||"")
    +"\n10. Crisis: "+(ans.heroCrisis||"")+"\n10b. Sacrifice: "+(ans.heroSacrifice||"")+"\n10c. Payoff: "+(ans.heroPayoff||"")
    +"\n\nSTRICT NO-HALLUCINATION: Only use facts from answers above.\n"
    +"RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. No em dashes. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.\n"
    +"STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Hero moment 8-12 lines, (4) Neighbor proof, (5) End ONLY with: \"Also, I am on a mission to find the best [mission] in [city]. Any suggestions?\"\n"
    +"Output post only. No labels.";
  return await callClaude([{role:"user", content:p}]);
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({children, style}){
  return <div style={{background:WHITE,borderRadius:16,padding:28,boxShadow:"0 4px 24px rgba(0,41,66,0.08)",marginBottom:20,...(style||{})}}>{children}</div>;
}
function Btn({children, onClick, variant, style, disabled}){
  const v = variant||"primary";
  const base = {border:"none",borderRadius:10,padding:"13px 24px",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6};
  const vars = {primary:{background:YELLOW,color:NAVY},secondary:{background:NAVY,color:WHITE},success:{background:GREEN,color:WHITE},ghost:{background:GRAY100,color:GRAY600}};
  return <button onClick={onClick} disabled={!!disabled} style={{...base,...(vars[v]||vars.primary),opacity:disabled?0.5:1,...(style||{})}}>{children}</button>;
}
function BottomNav({onBack, onNext, nextDisabled}){
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(8px)",borderTop:"2px solid "+GRAY200,padding:"14px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      {onBack ? <Btn variant="primary" onClick={onBack} style={{minWidth:110}}>← Back</Btn> : <div/>}
      {onNext ? <Btn variant="primary" onClick={onNext} disabled={!!nextDisabled} style={{minWidth:110}}>Next →</Btn> : <div/>}
    </div>
  );
}
function NavSpacer(){ return <div style={{height:80}}/>; }
function SectionHeader({emoji, title, subtitle}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:32,marginBottom:8}}>{emoji}</div>
      <h2 style={{fontSize:22,fontWeight:800,color:NAVY,margin:0}}>{title}</h2>
      {subtitle && <p style={{color:GRAY600,margin:"8px 0 0",fontSize:14,lineHeight:1.6}}>{subtitle}</p>}
    </div>
  );
}
function ProgressBar({current, total}){
  const pct = Math.round((current/total)*100);
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:4}}><span>{current} of {total} answered</span><span>{pct}%</span></div>
      <div style={{background:GRAY200,borderRadius:99,height:6}}><div style={{background:YELLOW,borderRadius:99,height:6,width:pct+"%",transition:"width 0.4s"}}/></div>
    </div>
  );
}
function LangToggle({lang, setLang}){
  return(
    <div style={{display:"inline-flex",border:"2px solid "+NAVY,borderRadius:10,overflow:"hidden",marginBottom:20}}>
      {["en","es"].map(l=>(
        <button key={l} onClick={()=>setLang(l)} style={{background:lang===l?NAVY:WHITE,color:lang===l?YELLOW:NAVY,border:"none",padding:"7px 20px",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>
          {l==="en"?"🇺🇸 English":"🇪🇸 Español"}
        </button>
      ))}
    </div>
  );
}
function PhaseNav({current, onNavigate, completedSections}){
  if (NO_NAV_PHASES.includes(current)) return null;
  const activeSection = NAV_SECTIONS.find(s=>s.phases.includes(current));
  if (!activeSection) return null;
  const subPhases = activeSection.phases;
  const currentSubIdx = subPhases.indexOf(current);
  const sectionPct = Math.round(((currentSubIdx+1)/subPhases.length)*100);
  const isLeads = activeSection.id === "leads";
  return(
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
        {NAV_SECTIONS.map(section=>{
          const sectionActive = section.phases.includes(current);
          const sectionDone = completedSections.includes(section.id);
          return(
            <div key={section.id} style={{flex:1,minWidth:0}}>
              <div onClick={()=>onNavigate&&onNavigate(section.phases[0])}
                style={{background:sectionDone?GREEN:sectionActive?NAVY:GRAY200,color:sectionDone?WHITE:sectionActive?YELLOW:GRAY600,borderRadius:sectionActive?"10px 10px 0 0":10,padding:"8px 14px",fontSize:13,fontWeight:800,textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}>
                {sectionDone?"✓ ":""}{section.label}
              </div>
              {sectionActive&&(
                <div style={{background:GRAY50,border:"1px solid "+GRAY200,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"8px 10px",display:"flex",flexDirection:"column",gap:5}}>
                  {subPhases.map((p,i)=>{
                    const isDone=i<currentSubIdx; const isActive=p===current;
                    return(
                      <div key={p} onClick={e=>{e.stopPropagation();onNavigate&&onNavigate(p);}}
                        style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,background:isDone?"#D1FAE5":isActive?YELLOW:GRAY200,color:isDone?"#065F46":isActive?NAVY:GRAY400,cursor:"pointer",textAlign:"center",transition:"all 0.2s",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
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
      {!isLeads&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:GRAY400,marginBottom:4}}>
            <span style={{fontWeight:600,color:GRAY600}}>{activeSection.label}</span>
            <span style={{fontWeight:700,color:sectionPct===100?GREEN:NAVY}}>{sectionPct}% complete</span>
          </div>
          <div style={{background:GRAY200,borderRadius:99,height:10}}>
            <div style={{background:sectionPct===100?GREEN:YELLOW,borderRadius:99,height:10,width:sectionPct+"%",transition:"width 0.4s ease"}}/>
          </div>
        </div>
      )}
    </div>
  );
}
function MicBtn({onTranscript, size, lang}){
  const [listening,setListening]=useState(false);
  const [err,setErr]=useState("");
  const recogRef=useRef(null);
  const sz=size||30;
  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR) return;
    const r=new SR(); r.continuous=false; r.interimResults=false; r.lang=lang==="es"?"es-ES":"en-US";
    r.onresult=e=>{onTranscript(e.results[0][0].transcript);setListening(false);};
    r.onerror=e=>{setListening(false);setErr(e.error==="not-allowed"?"Mic blocked.":"Mic error.");};
    r.onend=()=>setListening(false);
    recogRef.current=r;
  },[lang]);
  const toggle=()=>{
    if(!recogRef.current) return;
    if(listening){recogRef.current.stop();setListening(false);}
    else{try{recogRef.current.start();setListening(true);setErr("");}catch(e){}}
  };
  return(
    <span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <button type="button" onClick={toggle} style={{background:listening?RED:GRAY200,border:"none",borderRadius:"50%",width:sz,height:sz,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:listening?"0 0 0 5px rgba(239,68,68,0.2)":"none",transition:"all 0.2s",flexShrink:0}}>
        <svg width={sz*0.44} height={sz*0.44} viewBox="0 0 24 24" fill={listening?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
      </button>
      {listening&&<span style={{fontSize:10,color:RED}}>Listening...</span>}
      {err&&<span style={{fontSize:10,color:RED}}>{err}</span>}
    </span>
  );
}
function GroupTable({groups, showNum}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:NAVY}}>{(showNum?["#"]:[]).concat(["Group Name","Privacy","Members","Type"]).map(h=><th key={h} style={{padding:"10px 12px",color:YELLOW,textAlign:"left",fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>
          {groups.map((g,i)=>(
            <tr key={i} style={{background:i%2===0?WHITE:GRAY50,borderBottom:"1px solid "+GRAY200}}>
              {showNum&&<td style={{padding:"10px 12px",color:GRAY400,fontWeight:700,fontSize:12}}>{i+2}</td>}
              <td style={{padding:"10px 12px"}}>
                <a href={g.url} target="_blank" rel="noopener noreferrer" style={{color:NAVY,fontWeight:600,textDecoration:"underline"}}>{g.name}</a>
                <span style={{display:"block",fontSize:11,marginTop:2,color:GRAY400}}>Opens Facebook search</span>
              </td>
              <td style={{padding:"10px 12px",color:GRAY600}}>{g.privacy||"—"}</td>
              <td style={{padding:"10px 12px",color:GRAY600}}>{g.members||"—"}</td>
              <td style={{padding:"10px 12px"}}><span style={{background:NAVY_LIGHT,color:YELLOW,borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700}}>{g.type}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Voice Mode ────────────────────────────────────────────────────────────────
function VoiceMode({onComplete, lang}){
  const t = T[lang]||T.en;
  const ttsLang = lang==="es"?"es-ES":"en-US";

  // Single ref for all mutable state — avoids stale closure bugs entirely
  const S = useRef({
    qIdx:       0,
    answers:    {},
    rerecordId: null,
    busy:       false,
    wantMic:    false,
  });

  const [displayQIdx,    setDisplayQIdx]    = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState({});
  const [coachMsg,       setCoachMsg]       = useState(t.voiceIntro);
  const [transcript,     setTranscript]     = useState("");
  const [uiStatus,       setUiStatus]       = useState("idle");
  const [micErr,         setMicErr]         = useState("");
  const recogRef = useRef(null);

  function openMic(){
    if (!recogRef.current || S.current.busy) return;
    S.current.wantMic = true;
    try{ recogRef.current.start(); setUiStatus("listening"); setMicErr(""); }catch(_){}
  }
  function closeMic(){
    S.current.wantMic = false;
    try{ recogRef.current&&recogRef.current.stop(); }catch(_){}
  }
  function coachSay(msg, afterSpeak){
    S.current.busy = true;
    S.current.wantMic = false;
    closeMic();
    setCoachMsg(msg);
    setUiStatus("speaking");
    ttsSpeak(msg, ttsLang, ()=>{
      S.current.busy = false;
      if (afterSpeak) afterSpeak();
      else openMic();
    });
  }

  async function handleAnswer(text){
    const qIdx       = S.current.qIdx;
    const rerecordId = S.current.rerecordId;
    const q          = rerecordId ? ALL_QUESTIONS.find(x=>x.id===rerecordId) : ALL_QUESTIONS[qIdx];
    const isLast     = !rerecordId && qIdx===ALL_QUESTIONS.length-1;
    const nextQ      = isLast ? null : ALL_QUESTIONS[qIdx+1];
    const qLabel = (lang==="es"&&Q_ES[q.id])?Q_ES[q.id].label:q.label;
    const qHint  = (lang==="es"&&Q_ES[q.id])?Q_ES[q.id].hint:q.hint;
    const nextVoiceQ = nextQ?(nextQ.voiceQ||nextQ.hint):null;

    const sysPrompt = lang==="es"
      ?"Eres un coach de negocios cálido y alentador. Respuestas cortas, naturales. Sin listas."
      :`You are a warm, encouraging business coach — like a supportive friend.
NEVER start with "Got it". Vary acknowledgments naturally.
2-3 short sentences max. Casual, warm, real. No bullet points.`;

    const userPrompt = lang==="es"
      ?`Pregunta: ${qLabel} (${qHint})\nRespuesta: "${text}"\nMínimo: ${q.minWords} palabras\n\nSi específica y cumple mínimo: ACCEPT + reacción cálida + pregunta: ${nextVoiceQ||"Eso es todo."}\nSi vaga o corta: FOLLOWUP + una pregunta amigable.`
      :`Question: ${qLabel}
Looking for: ${qHint}
Their answer: "${text}"
Min words: ${q.minWords}

If specific and meets word count:
→ Start with ACCEPT
→ React warmly (1 sentence, never "Got it")
→ Lead into: ${nextVoiceQ||"That's everything — you did amazing!"}

If too short or vague:
→ Start with FOLLOWUP
→ One short friendly nudge to go deeper`;

    let reply = "";
    try{
      const timeout = new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),9000));
      reply = await Promise.race([callClaude([{role:"user",content:userPrompt}],sysPrompt), timeout]);
    }catch(_){
      const fb=["Love that. ","Perfect. ","Great, got it. "];
      reply="ACCEPT "+fb[Math.floor(Math.random()*fb.length)]+(nextVoiceQ||t.voiceDone);
    }

    const isAccept = reply.trim().toUpperCase().startsWith("ACCEPT");
    const msg = reply.replace(/^ACCEPT\s*/i,"").replace(/^FOLLOWUP\s*/i,"").trim();

    if (isAccept){
      const id = rerecordId||q.id;
      S.current.answers = {...S.current.answers,[id]:text};
      S.current.rerecordId = null;
      setDisplayAnswers({...S.current.answers});
      setTranscript("");
      if (isLast){
        coachSay(msg||t.voiceDone, ()=>setUiStatus("done"));
      } else {
        S.current.qIdx = qIdx+1;
        setDisplayQIdx(qIdx+1);
        coachSay(msg, ()=>openMic());
      }
    } else {
      coachSay(msg, ()=>openMic());
    }
  }

  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setMicErr("Speech recognition not supported in this browser.");return;}
    const r=new SR();
    r.continuous=false; r.interimResults=false; r.lang=ttsLang;
    r.onresult=e=>{
      const text=e.results[0][0].transcript.trim();
      if(!text||S.current.busy) return;
      S.current.busy=true;
      S.current.wantMic=false;
      setTranscript(text);
      setUiStatus("thinking");
      handleAnswer(text);
    };
    r.onerror=e=>{
      if(e.error==="no-speech"){if(S.current.wantMic&&!S.current.busy)try{r.start();}catch(_){}return;}
      S.current.wantMic=false;
      setMicErr(e.error==="not-allowed"?"Mic access blocked — please allow microphone.":"Mic error: "+e.error);
      setUiStatus("idle");
    };
    r.onend=()=>{
      if(S.current.wantMic&&!S.current.busy){try{r.start();}catch(_){}}
      else{setUiStatus(u=>u==="listening"?"idle":u);}
    };
    recogRef.current=r;
    return()=>{S.current.wantMic=false;try{r.stop();}catch(_){}};
  },[lang]);

  function handleStart(){
    const first=ALL_QUESTIONS.findIndex(q=>!S.current.answers[q.id]);
    const idx=first===-1?0:first;
    const isResuming=idx>0;
    S.current.qIdx=idx; setDisplayQIdx(idx);
    const q=ALL_QUESTIONS[idx];
    const firstQ=q.voiceQ||q.hint;
    const intro=isResuming
      ?(lang==="es"?`¡Bienvenido de vuelta! Continuemos. ${firstQ}`:`Hey, welcome back! Let's pick up right where we left off. ${firstQ}`)
      :(lang==="es"?`¡Perfecto! Empecemos. ${firstQ}`:`Alright, let's build your story! Just talk to me like you're catching up with a friend. Here we go: ${firstQ}`);
    coachSay(intro, ()=>openMic());
  }
  function handleRerecord(id){
    S.current.rerecordId=id;
    const q=ALL_QUESTIONS.find(x=>x.id===id);
    const vq=q.voiceQ||q.hint;
    const msg=lang==="es"?`Claro, repitamos. ${vq}`:`No problem, let's redo that one. ${vq}`;
    setTranscript("");
    coachSay(msg, ()=>openMic());
  }

  const answeredCount=Object.values(displayAnswers).filter(v=>v&&v.trim()).length;
  const activeQ=(S.current.rerecordId?ALL_QUESTIONS.find(x=>x.id===S.current.rerecordId):ALL_QUESTIONS[displayQIdx])||ALL_QUESTIONS[0];
  const chapterLabel={ch1:"Chapter 1",ch2:"Chapter 2",ch3:"Chapter 3"}[activeQ.chapter]||"";
  const isListening=uiStatus==="listening", isThinking=uiStatus==="thinking", isSpeaking=uiStatus==="speaking";

  return(
    <div>
      <Card style={{background:NAVY,marginBottom:16}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{background:YELLOW,borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:NAVY,fontSize:14,flexShrink:0}}>AI</div>
          <div style={{flex:1}}>
            {isThinking?<p style={{color:GRAY400,fontSize:14,margin:0,fontStyle:"italic"}}>{t.processing}</p>
              :<p style={{color:WHITE,fontSize:16,margin:0,lineHeight:1.8}}>{coachMsg}</p>}
          </div>
        </div>
      </Card>
      {uiStatus!=="idle"&&uiStatus!=="done"&&(
        <Card>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,paddingTop:8,paddingBottom:8}}>
            <div style={{position:"relative"}}>
              <button type="button" onClick={isListening?closeMic:openMic} disabled={isThinking||isSpeaking}
                style={{background:isListening?RED:isSpeaking||isThinking?GRAY400:GRAY200,border:"none",borderRadius:"50%",width:80,height:80,cursor:isThinking||isSpeaking?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isListening?"0 0 0 10px rgba(239,68,68,0.15)":"none",transition:"all 0.3s"}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill={isListening?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
              </button>
              {isSpeaking&&<div style={{position:"absolute",inset:-6,borderRadius:"50%",border:"3px solid "+YELLOW,opacity:0.6}}/>}
            </div>
            <span style={{fontSize:13,color:isListening?RED:isSpeaking?YELLOW:GRAY400,fontWeight:isListening||isSpeaking?600:400,textAlign:"center"}}>
              {isListening?t.listenHint:isThinking?t.processing:isSpeaking?(lang==="es"?"Coach hablando...":"Coach speaking..."):"Tap to start listening"}
            </span>
            {micErr&&<span style={{fontSize:12,color:RED,textAlign:"center",maxWidth:280}}>{micErr}</span>}
            {transcript&&(
              <div style={{background:"#F0F7FF",border:"2px solid "+NAVY,borderRadius:10,padding:"10px 14px",width:"100%",boxSizing:"border-box",fontSize:14,color:GRAY800,lineHeight:1.7}}>
                <div style={{fontSize:11,color:GRAY400,marginBottom:4,fontWeight:600}}>YOU SAID:</div>{transcript}
              </div>
            )}
          </div>
          {activeQ&&(
            <details style={{marginTop:8}}>
              <summary style={{fontSize:12,color:GRAY400,cursor:"pointer",userSelect:"none"}}>{chapterLabel} · Q{activeQ.num} of {ALL_QUESTIONS.length} · <span style={{textDecoration:"underline"}}>{t.seeQuestion}</span></summary>
              <div style={{marginTop:8,padding:"10px 14px",background:GRAY50,borderRadius:10,fontSize:13,color:GRAY600,lineHeight:1.6}}><strong style={{color:NAVY}}>{activeQ.label}</strong><br/>{activeQ.hint}</div>
            </details>
          )}
        </Card>
      )}
      {uiStatus!=="idle"&&<div style={{marginBottom:12}}><ProgressBar current={answeredCount} total={ALL_QUESTIONS.length}/></div>}
      {uiStatus==="idle"&&<div style={{textAlign:"center",marginTop:8}}><Btn onClick={handleStart}>{t.voiceStart}</Btn></div>}
      {answeredCount>0&&(
        <Card>
          <h3 style={{color:NAVY,margin:"0 0 16px",fontSize:16}}>📝 {t.answeredSoFar}</h3>
          {ALL_QUESTIONS.filter(q=>displayAnswers[q.id]).map(q=>(
            <div key={q.id} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid "+GRAY200}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                    <span style={{background:NAVY,color:YELLOW,borderRadius:6,padding:"1px 6px",fontSize:11,fontWeight:700}}>Q{q.num}</span>
                    <span style={{fontWeight:700,color:NAVY,fontSize:13}}>{(lang==="es"&&Q_ES[q.id])?Q_ES[q.id].label:q.label}</span>
                  </div>
                  <p style={{margin:0,fontSize:13,color:GRAY800,lineHeight:1.6}}>{displayAnswers[q.id]}</p>
                </div>
                <button onClick={()=>handleRerecord(q.id)} style={{background:GRAY100,border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,color:GRAY600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{t.rerecord}</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {uiStatus==="done"&&<div style={{marginTop:8}}><Btn onClick={()=>onComplete(displayAnswers)}>{t.voiceContinue}</Btn></div>}
    </div>
  );
}

// ── Type Mode ─────────────────────────────────────────────────────────────────
function TypeMode({onComplete, lang}){
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [showInspiration,setShowInspiration]=useState(false);
  const [inspirationLoading,setInspirationLoading]=useState(false);
  const [inspirationExamples,setInspirationExamples]=useState([]);

  const q=ALL_QUESTIONS[qIdx];
  const value=answers[q.id]||"";
  const wc=wordCount(value);
  const met=wc>=q.minWords;
  const isLast=qIdx===ALL_QUESTIONS.length-1;
  const answeredCount=ALL_QUESTIONS.filter(q2=>wordCount(answers[q2.id])>=q2.minWords).length;
  const label=(lang==="es"&&Q_ES[q.id])?Q_ES[q.id].label:q.label;
  const hint=(lang==="es"&&Q_ES[q.id])?Q_ES[q.id].hint:q.hint;

  const handleMic=text=>{const c=value||"";setAnswers(prev=>({...prev,[q.id]:c?c+" "+text:text}));};
  const handleInspiration=async()=>{
    setShowInspiration(true);
    if(inspirationExamples.length>0) return;
    setInspirationLoading(true);
    try{
      const reply=await callClaude([{role:"user",content:"Give 2 short vivid example answers for this question from a home service business owner:\n\nQuestion: "+q.label+"\nContext: "+q.hint+"\n\nReturn ONLY a JSON array of 2 strings: [\"example 1\",\"example 2\"]. Authentic, specific, different styles."}]);
      const match=reply.match(/\[[\s\S]*?\]/);
      if(match){const p=JSON.parse(match[0]);setInspirationExamples(Array.isArray(p)?p:[]);}
    }catch(e){setInspirationExamples([q.placeholder]);}
    setInspirationLoading(false);
  };
  const handleNext=()=>{
    if(!met) return;
    if(isLast){onComplete(answers);}
    else{setQIdx(i=>i+1);setShowInspiration(false);setInspirationExamples([]);}
  };

  const chapterLabel={ch1:"Chapter 1 — Who You Are",ch2:"Chapter 2 — Your Real Life",ch3:"Chapter 3 — What Shaped You"}[q.chapter];
  const chapterBg={ch1:"#EFF6FF",ch2:"#D1FAE5",ch3:"#FEF3C7"}[q.chapter];
  const chapterColor={ch1:"#1D4ED8",ch2:"#065F46",ch3:"#92400E"}[q.chapter];

  return(
    <div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:700,color:chapterColor,background:chapterBg,borderRadius:99,padding:"3px 12px"}}>{chapterLabel}</span>
          <span style={{fontSize:12,color:GRAY400,fontWeight:600}}>Question {qIdx+1} of {ALL_QUESTIONS.length}</span>
        </div>
        <ProgressBar current={answeredCount} total={ALL_QUESTIONS.length}/>
      </div>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{background:NAVY,color:YELLOW,borderRadius:8,padding:"4px 12px",fontSize:13,fontWeight:800}}>Q{q.num}</span>
          <span style={{fontWeight:800,color:NAVY,fontSize:18}}>{label}</span>
        </div>
        <p style={{fontSize:14,color:GRAY600,margin:"0 0 16px",lineHeight:1.7}}>{hint}</p>
        <div style={{position:"relative"}}>
          <textarea value={value} onChange={e=>setAnswers(prev=>({...prev,[q.id]:e.target.value}))}
            placeholder="Type your answer here, or tap the mic to speak..." rows={4} autoFocus
            style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(value?(met?GREEN:RED):GRAY200),borderRadius:12,padding:"14px 52px 14px 14px",fontSize:15,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none",transition:"border 0.15s",background:value?(met?"#F0FDF4":"#FFF5F5"):WHITE,lineHeight:1.7}}/>
          <div style={{position:"absolute",top:12,right:12}}><MicBtn onTranscript={handleMic} size={32} lang={lang}/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0 16px",minHeight:20}}>
          {wc>0?(
            <>
              <div style={{flex:1,background:GRAY200,borderRadius:99,height:5,overflow:"hidden"}}>
                <div style={{background:met?GREEN:RED,height:5,borderRadius:99,width:Math.min((wc/q.minWords)*100,100)+"%",transition:"width 0.2s"}}/>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:met?GREEN:RED,whiteSpace:"nowrap"}}>{met?"✓ ":""}{wc} / {q.minWords} words{met?"":" min"}</span>
            </>
          ):<span style={{fontSize:12,color:GRAY400}}>Minimum {q.minWords} word{q.minWords!==1?"s":""} required</span>}
        </div>
        <button onClick={handleInspiration} style={{background:"transparent",border:"2px dashed "+GRAY300,borderRadius:10,padding:"9px 18px",fontSize:13,color:GRAY600,cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}>💡 Need inspiration?</button>
        {showInspiration&&(
          <div style={{marginTop:10,background:"#FFFBEB",border:"1.5px solid "+YELLOW,borderRadius:12,padding:16}}>
            <p style={{fontSize:12,fontWeight:700,color:GRAY600,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Example answers</p>
            {inspirationLoading?<p style={{fontSize:13,color:GRAY400,fontStyle:"italic",margin:0}}>Loading examples...</p>:inspirationExamples.map((ex,i)=>(
              <div key={i} style={{marginBottom:i<inspirationExamples.length-1?10:0}}>
                <p style={{fontSize:13,color:GRAY800,margin:0,lineHeight:1.7,fontStyle:"italic"}}>"{ex}"</p>
                {i<inspirationExamples.length-1&&<div style={{borderTop:"1px solid "+GRAY200,margin:"10px 0 0"}}/>}
              </div>
            ))}
            <p style={{fontSize:11,color:GRAY400,margin:"10px 0 0"}}>Use these as a guide — write your own real version.</p>
          </div>
        )}
      </Card>
      <BottomNav
        onBack={qIdx>0?()=>{setQIdx(i=>i-1);setShowInspiration(false);setInspirationExamples([]);}:undefined}
        onNext={met?handleNext:undefined}
        nextDisabled={!met}
      />
      <NavSpacer/>
    </div>
  );
}

// ── Lead Engagement ───────────────────────────────────────────────────────────
function LeadEngagement({onBack, onAmplify}){
  const [watched,setWatched]=useState(false);
  const [active,setActive]=useState(null);
  const [subtype,setSubtype]=useState(null);
  const [copiedIdx,setCopiedIdx]=useState(null);
  const [log,setLog]=useState([]);
  const [jobsInput,setJobsInput]=useState("");
  const [showJobEntry,setShowJobEntry]=useState(false);
  const [totalJobs,setTotalJobs]=useState(0);
  const [likeCount,setLikeCount]=useState(1);

  const activeLead=LEAD_TYPES.find(l=>l.id===active);
  const activeSubtype=activeLead&&subtype?(activeLead.subtypes||[]).find(s=>s.id===subtype):null;
  const sessionCounts=LEAD_TYPES.reduce((acc,t)=>{acc[t.id]=log.filter(l=>l.type===t.id).length;return acc;},{});
  const sessionTotal=log.length;

  function copyText(text,idx){
    try{const el=document.createElement("textarea");el.value=text;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){navigator.clipboard&&navigator.clipboard.writeText(text);}
    setCopiedIdx(idx);setTimeout(()=>setCopiedIdx(null),2000);
  }
  function logLead(typeId,n){const num=n||1;const e=[];for(let i=0;i<num;i++)e.push({type:typeId,timestamp:Date.now()});setLog(p=>[...p,...e]);}
  function reset(){setActive(null);setSubtype(null);setLikeCount(1);}

  function ScriptBox({text,idx}){
    return(
      <div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
        <p style={{fontSize:14,color:GRAY800,lineHeight:1.8,margin:"0 0 10px",fontStyle:"italic"}}>"{text}"</p>
        <button onClick={()=>copyText(text,idx)} style={{background:copiedIdx===idx?GREEN:NAVY,color:copiedIdx===idx?WHITE:YELLOW,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          {copiedIdx===idx?"✓ Copied!":"📋 Copy Script"}
        </button>
      </div>
    );
  }
  function StepNum({n,text}){
    return(
      <div style={{display:"flex",gap:10,alignItems:"flex-start",margin:"16px 0 8px"}}>
        <div style={{background:YELLOW,color:NAVY,borderRadius:99,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,flexShrink:0,marginTop:1}}>{n}</div>
        <div style={{fontWeight:700,color:NAVY,fontSize:14,paddingTop:2}}>{text}</div>
      </div>
    );
  }

  if(!watched){
    return(
      <>
        <Card>
          <SectionHeader emoji="🎉" title="Session Complete — Now We Execute" subtitle="Watch this training video before working your leads."/>
          <div style={{background:"#EFF6FF",borderRadius:12,padding:16,marginBottom:16}}>
            <p style={{margin:"0 0 12px",fontSize:14,color:NAVY,fontWeight:600}}>📹 Lead Engagement Training Video</p>
            <div style={{position:"relative",paddingBottom:"56.25%",height:0,borderRadius:10,overflow:"hidden",marginBottom:14}}>
              <iframe src="https://fast.wistia.net/embed/iframe/indqjc1oov?autoPlay=false" title="Lead Engagement Training" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none",borderRadius:10}}/>
            </div>
            <Btn onClick={()=>setWatched(true)}>✓ I watched the video — show me the playbook</Btn>
          </div>
          <div style={{borderTop:"1px solid "+GRAY200,paddingTop:12}}>
            <p style={{fontSize:12,color:GRAY400,margin:0}}>Already watched?{" "}<button onClick={()=>setWatched(true)} style={{background:"none",border:"none",color:NAVY,fontSize:12,fontWeight:700,cursor:"pointer",textDecoration:"underline",padding:0}}>Skip →</button></p>
          </div>
        </Card>
        <BottomNav onBack={onBack}/>
        <NavSpacer/>
      </>
    );
  }

  return(
    <>
      <Card style={{background:NAVY,marginBottom:16}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <h2 style={{color:YELLOW,fontSize:20,fontWeight:900,margin:"0 0 4px"}}>Work Your Leads</h2>
            <p style={{color:GRAY400,fontSize:13,margin:0}}>Pick the type of engagement. Follow the steps. Book the job.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:72}}>
              <div style={{color:YELLOW,fontWeight:900,fontSize:24,lineHeight:1}}>{sessionTotal}</div>
              <div style={{color:GRAY400,fontSize:10,marginTop:3}}>this session</div>
            </div>
            <div style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:72,cursor:"pointer"}} onClick={()=>setShowJobEntry(v=>!v)}>
              <div style={{color:GREEN,fontWeight:900,fontSize:24,lineHeight:1}}>{totalJobs}</div>
              <div style={{color:GREEN,fontSize:10,marginTop:3}}>jobs booked ＋</div>
            </div>
          </div>
        </div>
        {showJobEntry&&(
          <div style={{marginTop:14,padding:"14px 16px",background:"rgba(255,255,255,0.06)",borderRadius:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{color:WHITE,fontSize:13,fontWeight:600}}>Jobs booked from this post?</span>
            <input type="number" min="1" value={jobsInput} onChange={e=>setJobsInput(e.target.value)} placeholder="e.g. 2" style={{width:72,border:"2px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"7px 10px",fontSize:16,fontWeight:800,color:NAVY,outline:"none",textAlign:"center",background:WHITE}}/>
            <Btn onClick={()=>{const n=parseInt(jobsInput);if(n>0){setTotalJobs(j=>j+n);setJobsInput("");setShowJobEntry(false);}}} disabled={!jobsInput||parseInt(jobsInput)<1} style={{fontSize:13}}>Add</Btn>
          </div>
        )}
        <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,255,255,0.06)",borderRadius:10}}>
          <p style={{color:WHITE,fontSize:13,margin:0}}>⚡ <strong style={{color:YELLOW}}>Time kills deals.</strong> First 24–48 hours are everything.</p>
        </div>
      </Card>

      {!active&&(
        <Card>
          <h3 style={{color:NAVY,fontSize:17,fontWeight:800,margin:"0 0 6px"}}>What kind of engagement did you get?</h3>
          <p style={{color:GRAY600,fontSize:13,margin:"0 0 20px"}}>Tap one to get exact steps and scripts.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {LEAD_TYPES.map(t=>(
              <button key={t.id} onClick={()=>{setActive(t.id);setSubtype(null);}}
                style={{background:t.color,border:"2px solid "+t.border,borderRadius:14,padding:"18px 16px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:6}}>
                <span style={{fontSize:32}}>{t.emoji}</span>
                <span style={{fontWeight:800,color:NAVY,fontSize:15}}>{t.label}</span>
                {sessionCounts[t.id]>0&&<span style={{fontSize:11,color:GRAY600,fontWeight:600}}>✓ {sessionCounts[t.id]} this session</span>}
              </button>
            ))}
          </div>
        </Card>
      )}

      {activeLead&&activeLead.simple&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button>
            <span style={{fontSize:26}}>{activeLead.emoji}</span>
            <h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{activeLead.label}</h3>
          </div>
          {activeLead.steps.map((step,i)=>(
            <div key={i}>
              <StepNum n={i+1} text={step.label}/>
              {step.note
                ?<div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:NAVY}}>Use the <strong>Direct Message</strong> playbook once they respond.</div>
                :<ScriptBox text={step.script} idx={i}/>}
            </div>
          ))}
          {activeLead.id==="like"?(
            <div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16}}>
              <p style={{fontWeight:700,color:NAVY,fontSize:14,margin:"0 0 12px"}}>How many people did you DM?</p>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <input type="number" min="1" value={likeCount} onChange={e=>setLikeCount(Math.max(1,parseInt(e.target.value)||1))}
                  style={{width:90,border:"2px solid "+NAVY,borderRadius:10,padding:"10px 14px",fontSize:22,fontWeight:800,color:NAVY,outline:"none",textAlign:"center",fontFamily:"inherit",background:WHITE}}/>
                <Btn variant="success" onClick={()=>{logLead(activeLead.id,likeCount);reset();}}>Log {likeCount} DM{likeCount!==1?"s":""} ✓</Btn>
              </div>
              <Btn variant="ghost" onClick={reset}>← Back</Btn>
            </div>
          ):(
            <div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16,display:"flex",gap:10}}>
              <Btn variant="success" onClick={()=>{logLead(activeLead.id);reset();}}>✓ Mark as Worked</Btn>
              <Btn variant="ghost" onClick={reset}>← Back</Btn>
            </div>
          )}
        </Card>
      )}

      {activeLead&&!activeLead.simple&&!subtype&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button>
            <span style={{fontSize:26}}>{activeLead.emoji}</span>
            <h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{activeLead.label}</h3>
          </div>
          <p style={{color:GRAY600,fontSize:13,margin:"0 0 16px"}}>What did they say?</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {activeLead.subtypes.map(s=>(
              <button key={s.id} onClick={()=>setSubtype(s.id)}
                style={{background:activeLead.color,border:"1.5px solid "+activeLead.border,borderRadius:12,padding:"12px 16px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:3}}>
                <span style={{fontWeight:700,color:NAVY,fontSize:14}}>{s.label}</span>
                <span style={{fontSize:12,color:GRAY600,fontStyle:"italic"}}>{s.example}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {activeLead&&!activeLead.simple&&activeSubtype&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={()=>setSubtype(null)} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button>
            <span style={{fontSize:26}}>{activeLead.emoji}</span>
            <div>
              <div style={{fontWeight:800,color:NAVY,fontSize:15}}>{activeLead.label}</div>
              <div style={{fontSize:12,color:GRAY600}}>{activeSubtype.label}</div>
            </div>
          </div>
          {activeLead.id==="comment"&&(
            <div>
              <StepNum n={1} text="Reply publicly"/>
              {activeSubtype.publicReplies.map((r,i)=><ScriptBox key={i} text={r} idx={i}/>)}
              <StepNum n={2} text="Then immediately DM"/>
              <ScriptBox text={activeSubtype.dmScript} idx={99}/>
            </div>
          )}
          {activeLead.id==="dm"&&(
            <div>
              <StepNum n={1} text="Reply within 24 hours"/>
              <ScriptBox text={activeSubtype.dmScript} idx={0}/>
            </div>
          )}
          <div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16,display:"flex",gap:10}}>
            <Btn variant="success" onClick={()=>{logLead(activeLead.id);reset();}}>✓ Mark as Worked</Btn>
            <Btn variant="ghost" onClick={()=>setSubtype(null)}>← Different Response</Btn>
          </div>
        </Card>
      )}

      {sessionTotal>0&&!active&&(
        <Card>
          <h3 style={{color:NAVY,fontSize:16,fontWeight:800,margin:"0 0 14px"}}>📊 This Session</h3>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
            {LEAD_TYPES.map(t=>sessionCounts[t.id]>0&&(
              <div key={t.id} style={{background:t.color,border:"1.5px solid "+t.border,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{t.emoji}</span>
                <span style={{fontWeight:800,color:NAVY,fontSize:14}}>{sessionCounts[t.id]}</span>
                <span style={{fontSize:12,color:GRAY600}}>{t.label}</span>
              </div>
            ))}
          </div>
          <div style={{background:NAVY,borderRadius:12,padding:16}}>
            <p style={{color:YELLOW,fontWeight:700,margin:"0 0 4px",fontSize:14}}>Every path leads to a DM. Every DM is a chance to book a job.</p>
            <p style={{color:WHITE,fontSize:13,margin:0}}>Keep going. The first 48 hours are everything.</p>
          </div>
        </Card>
      )}

      {!active&&(
        <Card style={{background:"linear-gradient(135deg, #002942, #003a5c)",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>⚡</div>
          <h3 style={{color:YELLOW,fontSize:18,fontWeight:900,margin:"0 0 8px"}}>Done working leads for now?</h3>
          <p style={{color:GRAY400,fontSize:13,lineHeight:1.7,margin:"0 0 20px"}}>Post in more groups to get more leads.</p>
          <Btn onClick={onAmplify} style={{margin:"0 auto"}}>⚡ Amplify — Post in More Groups →</Btn>
        </Card>
      )}

      <BottomNav onBack={onBack}/>
      <NavSpacer/>
    </>
  );
}

// ── Amplify ───────────────────────────────────────────────────────────────────
function AmplifyScreen({onBack, city, totalPosted}){
  const [groups,setGroups]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [extraPosted,setExtraPosted]=useState(0);
  const total=totalPosted+extraPosted;

  function loadGroups(){
    setLoading(true);setError("");
    findFacebookGroups(city||"Your City",20)
      .then(r=>{setGroups(r);setLoading(false);if(!r.length)setError("Could not load groups.");})
      .catch(()=>{setLoading(false);setError("Could not load groups.");});
  }
  useEffect(()=>{loadGroups();},[city]);

  return(
    <>
      <Card style={{background:NAVY}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div>
            <h2 style={{color:YELLOW,fontSize:20,fontWeight:900,margin:"0 0 4px"}}>⚡ Amplify</h2>
            <p style={{color:GRAY400,fontSize:13,margin:0}}>Keep the momentum going.</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 20px",textAlign:"center",minWidth:90}}>
            <div style={{color:YELLOW,fontWeight:900,fontSize:32,lineHeight:1}}>{total}</div>
            <div style={{color:GRAY400,fontSize:11,marginTop:4}}>total groups posted</div>
          </div>
        </div>
      </Card>
      <Card>
        <Btn variant="success" onClick={()=>setExtraPosted(n=>n+1)} style={{fontSize:14}}>+ Posted in Another Group</Btn>
      </Card>
      <Card>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <h3 style={{color:NAVY,fontSize:16,fontWeight:800,margin:0}}>More groups near you</h3>
          <button onClick={loadGroups} style={{background:NAVY,color:YELLOW,border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}>↺ Refresh</button>
        </div>
        {loading&&<p style={{color:GRAY600,fontSize:14}}>🔍 Finding groups near {city}...</p>}
        {error&&<div style={{background:"#FEF2F2",borderRadius:10,padding:14,color:RED,fontSize:13}}>{error}</div>}
        {!loading&&groups.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {groups.map((g,i)=>(
              <div key={i} style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,color:NAVY,fontSize:14,marginBottom:2}}>{g.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{background:g.privacy==="Public"?"#D1FAE5":"#FEF9EC",color:g.privacy==="Public"?"#065F46":"#92400E",borderRadius:99,padding:"1px 8px",fontSize:11,fontWeight:700}}>{g.privacy||"—"}</span>
                    <span style={{fontSize:11,color:GRAY400}}>{g.members||""} {g.type}</span>
                  </div>
                </div>
                <a href={g.url} target="_blank" rel="noopener noreferrer" style={{background:"#1877F2",color:WHITE,borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Open in Facebook</a>
              </div>
            ))}
          </div>
        )}
      </Card>
      <BottomNav onBack={onBack}/>
      <NavSpacer/>
    </>
  );
}

// ── Coach Dashboard ───────────────────────────────────────────────────────────
function CoachDashboard({onClose}){
  const [submissions,setSubmissions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [expanded,setExpanded]=useState(null);
  const [testMsg,setTestMsg]=useState("");
  async function loadData(){
    setLoading(true);
    try{
      const result=await window.storage.list("submission:",true);
      const keys=(result&&result.keys)?result.keys:[];
      const items=[];
      for(let i=0;i<keys.length;i++){
        try{const r=await window.storage.get(keys[i],true);if(r&&r.value)items.push(JSON.parse(r.value));}catch(e){}
      }
      setSubmissions(items.sort((a,b)=>b.timestamp-a.timestamp));
    }catch(e){setSubmissions([]);}
    setLoading(false);
  }
  async function doTestSave(){
    setTestMsg("Saving...");
    try{
      await window.storage.set("submission:test_pro",JSON.stringify({name:"Test Pro",business:"Test Biz",city:"Nashville",answers:{},post:"Test post",status:"Post Generated",postGenerated:true,timestamp:Date.now(),updatedAt:Date.now()}),true);
      setTestMsg("Saved! Click Refresh.");setTimeout(loadData,600);
    }catch(e){setTestMsg("Error: "+e.message);}
  }
  useEffect(()=>{loadData();},[]);
  return(
    <div style={{position:"fixed",inset:0,background:GRAY100,zIndex:300,overflowY:"auto"}}>
      <div style={{background:NAVY,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{background:YELLOW,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:NAVY,fontSize:18}}>H</div>
          <div><div style={{color:WHITE,fontWeight:800,fontSize:16,lineHeight:1}}>Coach Dashboard</div><div style={{color:YELLOW,fontSize:12,fontWeight:600}}>{submissions.length} submissions</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={loadData} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"6px 14px",color:WHITE,fontSize:12,fontWeight:600,cursor:"pointer"}}>↺ Refresh</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"6px 14px",color:WHITE,fontSize:12,fontWeight:600,cursor:"pointer"}}>← Back</button>
        </div>
      </div>
      <div style={{maxWidth:800,margin:"0 auto",padding:"28px 16px 60px"}}>
        {loading&&<Card><p style={{textAlign:"center",color:GRAY600,padding:40}}>Loading...</p></Card>}
        {!loading&&submissions.length===0&&(
          <Card>
            <div style={{textAlign:"center",padding:20}}>
              <div style={{fontSize:40,marginBottom:12}}>📭</div>
              <p style={{color:GRAY600,fontSize:14,marginBottom:20}}>No submissions yet.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button onClick={doTestSave} style={{background:YELLOW,color:NAVY,border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer"}}>🧪 Write Test Entry</button>
                <button onClick={loadData} style={{background:NAVY,color:WHITE,border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer"}}>↺ Refresh</button>
              </div>
              {testMsg&&<p style={{marginTop:14,fontWeight:700,fontSize:13,color:testMsg.startsWith("Saving")?GRAY400:testMsg.startsWith("Error")?RED:GREEN}}>{testMsg}</p>}
            </div>
          </Card>
        )}
        {!loading&&submissions.map((s,i)=>(
          <Card key={i}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div>
                <div style={{fontWeight:800,color:NAVY,fontSize:17}}>{s.name||"Unknown"}</div>
                <div style={{fontSize:13,color:GRAY600,marginTop:2}}>{s.business} · {s.city}</div>
                <div style={{fontSize:12,color:GRAY400,marginTop:4}}>{s.timestamp?new Date(s.timestamp).toLocaleString():"—"}</div>
              </div>
              <span style={{background:"#DBEAFE",color:"#1D4ED8",borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>{s.status||"Post Generated"}</span>
            </div>
            <button onClick={()=>setExpanded(expanded===i?null:i)} style={{marginTop:14,background:GRAY50,border:"1px solid "+GRAY200,borderRadius:8,padding:"6px 14px",fontSize:12,color:NAVY,fontWeight:600,cursor:"pointer"}}>
              {expanded===i?"Hide Details ▲":"View Details ▼"}
            </button>
            {expanded===i&&(
              <div style={{marginTop:16}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {ALL_QUESTIONS.filter(q=>s.answers&&s.answers[q.id]).map(q=>(
                    <div key={q.id} style={{background:GRAY50,borderRadius:10,padding:"10px 12px"}}>
                      <div style={{fontSize:11,fontWeight:700,color:GRAY400,marginBottom:3}}>Q{q.num} {q.label}</div>
                      <div style={{fontSize:13,color:GRAY800,lineHeight:1.5}}>{s.answers[q.id]}</div>
                    </div>
                  ))}
                </div>
                {s.post&&<div><div style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:8}}>Generated Post:</div><div style={{background:GRAY50,border:"1px solid "+GRAY200,borderRadius:10,padding:16,fontSize:13,color:GRAY800,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{s.post}</div></div>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [appPhase,setAppPhase]=useState("lane");
  const [lang,setLang]=useState("en");
  const [answers,setAnswers]=useState({});
  const [post,setPost]=useState("");
  const [postLoading,setPostLoading]=useState(false);
  const [postError,setPostError]=useState("");
  const [copied,setCopied]=useState(false);
  const [groups5,setGroups5]=useState([]);
  const [groups20,setGroups20]=useState([]);
  const [groupsLoading,setGroupsLoading]=useState(false);
  const [groupsError,setGroupsError]=useState("");
  const [manualCity,setManualCity]=useState("");
  const [postCount,setPostCount]=useState(0);
  const [tenDone,setTenDone]=useState(false);
  const [showCoachLogin,setShowCoachLogin]=useState(false);
  const [showDashboard,setShowDashboard]=useState(false);
  const [passcodeInput,setPasscodeInput]=useState("");
  const [passcodeError,setPasscodeError]=useState(false);
  const [completedSections,setCompletedSections]=useState([]);
  const [autoSaved,setAutoSaved]=useState(false);
  const topRef=useRef(null);

  useEffect(()=>{
    if(Object.keys(answers).length===0) return;
    setAutoSaved(false);
    const t=setTimeout(()=>setAutoSaved(true),800);
    return()=>clearTimeout(t);
  },[answers,post]);

  useEffect(()=>{if(topRef.current)topRef.current.scrollIntoView({behavior:"smooth"});},[appPhase]);

  const city=answers.area
    ?answers.area.split(/[,\-\u2013\u2014]/)[0].replace(/\b(in the|area|been|here|for|years|going on|about|over|past|nearly|almost)\b.*/i,"").replace(/[^a-zA-Z\s]/g,"").trim()
    :manualCity.trim()||"Your City";

  useEffect(()=>{
    if(appPhase==="groups"&&groups5.length===0&&!groupsLoading){
      setGroupsLoading(true);setGroupsError("");
      findFacebookGroups(city,5).then(r=>{setGroups5(r);setGroupsLoading(false);if(!r.length)setGroupsError("Could not find groups. Try searching Facebook manually.");}).catch(()=>{setGroupsLoading(false);setGroupsError("Search failed.");});
    }
    if(appPhase==="replicate"&&groups20.length===0&&!groupsLoading){
      setGroupsLoading(true);
      findFacebookGroups(city,20).then(r=>{setGroups20(r);setGroupsLoading(false);}).catch(()=>setGroupsLoading(false));
    }
  },[appPhase]);

  async function saveSubmission(a,generatedPost,status){
    const data=a||answers;
    const name=(data.name||"Unknown").trim();
    const key="submission:"+name.replace(/\s+/g,"_").toLowerCase()+"_"+(data.business||"biz").replace(/\s+/g,"_").toLowerCase();
    try{
      let prev={};
      try{const ex=await window.storage.get(key,true);if(ex&&ex.value)prev=JSON.parse(ex.value);}catch(e){}
      const rec={name,business:data.business||"",city:(data.area||manualCity||"").split(/[,\-]/)[0].replace(/[^a-zA-Z\s]/g,"").trim(),answers:data,post:generatedPost!==undefined?generatedPost:(prev.post||""),status:status||prev.status||"Post Generated",postGenerated:true,timestamp:prev.timestamp||Date.now(),updatedAt:Date.now()};
      await window.storage.set(key,JSON.stringify(rec),true);
    }catch(e){}
  }

  async function handleGeneratePost(ans){
    const a=ans||answers;
    setPostLoading(true);setPostError("");
    try{
      const generated=await generateAIPost(a);
      setPost(generated);
      setCompletedSections(prev=>prev.includes("write")?prev:[...prev,"write"]);
      await saveSubmission(a,generated,"Post Generated");
    }catch(e){setPostError("Could not generate post. Please check your connection and try again.");}
    setPostLoading(false);
  }

  const handleCopy=()=>{
    if(!post) return;
    try{const el=document.createElement("textarea");el.value=post;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){navigator.clipboard&&navigator.clipboard.writeText(post);}
    setCopied(true);setTimeout(()=>setCopied(false),2500);
  };

  const allCh3Met=ch3Qs.every(q=>wordCount(answers[q.id])>=q.minWords);

  return(
    <div style={{minHeight:"100vh",background:GRAY100,fontFamily:"'Inter', -apple-system, sans-serif"}}>
      {showDashboard&&<CoachDashboard onClose={()=>setShowDashboard(false)}/>}
      {showCoachLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:WHITE,borderRadius:20,padding:32,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:36,textAlign:"center",marginBottom:12}}>🔐</div>
            <h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:"0 0 8px",textAlign:"center"}}>Coach Access</h3>
            <p style={{color:GRAY600,fontSize:13,textAlign:"center",margin:"0 0 20px"}}>Enter your passcode to view the dashboard.</p>
            <input type="password" value={passcodeInput} onChange={e=>{setPasscodeInput(e.target.value);setPasscodeError(false);}}
              onKeyDown={e=>{if(e.key==="Enter"){if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true);}}}
              placeholder="Enter passcode"
              style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(passcodeError?RED:GRAY200),borderRadius:10,padding:"10px 14px",fontSize:14,outline:"none",marginBottom:8}}/>
            {passcodeError&&<p style={{color:RED,fontSize:12,margin:"0 0 8px"}}>Incorrect passcode.</p>}
            <Btn style={{width:"100%",justifyContent:"center",marginBottom:10}} onClick={()=>{if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true);}}>Enter Dashboard</Btn>
            <button onClick={()=>{setShowCoachLogin(false);setPasscodeInput("");setPasscodeError(false);}} style={{width:"100%",background:"none",border:"none",color:GRAY400,fontSize:13,cursor:"pointer",padding:"4px 0"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:NAVY,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{background:YELLOW,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:NAVY,fontSize:18}}>H</div>
          <div><div style={{color:WHITE,fontWeight:800,fontSize:16,lineHeight:1}}>Business Coaching Foundations</div><div style={{color:YELLOW,fontSize:12,fontWeight:600}}>Week 1 — Facebook Organic Strategy</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {appPhase==="lane"&&(
            <button onClick={()=>setShowCoachLogin(true)} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"6px 14px",color:WHITE,fontSize:12,fontWeight:600,cursor:"pointer"}}>Coach Dashboard</button>
          )}
          {appPhase!=="lane"&&(
            <>
              {autoSaved&&<span style={{color:"rgba(255,255,255,0.5)",fontSize:12,display:"flex",alignItems:"center",gap:5}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Saved</span>}
              <button onClick={()=>setAppPhase("lane")} style={{background:YELLOW,border:"none",borderRadius:8,padding:"8px 18px",color:NAVY,fontSize:13,fontWeight:800,cursor:"pointer"}}>Save & Exit</button>
            </>
          )}
        </div>
      </div>

      <div ref={topRef} style={{maxWidth:960,margin:"0 auto",padding:"28px 32px 60px"}}>
        <PhaseNav current={appPhase} onNavigate={id=>setAppPhase(id)} completedSections={completedSections}/>

        {/* HOME */}
        {appPhase==="lane"&&(
          <div>
            <div style={{background:NAVY,borderRadius:16,padding:32,marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🚀</div>
              <h1 style={{color:WHITE,fontSize:24,fontWeight:900,margin:"0 0 12px",lineHeight:1.3}}>Turn Your Story Into<br/><span style={{color:YELLOW}}>Jobs on Your Calendar</span></h1>
              <p style={{color:GRAY400,fontSize:14,lineHeight:1.8,margin:"0 0 20px",maxWidth:480,marginLeft:"auto",marginRight:"auto"}}>Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                {["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"].map((s,i)=><div key={i} style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 18px",fontSize:13,color:WHITE}}>{s}</div>)}
              </div>
            </div>

            <button onClick={()=>{
              const n=ALL_QUESTIONS.filter(q=>wordCount(answers[q.id])>=q.minWords).length;
              if(n===0)setAppPhase("writechoice");
              else if(!post)setAppPhase("getpost");
              else if(postCount<9)setAppPhase("replicate");
              else setAppPhase("leads");
            }} style={{width:"100%",background:YELLOW,border:"none",borderRadius:14,padding:"18px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:24,boxShadow:"0 4px 20px rgba(254,183,5,0.35)"}}>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:11,fontWeight:700,color:NAVY,opacity:0.6,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.05em"}}>Continue where you left off</div>
                <div style={{fontSize:16,fontWeight:900,color:NAVY}}>
                  {(()=>{
                    const n=ALL_QUESTIONS.filter(q=>wordCount(answers[q.id])>=q.minWords).length;
                    if(n===0) return "✍️ Start Writing Your Post";
                    if(!post) return "✨ Generate Your Post";
                    if(postCount<9) return "🔁 Cross-Post to More Groups";
                    return "🔥 Work Your Leads";
                  })()}
                </div>
              </div>
              <div style={{background:NAVY,borderRadius:10,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>

            <h3 style={{color:NAVY,fontSize:15,fontWeight:800,margin:"0 0 12px"}}>Your Week 1 Checklist</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {[
                {phase:"writechoice",icon:"✍️",bg:NAVY,title:"Write Post",desc:"Answer 15 questions. AI writes your trust-building post.",time:"~8 min",
                  progress:(()=>{const n=ALL_QUESTIONS.filter(q=>wordCount(answers[q.id])>=q.minWords).length;return n+" of 15 answered";})(),
                  status:(()=>{const n=ALL_QUESTIONS.filter(q=>wordCount(answers[q.id])>=q.minWords).length;if(n===0)return{label:"Not Started",bg:GRAY100,fg:GRAY400};if(n<15)return{label:"In Progress",bg:"#FEF9EC",fg:"#92400E"};return{label:"Done",bg:"#D1FAE5",fg:"#065F46"};})()},
                {phase:"groups",icon:"📣",bg:NAVY_LIGHT,title:"Post in Groups",desc:"Find local Facebook groups and replicate your post to 10.",time:"~15 min",
                  progress:(postCount+1)+" of 10 groups posted",
                  status:postCount===9?{label:"Done",bg:"#D1FAE5",fg:"#065F46"}:postCount>0?{label:"In Progress",bg:"#FEF9EC",fg:"#92400E"}:{label:"Not Started",bg:GRAY100,fg:GRAY400}},
                {phase:"leads",icon:"🔥",bg:"#065F46",title:"Work Leads",desc:"Turn every like, comment, share, and DM into a booked job.",time:"~5 min",
                  progress:"Scripts for every engagement type",
                  status:{label:"Not Started",bg:GRAY100,fg:GRAY400}},
              ].map(item=>(
                <div key={item.phase} onClick={()=>setAppPhase(item.phase)} style={{background:WHITE,borderRadius:16,boxShadow:"0 2px 12px rgba(0,41,66,0.06)",overflow:"hidden",cursor:"pointer",display:"flex"}}>
                  <div style={{background:item.bg,width:56,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:22}}>{item.icon}</div>
                  <div style={{padding:"14px 16px",flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{fontWeight:800,color:NAVY,fontSize:15}}>{item.title}</div>
                      <span style={{background:item.status.bg,color:item.status.fg,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>{item.status.label==="Done"?"✓ ":item.status.label==="In Progress"?"● ":"○ "}{item.status.label}</span>
                    </div>
                    <div style={{fontSize:12,color:GRAY600}}>{item.desc}</div>
                    <div style={{fontSize:11,color:GRAY400,marginTop:4}}>{item.time} · {item.progress}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",paddingRight:16}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><LangToggle lang={lang} setLang={setLang}/></div>
          </div>
        )}

        {appPhase==="writechoice"&&(
          <>
            <Card>
              <SectionHeader emoji="✍️" title="Write Your Post" subtitle="How would you like to answer the questions?"/>
              <LangToggle lang={lang} setLang={setLang}/>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
                <button onClick={()=>setAppPhase("ch1")} style={{background:WHITE,border:"2px solid "+NAVY,borderRadius:14,padding:20,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{fontSize:32,flexShrink:0}}>⌨️</div>
                  <div><div style={{fontWeight:800,color:NAVY,fontSize:15,marginBottom:4}}>Type My Answers</div><div style={{fontSize:13,color:GRAY600,lineHeight:1.5}}>Fill in each question at your own pace. Mic icon available to dictate.</div></div>
                </button>
                <button onClick={()=>setAppPhase("voice")} style={{background:NAVY,border:"2px solid "+NAVY,borderRadius:14,padding:20,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{fontSize:32,flexShrink:0}}>🎤</div>
                  <div><div style={{fontWeight:800,color:YELLOW,fontSize:15,marginBottom:4}}>Talk Through It</div><div style={{fontSize:13,color:GRAY400,lineHeight:1.5}}>Speak your answers. An AI coach guides you through every question{lang==="es"?" (en Español)":""}.</div></div>
                </button>
              </div>
            </Card>
            <BottomNav onBack={()=>setAppPhase("lane")}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="voice"&&(
          <>
            <VoiceMode onComplete={va=>{setAnswers(va);setAppPhase("groups");}} lang={lang}/>
            <BottomNav onBack={()=>setAppPhase("writechoice")}/>
            <NavSpacer/>
          </>
        )}

        {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3")&&(
          <TypeMode onComplete={va=>{setAnswers(va);setAppPhase("groups");}} lang={lang}/>
        )}

        {appPhase==="groups"&&(
          <>
            <Card>
              <SectionHeader emoji="🧭" title="Step 1 — Join a Group" subtitle="Find an active local Facebook group and join it. You only need one to start."/>
              {!answers.area&&(
                <div style={{background:"#EFF6FF",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                  <p style={{margin:"0 0 8px",fontSize:13,fontWeight:600,color:NAVY}}>What city or area do you serve?</p>
                  <div style={{display:"flex",gap:8}}>
                    <input value={manualCity} onChange={e=>setManualCity(e.target.value)} placeholder="e.g. East Nashville"
                      style={{flex:1,border:"2px solid "+GRAY200,borderRadius:8,padding:"8px 12px",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    <button onClick={()=>{setGroups5([]);setGroupsError("");}} style={{background:NAVY,color:YELLOW,border:"none",borderRadius:8,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>Search</button>
                  </div>
                </div>
              )}
              {groupsLoading&&<div style={{textAlign:"center",padding:32}}><p style={{color:GRAY600}}>🔍 Finding groups near {city}...</p></div>}
              {groupsError&&<div style={{background:"#FEF2F2",borderRadius:10,padding:14,marginBottom:16,color:RED,fontSize:13}}>{groupsError}</div>}
              {!groupsLoading&&groups5.length>0&&(
                <>
                  <div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:NAVY,lineHeight:1.6}}>💡 Click a group name to open Facebook. Find it, click in, and join.</div>
                  <GroupTable groups={groups5} showNum={false}/>
                </>
              )}
            </Card>
            <BottomNav onBack={()=>setAppPhase("lane")} onNext={()=>setAppPhase("getpost")}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="getpost"&&(
          <>
            <Card>
              <SectionHeader emoji="✍️" title="Step 2 — Get Your Post"/>
              {allCh3Met&&!post&&!postLoading&&(
                <>
                  <p style={{color:GRAY600,fontSize:14,lineHeight:1.7,marginBottom:20}}>Your story answers are ready. Tap the button below and we'll write your post for you.</p>
                  {postError&&<div style={{background:"#FEF2F2",borderRadius:10,padding:14,marginBottom:16,color:RED,fontSize:13}}>{postError}</div>}
                  <Btn onClick={()=>handleGeneratePost()}>Generate My Post →</Btn>
                </>
              )}
              {postLoading&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:12}}>✨</div><p style={{color:GRAY600,fontSize:14}}>Writing your post...</p></div>}
              {!allCh3Met&&!post&&(
                <>
                  <div style={{background:"#FEF9EC",border:"1.5px solid "+YELLOW,borderRadius:10,padding:16,marginBottom:20}}>
                    <p style={{fontWeight:700,color:NAVY,fontSize:14,margin:"0 0 6px"}}>You'll need a post to continue.</p>
                    <p style={{color:GRAY600,fontSize:13,lineHeight:1.7,margin:"0 0 14px"}}>Go back to Write Post to build your story, or paste an existing post below.</p>
                    <Btn onClick={()=>setAppPhase("writechoice")}>← Write My Post</Btn>
                  </div>
                  <textarea value={post} onChange={e=>setPost(e.target.value)} rows={10} placeholder="Paste your Facebook post here..."
                    style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(post?NAVY:GRAY200),borderRadius:12,padding:16,fontSize:14,lineHeight:1.8,color:GRAY800,fontFamily:"inherit",resize:"vertical",background:post?"#F0F7FF":GRAY50,outline:"none"}}/>
                </>
              )}
              {post&&!postLoading&&<p style={{color:GREEN,fontWeight:700,fontSize:14,marginTop:12}}>✓ Your post is ready!</p>}
            </Card>
            <BottomNav onBack={()=>setAppPhase("groups")} onNext={post&&!postLoading?()=>setAppPhase("copypost"):undefined} nextDisabled={!post||postLoading}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="copypost"&&(
          <>
            <Card>
              <SectionHeader emoji="📋" title="Step 3 — Copy Your Post" subtitle="Read it over, then copy it. Do not edit — paste it exactly as written."/>
              <textarea value={post} onChange={e=>setPost(e.target.value)} rows={14}
                style={{width:"100%",boxSizing:"border-box",border:"2px solid "+NAVY,borderRadius:12,padding:16,fontSize:14,lineHeight:1.8,color:GRAY800,fontFamily:"inherit",resize:"vertical",background:GRAY50}}/>
              <div style={{marginTop:14}}><Btn onClick={handleCopy} variant={copied?"success":"primary"}>{copied?"✓ Copied!":"📋 Copy Post"}</Btn></div>
            </Card>
            <BottomNav onBack={()=>setAppPhase("getpost")} onNext={copied?()=>setAppPhase("photo"):undefined} nextDisabled={!copied}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="photo"&&(
          <>
            <Card>
              <SectionHeader emoji="📸" title="Step 4 — Choose Your Photo" subtitle="Pick one real photo of you. Your face needs to be clearly visible."/>
              <div style={{fontWeight:700,color:GREEN,fontSize:13,marginBottom:10}}>✅ GOOD — choose one of these:</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))",gap:10,marginBottom:20}}>
                {[{emoji:"😊",label:"You with family",desc:"Smiling face, bright natural light."},{emoji:"☕",label:"You at your local spot",desc:"Candid shot where you hang out."},{emoji:"🔧",label:"Candid job-site photo",desc:"You working, face clearly visible."}].map((g,i)=>(
                  <div key={i} style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{g.emoji}</div><div style={{fontWeight:700,color:"#166534",fontSize:13,marginBottom:4}}>{g.label}</div><div style={{fontSize:11,color:"#166534",lineHeight:1.4}}>{g.desc}</div></div>
                ))}
              </div>
              <div style={{fontWeight:700,color:RED,fontSize:13,marginBottom:10}}>❌ DO NOT use these:</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))",gap:10}}>
                {[{emoji:"🚛",label:"Truck only",desc:"No face = no connection."},{emoji:"🖼️",label:"Logo or flyer",desc:"Looks like an ad."},{emoji:"🕶️",label:"Dark selfie",desc:"Hard to connect with."},{emoji:"🤖",label:"AI or stock photo",desc:"People can tell."}].map((b,i)=>(
                  <div key={i} style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{b.emoji}</div><div style={{fontWeight:700,color:"#991B1B",fontSize:13,marginBottom:4}}>{b.label}</div><div style={{fontSize:11,color:"#991B1B",lineHeight:1.4}}>{b.desc}</div></div>
                ))}
              </div>
            </Card>
            <BottomNav onBack={()=>setAppPhase("copypost")} onNext={()=>setAppPhase("dopost")}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="dopost"&&(
          <>
            <Card>
              <SectionHeader emoji="🚀" title="Step 5 — Post It" subtitle="You're ready. Follow these steps exactly in the Facebook group."/>
              {[{num:1,text:"Open the Facebook group you joined and tap Write something"},{num:2,text:"Paste your copied post"},{num:3,text:"Attach your photo"},{num:4,text:"Tap Post"}].map(s=>(
                <div key={s.num} style={{display:"flex",gap:14,marginBottom:18,alignItems:"flex-start"}}>
                  <div style={{background:YELLOW,color:NAVY,borderRadius:99,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,flexShrink:0}}>{s.num}</div>
                  <p style={{margin:0,fontSize:15,color:GRAY800,paddingTop:7,lineHeight:1.6}}>{s.text}</p>
                </div>
              ))}
            </Card>
            <BottomNav onBack={()=>setAppPhase("photo")} onNext={()=>setAppPhase("approval")}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="approval"&&(
          <>
            <Card>
              <SectionHeader emoji="📋" title="Step 6 — Coach Approval" subtitle="Let your coach know you're ready for your post audit."/>
              <div style={{background:"#EFF6FF",borderRadius:12,padding:24,marginBottom:24,textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:10}}>👋</div>
                <p style={{color:NAVY,fontWeight:700,fontSize:15,margin:"0 0 8px"}}>Your post is live!</p>
                <p style={{color:GRAY600,fontSize:14,lineHeight:1.7,margin:0}}>Let your coach know you are ready for your audit. Once they have reviewed and approved it, tap Next below.</p>
              </div>
            </Card>
            <BottomNav onBack={()=>setAppPhase("dopost")} onNext={()=>{saveSubmission(answers,post,"Coach Approved");setAppPhase("replicate");}}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="replicate"&&(
          <>
            <Card>
              <SectionHeader emoji="🔁" title="Step 7 — Cross-Post to 9 More Groups" subtitle="Same post. Same photo. No edits. Hit 10 total to complete your Week 1 goal."/>
              <div style={{background:GRAY50,borderRadius:12,padding:16,marginBottom:20}}>
                {["Use the exact same post — do not change a single word.","Attach the exact same photo.","Do not add your phone number, website, or any contact info.","Public groups: post immediately. Private groups: join and post once approved."].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{background:YELLOW,color:NAVY,borderRadius:99,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:11,flexShrink:0,marginTop:1}}>{i+1}</div>
                    <p style={{margin:0,fontSize:13,color:GRAY800,lineHeight:1.6}}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading&&<p style={{color:GRAY600,fontSize:14,textAlign:"center"}}>🔍 Loading groups...</p>}
              {!groupsLoading&&groups20.length>0&&<div style={{marginBottom:20}}><GroupTable groups={groups20} showNum={true}/></div>}
            </Card>
            <Card>
              <h3 style={{color:NAVY,margin:"0 0 8px",fontSize:18}}>How many additional groups did you post in?</h3>
              <p style={{color:GRAY600,fontSize:13,marginTop:0,marginBottom:16}}>You already posted in 1 — tap how many more you completed.</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                {[1,2,3,4,5,6,7,8,9].map(n=>(
                  <button key={n} onClick={()=>setPostCount(n)} style={{width:48,height:48,borderRadius:10,border:"2px solid "+(postCount===n?NAVY:GRAY200),background:postCount===n?NAVY:WHITE,color:postCount===n?YELLOW:GRAY600,fontWeight:800,fontSize:16,cursor:"pointer",transition:"all 0.15s"}}>{n}</button>
                ))}
              </div>
              {postCount>0&&postCount<9&&<div style={{background:"#FEF9EC",border:"1.5px solid "+YELLOW,borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:GRAY800,lineHeight:1.6}}>You have posted in <strong>{postCount+1} total groups</strong>. You still have <strong>{9-postCount} more to go</strong>. Keep going.</div>}
              {postCount===9&&!tenDone&&<Btn variant="success" onClick={()=>{setTenDone(true);setCompletedSections(prev=>prev.includes("grouppost")?prev:[...prev,"grouppost"]);saveSubmission(answers,post,"10 Groups Done");}}>10 Groups Done! 🎯</Btn>}
            </Card>
            {tenDone&&(
              <Card style={{background:NAVY,textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:8}}>🎯</div>
                <h2 style={{color:YELLOW,fontSize:24,margin:"0 0 8px"}}>WEEK 1 GOAL ACHIEVED</h2>
                <p style={{color:WHITE,fontSize:15,lineHeight:1.8,margin:"0 0 20px"}}>10 groups. 10 posts. Mission accomplished.</p>
                <Btn onClick={()=>setAppPhase("leads")}>Open Lead Engagement →</Btn>
              </Card>
            )}
            <BottomNav onBack={()=>setAppPhase("approval")} onNext={tenDone?()=>setAppPhase("leads"):undefined} nextDisabled={!tenDone}/>
            <NavSpacer/>
          </>
        )}

        {appPhase==="leads"&&(
          <LeadEngagement onBack={()=>setAppPhase("replicate")} onAmplify={()=>setAppPhase("amplify")}/>
        )}

        {appPhase==="amplify"&&(
          <AmplifyScreen onBack={()=>setAppPhase("leads")} city={city} totalPosted={postCount+1}/>
        )}
      </div>
    </div>
  );
}