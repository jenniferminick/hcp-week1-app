import { useState, useEffect, useRef, createContext, useContext } from "react";

// ── Lang Context ──────────────────────────────────────────────────────────────
const LangCtx = createContext("en");
function useSp(){ return useContext(LangCtx)==="es"; }

// ── Colors ────────────────────────────────────────────────────────────────────
const NAVY="#0A2443",NAVY_LIGHT="#083072",YELLOW="#FFB706",WHITE="#FFFFFF",GRAY50="#ECEFF1",GRAY100="#E2E8F0",GRAY200="#CBD5E1",GRAY400="#999999",GRAY600="#666666",GRAY800="#0A2443",GREEN="#10B981",RED="#EF4444",ND_GREEN="#00B246",HCP_BLUE="#0055FF";

// ── Storage ───────────────────────────────────────────────────────────────────
const LS_FLAGS="hcp_nd_flags",LS_INPUTS="hcp_nd_inputs",LS_OUTPUTS="hcp_nd_outputs",LS_PHASE="hcp_nd_phase";
const _mem={};
function lsGet(k,fb){try{const v=localStorage.getItem(k);if(v!=null)return JSON.parse(v);}catch{}return _mem[k]!==undefined?_mem[k]:fb;}
function lsSet(k,v){_mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

// ── Spanish strings ───────────────────────────────────────────────────────────
const ES={
  "Get Your Post":"Obtén Tu Publicación","Setup":"Configuración","Intro Posts":"Publicaciones de Introducción",
  "Comments":"Comentarios","Work Leads":"Trabajar Prospectos","Personal Account":"Cuenta Personal",
  "Business Page":"Página de Negocio","Get Reviews on Nextdoor":"Obtener Reseñas en Nextdoor",
  "1. Personal Page":"1. Página Personal","2. First Group":"2. Primer Grupo","3. More Groups":"3. Más Grupos",
  "Save & Exit":"Guardar y Salir","← Back":"← Atrás","Next →":"Siguiente →",
  "Import Your Week 1 Post":"Importar Tu Publicación","Required before anything else can begin":"Requerido antes de comenzar",
  "Account Setup":"Configuración de Cuenta","Complete once — unlocks your bios and profile":"Completa una vez — desbloquea tus bios",
  "Weekly Implementation":"Implementación Semanal","Hit 5 and 5 to complete the week":"Llega a 5 y 5 para completar la semana",
  "Scripts for every DM, comment, like, and share":"Guiones para cada DM, comentario y compartido",
  "🔒 Locked":"🔒 Bloqueado","Continue Where You Left Off →":"Continuar Donde Lo Dejaste →",
  "🎯 Week Complete — Review":"🎯 Semana Completa — Revisar",
  "Week 2 Complete":"Semana 2 Completa",
  "Profile built. Intro posted. Comments done. Your Nextdoor presence is live.":"Perfil creado. Introducción publicada. Presencia en Nextdoor activa.",
};
function sp(x){ const s=useContext(LangCtx)==="es"; return s?(ES[x]||x):x; }

// ── Mock Week 1 Post ──────────────────────────────────────────────────────────
const MOCK_POST="I almost didn't start this business.\n\nAfter watching my old boss charge an elderly woman three times what a job was worth and sleep just fine that night, I walked out one afternoon and never looked back. That was the best decision I ever made.\n\nMy name is Marcus Webb. I run Webb Home Services out of East Nashville, and I have been the go-to slow drain detective in Donelson and Hermitage for going on 11 years now. Drain cleaning and water heater installs are what I do best.\n\nA few winters ago, an elderly woman called me at 7pm on Christmas Eve. Her heat had been out for two days and her three grandkids were coming in from out of town the next morning. She was in tears when I picked up. I drove 40 minutes out there, worked two hours in the cold, and only charged her for the cost of the part. She grabbed my hand on the way out and told me she was going to tell everyone she knew about me. She has sent me four referrals since that night.\n\nI will never tell someone they need a full repipe just to run up a bill when a simple repair will fix the problem just fine. Outside of work I have been slowly restoring a 1967 candy apple red Ford Bronco I found rusting in a barn two summers ago.\n\nMy go-to spot is Mas Tacos Por Favor in East Nashville. I always get the chicken taco plate and eat it standing outside on the sidewalk no matter what the weather is doing.\n\nAlso, I\'m on a mission to find the best hot chicken in Nashville. Any suggestions?";

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEF_FLAGS={postConfirmed:false,setupPath:null,introPath:null,commentPath:null,personalAccountDone:false,businessPageDone:false,customersDone:false,introPostCount:0,commentCount:0,amplifyCommentCount:0,leadsWorked:{like:0,comment:0,share:0,dm:0},jobsBooked:0};
const DEF_INPUTS={week1Post:MOCK_POST,proName:"",trade:"",city:"",businessPageLink:"",businessPageName:"",problemSolved:"",jobNotable:"",customerRelief:""};
const DEF_OUTPUTS={personalBio:"",businessStory:"",activationEmailSubject:"",activationEmailBody:""};

// ── Nav ───────────────────────────────────────────────────────────────────────
const NO_SUBS=["getpost","introposts","leads","tracker"];
const NAV=[
  {id:"getpost",    emoji:"📄", label:"Import Your Intro Post",  phases:["get_post"],                                                                   sub:{get_post:"Import Post"}},
  {id:"setup",      emoji:"⚙️", label:"Account Setup",          phases:["setup","setup_personal","setup_business","setup_business_video","setup_customers"],   sub:{setup:"Setup",setup_personal:"Personal Account",setup_business:"Business Page",setup_business_video:"Business Page",setup_customers:"Get Reviews on Nextdoor"}},
  {id:"introposts", emoji:"📣", label:"Intro Posts",    phases:["post_path","post_coach","post_video","post_personal","post_group","post_loop"],              sub:{}},
  {id:"comments",   emoji:"💬", label:"Comments",       phases:["comment_path","comment_how","comment_video","comment_coach","comment_generate"],sub:{comment_how:"How to Find Comments",comment_video:"How to Find Comments",comment_coach:"Comment Generator",comment_generate:"Comment Generator"}},
  {id:"leads",      emoji:"🔥", label:"Work Leads",     phases:["leads_main"],                                                                 sub:{leads_main:"Work Leads"}},
  {id:"amplify",    emoji:"⚡", label:"Amplify",         phases:["amplify_home","amplify_posts","amplify_post_coach","amplify_post_video","amplify_post_personal","amplify_comments","amplify_how","amplify_video","amplify_generate"],sub:{amplify_home:"Amplify",amplify_posts:"More Intro Posts",amplify_post_coach:"More Intro Posts",amplify_post_video:"More Intro Posts",amplify_post_personal:"More Intro Posts",amplify_comments:"More Comments",amplify_how:"More Comments",amplify_video:"More Comments",amplify_generate:"More Comments"}},
  {id:"tracker",    emoji:"📊", label:"Accountability Tracker", phases:["tracker_home"],sub:{}},
];

// ── Prompts ───────────────────────────────────────────────────────────────────
const ACT_PROMPT="Act as an expert local business copywriter specializing in high-conversion, community-based marketing.\n\nTASK: Generate an email template a local home service Pro can send to a hand-picked list of their top 10 best past customers. The goal is to persuade the customer to Fave their Nextdoor business page and write a Recommendation. Then generate a separate SMS version.\n\nPRE-FILLED VARIABLES (use exactly as provided, do not add or invent anything else):\nTrade, City, Business Name, and Nextdoor Link will be provided. Use only these. Do not fabricate services, prices, history, or any other claims about the business.\n\nEMAIL STRATEGIC DIRECTIVES:\n\n1. TRANSACTIONAL SUBJECT LINE: Write a subject line that looks administrative or transactional, similar to \"Account Update\" or \"Service Record,\" to guarantee a high open rate. Keep it under 6 words. No em dash or en dash.\n\n2. FLATTERY AND EXCLUSIVITY: Open by making the customer feel incredibly special. Tell them you are going through your files and hand-picking your top 10 absolute best customers, and they made the list. Make this feel genuine and personal, not like a mass email.\n\n3. THE WHY: Clearly explain why their recommendation matters. As a local business, you are trying to grow without relying on expensive corporate advertising. Nextdoor's algorithm only shows your business to other neighbors when verified homeowners like them leave recommendations. Their voice carries more weight than any ad you could run.\n\n4. THE ASK: Ask them to do exactly two things: (1) click the link to Fave the business page, and (2) write a brief recommendation. Make it sound easy and neighborly.\n\n5. THE AI SEARCH NUDGE: Include a gentle tip asking them to mention that the business is a local [City] [Trade] and to share one quick detail about the specific problem that was solved for them. Provide two or three clearly hypothetical general examples in parentheses so they understand what you mean. Do not use any specific services or details not provided in the variables.\n\n6. UNIVERSAL TEMPLATE: The email must work for all 10 customers with zero edits from the Pro. Use \"Hi there,\" as the greeting. NEVER include brackets, blanks, or placeholders like [Customer Name] or [Project]. Every word must be ready to copy and paste as-is.\n\n7. FORBIDDEN FORMATTING, CRITICAL, NO EXCEPTIONS: Never use an em dash or en dash anywhere in the email or subject line. Not once. Use commas or periods instead. Never use \"--\" or \"---\" as a signature separator or for any other purpose. This is non-negotiable.\n\n8. STRICT ANTI-HALLUCINATION, CRITICAL: Use only the provided variables. Do not invent specific services, prices, years in business, team size, awards, or any other claims. Hypothetical examples in the nudge must be clearly framed as examples, not as facts about this business.\n\n9. CLOSING: Sign off warmly using the business name only. No sign-off phrase like \"Warmly\" or \"Best regards.\"\n\nTEXT MESSAGE (separate SMS version, follow all rules below exactly):\nAct as an expert local business copywriter specializing in high-conversion, extremely succinct, community-based SMS marketing. Generate a highly persuasive, short SMS template the Pro can send to their top 10 best past customers.\n\n1. EXTREME BREVITY: As short and punchy as possible while hitting every essential trigger. Cut all unnecessary filler words. Every sentence must earn its place.\n2. OWNER-OPERATOR PERSPECTIVE, CRITICAL: Write in first-person singular only. Use \"I\" and \"my\" throughout. Never use \"we\", \"our\", or \"the team\". This is a solo owner texting a customer, not a corporation.\n3. IDENTITY FIRST WITH FIRST NAME, CRITICAL: Open by introducing yourself using your first name immediately, for example: \"Hi there, this is [Pro First Name] at [Business Name].\" Then tell them you made a list of your top 10 absolute best customers and they made the list. Express genuine gratitude.\n4. THE WHY, SUCCINCT: Explain briefly that as a local [City] [Trade], you are trying to grow without expensive corporate ads, and Nextdoor's algorithm only shows your business to neighbors when verified homeowners leave recommendations.\n5. THE ASK: Ask if they have 60 seconds to help. Instruct them to click the link to Fave the page and write a quick recommendation.\n6. AI SEARCH NUDGE: Include a short \"Quick tip\" asking them to mention you are a local [City] [Trade] and the specific problem you solved. Provide 1 to 2 very short, clearly hypothetical general examples in parentheses. Let them know it helps neighbors find you when they search.\n7. NO ENDING SIGNATURE, CRITICAL: Do not repeat the Pro Name or Business Name at the end. End simply with a warm line of gratitude, for example: \"Thanks so much. It really means the world to a small business like mine.\" Nothing after that.\n8. UNIVERSAL TEMPLATE: Must work for all 10 customers with zero edits. Never include blank brackets like [Customer Name] or any placeholder requiring editing.\n9. FORBIDDEN FORMATTING, CRITICAL, NO EXCEPTIONS: Never use an em dash or en dash anywhere. Use commas or periods instead.\n10. STRICT ANTI-HALLUCINATION, CRITICAL: Use only the provided variables. Do not invent services, prices, history, or any other claims. Examples in the nudge must be clearly hypothetical.\n11. FORMATTING FOR READABILITY: Use frequent line breaks, two hard returns between thoughts. Never output a single solid block of text. Break into short scannable stanzas, 1 to 2 sentences each.\n\nOutput exactly:\nEMAIL_SUBJECT: (transactional subject line, under 6 words, no em dash or en dash)\nEMAIL_BODY: (the email)\nTEXT: (the text message)";
const REPLY_PROMPT="You are helping a home service professional reply to a Nextdoor post using an Anti Ad strategy. Generate two reply options. Option 1 is under 120 words, diagnostic neighbor style. Option 2 is under 150 words, authority version. Each must acknowledge the neighbor naturally, include one micro diagnostic insight, one clarifying question, a subtle scarcity cue, and a low-pressure DM offer. No free estimate, no flyer tone.\n\nFORMATTING RULES, CRITICAL, NO EXCEPTIONS:\n- Use natural paragraph breaks with a blank line between paragraphs. Each paragraph should be 1-3 sentences. Never write one solid block of text.\n- NEVER use an em dash or en dash. Not once. Use a comma or period instead. Never use -- or --- either.\n- Output ONLY the reply text for each option. No commentary, no analysis, no Why This Works, no Likely Path to Booking.\n\nFormat your entire response exactly like this:\nOPTION_1:\n[reply text with paragraph breaks]\nOPTION_2:\n[reply text with paragraph breaks]";

// ── Claude ────────────────────────────────────────────────────────────────────
async function callClaude(messages,system){
  const body={model:"claude-sonnet-4-20250514",max_tokens:1500,messages};
  if(system)body.system=system;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const d=await r.json();
  return(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("")||"";
}
function stripTrailingQuestion(t){
  let r=t.trim();
  if(!r.endsWith("?"))return r;
  // Find the last sentence boundary before the question
  const NL="\n";const lastDot=Math.max(r.lastIndexOf(". "),r.lastIndexOf("! "),r.lastIndexOf("."+NL),r.lastIndexOf("!"+NL));
  return lastDot>0?r.slice(0,lastDot+1).trim():r;
}
const genBio=post=>callClaude([{role:"user",content:"Write a personal Nextdoor bio for the person who wrote this post. Max 500 chars. First-person as the individual, not the business. Include their name, trade, city, what drives them personally, and one human detail from outside of work. Sound like a neighbor introducing themselves, not a business owner marketing themselves. No sales language, no CTA, no em dashes. Do NOT end with a question. Bio only.\n\n"+post}]);
const genStory=post=>callClaude([{role:"user",content:"Write a Nextdoor Business Page Your Story section for the business described in this post. Max 500 chars. First-person as the business owner writing about their business. Include the business name, trade, city, what the business stands for, and one moment or detail that shows their values or commitment to customers. Trust-first, no ads, no sales pitch, no CTA, no em dashes. This should feel different from a personal bio -- it is about the business and its mission, not the person's hobbies or life outside work. Do NOT end with a question. Story only.\n\n"+post}]);
const genActivation=inp=>callClaude([{role:"user",content:"Pro First Name: "+(inp.proName||"").split(" ")[0]+"\nPro Full Name: "+inp.proName+"\nBusiness Name: "+inp.businessPageName+"\nTrade: "+inp.trade+"\nCity: "+inp.city+"\nNextdoor Link: "+inp.businessPageLink+"\n\nGenerate the two outreach messages."}],ACT_PROMPT);
const genReplyText=(text,trade,city)=>callClaude([{role:"user",content:"Neighbor post:\n\n\""+text+"\"\n\nI am a "+trade+" in "+city+". Generate two reply options."}],REPLY_PROMPT);
const genExtract=post=>callClaude([{role:"user",content:"From this home service business introduction post, extract:\n1. Owner full name (first and last name of the person writing the post)\n2. Trade (e.g. Plumber, HVAC Technician, Electrician)\n3. City (the city or area they serve)\n4. Business name (if mentioned)\n\nRespond ONLY with valid JSON, no markdown, no explanation:\n{\"ownerName\":\"\",\"trade\":\"\",\"city\":\"\",\"businessName\":\"\"}\n\nPost:\n"+post}]);
const genReplyImg=(b64,mime,trade,city)=>callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:mime,data:b64}},{type:"text",text:"Screenshot of a Nextdoor post. I am a "+trade+" in "+city+". Generate two reply options."}]}],REPLY_PROMPT);

// ── UI Primitives ─────────────────────────────────────────────────────────────
function Card({children,style}){return <div style={{background:WHITE,borderRadius:16,padding:28,boxShadow:"0 4px 24px rgba(0,41,66,0.08)",marginBottom:20,...style}}>{children}</div>;}
function Btn({children,onClick,variant,style,disabled}){
  const v=variant||"primary";
  const base={border:"none",borderRadius:10,minHeight:44,padding:"0 24px",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6};
  const vars={primary:{background:YELLOW,color:NAVY},secondary:{background:NAVY,color:WHITE},success:{background:GREEN,color:WHITE},ghost:{background:"transparent",color:GRAY400,border:"1.5px solid "+GRAY200}};
  return <button onClick={onClick} disabled={!!disabled} style={{...base,...vars[v]||vars.primary,opacity:disabled?0.45:1,...style}}>{children}</button>;
}
function BottomNav({onBack,onNext,nextLabel,nextDisabled,backLabel}){
  const s=useSp();
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:28,paddingTop:20,borderTop:"1px solid "+GRAY200}}>
    <Btn variant="ghost" onClick={onBack} style={{fontSize:14,minWidth:120}}>{backLabel||(s?"← Atrás":"← Back")}</Btn>
    {onNext&&<Btn onClick={onNext} disabled={nextDisabled} style={{fontSize:14,minWidth:120}}>{nextLabel||(s?"Siguiente →":"Next →")}</Btn>}
  </div>;
}
function SectionHeader({title,subtitle,emoji}){return <div style={{marginBottom:20}}><div style={{fontSize:32,marginBottom:8}}>{emoji}</div><h2 style={{fontSize:22,fontWeight:800,color:NAVY,margin:0}}>{title}</h2>{subtitle&&<p style={{color:GRAY600,margin:"8px 0 0",fontSize:14,lineHeight:1.6}}>{subtitle}</p>}</div>;}
function CheckRow({checked,onChange,label,sub}){return <div onClick={()=>onChange&&onChange(!checked)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:10,background:checked?"#F0FDF4":GRAY50,border:"1.5px solid "+(checked?GREEN:GRAY200),cursor:onChange?"pointer":"default",marginBottom:8}}><div style={{width:22,height:22,borderRadius:6,border:"2px solid "+(checked?GREEN:GRAY200),background:checked?GREEN:WHITE,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{checked&&<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}</div><div><div style={{fontWeight:700,color:checked?"#065F46":NAVY,fontSize:14}}>{label}</div>{sub&&<div style={{fontSize:12,color:GRAY400,marginTop:2}}>{sub}</div>}</div></div>;}
function CopyBox({text,label,paragraphs}){const [c,sC]=useState(false);function copy(){try{const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){}sC(true);setTimeout(()=>sC(false),2000);}function splitParas(t){return t.split("\n").reduce((acc,line)=>{if(!line.trim()){if(acc.length&&acc[acc.length-1]!=="")acc.push("");return acc;}if(acc.length&&acc[acc.length-1]!==""){acc[acc.length-1]+=" "+line;}else{acc.push(line);}return acc;},[]).filter((p,i,a)=>p!==""||!(i===0||i===a.length-1||a[i-1]===""));}return <div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:16,marginBottom:14}}>{label&&<div style={{fontSize:11,fontWeight:700,color:GRAY400,marginBottom:6,textTransform:"uppercase"}}>{label}</div>}{paragraphs?<div style={{fontSize:13,color:GRAY800,fontFamily:"inherit"}}>{splitParas(text||"").map((para,i)=><p key={i} style={{margin:i===0?"0 0 10px 0":"10px 0",lineHeight:1.8}}>{para.trim()}</p>)}</div>:<pre style={{margin:0,fontSize:13,color:GRAY800,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{text}</pre>}<div style={{marginTop:12}}><Btn onClick={copy} variant={c?"success":"primary"} style={{fontSize:13}}>{c?"✓ Copied!":"📋 Copy"}</Btn></div></div>;}
function FormField({label,hint,value,onChange,placeholder,rows,type}){return <div style={{marginBottom:16}}><label style={{display:"block",fontWeight:700,color:NAVY,fontSize:14,marginBottom:4}}>{label}</label>{hint&&<p style={{margin:"0 0 6px",fontSize:12,color:GRAY400}}>{hint}</p>}{rows>1?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+GRAY200,borderRadius:10,padding:"10px 14px",fontSize:14,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none"}}/>:<input type={type||"text"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+GRAY200,borderRadius:10,padding:"10px 14px",fontSize:14,color:GRAY800,fontFamily:"inherit",outline:"none"}}/>}</div>;}
function LoadingDots(){return <div style={{display:"flex",alignItems:"center",gap:16,padding:"12px 0",color:GRAY400,fontSize:13}}><style>{"@keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}"}</style>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:YELLOW,animation:"blink 1.2s infinite",animationDelay:i*.2+"s"}}/>)}<span>Generating...</span></div>;}
function BioBox({title,fieldName,text,loading,pasteInstruction}){const [c,sC]=useState(false);function copy(){try{const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){}sC(true);setTimeout(()=>sC(false),2000);}return <div style={{background:"#F0FDF4",border:"2px solid "+ND_GREEN,borderRadius:12,padding:16,marginBottom:16}}><div style={{fontWeight:800,color:NAVY,fontSize:14,marginBottom:4}}>{title}</div>{loading&&<LoadingDots/>}{!loading&&text&&<><pre style={{margin:"0 0 10px",fontSize:13,color:GRAY800,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit",background:WHITE,border:"1px solid "+GRAY200,borderRadius:8,padding:"10px 12px"}}>{text}</pre><div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:NAVY}}><strong>Where to paste:</strong> {pasteInstruction}</div><Btn onClick={copy} variant={c?"success":"primary"} style={{fontSize:13}}>{c?"✓ Copied!":"📋 Copy "+fieldName}</Btn></>}</div>;}

// ── Side Nav ──────────────────────────────────────────────────────────────────
function SideNav({current,onNavigate,flags}){
  const lang=useContext(LangCtx);
  const T=(x)=>lang==="es"?(ES[x]||x):x;
  const activeSec=NAV.find(s=>s.phases.includes(current));
  const done={getpost:flags.postConfirmed,setup:flags.personalAccountDone&&flags.businessPageDone&&flags.customersDone,introposts:(flags.introPostCount||0)>=5,comments:(flags.commentCount||0)>=5,leads:false};
  return (
    <div style={{width:260,flexShrink:0,background:NAVY,minHeight:"100%",padding:"24px 0",boxSizing:"border-box"}}>
      {NAV.map(s=>{
        const isA=activeSec&&activeSec.id===s.id,isDone=done[s.id],showSubs=isA&&!NO_SUBS.includes(s.id)&&!(s.id==="comments"&&current==="comment_path")&&!(s.id==="amplify"&&current==="amplify_home");
        return (
          <div key={s.id}>
            <div onClick={()=>onNavigate(s.phases[0])} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",cursor:"pointer",borderLeft:isA?"5px solid "+YELLOW:"5px solid transparent",background:isA?"rgba(255,255,255,0.08)":"transparent"}}>
              <span style={{fontSize:20,flexShrink:0,opacity:isA?1:isDone?0.9:0.5}}>{s.emoji}</span>
              <span style={{fontWeight:900,fontSize:16,color:isA?YELLOW:isDone?GREEN:WHITE,lineHeight:1.2}}>{T(s.label)}</span>
            </div>
            {showSubs&&s.phases.filter(p=>p!==s.id&&p!=="setup_business_video"&&p!=="comment_path"&&p!=="comment_video"&&p!=="comment_coach"&&p!=="amplify_home"&&p!=="amplify_how"&&p!=="amplify_video"&&p!=="amplify_generate"&&p!=="amplify_post_coach"&&p!=="amplify_post_video"&&p!=="amplify_post_personal").map((p,i)=>{
              const subPhases=s.phases.filter(ph=>ph!==s.id&&ph!=="comment_path"&&ph!=="comment_video"&&ph!=="comment_coach"&&ph!=="amplify_home"&&ph!=="amplify_how"&&ph!=="amplify_video"&&ph!=="amplify_generate"&&ph!=="amplify_post_coach"&&ph!=="amplify_post_video"&&ph!=="amplify_post_personal");
              const activeCurrent=current==="setup_business_video"?"setup_business":current==="comment_video"?"comment_how":current==="comment_coach"?"comment_generate":["amplify_how","amplify_video","amplify_generate"].includes(current)?"amplify_comments":["amplify_post_coach","amplify_post_video","amplify_post_personal"].includes(current)?"amplify_posts":current;const ci=subPhases.indexOf(activeCurrent),dp=i<ci,ap=p===activeCurrent;
              return (
                <div key={p} onClick={()=>onNavigate(p)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 20px 9px 40px",cursor:"pointer",background:ap?"rgba(254,183,5,0.15)":"transparent"}}>
                  {dp
                    ? <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:GREEN,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    : ap
                      ? <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:YELLOW,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 0 3px rgba(255,183,6,0.3)"}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:NAVY}}/>
                        </div>
                      : <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,border:"2px solid "+GRAY400,background:"transparent"}}/>
                  }
                  <span style={{fontSize:14,fontWeight:ap?800:500,color:dp?GREEN:ap?YELLOW:WHITE}}>{T(s.sub[p]||p)}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Photo Guide ───────────────────────────────────────────────────────────────
const GP=[{url:"https://i.imgur.com/F7Ur9Rf.png",l:"You with family outdoors",d:"Real moment, face visible."},{url:"https://i.imgur.com/HWxgfnO.png",l:"You with your partner",d:"Warm, approachable."},{url:"https://i.imgur.com/Cv43HJt.png",l:"Special life moment",d:"Shows who you are outside work."}];
const BP=[{url:"https://i.imgur.com/l8KAdix.png",l:"No face",d:"No face = no connection."},{url:"https://i.imgur.com/vCVlGIm.png",l:"Logo",d:"Looks like an ad."},{url:"https://i.imgur.com/7rvGL6O.png",l:"No people",d:"Nothing to connect with."}];
function PhotoGuide(){return <>
  <div style={{fontWeight:700,color:GREEN,fontSize:13,marginBottom:8}}>✅ GOOD:</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>{GP.map((g,i)=><div key={i} style={{border:"2.5px solid #86EFAC",borderRadius:10,overflow:"hidden"}}><div style={{position:"relative",paddingBottom:"75%",background:GRAY100}}><img src={g.url} alt={g.l} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",top:4,left:4,background:GREEN,color:WHITE,borderRadius:99,padding:"1px 6px",fontSize:9,fontWeight:800}}>✓</div></div><div style={{padding:"6px 8px",background:"#F0FDF4"}}><div style={{fontWeight:700,color:"#166534",fontSize:11}}>{g.l}</div><div style={{fontSize:10,color:"#166534"}}>{g.d}</div></div></div>)}</div>
  <div style={{fontWeight:700,color:RED,fontSize:13,marginBottom:8}}>❌ AVOID:</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{BP.map((b,i)=><div key={i} style={{border:"2.5px solid #FCA5A5",borderRadius:10,overflow:"hidden"}}><div style={{position:"relative",paddingBottom:"75%",background:GRAY100}}><img src={b.url} alt={b.l} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",top:4,left:4,background:RED,color:WHITE,borderRadius:99,padding:"1px 6px",fontSize:9,fontWeight:800}}>✗</div></div><div style={{padding:"6px 8px",background:"#FEF2F2"}}><div style={{fontWeight:700,color:"#991B1B",fontSize:11}}>{b.l}</div><div style={{fontSize:10,color:"#991B1B"}}>{b.d}</div></div></div>)}</div>
</>;}

// ── Stepper shell ─────────────────────────────────────────────────────────────
function Stepper({titleEmoji,title,subtitle,steps,onDone,onBack,outputs,bioLoading}){
  const s=useSp();
  const [idx,setIdx]=useState(0);
  const cur=steps[idx],isLast=idx===steps.length-1;
  const pct=Math.round((idx/steps.length)*100);
  const nextDisabled=isLast&&((cur.showBio&&!outputs.personalBio)||(cur.showStory&&!outputs.businessStory));
  return <div>
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:4}}>
        <span style={{fontWeight:700,color:NAVY}}>{titleEmoji} {title}</span>
        <span>{idx} {s?"de":"of"} {steps.length} {s?"hecho":"done"}</span>
      </div>
      <div style={{background:GRAY200,borderRadius:99,height:6}}><div style={{background:YELLOW,borderRadius:99,height:6,width:Math.max(2,pct)+"%",transition:"width 0.4s"}}/></div>
    </div>
    <Card style={{minHeight:360}}>
      {(cur.showBio||cur.showStory||cur.showPhoto)&&<div style={{borderLeft:"4px solid "+YELLOW,background:GRAY50,borderRadius:"0 10px 10px 0",padding:"10px 14px 10px 16px",marginBottom:20}}><p style={{margin:0,fontSize:13,color:GRAY600,fontStyle:"italic",lineHeight:1.6}}>💡 {cur.why}</p></div>}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{background:NAVY,color:YELLOW,borderRadius:6,padding:"2px 10px",fontSize:12,fontWeight:700}}>{s?"Paso":"Step"} {idx+1}</span>
        <span style={{fontWeight:800,color:NAVY,fontSize:17}}>{cur.label}</span>
      </div>
      <p style={{fontSize:13,color:GRAY600,margin:"0 0 18px",lineHeight:1.7}}>{cur.instruction}</p>
      <div style={{background:GRAY100,border:"2px dashed "+GRAY200,borderRadius:12,padding:"28px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:16}}>
        <span style={{fontSize:36}}>📸</span>
        <span style={{fontSize:12,color:GRAY400,fontStyle:"italic",textAlign:"center"}}>{cur.img}</span>
      </div>
      {cur.showPhoto&&<PhotoGuide/>}
      {cur.showBio&&<BioBox title={s?"Bio de Perfil Personal — Lista para Pegar":"Personal Profile Bio — Ready to Paste"} fieldName="Bio" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Perfil, desplázate a Bio y pégalo.":"Tap Edit Profile, scroll to Bio, and paste this in."}/>}
      {cur.showStory&&<BioBox title={s?"Tu Historia — Lista para Pegar":"Business Page Your Story — Ready to Paste"} fieldName="Your Story" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Página, desplázate a Tu Historia y pégalo.":"Tap Edit Page, scroll to Your Story, and paste this in."}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:28,paddingTop:20,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="primary" onClick={idx===0?onBack:()=>setIdx(i=>i-1)} style={{minWidth:120,fontSize:14}}>{s?"← Atrás":"← Back"}</Btn>
        <span style={{fontSize:13,color:GRAY400,fontWeight:600}}>{idx+1} / {steps.length}</span>
        <Btn onClick={isLast?onDone:()=>setIdx(i=>i+1)} disabled={nextDisabled} style={{minWidth:120,fontSize:14}}>{s?"Siguiente →":"Next →"}</Btn>
      </div>
    </Card>
  </div>;
}

// ── GET YOUR POST ─────────────────────────────────────────────────────────────
function GetPost({inputs,setInputs,setFlag,onNext}){
  const s=useSp();
  const [mode,setMode]=useState(null);
  const [pasted,setPasted]=useState(inputs.week1Post===MOCK_POST?"":inputs.week1Post||"");
  const [confirmed,setConfirmed]=useState(false);
  const canConfirm=pasted.trim().length>50;
  function confirm(){setInputs(p=>({...p,week1Post:pasted}));setFlag("postConfirmed",true);setConfirmed(true);}
  function selectMode(m){if(!confirmed){setMode(m);}}
  return <div>
    <SectionHeader emoji="📄" title={s?"Obtén Tu Publicación de Introducción":"Get Your Intro Post"} subtitle={s?"Ya hiciste el trabajo duro en la Semana 1. Aquí vamos a reutilizar tu publicación de Facebook para construir tu presencia en Nextdoor — tu bio, tu historia y tu publicación de introducción, todo de una vez.":"You already did the hard work in Week 1. Here we reuse your Facebook post to build your entire Nextdoor presence — your bio, your story, and your intro post, all at once."}/>

    {/* Side-by-side option cards */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>

      {/* Option A: Auto-Import (Recommended) */}
      <div onClick={()=>selectMode("auto")} style={{borderRadius:14,border:"2px solid "+(mode==="auto"?NAVY:GRAY200),background:mode==="auto"?NAVY:WHITE,cursor:"pointer",padding:20,display:"flex",flexDirection:"column",gap:10,position:"relative",transition:"all 0.2s"}}>
        <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:ND_GREEN,color:WHITE,borderRadius:99,padding:"2px 12px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>{s?"⭐ Recomendado":"⭐ Recommended"}</div>
        <div style={{fontSize:32,textAlign:"center",marginTop:8}}>⚡</div>
        <div style={{fontWeight:800,fontSize:15,color:mode==="auto"?YELLOW:NAVY,textAlign:"center"}}>{s?"Auto-importar desde Semana 1":"Auto-Import from Week 1"}</div>
        <div style={{fontSize:12,color:mode==="auto"?GRAY200:GRAY600,textAlign:"center",lineHeight:1.5}}>{s?"Tu publicación se importa automáticamente desde la Semana 1.":"Your post pulls over automatically from Week 1."}</div>
        <div style={{background:mode==="auto"?"rgba(255,255,255,0.1)":"#FEF9EC",borderRadius:8,padding:"6px 10px",textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:mode==="auto"?GRAY200:"#92400E"}}>{s?"Próximamente":"Coming Soon"}</span></div>
        {mode==="auto"&&<div style={{position:"absolute",top:10,right:10,width:22,height:22,borderRadius:"50%",background:YELLOW,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
      </div>

      {/* Option B: Paste */}
      <div onClick={()=>selectMode("paste")} style={{borderRadius:14,border:"2px solid "+(confirmed?GREEN:mode==="paste"?NAVY:GRAY200),background:confirmed?GREEN:mode==="paste"?NAVY:WHITE,cursor:"pointer",padding:20,display:"flex",flexDirection:"column",gap:10,position:"relative",transition:"all 0.2s"}}>
        <div style={{fontSize:32,textAlign:"center",marginTop:8}}>📋</div>
        <div style={{fontWeight:800,fontSize:15,color:confirmed?WHITE:mode==="paste"?YELLOW:NAVY,textAlign:"center"}}>{s?"Pegar desde Facebook":"Paste from Facebook"}</div>
        <div style={{fontSize:12,color:confirmed||mode==="paste"?GRAY200:GRAY600,textAlign:"center",lineHeight:1.5}}>{s?"Copia tu publicación de la Semana 1 de Facebook y pégala aquí.":"Copy your Week 1 post from Facebook and paste it in."}</div>
        {confirmed&&<div style={{textAlign:"center",fontWeight:700,color:WHITE,fontSize:13}}>✓ {s?"Publicación confirmada":"Post confirmed"}</div>}
        {(mode==="paste"||confirmed)&&<div style={{position:"absolute",top:10,right:10,width:22,height:22,borderRadius:"50%",background:confirmed?WHITE:YELLOW,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
      </div>
    </div>

    {/* Auto-import selected: coming soon message */}
    {mode==="auto"&&<Card style={{border:"2px solid "+NAVY}}>
      <div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{fontSize:40,marginBottom:10}}>🔗</div>
        <h3 style={{color:NAVY,fontWeight:800,fontSize:16,margin:"0 0 8px"}}>{s?"Conexión automática próximamente":"Automatic connection coming soon"}</h3>
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 16px",lineHeight:1.6}}>{s?"Una vez conectadas la Semana 1 y 2, tu publicación se importará automáticamente. Por ahora, usa la opción Pegar desde Facebook.":"Once Week 1 and Week 2 are connected, your post will pull over automatically. For now, switch to the Paste from Facebook option."}</p>
        <Btn onClick={()=>setMode("paste")} variant="secondary">{s?"Usar opción de pegar →":"Use paste option instead →"}</Btn>
      </div>
    </Card>}

    {/* Paste selected: text area */}
    {mode==="paste"&&<Card style={{border:"2px solid "+NAVY}}>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:NAVY}}><strong>{s?"Dónde encontrarla:":"Where to find it:"}</strong> {s?"Abre Facebook → tu perfil → encuentra la publicación → tres puntos → Copiar texto.":"Open Facebook → your profile or the group → find the post → tap three dots → Copy text."}</div>
      <textarea value={pasted} onChange={e=>setPasted(e.target.value)} placeholder={s?"Pega tu publicación completa aquí...":"Paste your full Facebook post here..."} rows={10} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+(canConfirm?NAVY:GRAY200),borderRadius:10,padding:"12px 14px",fontSize:13,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none",marginBottom:10}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:12,color:canConfirm?ND_GREEN:GRAY400,fontWeight:600}}>{pasted.trim().split(" ").filter(Boolean).length} {s?"palabras":"words"}{canConfirm?(s?" — lista":" — looks good"):""}</span>
      </div>
    </Card>}

    <BottomNav onBack={()=>onNext("home")} backLabel={s?"← Atrás":"← Back"} onNext={()=>{setInputs(p=>({...p,week1Post:pasted}));setFlag("postConfirmed",true);onNext("setup");}} nextLabel={s?"Siguiente →":"Next →"} nextDisabled={!canConfirm}/>
  </div>;
}

// ── SETUP PATH ────────────────────────────────────────────────────────────────
function SetupPath({setFlag,onNext,onSelect,s}){
  const [hovered,setHovered]=useState(null);
  function choose(m){
    if(onSelect){onSelect(m);return;}
    setFlag("setupPath",m);
    if(m==="coach"){onNext("setup_personal");}
    else{onNext("setup_personal");}
  }
  return <div>
    <SectionHeader emoji="⚙️" title={s?"Configuración de Cuenta":"Account Setup"} subtitle={s?"Elige la opción que mejor funcione para ti":"Pick which option works best for you"}/>
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      {[{n:1,l:"Personal Account"},{n:2,l:"Business Page"},{n:3,l:"Get Reviews on Nextdoor"}].map((st,i)=><div key={i} style={{flex:1,background:GRAY50,borderRadius:10,padding:"8px 12px",textAlign:"center",border:"1.5px solid "+GRAY200}}><div style={{fontSize:11,fontWeight:700,color:NAVY}}>{"Step "+st.n}</div><div style={{fontSize:11,color:GRAY600,marginTop:2}}>{st.l}</div></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
      {SETUP_OPTIONS.map(opt=>{
        const isH=hovered===opt.id;
        const isDisabled=opt.comingSoon;
        return <div key={opt.id} onClick={!isDisabled?()=>choose(opt.id):undefined} onMouseEnter={()=>!isDisabled&&setHovered(opt.id)} onMouseLeave={()=>setHovered(null)}
          style={{borderRadius:14,border:"2px solid "+(opt.recommended?(isH?YELLOW:YELLOW):isH?NAVY:GRAY200),background:isH?NAVY:opt.recommended?"#FFFBEB":WHITE,cursor:isDisabled?"default":"pointer",padding:"22px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,textAlign:"center",transition:"all 0.18s",opacity:isDisabled?0.55:1,position:"relative"}}>
          {opt.recommended&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:YELLOW,color:NAVY,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>{"⭐ Recommended"}</div>}
          {opt.comingSoon&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:GRAY400,color:WHITE,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{"Coming Soon"}</div>}
          <div style={{fontSize:32,marginTop:opt.recommended||opt.comingSoon?8:0}}>{opt.emoji}</div>
          <div style={{fontWeight:800,fontSize:14,color:isH?YELLOW:opt.recommended?NAVY:NAVY,lineHeight:1.3}}>{s?opt.labelEs:opt.label}</div>
          <div style={{fontSize:12,color:isH?GRAY200:GRAY600,lineHeight:1.5}}>{s?opt.subEs:opt.sub}</div>
        </div>;
      })}
    </div>
  </div>;
}

// ── SETUP OPTION PICKER ───────────────────────────────────────────────────────
const SETUP_OPTIONS=[
  {id:"coach",  emoji:"🎙️", label:"Follow Your Business Coach",      labelEs:"Seguir con el Business Coach",      sub:"Join the live session and set up with your Business Coach.",           subEs:"Únete a la sesión en vivo y configura junto a tu Business Coach.", recommended:true},
  {id:"video",  emoji:"▶️",  label:"Watch the How-To Video",       labelEs:"Ver el Video Tutorial",     sub:"Watch a step-by-step video walkthrough at your own pace.",      subEs:"Mira el tutorial en video a tu propio ritmo."},
  {id:"steps",  emoji:"📋",  label:"Step-by-Step Walkthrough",     labelEs:"Guía Paso a Paso",          sub:"Follow annotated instructions with copy-paste bios built in.",  subEs:"Sigue instrucciones con bios listos para copiar y pegar."},
];

function SetupOptionPicker({titleEmoji,title,titleEs,onSelect,s}){
  const [hovered,setHovered]=useState(null);
  return <div>
    <SectionHeader emoji={titleEmoji} title={s?titleEs:title} subtitle={s?"Elige la opción que mejor funcione":"Pick which option works best"}/>
    <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
      {SETUP_OPTIONS.map((opt,i)=>{
        const isH=hovered===opt.id;
        return <div key={opt.id} onClick={()=>onSelect(opt.id)} onMouseEnter={()=>setHovered(opt.id)} onMouseLeave={()=>setHovered(null)}
          style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",borderRadius:14,border:"2px solid "+(isH?NAVY:GRAY200),background:isH?NAVY:WHITE,cursor:"pointer",transition:"all 0.18s"}}>
          <div style={{width:48,height:48,borderRadius:12,background:isH?"rgba(254,183,5,0.15)":GRAY50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{opt.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15,color:isH?YELLOW:NAVY,marginBottom:3}}>{s?opt.labelEs:opt.label}</div>
            <div style={{fontSize:13,color:isH?GRAY200:GRAY600,lineHeight:1.5}}>{s?opt.subEs:opt.sub}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isH?YELLOW:GRAY400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>;
      })}
    </div>
  </div>;
}

// ── VIDEO PLAYER PLACEHOLDER ──────────────────────────────────────────────────
function VideoPlaceholder({title,titleEs,videoUrl,s,onNext,onBack,backLabel}){
  // videoUrl: pass a real embed URL (YouTube /embed/ID, Vimeo, etc.) when ready
  return <div>
    <Card>
      <h2 style={{color:NAVY,fontWeight:900,fontSize:20,margin:"0 0 6px"}}>{s?titleEs:title}</h2>
      <p style={{color:GRAY600,fontSize:13,margin:"0 0 20px",lineHeight:1.6}}>{s?"Mira el video completo, luego haz clic en Siguiente para continuar.":"Watch the full video, then click Next to continue."}</p>
      {videoUrl
        ? <div style={{position:"relative",paddingBottom:"56.25%",borderRadius:12,overflow:"hidden",background:"#000",marginBottom:8}}>
            <iframe src={videoUrl} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}/>
          </div>
        : <div style={{borderRadius:12,overflow:"hidden",background:NAVY,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,marginBottom:8}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(254,183,5,0.15)",border:"2px solid "+YELLOW,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill={YELLOW}><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{color:WHITE,fontWeight:800,fontSize:15,marginBottom:4}}>{s?"Video próximamente":"Video coming soon"}</div>
              <div style={{color:GRAY400,fontSize:13}}>{s?"Este espacio está listo para el video de configuración.":"This space is ready for the setup video."}</div>
            </div>
          </div>
      }
    </Card>
    <BottomNav onBack={onBack} backLabel={backLabel||"← Back"} onNext={onNext} nextLabel={s?"Siguiente →":"Next →"}/>
  </div>;
}

// ── SETUP PERSONAL ────────────────────────────────────────────────────────────
// ── SETUP PERSONAL COACH ─────────────────────────────────────────────────────
function SetupPersonalCoach({flags,setFlag,outputs,setOutputs,inputs,onNext,onBack}){
  const s=useSp();
  const [bioLoading,setBioLoading]=useState(true);

  useEffect(()=>{
    if(inputs.week1Post){
      setBioLoading(true);
      genBio(inputs.week1Post).then(b=>setOutputs(p=>({...p,personalBio:stripTrailingQuestion(b)}))).catch(()=>{}).finally(()=>setBioLoading(false));
    } else {
      setBioLoading(false);
    }
  },[]);

  return <div>
    <SectionHeader emoji="👤" title={s?"Cuenta Personal — Bio":"Personal Account — Bio"} subtitle=""/>
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On Nextdoor, click your profile photo → Edit Profile → scroll to Bio → paste this in. Max 500 characters."}
      </div>
      <BioBox
        title={s?"Tu Bio Personal — Lista para Pegar":"Personal Bio — Ready to Paste"}
        fieldName="Bio"
        text={outputs.personalBio}
        loading={bioLoading}
        pasteInstruction={s?"Toca Editar Perfil, desplázate a Bio y pégalo.":"Click Edit Profile, scroll to Bio, and paste this in."}
      />
    </Card>
    <BottomNav
      onBack={()=>onBack("setup")}
      onNext={()=>{setFlag("personalAccountDone",true);onNext("setup_business");}}
      nextDisabled={bioLoading||!outputs.personalBio}
    />
  </div>;
}

// ── SETUP BUSINESS COACH ──────────────────────────────────────────────────────
function SetupBusinessCoach({flags,setFlag,outputs,setOutputs,inputs,onNext,onBack}){
  const s=useSp();
  const [storyLoading,setStoryLoading]=useState(true);

  useEffect(()=>{
    if(inputs.week1Post){
      setStoryLoading(true);
      genStory(inputs.week1Post).then(t=>setOutputs(p=>({...p,businessStory:stripTrailingQuestion(t)}))).catch(()=>{}).finally(()=>setStoryLoading(false));
    } else {
      setStoryLoading(false);
    }
  },[]);

  return <div>
    <SectionHeader emoji="🏢" title={s?"Página de Negocio — Tu Historia":"Business Page — Your Story"} subtitle=""/>
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On your Nextdoor Business Page, click Edit Page → scroll to Your Story → Describe your page → paste this in. Max 500 characters."}
      </div>
      <BioBox
        title={s?"Tu Historia — Lista para Pegar":"Your Story — Ready to Paste"}
        fieldName="Your Story"
        text={outputs.businessStory}
        loading={storyLoading}
        pasteInstruction={s?"Toca Editar Página, desplázate a Tu Historia y pégalo.":"Click Edit Page, scroll to Your Story, and paste this in."}
      />
    </Card>
    <BottomNav
      onBack={()=>onBack("setup_personal")}
      onNext={()=>{setFlag("businessPageDone",true);onNext("setup_customers");}}
      nextDisabled={storyLoading||!outputs.businessStory}
    />
  </div>;
}

function SetupPersonal({flags,setFlag,outputs,setOutputs,inputs,onNext,onBack}){
  const s=useSp();
  const mode=flags.setupPath;
  const [bioLoading,setBioLoading]=useState(false);

  // Pre-generate bio for step-by-step path
  useEffect(()=>{if(mode==="steps"&&inputs.week1Post&&!outputs.personalBio){setBioLoading(true);genBio(inputs.week1Post).then(b=>setOutputs(p=>({...p,personalBio:stripTrailingQuestion(b)}))).catch(()=>{}).finally(()=>setBioLoading(false));}},[mode]);

  useEffect(()=>{if(!mode)onNext("setup");},[mode]);
  if(!mode){return null;}

  if(mode==="video") return <div>
    <VideoPlaceholder
      title="Personal Account Setup — Video Walkthrough"
      titleEs="Configuración de Cuenta — Video Tutorial"
      videoUrl={null}
      s={s}
      onBack={()=>{setFlag("setupPath",null);}}
      backLabel={s?"← Atrás":"← Back"}
      onNext={()=>{setFlag("personalAccountDone",true);onNext("setup_business_video");}}
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On Nextdoor, click your profile photo → Edit Profile → scroll to Bio → paste this in."}
      </div>
      <BioBox title={s?"Tu Bio Personal — Lista para Pegar":"Personal Bio — Ready to Paste"} fieldName="Bio" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Perfil, desplázate a Bio y pégalo.":"Click Edit Profile, scroll to Bio, and paste this in."}/>
    </Card>
  </div>;

  // mode === "steps"
  const steps=s?[
    {label:"Inicia sesión en Nextdoor",why:"Harás todo desde nextdoor.com — no necesitas la app durante esta sesión.",instruction:"Abre nextdoor.com en tu navegador e inicia sesión o crea tu cuenta.",img:"Captura: inicio de sesión de Nextdoor — próximamente"},
    {label:"Crea tu cuenta con tu nombre real",why:"Tu nombre completo es la primera señal de confianza.",instruction:"Toca Registrarse e ingresa tu nombre y apellido exactamente como quieres que los vecinos te vean.",img:"Captura: pantalla de registro — próximamente"},
    {label:"Establece tu vecindario y verifica tu dirección",why:"Sin verificación de dirección, tus publicaciones no llegarán a vecinos cercanos.",instruction:"Ingresa tu dirección y sigue los pasos de verificación en pantalla.",img:"Captura: verificación de dirección — próximamente"},
    {label:"Agrega una foto real de tu cara",why:"Una foto clara de tu cara es la señal de confianza más importante en Nextdoor.",instruction:"Haz clic en tu ícono de perfil, haz clic en Editar Perfil, luego haz clic en tu foto para reemplazarla.",img:"Captura: editar foto de perfil — próximamente",showPhoto:true},
    {label:"Pega tu bio de Sobre Mí",why:"Tu bio ya está escrita de tu historia de la Semana 1 — solo cópiala y pégala.",instruction:"Haz clic en Editar Perfil, desplázate al campo Bio o Sobre Mí, copia el texto abajo y pégalo.",img:"Captura: campo Bio — próximamente",showBio:true},
  ]:[
    {label:"Sign in to Nextdoor",why:"You'll do everything from nextdoor.com — no app needed during this session.",instruction:"Open nextdoor.com in your browser and sign in or create your account.",img:"Screenshot: Nextdoor sign in — coming soon"},
    {label:"Create your account using your real name",why:"Your full name is the first trust signal.",instruction:"Tap Sign Up and enter your first and last name exactly as you want neighbors to see it.",img:"Screenshot: Sign up screen — coming soon"},
    {label:"Set your neighborhood and verify your address",why:"Without verification your posts won't reach nearby neighbors.",instruction:"Enter your address and follow the on-screen verification steps.",img:"Screenshot: Address verification — coming soon"},
    {label:"Add your real face photo",why:"A clear photo of your face is the biggest trust signal on Nextdoor.",instruction:"Click your profile icon, click Edit Profile, then click your photo to replace it.",img:"Screenshot: Edit profile photo — coming soon",showPhoto:true},
    {label:"Paste your About Me bio",why:"Your bio is already written from your Week 1 story — just copy and paste.",instruction:"Click Edit Profile, scroll to the Bio field, copy the text below, and paste it in.",img:"Screenshot: Bio field — coming soon",showBio:true},
  ];
  return <Stepper titleEmoji="👤" title={s?"Configuración de Cuenta Personal":"Personal Account Setup"} subtitle="" steps={steps} outputs={outputs} bioLoading={bioLoading} onDone={()=>{setFlag("personalAccountDone",true);onNext("setup_business");}} onBack={()=>setFlag("setupPath",null)}/>;
}

// ── SETUP BUSINESS ────────────────────────────────────────────────────────────
function SetupBusiness({flags,setFlag,outputs,setOutputs,inputs,onNext,onBack}){
  const s=useSp();
  const mode=flags.setupPath;
  const [bioLoading,setBioLoading]=useState(false);

  useEffect(()=>{if(mode==="steps"&&inputs.week1Post&&!outputs.businessStory){setBioLoading(true);genStory(inputs.week1Post).then(t=>setOutputs(p=>({...p,businessStory:stripTrailingQuestion(t)}))).catch(()=>{}).finally(()=>setBioLoading(false));}},[mode]);

  useEffect(()=>{if(!mode)onNext("setup");},[mode]);
  if(!mode){return null;}

  if(mode==="video") return <div>
    <VideoPlaceholder
      title="Business Page Setup — Video Walkthrough"
      titleEs="Página de Negocio — Video Tutorial"
      videoUrl={null}
      s={s}
      onBack={()=>onBack("setup_personal")}
      backLabel={s?"← Atrás":"← Back"}
      onNext={()=>{setFlag("businessPageDone",true);onNext("setup_customers");}}
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On your Nextdoor Business Page, click Edit Page → scroll to Your Story → paste this in."}
      </div>
      <BioBox title={s?"Tu Historia — Lista para Pegar":"Your Story — Ready to Paste"} fieldName="Your Story" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Página, desplázate a Tu Historia y pégalo.":"Click Edit Page, scroll to Your Story, and paste this in."}/>
    </Card>
  </div>;

  // mode === "steps"
  const steps=s?[
    {label:"Ve a nextdoor.com/pages",why:"Reclamar una página existente es más rápido y conserva cualquier mención de vecinos.",instruction:"Abre nextdoor.com/pages. Busca el nombre de tu negocio. Toca Reclamar si aparece, o Crear una Página de Negocio.",img:"Captura: búsqueda de Páginas — próximamente"},
    {label:"Selecciona la categoría de tu negocio",why:"La categoría correcta significa que los vecinos que buscan tu oficio te encontrarán.",instruction:"Elige la categoría más específica disponible — Plomero, Técnico HVAC, Electricista, etc.",img:"Captura: selector de categoría — próximamente"},
    {label:"Agrega tu área de servicio",why:"Los vecinos deciden en segundos si trabajas en su calle.",instruction:"Lista los vecindarios y ciudades específicos donde trabajas.",img:"Captura: campo de área de servicio — próximamente"},
    {label:"Sube una foto de negocio",why:"Una foto real en el trabajo le dice al vecino inmediatamente qué haces.",instruction:"Agrega una foto clara de ti en un proyecto. Sin logos ni fotos de stock.",img:"Captura: subida de foto — próximamente"},
    {label:"Agrega tu información de contacto",why:"Si falta tu número, un vecino que quiere contratarte no puede contactarte.",instruction:"Ingresa tu número de teléfono y sitio web.",img:"Captura: campos de contacto — próximamente"},
    {label:"Pega Tu Historia",why:"Tu historia ya está escrita de tu publicación de la Semana 1. Cópiala y pégala.",instruction:"Encuentra la sección Tu Historia en la pantalla de edición y pega el texto generado abajo.",img:"Captura: campo Tu Historia — próximamente",showStory:true},
  ]:[
    {label:"Go to nextdoor.com/pages",why:"Claiming an existing page keeps any neighbor mentions already there.",instruction:"Open nextdoor.com/pages. Search your business name. Tap Claim It or Create a Business Page.",img:"Screenshot: Pages search — coming soon"},
    {label:"Select your business category",why:"The right category means neighbors searching your trade will find you.",instruction:"Choose the most specific category — Plumber, HVAC Technician, Electrician, etc.",img:"Screenshot: Category selector — coming soon"},
    {label:"Add your service area",why:"Neighbors decide in seconds whether you serve their street.",instruction:"List the specific neighborhoods and cities you work in.",img:"Screenshot: Service area field — coming soon"},
    {label:"Upload a business photo",why:"A real job photo tells a neighbor what you do instantly.",instruction:"Add a clear photo of you on a job site. No logos or stock photos.",img:"Screenshot: Business photo upload — coming soon"},
    {label:"Add your contact info",why:"If your phone number is missing a neighbor who wants to hire you can't reach you.",instruction:"Enter your phone number and website.",img:"Screenshot: Contact info fields — coming soon"},
    {label:"Paste your Your Story",why:"Your story is already written from your Week 1 post. Copy and paste it.",instruction:"Find the Your Story section on your business page and paste the generated text below.",img:"Screenshot: Your Story field — coming soon",showStory:true},
  ];
  return <Stepper titleEmoji="🏢" title={s?"Configuración de Página de Negocio":"Business Page Setup"} subtitle="" steps={steps} outputs={outputs} bioLoading={bioLoading} onDone={()=>{setFlag("businessPageDone",true);onNext("setup_customers");}} onBack={()=>onBack("setup_personal")}/>;
}

// ── FIELD STEP (one-at-a-time question card) ─────────────────────────────────
function FieldStep({cur,step,inputs,si,s,onBack,onNext}){
  const [showEx,setShowEx]=useState(false);
  const val=(inputs[cur.key]||"").trim();
  const canNext=!!val;
  return <Card style={{minHeight:200}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
      <span style={{background:NAVY,color:YELLOW,borderRadius:8,padding:"4px 12px",fontSize:14,fontWeight:900,flexShrink:0}}>Q{step+1}</span>
      <span style={{fontWeight:800,color:NAVY,fontSize:17,lineHeight:1.3}}>{cur.label}</span>
    </div>
    {cur.hint&&<p style={{fontSize:13,color:GRAY600,margin:"0 0 14px",lineHeight:1.6}}>{cur.hint}</p>}
    {cur.examples&&<div style={{marginBottom:14}}>
      <button onClick={()=>setShowEx(v=>!v)} style={{display:"inline-flex",alignItems:"center",gap:6,background:GRAY50,border:"1.5px dashed "+YELLOW,borderRadius:8,padding:"8px 16px",fontSize:13,color:NAVY,cursor:"pointer",fontWeight:700}}>
        💡 {showEx?(s?"Ocultar inspiración":"Hide inspiration"):(s?"¿Necesitas inspiración?":"Need inspiration?")}
      </button>
      {showEx&&<div style={{marginTop:10,background:"#FFFBEB",border:"1.5px solid "+YELLOW,borderRadius:10,padding:"14px 16px"}}>
        <div style={{fontSize:11,fontWeight:800,color:GRAY400,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>{s?"Ejemplos — úsalos solo como guía":"Example answers — use as a guide only"}</div>
        {cur.examples.map((ex,i)=><p key={i} style={{fontSize:13,color:GRAY800,fontStyle:"italic",margin:"0 0 8px",lineHeight:1.6}}>{ex}</p>)}
        {cur.showGuidesNote&&<p style={{fontSize:11,color:GRAY400,margin:"6px 0 0",fontStyle:"italic"}}>{s?"Son guías — escribe tu propia versión real.":"These are guides only — write your own real version."}</p>}

      </div>}
    </div>}
    <FormField label="" value={inputs[cur.key]||""} onChange={v=>si(cur.key,v)} placeholder={cur.placeholder} rows={cur.rows} type={cur.type}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
      <Btn variant="ghost" onClick={onBack} style={{minWidth:110,fontSize:14}}>{s?"← Atrás":"← Back"}</Btn>
      <Btn onClick={onNext} disabled={!canNext} style={{minWidth:110,fontSize:14}}>{s?"Siguiente →":"Next →"}</Btn>
    </div>
  </Card>;
}

// ── SETUP CUSTOMERS ───────────────────────────────────────────────────────────
function SetupCustomers({flags,setFlag,inputs,setInputs,outputs,setOutputs,onNext,onBack}){
  const s=useSp();
  const [step,setStep]=useState(0);
  const [extracting,setExtracting]=useState(false);
  const [gen,setGen]=useState(false);const [err,setErr]=useState("");const [textMsg,setTextMsg]=useState("");
  const [subj,setSubj]=useState(outputs.activationEmailSubject||"");
  const [body,setBody]=useState(outputs.activationEmailBody||"");
  const [cnt,setCnt]=useState(0);const [cv,sCv]=useState("");const [mode,setMode]=useState(null);
  const si=(k,v)=>setInputs(p=>({...p,[k]:v}));

  // Auto-extract trade/city/business from post on first render if fields are empty
  useEffect(()=>{
    if(inputs.week1Post&&(!inputs.trade||!inputs.city)){
      setExtracting(true);
      genExtract(inputs.week1Post).then(raw=>{
        try{
          const BT=String.fromCharCode(96);const clean=raw.split(BT+BT+BT+"json").join("").split(BT+BT+BT).join("").trim();
          const parsed=JSON.parse(clean);
          setInputs(p=>({...p,
            proName:p.proName||parsed.ownerName||"",
            trade:p.trade||parsed.trade||"",
            city:p.city||parsed.city||"",
            businessPageName:p.businessPageName||parsed.businessName||"",
          }));
        }catch(e){}
      }).catch(()=>{}).finally(()=>setExtracting(false));
    }
  },[]);

  const ok=["proName","trade","city","businessPageLink","businessPageName"].every(k=>(inputs[k]||"").trim().length>0);
  async function doGen(){setGen(true);setErr("");try{const raw=await genActivation(inputs);const smIdx=raw.indexOf("EMAIL_SUBJECT:");const bmIdx=raw.indexOf("EMAIL_BODY:");const tmIdx=raw.indexOf("TEXT:");const sj=smIdx>=0?raw.slice(smIdx+14,raw.indexOf("\n",smIdx)).trim():"Quick favor from [Business Name]";const b=bmIdx>=0?(tmIdx>bmIdx?raw.slice(bmIdx+11,tmIdx):raw.slice(bmIdx+11)).trim():raw.trim();const t=tmIdx>=0?raw.slice(tmIdx+5).trim():"";setSubj(sj);setBody(b);setTextMsg(t);setOutputs(p=>({...p,activationEmailSubject:sj,activationEmailBody:b}));}catch(e){setErr(s?"No se pudo generar. Verifica tu conexión.":"Could not generate. Check your connection.");}setGen(false);}
  const mailto="mailto:?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);

  // Steps definition
  const STEPS=[
    {key:"proName", label:s?"¿Cuál es tu nombre y apellido?":"What is your first and last name?",
     hint:s?"Escríbelo exactamente como quieres que aparezca públicamente.":"Write it exactly how you want it shown publicly.",
     placeholder:"e.g. Marcus Webb", rows:1,
     examples:['"Maria Rodriguez"','"James T. Mitchell"','"Sarah Chen-Williams"'],
     showGuidesNote:true},
    {key:"trade",      label:s?"¿Cuál es tu oficio?":"What is your trade?",
     hint:"",
     placeholder:"e.g. Plumber, HVAC Technician, Electrician", rows:1,
     examples:["Plumber","HVAC Technician","Electrician","Roofer","Landscaper","Handyman","Pest Control Technician"]},
    {key:"city",       label:s?"¿Qué ciudad o vecindario atiendes?":"What city or neighborhood do you serve?",
     hint:"",
     placeholder:"e.g. Naperville, East Nashville, Scottsdale", rows:1,
     examples:["East Nashville, TN","Naperville, IL","Scottsdale, AZ and surrounding areas including Tempe and Mesa"]},
    {key:"businessPageName", label:s?"¿Cuál es el nombre de tu negocio en Nextdoor?":"What is your business name on Nextdoor?",
     hint:s?"Escríbelo exactamente como aparece en tu página de Nextdoor.":"Type it exactly as it appears on your Nextdoor business page.",
     placeholder:"e.g. Webb Home Services, ABC Plumbing", rows:1,
     examples:["Webb Home Services","ABC Plumbing & Drain","Sunrise HVAC Solutions"]},
    {key:"businessPageLink", label:s?"¿Cuál es el enlace de tu página en Nextdoor?":"What is your Nextdoor business page link?",
     hint:s?"Ve a tu página de Nextdoor y copia el enlace de la barra de dirección.":"Go to your Nextdoor business page and copy the link from the address bar.",
     placeholder:"https://nextdoor.com/pages/your-business", rows:1, type:"url",
     examples:["https://nextdoor.com/pages/webb-home-services","https://nextdoor.com/pages/abc-plumbing","https://nextdoor.com/pages/sunrise-hvac"]},

  ];
  const GENERATE_STEP=STEPS.length;
  const cur=STEPS[step];
  const totalSteps = GENERATE_STEP + 1; // fields + generate step
  const pct = Math.round((step / totalSteps) * 100);

  return <div>
    {/* Progress bar */}
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:6}}>
        <span style={{fontWeight:700,color:NAVY}}>⭐ {s?"Obtener Reseñas en Nextdoor":"Get Reviews on Nextdoor"}</span>
        <span style={{fontWeight:700,color:NAVY,fontSize:12}}>{step+1} / {totalSteps}</span>
      </div>
      <div style={{background:GRAY200,borderRadius:99,height:18,position:"relative"}}>
        <div style={{background:YELLOW,borderRadius:99,height:18,width:Math.max(2,pct)+"%",transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
          {pct>10&&<span style={{fontSize:11,fontWeight:800,color:NAVY}}>{pct}%</span>}
        </div>
      </div>
    </div>

    {/* Extracting indicator */}
    {extracting&&<Card><div style={{display:"flex",alignItems:"center",gap:10,color:GRAY600,fontSize:13}}><LoadingDots/><span>{s?"Extrayendo información de tu publicación...":"Pulling info from your post..."}</span></div></Card>}

    {/* Field steps */}
    {!extracting&&step<GENERATE_STEP&&cur&&<FieldStep
      cur={cur} step={step} inputs={inputs} si={si} s={s}
      onBack={()=>step===0?onBack("setup_business"):setStep(st=>st-1)}
      onNext={async()=>{if(step===GENERATE_STEP-1){setStep(GENERATE_STEP);try{await doGen();}catch(e){}setStep(GENERATE_STEP+1);}else{setStep(st=>st+1);}}}
    />}

    {/* Step 5 (GENERATE_STEP): generating state — auto-triggers then advances */}
    {!extracting&&step===GENERATE_STEP&&<Card style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:40,marginBottom:16}}>✉️</div>
      <h2 style={{color:NAVY,fontWeight:900,fontSize:18,margin:"0 0 8px"}}>{s?"Generando tus mensajes...":"Generating your messages..."}</h2>
      <p style={{color:GRAY600,fontSize:13,margin:"0 0 20px"}}>{s?"Esto tomará solo un momento.":"This will just take a moment."}</p>
      <LoadingDots/>
      {err&&<div style={{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",color:RED,fontSize:13,marginTop:16}}>{err}</div>}
    </Card>}

    {/* Step 9: Message screen — email + text */}
    {!extracting&&step===GENERATE_STEP+1&&<Card>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:24}}>⭐</span>
        <h2 style={{fontSize:20,fontWeight:900,color:NAVY,margin:0}}>{s?"Obtén 5 Favoritos + 5 Recomendaciones":"Unlock 5 Faves + 5 Recommendations"}</h2>
      </div>
      <div style={{background:NAVY,borderRadius:12,padding:"14px 18px",marginBottom:20}}>
        <p style={{color:WHITE,fontSize:14,lineHeight:1.7,margin:0}}>{"With 5 faves and 5 recommendations, your business pops up when locals go looking. It’s how you get on the radar and start getting more calls from people nearby."}</p>
      </div>

      {/* Email */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span style={{fontSize:20}}>📧</span>
          <span style={{fontWeight:800,color:NAVY,fontSize:15}}>{s?"Correo electrónico":"Email"}</span>
        </div>
        {subj&&<div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:8,padding:"8px 12px",marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:GRAY400,textTransform:"uppercase"}}>{s?"Asunto: ":"Subject: "}</span><span style={{fontWeight:700,color:NAVY,fontSize:13}}>{subj}</span></div>}
        <CopyBox text={body} label={s?"cuerpo del correo":"email body"}/>

      </div>

      {/* Text */}
      <div style={{paddingTop:20,borderTop:"1px solid "+GRAY200}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span style={{fontSize:20}}>💬</span>
          <span style={{fontWeight:800,color:NAVY,fontSize:15}}>{s?"Mensaje de texto":"Text message"}</span>
        </div>
        <CopyBox text={textMsg||body} label={s?"mensaje de texto":"text message"}/>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>setStep(GENERATE_STEP)} style={{minWidth:110,fontSize:14}}>{s?"← Atrás":"← Back"}</Btn>
        <Btn onClick={()=>{setFlag("customersDone",true);onNext("post_path");}} style={{minWidth:110,fontSize:14}}>{s?"Siguiente →":"Next →"}</Btn>
      </div>
    </Card>}
  </div>;
}

// ── INTRO POSTS COACH PAGE ───────────────────────────────────────────────────
function PostCoach({inputs,onNext,onBack}){
  const s=useSp();
  return <div>
    <SectionHeader emoji="🎙️"
      title={s?"Sigue con tu Business Coach":"Follow Your Business Coach"}
      subtitle={s?"Tu Business Coach te guiará paso a paso. Copia tu publicación abajo para tenerla lista cuando la necesites.":"Your Business Coach will walk you through it step by step. Copy your intro post below so you have it ready to go."}
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        💡 {s?"Copia tu publicación ahora. Tu Business Coach te dirá exactamente cuándo y dónde pegarla.":"Copy your post now. Your Business Coach will tell you exactly when and where to paste it."}
      </div>
      <CopyBox text={inputs.week1Post} label={s?"tu publicación de introducción":"your intro post"}/>
    </Card>
    <BottomNav
      onBack={()=>onBack("post_path")}
      onNext={()=>onNext("comment_path")}
      nextLabel={s?"Siguiente →":"Next →"}
    />
  </div>;
}

// ── INTRO POSTS PATH PICKER ───────────────────────────────────────────────────
const INTRO_OPTIONS=[
  {id:"coach", emoji:"🎙️", label:"Follow Your Business Coach",  labelEs:"Seguir con el Business Coach",
   sub:"Join the live session and post with your Business Coach.",   subEs:"Únete a la sesión en vivo y publica junto a tu Business Coach.", recommended:true},
  {id:"video", emoji:"▶️",  label:"Watch the How-To Video",   labelEs:"Ver el Video Tutorial",
   sub:"Watch a step-by-step video walkthrough at your own pace.", subEs:"Mira el tutorial en video a tu propio ritmo."},
  {id:"steps", emoji:"📋",  label:"Step-by-Step Walkthrough", labelEs:"Guía Paso a Paso",
   sub:"Follow annotated instructions with screenshots.",     subEs:"Sigue instrucciones anotadas con capturas de pantalla."},
];
function PostPath({setFlag,flags,onNext,s}){
  const [hovered,setHovered]=useState(null);
  function choose(id){
    setFlag("introPath",id);
    if(id==="coach"){setFlag("introPostCount",5);onNext("post_coach");}
    else if(id==="video"){onNext("post_video");}
    else{onNext("post_personal");}
  }
  return <div>
    <SectionHeader emoji="📣" title={s?"Publicaciones de Introducción":"Intro Posts"} subtitle=""/>
    <div style={{background:NAVY,borderRadius:16,padding:24,marginBottom:24}}>
      <h3 style={{color:YELLOW,fontWeight:900,fontSize:18,margin:"0 0 12px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>📣 {s?"Meta: 5 publicaciones de introducción":"Goal: 5 intro posts"}</h3>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:"0 0 10px"}}>{"Most Pros show up on Nextdoor looking like an ad. They post their logo, list their services, and wonder why nobody calls. Neighbors scroll past it the same way they skip every other ad they see."}</p>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:0}}>{"What actually works is showing up as a person, not a business. When neighbors can see who you are, why you do this work, and what you stand for, they find things to connect with. That connection is what builds trust. And trust is what makes them call you instead of the next guy."}</p>
    </div>
    <p style={{fontSize:13,color:GRAY600,margin:"0 0 16px",textAlign:"center"}}>{s?"Elige la opción que mejor funcione para ti":"Pick which option works best for you"}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
      {INTRO_OPTIONS.map(opt=>{
        const isH=hovered===opt.id;
        const isDisabled=opt.comingSoon;
        return <div key={opt.id} onClick={!isDisabled?()=>choose(opt.id):undefined} onMouseEnter={()=>!isDisabled&&setHovered(opt.id)} onMouseLeave={()=>setHovered(null)}
          style={{borderRadius:14,border:"2px solid "+(opt.recommended?(isH?YELLOW:YELLOW):isH?NAVY:GRAY200),background:isH?NAVY:opt.recommended?"#FFFBEB":WHITE,cursor:isDisabled?"default":"pointer",padding:"22px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,textAlign:"center",transition:"all 0.18s",opacity:isDisabled?0.55:1,position:"relative"}}>
          {opt.recommended&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:YELLOW,color:NAVY,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>{"⭐ Recommended"}</div>}
          {opt.comingSoon&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:GRAY400,color:WHITE,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{"Coming Soon"}</div>}
          <div style={{fontSize:32,marginTop:opt.recommended||opt.comingSoon?8:0}}>{opt.emoji}</div>
          <div style={{fontWeight:800,fontSize:14,color:isH?YELLOW:NAVY,lineHeight:1.3}}>{s?opt.labelEs:opt.label}</div>
          <div style={{fontSize:12,color:isH?GRAY200:GRAY600,lineHeight:1.5}}>{s?opt.subEs:opt.sub}</div>
        </div>;
      })}
    </div>
  </div>;
}

// ── INTRO POSTS VIDEO ─────────────────────────────────────────────────────────
function PostVideo({flags,setFlag,inputs,onNext,onBack}){
  const s=useSp();
  const count=flags.introPostCount||0;
  const goal=5;
  const done=count>=goal;
  // videoUrl: swap in real embed URL when ready e.g. "https://www.youtube.com/embed/YOUR_ID"
  const videoUrl=null;
  return <div>
    <SectionHeader emoji="▶️" title={s?"Video Tutorial — Publicaciones de Introducción":"Intro Posts Video Walkthrough"} subtitle=""/>
    <Card>
      {videoUrl
        ? <div style={{position:"relative",paddingBottom:"56.25%",borderRadius:12,overflow:"hidden",background:"#000"}}>
            <iframe src={videoUrl} title="Intro Posts Walkthrough" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}/>
          </div>
        : <div style={{borderRadius:12,background:NAVY,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(254,183,5,0.15)",border:"2px solid "+YELLOW,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill={YELLOW}><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{color:WHITE,fontWeight:800,fontSize:15,marginBottom:4}}>{s?"Video próximamente":"Video coming soon"}</div>
              <div style={{color:GRAY400,fontSize:13}}>{s?"Este espacio está listo para el video tutorial.":"This space is ready for the intro posts walkthrough video."}</div>
            </div>
          </div>
      }
    </Card>
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        💡 {s?"Copia tu publicación para tenerla lista mientras ves el video.":"Copy your intro post to have it ready as you follow along with the video."}
      </div>
      <CopyBox text={inputs.week1Post} label={s?"tu publicación de introducción":"your intro post"}/>
    </Card>
    <BottomNav onBack={()=>{setFlag("introPath",null);onBack("post_path");}} onNext={()=>{setFlag("introPostCount",5);onNext("comment_path");}} nextLabel={s?"Siguiente →":"Next →"}/>
  </div>;
}

// ── INTRO POSTS ───────────────────────────────────────────────────────────────
// Step-by-step annotated walkthrough — 10 steps, image placeholder per step
const POST_STEPS=[
  {num:1,  label:"Click on Groups",
   desc:"On nextdoor.com, find the Groups section in the left sidebar or top navigation and click on it.",
   descEs:"En nextdoor.com, encuentra la sección Grupos en la barra lateral izquierda y haz clic."},
  {num:2,  label:"Join 4 Public Groups",
   desc:"Browse and join 4 public groups that have a lot of members and feel relevant to you — neighborhood groups, local community groups, or groups connected to your area. The more members, the more neighbors will see your post.",
   descEs:"Explora y únete a 4 grupos públicos con muchos miembros que sientas relevantes — grupos de vecindario, comunidad local o tu área. Más miembros significa más vecinos que verán tu publicación."},
  {num:3,  label:"Click Post",
   desc:"Once you've joined your groups, click the Post button to start composing your intro post.",
   descEs:"Una vez que te hayas unido a tus grupos, haz clic en el botón Publicar para comenzar a redactar tu publicación de introducción."},
  {num:4,  label:"Copy Your Intro Post",
   desc:"Copy your intro post below and paste it into the text box on Nextdoor.",
   descEs:"Copia tu publicación de introducción abajo y pégala en el cuadro de texto en Nextdoor.",
   showPost:true},
  {num:5,  label:"Add Your Photo",
   desc:"Attach the same face photo you used in your Facebook group intro post. A real photo of your face builds the most trust on Nextdoor.",
   descEs:"Adjunta la misma foto de tu cara que usaste en tu publicación de introducción en Facebook. Una foto real genera más confianza en Nextdoor."},
  {num:6,  label:"Click Next",
   desc:"After adding your post text and photo, click Next to move to the audience and group selection screen.",
   descEs:"Después de agregar tu texto y foto, haz clic en Siguiente para ir a la pantalla de selección de audiencia y grupo."},
  {num:7,  label:"Select Anyone and Choose a Group",
   desc:"Keep the Anyone selection at the top so your post reaches the full neighborhood. Then select one of your groups to post to from the group list below.",
   descEs:"Mantén la selección Cualquiera en la parte superior para que tu publicación llegue a todo el vecindario. Luego selecciona uno de tus grupos en la lista."},
  {num:8,  label:"Click Post",
   desc:"Hit Post. Your intro is now live on your personal page and in your first group. That's 2 of 5 done.",
   descEs:"Haz clic en Publicar. Tu introducción ya está activa en tu página personal y en tu primer grupo. Eso es 2 de 5."},
  {num:9,  label:"Your First Post Is Live!",
   desc:"Your intro post is now published on your personal Nextdoor page and in one group. You're on the map. Now you'll post in 3 more groups to hit your goal of 5 total intro posts.",
   descEs:"Tu publicación de introducción ya está publicada en tu página personal de Nextdoor y en un grupo. Ahora publicarás en 3 grupos más para llegar a 5 publicaciones en total.",
   celebrate:true},
  {num:10, label:"Post in 3 More Groups",
   desc:"Repeat steps 3 through 8 for each of your remaining 3 groups. Same post, same photo, different group each time. Once you've posted in all 4 groups plus your personal page you've hit your goal of 5 intro posts.",
   descEs:"Repite los pasos 3 al 8 para cada uno de tus 3 grupos restantes. Misma publicación, misma foto, grupo diferente. Cuando hayas publicado en 4 grupos más tu página personal habrás alcanzado tu meta de 5 publicaciones.",
   repeat:true},
];

function PostPersonal({flags,setFlag,inputs,onNext,onBack}){
  const s=useSp();
  const [stepIdx,setStepIdx]=useState(0);
  const totalSteps=POST_STEPS.length;
  const cur=POST_STEPS[stepIdx];
  const done=stepIdx>=totalSteps;

  function goNext(){
    if(stepIdx===totalSteps-1){setFlag("introPostCount",5);onNext("comment_path");}
    else{setStepIdx(i=>i+1);}
  }
  function goBack(){
    if(stepIdx===0){setFlag("introPath",null);onBack("post_path");}
    else{setStepIdx(i=>i-1);}
  }

  const pct=Math.round((stepIdx/totalSteps)*100);

  return <div>
    <SectionHeader emoji="📋" title={s?"Publicaciones de Introducción — Paso a Paso":"Intro Posts — Step by Step"} subtitle=""/>
    {/* Progress bar */}
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:6}}>
        <span style={{fontWeight:700,color:NAVY}}>{"Your Story Progress"}</span>
        <span style={{fontWeight:700,color:NAVY}}>{stepIdx+1} / {totalSteps}</span>
      </div>
      <div style={{background:GRAY200,borderRadius:99,height:18,position:"relative"}}>
        <div style={{background:YELLOW,borderRadius:99,height:18,width:Math.max(2,pct)+"%",transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
          {pct>8&&<span style={{fontSize:11,fontWeight:800,color:NAVY}}>{pct}%</span>}
        </div>
      </div>
    </div>

    <Card>
      {/* Step header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <span style={{background:NAVY,color:YELLOW,borderRadius:8,padding:"4px 12px",fontSize:14,fontWeight:900,flexShrink:0}}>Step {cur.num}</span>
        <span style={{fontWeight:800,color:NAVY,fontSize:17,lineHeight:1.3}}>{s?cur.label:cur.label}</span>
      </div>

      <p style={{fontSize:13,color:GRAY600,margin:"0 0 16px",lineHeight:1.7}}>{s?cur.descEs:cur.desc}</p>

      {/* Celebration banner */}
      {cur.celebrate&&<div style={{background:NAVY,borderRadius:12,padding:"20px 16px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:8}}>🎉</div>
        <div style={{color:YELLOW,fontWeight:900,fontSize:16,marginBottom:4}}>{s?"¡Tu primera publicación está activa!":"Your first post is live!"}</div>
        <div style={{color:WHITE,fontSize:13,lineHeight:1.6}}>{s?"Tu página personal + 1 grupo. Eso es 2 de 5.":"Personal page + 1 group. That's 2 of 5."}</div>
      </div>}

      {/* Screenshot placeholder */}
      <div style={{borderRadius:12,background:GRAY50,border:"2px dashed "+GRAY200,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,marginBottom:cur.showPost?16:0}}>
        <span style={{fontSize:36}}>📸</span>
        <span style={{fontSize:13,color:GRAY400,fontWeight:600}}>{s?"Captura de pantalla anotada — próximamente":"Annotated screenshot — coming soon"}</span>
        <span style={{fontSize:11,color:GRAY200}}>Step {cur.num} of {totalSteps}</span>
      </div>

      {/* Copy box on step 4 */}
      {cur.showPost&&<>
        <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:NAVY}}>
          💡 {s?"Copia tu publicación y pégala en Nextdoor.":"Copy your post and paste it into Nextdoor."}
        </div>
        <CopyBox text={inputs.week1Post} label={s?"tu publicación de introducción":"your intro post"}/>
      </>}

      {/* Repeat instructions on step 10 */}
      {cur.repeat&&<div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:10,padding:"14px 16px",marginTop:16}}>
        <div style={{fontWeight:800,color:NAVY,fontSize:14,marginBottom:8}}>{s?"Para cada uno de los 3 grupos restantes:":"For each of your 3 remaining groups:"}</div>
        {(s?["Haz clic en Publicar","Pega tu publicación de introducción","Adjunta tu foto","Haz clic en Siguiente","Selecciona Cualquiera y elige un grupo nuevo","Haz clic en Publicar"]:["Click Post","Paste your intro post","Attach your photo","Click Next","Select Anyone and choose a new group","Click Post"]).map((t,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}><div style={{background:YELLOW,color:NAVY,borderRadius:99,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,flexShrink:0}}>{i+1}</div><span style={{fontSize:13,color:GRAY800}}>{t}</span></div>)}
        <CopyBox text={inputs.week1Post} label={s?"tu publicación — copia para cada grupo":"your post — copy for each group"}/>
      </div>}
    </Card>

    <BottomNav
      onBack={goBack}
      onNext={goNext}
      nextLabel={s?"Siguiente →":"Next →"}
    />
  </div>;
}
// PostGroup and PostLoop proxy to PostPersonal
function PostGroup({flags,setFlag,inputs,onNext,onBack}){return <PostPersonal flags={flags} setFlag={setFlag} inputs={inputs} onNext={onNext} onBack={onBack}/>;}
function PostLoop({flags,setFlag,inputs,onNext,onBack}){return <PostPersonal flags={flags} setFlag={setFlag} inputs={inputs} onNext={onNext} onBack={onBack}/>;}

// ── COMMENTS ──────────────────────────────────────────────────────────────────

// Path picker (mirrors Intro Posts exactly)
const COMMENT_PATH_OPTIONS=[
  {id:"coach", emoji:"🎙️", label:"Follow Your Business Coach", labelEs:"Seguir con el Business Coach",
   sub:"Join the live session and find posts with your Business Coach.", subEs:"Únete a la sesión en vivo con tu Business Coach.", recommended:true},
  {id:"video", emoji:"▶️",  label:"Watch the How-To Video",  labelEs:"Ver el Video Tutorial",
   sub:"Watch a step-by-step video walkthrough at your own pace.", subEs:"Mira el tutorial en video a tu propio ritmo."},
  {id:"steps", emoji:"📋",  label:"Step-by-Step Walkthrough", labelEs:"Guía Paso a Paso",
   sub:"Follow annotated instructions with screenshots.", subEs:"Sigue instrucciones anotadas con capturas de pantalla."},
];

function CommentPath({flags,setFlag,onNext,s}){
  const [hovered,setHovered]=useState(null);
  function choose(id){
    setFlag("commentPath",id);
    if(id==="coach"){onNext("comment_generate");}
    else if(id==="video"){onNext("comment_video");}
    else{onNext("comment_how");}
  }
  return <div>
    <SectionHeader emoji="💬" title={s?"Comentarios":"Comments"} subtitle=""/>
    <div style={{background:NAVY,borderRadius:16,padding:24,marginBottom:24}}>
      <h3 style={{color:YELLOW,fontWeight:900,fontSize:18,margin:"0 0 12px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>💬 {s?"Meta: 5 comentarios en publicaciones existentes":"Goal: 5 comments on existing posts"}</h3>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:0}}>{"When you leave a helpful, expert reply, something important happens: the person who posted may call you, but the real win is everyone else reading the thread. Neighbors scroll through every response before they decide who to trust. A well-placed comment puts your name in front of 10, 20, sometimes 50 people who are watching."}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
      {COMMENT_PATH_OPTIONS.map(opt=>{
        const isH=hovered===opt.id;
        const isDisabled=opt.comingSoon;
        return <div key={opt.id} onClick={!isDisabled?()=>choose(opt.id):undefined} onMouseEnter={()=>!isDisabled&&setHovered(opt.id)} onMouseLeave={()=>setHovered(null)}
          style={{borderRadius:14,border:"2px solid "+(opt.recommended?(isH?YELLOW:YELLOW):isH?NAVY:GRAY200),background:isH?NAVY:opt.recommended?"#FFFBEB":WHITE,cursor:isDisabled?"default":"pointer",padding:"22px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,textAlign:"center",transition:"all 0.18s",opacity:isDisabled?0.55:1,position:"relative"}}>
          {opt.recommended&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:YELLOW,color:NAVY,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>{"⭐ Recommended"}</div>}
          {opt.comingSoon&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:GRAY400,color:WHITE,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{"Coming Soon"}</div>}
          <div style={{fontSize:32,marginTop:opt.recommended||opt.comingSoon?8:0}}>{opt.emoji}</div>
          <div style={{fontWeight:800,fontSize:14,color:isH?YELLOW:NAVY,lineHeight:1.3}}>{s?opt.labelEs:opt.label}</div>
          <div style={{fontSize:12,color:isH?GRAY200:GRAY600,lineHeight:1.5}}>{s?opt.subEs:opt.sub}</div>
        </div>;
      })}
    </div>
  </div>;
}

// How to Find Comments — step-by-step walkthrough
const HOW_STEPS=[
  {label:"Go to nextdoor.com and search your trade", labelEs:"Ve a nextdoor.com y busca tu oficio",
   desc:"Open nextdoor.com. Use the search bar and type your trade — plumber, HVAC, electrician, etc.",
   descEs:"Abre nextdoor.com. Usa la barra de búsqueda y escribe tu oficio — plomero, HVAC, electricista, etc."},
  {label:"Filter results for the last 7 days", labelEs:"Filtra resultados de los últimos 7 días",
   desc:"After searching, look for the filter option and select Posts from the last 7 days to find the freshest opportunities.",
   descEs:"Después de buscar, busca la opción de filtro y selecciona Publicaciones de los últimos 7 días."},
  {label:"Find a neighbor asking for your service", labelEs:"Encuentra un vecino que busca tu servicio",
   desc:"Look for posts like Anyone recommend a good plumber? or Need an HVAC tech ASAP. These are your best leads.",
   descEs:"Busca publicaciones como Alguien recomienda un buen plomero o Necesito un técnico HVAC urgente."},
];

function CommentHow({flags,setFlag,inputs,onNext,onBack}){
  const s=useSp();
  const [stepIdx,setStepIdx]=useState(0);
  const cur=HOW_STEPS[stepIdx];
  const pct=Math.round(((stepIdx+1)/HOW_STEPS.length)*100);
  function goNext(){if(stepIdx===HOW_STEPS.length-1){onNext("comment_generate");}else{setStepIdx(i=>i+1);}}
  function goBack(){if(stepIdx===0){onBack("comment_path");}else{setStepIdx(i=>i-1);}}
  return <div>
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:6}}>
        <span style={{fontWeight:700,color:NAVY}}>{"How to Find Comments"}</span>
        <span style={{fontWeight:700,color:NAVY}}>{stepIdx+1} / {HOW_STEPS.length}</span>
      </div>
      <div style={{background:GRAY200,borderRadius:99,height:18,position:"relative"}}>
        <div style={{background:YELLOW,borderRadius:99,height:18,width:pct+"%",transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
          {pct>10&&<span style={{fontSize:11,fontWeight:800,color:NAVY}}>{pct}%</span>}
        </div>
      </div>
    </div>
    <Card>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <span style={{background:NAVY,color:YELLOW,borderRadius:8,padding:"4px 12px",fontSize:14,fontWeight:900,flexShrink:0}}>{s?"Paso":"Step"} {stepIdx+1}</span>
        <span style={{fontWeight:800,color:NAVY,fontSize:17,lineHeight:1.3}}>{s?cur.labelEs:cur.label}</span>
      </div>
      <p style={{fontSize:13,color:GRAY600,margin:"0 0 16px",lineHeight:1.7}}>{s?cur.descEs:cur.desc}</p>
      <div style={{borderRadius:12,background:GRAY50,border:"2px dashed "+GRAY200,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
        <span style={{fontSize:36}}>📸</span>
        <span style={{fontSize:13,color:GRAY400,fontWeight:600}}>{s?"Captura de pantalla — próximamente":"Screenshot — coming soon"}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={goBack} style={{fontSize:14,minWidth:120}}>{s?"← Atrás":"← Back"}</Btn>
        <Btn onClick={goNext} style={{fontSize:14,minWidth:120}}>{stepIdx===HOW_STEPS.length-1?(s?"Ir al Generador →":"Go to Generator →"):(s?"Siguiente →":"Next →")}</Btn>
      </div>
    </Card>
  </div>;
}

// Comment Video placeholder
function CommentVideo({flags,setFlag,onNext,onBack,s}){
  return <VideoPlaceholder
    title="How to Find Comments — Video Walkthrough"
    titleEs="Cómo Encontrar Comentarios — Video Tutorial"
    videoUrl={null}
    s={s}
    onBack={()=>onBack("comment_path")}
    backLabel={s?"← Atrás":"← Back"}
    onNext={()=>onNext("comment_generate")}
  />;
}

// Comment Coach — bypass straight to generator
function CommentCoach({flags,setFlag,inputs,onNext,onBack}){
  const s=useSp();
  return <div>
    <SectionHeader emoji="🎙️"
      title={s?"Sigue con tu Business Coach":"Follow Your Business Coach"}
      subtitle={s?"Tu Business Coach te guiará para encontrar publicaciones. Cuando encuentres una, usa el generador abajo para crear tu respuesta.":"Your Business Coach will guide you to find posts. When you find one, use the generator below to create your reply."}
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        💡 {s?"Tu Business Coach te dirá exactamente qué buscar y cuándo responder.":"Your Business Coach will tell you exactly what to look for and when to reply."}
      </div>
      <Btn onClick={()=>onNext("comment_generate")} style={{width:"100%",justifyContent:"center"}}>
        {s?"Ir al Generador de Comentarios →":"Go to Comment Generator →"}
      </Btn>
    </Card>
    <BottomNav onBack={()=>onBack("comment_path")}/>
  </div>;
}

// Comment Generator
const AMPLIFY_MILESTONES=["On Fire","Neighborhood Pro","Community Leader","Local Legend","Nextdoor MVP"];
function getAmplifyMilestone(n){return AMPLIFY_MILESTONES[Math.floor(n/5)-1]||AMPLIFY_MILESTONES[AMPLIFY_MILESTONES.length-1];}
const MILESTONE_EMOJIS_LIST=["🔥","⭐","🏅","🏆","👑"];

function CommentGenerate({flags,setFlag,inputs,onNext,onBack,amplify}){
  const s=useSp();
  const [mode,setMode]=useState(null);
  const [postText,setPostText]=useState("");
  const [imgData,setImgData]=useState(null);const [imgMime,setImgMime]=useState(null);const [imgName,setImgName]=useState("");
  const [reply1,setReply1]=useState("");const [reply2,setReply2]=useState("");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [screen,setScreen]=useState("input");
  const fileRef=useRef(null);

  const count=amplify?(flags.amplifyCommentCount||0):(flags.commentCount||0);
  const goal=amplify?null:5;

  function handleFile(e){const f=e.target.files[0];if(!f||!f.type.startsWith("image/"))return;setImgName(f.name);setImgMime(f.type);const r=new FileReader();r.onload=ev=>setImgData(ev.target.result.split(",")[1]);r.readAsDataURL(f);}

  async function generate(){
    if(!inputs.trade||!inputs.city){setErr(s?"Asegúrate de que tu oficio y ciudad estén completos en Configuración.":"Make sure your trade and city are filled in from Setup.");return;}
    setLoading(true);setErr("");setReply1("");setReply2("");
    try{
      let res;
      if(mode==="screenshot"&&imgData)res=await genReplyImg(imgData,imgMime,inputs.trade,inputs.city);
      else if(mode==="text"&&postText.trim())res=await genReplyText(postText,inputs.trade,inputs.city);
      else{setErr(s?"Proporciona el contenido de la publicación primero.":"Provide the post content first.");setLoading(false);return;}
      const i1=res.indexOf("OPTION_1:");const i2=res.indexOf("OPTION_2:");
      const r1=i1>=0?(i2>i1?res.slice(i1+9,i2):res.slice(i1+9)).trim():res.trim();
      const r2=i2>=0?res.slice(i2+9).trim():"";
      function stripDashes(t){return t.split("\u2014").join(",").split("\u2013").join(",").split("---").join(",").split("--").join(",");}
      setReply1(stripDashes(r1));setReply2(stripDashes(r2));
      setScreen("replies");
    }catch(e){setErr(s?"No se pudo generar. Verifica tu conexión.":"Could not generate. Check your connection.");}
    setLoading(false);
  }

  function logIt(){
    if(amplify){
      const newCount=(flags.amplifyCommentCount||0)+1;
      setFlag("amplifyCommentCount",newCount);
      if(newCount%5===0){setScreen("milestone");}
      else{setReply1("");setReply2("");setPostText("");setImgData(null);setImgName("");setMode(null);setErr("");setScreen("input");}
    } else {
      const newCount=Math.min(count+1,goal||5);
      setFlag("commentCount",newCount);
      const postsDone=(flags.introPostCount||0)>=5;
      if(newCount>=goal&&postsDone){onNext("week_complete");}
      else if(newCount>=goal){onNext("leads_main");}
      else{setReply1("");setReply2("");setPostText("");setImgData(null);setImgName("");setMode(null);setErr("");setScreen("input");}
    }
  }

  const progressPct=amplify?Math.round(((count%5)/5)*100):Math.round((count/(goal||5))*100);
  const totalAmplify=flags.amplifyCommentCount||0;
  const badge=totalAmplify>=5?getAmplifyMilestone(totalAmplify):null;

  if(screen==="milestone"){
    const n=flags.amplifyCommentCount||0;
    const label=getAmplifyMilestone(n);
    const emoji=MILESTONE_EMOJIS_LIST[Math.floor(n/5)-1]||"👑";
    return <div>
      <div style={{background:NAVY,borderRadius:16,padding:32,marginBottom:20,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:12}}>{emoji}</div>
        <h2 style={{color:YELLOW,fontSize:22,fontWeight:900,margin:"0 0 8px"}}>{label+"!"}</h2>
        <p style={{color:WHITE,fontSize:14,lineHeight:1.8,margin:"0 0 4px"}}>{"You've posted "+n+" comments through Amplify."}</p>
        <p style={{color:GRAY400,fontSize:13,lineHeight:1.8,margin:0}}>{"Every one puts your name in front of more neighbors. Keep going."}</p>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:20,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>onBack()} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
        <Btn onClick={()=>{setReply1("");setReply2("");setPostText("");setImgData(null);setImgName("");setMode(null);setErr("");setScreen("input");}} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
      </div>
    </div>;
  }

  if(screen==="input"&&loading){
    return <Card style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:40,marginBottom:16}}>💬</div>
      <h2 style={{color:NAVY,fontWeight:900,fontSize:18,margin:"0 0 8px"}}>{s?"Generando tus respuestas...":"Generating your replies..."}</h2>
      <p style={{color:GRAY600,fontSize:13,margin:"0 0 20px"}}>{s?"Esto tomará solo un momento.":"This will just take a moment."}</p>
      <LoadingDots/>
      {err&&<div style={{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",color:RED,fontSize:13,marginTop:16}}>{err}</div>}
    </Card>;
  }

  if(screen==="replies"){
    return <div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:6}}>
          <span style={{fontWeight:700,color:NAVY}}>💬 {s?"Generador de Comentarios":"Comment Generator"}{badge&&<span style={{marginLeft:8,background:YELLOW,color:NAVY,borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:800}}>{badge}</span>}</span>
          <span style={{fontWeight:700,color:NAVY}}>{amplify?(totalAmplify+" total"):(count+" / "+goal)}</span>
        </div>
        <div style={{background:GRAY200,borderRadius:99,height:18,position:"relative"}}>
          <div style={{background:amplify?YELLOW:GREEN,borderRadius:99,height:18,width:Math.max(2,progressPct)+"%",transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
            {progressPct>8&&<span style={{fontSize:11,fontWeight:800,color:amplify?NAVY:WHITE}}>{amplify?(count%5||5)+"/5":count+"/"+goal}</span>}
          </div>
        </div>
      </div>
      <Card>
        <h3 style={{color:NAVY,fontWeight:800,fontSize:16,margin:"0 0 4px"}}>{s?"Tu respuesta generada":"Your generated reply"}</h3>
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 16px"}}>{s?"Elige una opción, cópiala y publícala en Nextdoor.":"Pick one option, copy it, and post it on Nextdoor."}</p>
        <div style={{fontWeight:700,color:NAVY,fontSize:13,marginBottom:6}}>Option 1 — Diagnostic Neighbor</div>
        <CopyBox text={reply1} label={s?"opción 1":"option 1"} paragraphs={true}/>
        <div style={{fontWeight:700,color:NAVY,fontSize:13,marginBottom:6,marginTop:8}}>Option 2 — Authority Version</div>
        <CopyBox text={reply2} label={s?"opción 2":"option 2"} paragraphs={true}/>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>setScreen("input")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
        <Btn onClick={logIt} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
      </div>
    </div>;
  }

  // input screen
  return <div>
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY400,marginBottom:6}}>
        <span style={{fontWeight:700,color:NAVY}}>💬 {s?"Generador de Comentarios":"Comment Generator"}{badge&&<span style={{marginLeft:8,background:YELLOW,color:NAVY,borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:800}}>{badge}</span>}</span>
        <span style={{fontWeight:700,color:NAVY}}>{amplify?(totalAmplify+" total"):(count+"/"+(goal||5)+" done")}</span>
      </div>
      <div style={{background:GRAY200,borderRadius:99,height:18,position:"relative"}}>
        <div style={{background:amplify?YELLOW:GREEN,borderRadius:99,height:18,width:Math.max(2,progressPct)+"%",transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
          {progressPct>8&&<span style={{fontSize:11,fontWeight:800,color:amplify?NAVY:WHITE}}>{amplify?((count%5||5)+"/5"):(count+"/"+(goal||5))}</span>}
        </div>
      </div>
    </div>
    <Card>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <span style={{background:NAVY,color:YELLOW,borderRadius:8,padding:"4px 12px",fontSize:14,fontWeight:900,flexShrink:0}}>💬</span>
        <span style={{fontWeight:800,color:NAVY,fontSize:17}}>{s?"Encuentra una publicación que necesita tu ayuda":"Provide the neighbor\'s post"}</span>
      </div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
        {[{id:"screenshot",e:"📸",l:s?"Subir Captura":"Upload Screenshot",sub:s?"Claude lee la imagen directamente":"Claude reads the image directly"},{id:"text",e:"✏️",l:s?"Escribir Mis Respuestas":"Type My Answers",sub:s?"Completa a tu propio ritmo":"Fallback if you can\'t screenshot"}].map(m=><button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:"12px 14px",border:"2px solid "+(mode===m.id?NAVY:GRAY200),borderRadius:12,background:mode===m.id?NAVY:GRAY50,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><span style={{fontSize:22}}>{m.e}</span><span style={{fontWeight:800,color:mode===m.id?YELLOW:NAVY,fontSize:13}}>{m.l}</span><span style={{fontSize:11,color:mode===m.id?GRAY400:GRAY600,textAlign:"center"}}>{m.sub}</span></button>)}
      </div>
      {mode==="screenshot"&&<div><input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>{!imgData?<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{width:"100%",border:"2px dashed "+GRAY200,borderRadius:12,padding:"24px 16px",background:GRAY50,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><span style={{fontSize:32}}>📸</span><span style={{fontWeight:700,color:NAVY,fontSize:14}}>{s?"Clic para subir captura":"Click to upload screenshot"}</span></button>:<div style={{background:"#F0FDF4",border:"1.5px solid "+GREEN,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:22}}>🖼️</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#065F46",fontSize:14}}>{imgName}</div><div style={{fontSize:12,color:GREEN}}>✓ {s?"Lista":"Ready"}</div></div><button onClick={()=>{setImgData(null);setImgName("");}} style={{background:"none",border:"none",color:GRAY400,fontSize:20,cursor:"pointer"}}>x</button></div>}</div>}
      {mode==="text"&&<textarea value={postText} onChange={e=>setPostText(e.target.value)} placeholder={s?"Pega o escribe la publicación del vecino...":"Paste or type the neighbor\'s post..."} rows={5} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+GRAY200,borderRadius:10,padding:"10px 14px",fontSize:13,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none",marginBottom:8}}/>}
      {err&&<div style={{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",color:RED,fontSize:13,marginTop:10}}>{err}</div>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>onBack(flags.commentPath==="steps"?"comment_how":flags.commentPath==="video"?"comment_video":"comment_coach")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
        <Btn onClick={generate} disabled={loading||!mode||(mode==="screenshot"&&!imgData)||(mode==="text"&&!postText.trim())} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
      </div>
    </Card>
  </div>;
}
// ── WORK LEADS ────────────────────────────────────────────────────────────────
const ND_LEADS=[
  {id:"like",emoji:"👍",label:"Like or Emoji",color:"#FEF9EC",border:YELLOW,simple:true,steps:[{label:"Within 24 hours, send this DM",script:"Hey [Name], really appreciate the reaction on my post! The more neighbors who engage, the more Nextdoor shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?"},{label:"Then follow the DM strategy based on their response",note:true}]},
  {id:"comment",emoji:"💬",label:"Comment",color:"#EFF6FF",border:"#93C5FD",simple:false,subtypes:[
    {id:"cs",label:"Asked about a service",example:'"Do you do drain cleaning?"',pub:["@[Name] great question. I handle [service] and make sure it is done right every time."],dm:"Hey [Name], we can absolutely help with [service]. I have openings this week — want me to save you a spot?"},
    {id:"ca",label:"Asked about service area",example:'"Do you service this neighborhood?"',pub:["@[Name] yes, I serve [area] and would love to help."],dm:"Hey [Name], yes I service [area]. Is there something specific going on I can help with?"},
    {id:"cn",label:"Needs help now",example:'"I was just about to call someone!"',pub:["@[Name] glad you saw this. We would love to help."],dm:"Hey [Name], so glad you reached out. I have openings this week — want me to save you a spot?"},
    {id:"cp",label:"Praise or encouragement",example:'"Love seeing neighbors like you!"',pub:["@[Name] really appreciate the kind words. Makes the long days worth it."],dm:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you."},
    {id:"ct",label:"Past customer or testimonial",example:'"He did great work for us!"',pub:["@[Name] customers like you are what keep me going."],dm:"Your recommendation means the world to me. Do you know anyone else who could use [services]?"},
  ]},
  {id:"share",emoji:"🔁",label:"Share or Tag",color:"#F0FDF4",border:"#86EFAC",simple:true,steps:[{label:"Reply to their share",script:"@[Name] really appreciate that. Supporting local businesses helps the whole community."},{label:"Then send this DM",script:"Hey [Name], really appreciate you sharing that. If you ever need help with [services], I would be glad to take care of you."}]},
  {id:"dm",emoji:"✉️",label:"Direct Message",color:"#FDF4FF",border:"#D8B4FE",simple:false,subtypes:[
    {id:"ds",label:"Asked about a service",example:'"Do you do water heater installs?"',dm:"Hey, thanks for reaching out. We can help with [service]. I have openings this week — want me to save you a spot?"},
    {id:"dn",label:"Needs help now",example:'"I was just about to call someone!"',dm:"Hey, thanks for reaching out. I have openings this week — want me to save you a spot? I just need your name, address, and phone number."},
    {id:"dp",label:"Praise or encouragement",example:'"Love seeing neighbors like you!"',dm:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you."},
    {id:"dt",label:"Past customer",example:'"You did great work at my house!"',dm:"Your recommendation means the world to me. Do you know anyone else who could use [services]?"},
    {id:"dr",label:"Referral",example:'"Can you help my neighbor?"',dm:"The best compliment is a referral. Could you share their name and phone number?"},
  ]},
];
function WorkLeads({flags,setFlag,onBack}){
  const s=useSp();
  const [active,setAct]=useState(null);const [sub,setSub]=useState(null);const [ci,sCi]=useState(null);const [log,setLog]=useState([]);
  const [ji,sJi]=useState("");const [sje,setSje]=useState(false);const [jb,setJb]=useState(flags.jobsBooked||0);const [lw,setLw]=useState(flags.leadsWorked||{like:0,comment:0,share:0,dm:0});
  function copy(t,i){try{const el=document.createElement("textarea");el.value=t;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){}sCi(i);setTimeout(()=>sCi(null),2000);}
  function logL(id){setLog(p=>[...p,{type:id}]);const nx={...lw,[id]:(lw[id]||0)+1};setLw(nx);setFlag("leadsWorked",nx);}
  function addJ(n){const t=(jb||0)+n;setJb(t);setFlag("jobsBooked",t);sJi("");setSje(false);}
  function reset(){setAct(null);setSub(null);}
  const al=ND_LEADS.find(l=>l.id===active),as=al&&sub?(al.subtypes||[]).find(t=>t.id===sub):null;
  const sc=ND_LEADS.reduce((a,t)=>({...a,[t.id]:log.filter(l=>l.type===t.id).length}),{}),st=log.length;
  function SB({text,i}){const hasBrackets=text.includes("[");return <div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:"14px 16px",marginBottom:10}}>{hasBrackets&&<div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:8,padding:"6px 12px",marginBottom:8,fontSize:12,color:"#991B1B",fontWeight:700}}>{"⚠️ Replace all [bracketed text] before sending."}</div>}<p style={{fontSize:14,color:GRAY800,lineHeight:1.8,margin:"0 0 10px",fontStyle:"italic"}}>"{text}"</p><button onClick={()=>copy(text,i)} style={{background:ci===i?GREEN:NAVY,color:ci===i?WHITE:YELLOW,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{ci===i?"✓ Copied!":"📋 Copy Script"}</button></div>;}
  function SL({n,t}){return <div style={{display:"flex",gap:10,alignItems:"flex-start",margin:"16px 0 8px"}}><div style={{background:YELLOW,color:NAVY,borderRadius:99,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,flexShrink:0}}>{n}</div><div style={{fontWeight:700,color:NAVY,fontSize:14,paddingTop:2}}>{t}</div></div>;}
  return <div>
    <Card style={{background:NAVY,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h2 style={{color:YELLOW,fontSize:20,fontWeight:900,margin:"0 0 4px"}}>{s?"Trabaja Tus Prospectos":"Work Your Leads"}</h2><p style={{color:GRAY400,fontSize:13,margin:"0 0 8px"}}>{s?"Elige el tipo de interacción. Sigue los pasos. Reserva el trabajo.":"Pick the engagement type. Follow the steps. Book the job."}</p><p style={{color:WHITE,fontSize:13,margin:0,lineHeight:1.7}}>{"Someone engaged with your post. Pick what they did, get the exact script, and send it within 24 hours. That window is everything."}</p></div>
        <div style={{display:"flex",gap:10}}>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:72}}><div style={{color:YELLOW,fontWeight:900,fontSize:24,lineHeight:1}}>{st}</div><div style={{color:GRAY400,fontSize:10,marginTop:3}}>{s?"esta sesión":"this session"}</div></div>
          <div style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:72,cursor:"pointer"}} onClick={()=>setSje(v=>!v)}><div style={{color:GREEN,fontWeight:900,fontSize:24,lineHeight:1}}>{jb}</div><div style={{color:GREEN,fontSize:10,marginTop:3}}>{s?"trabajos reservados +":"jobs booked +"}</div></div>
        </div>
      </div>
      {sje&&<div style={{marginTop:14,padding:"14px 16px",background:"rgba(255,255,255,0.06)",borderRadius:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><span style={{color:WHITE,fontSize:13,fontWeight:600}}>{s?"¿Trabajos reservados de Nextdoor?":"Jobs booked from Nextdoor?"}</span><input type="number" min="1" value={ji} onChange={e=>sJi(e.target.value)} placeholder="e.g. 2" style={{width:72,border:"2px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"7px 10px",fontSize:16,fontWeight:800,color:NAVY,outline:"none",textAlign:"center",background:WHITE}}/><Btn onClick={()=>{const n=parseInt(ji);if(n>0)addJ(n);}} disabled={!ji||parseInt(ji)<1} style={{fontSize:13}}>Add</Btn></div>}
      <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,255,255,0.06)",borderRadius:10}}><p style={{color:WHITE,fontSize:13,margin:0}}>⚡ <strong style={{color:YELLOW}}>{s?"El tiempo mata los tratos.":"Time kills deals."}</strong> {s?"Las primeras 24 a 48 horas lo son todo.":"First 24 to 48 hours are everything."}</p></div>
    </Card>
    {!active&&<Card><h3 style={{color:NAVY,fontSize:17,fontWeight:800,margin:"0 0 6px"}}>{s?"¿Qué tipo de interacción recibiste?":"What kind of engagement did you get?"}</h3><p style={{color:GRAY600,fontSize:13,margin:"0 0 20px"}}>{s?"Toca uno para obtener pasos y guiones exactos.":"Tap one to get exact steps and scripts."}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{ND_LEADS.map(t=><button key={t.id} onClick={()=>{setAct(t.id);setSub(null);}} style={{background:t.color,border:"2px solid "+t.border,borderRadius:14,padding:"18px 16px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:6}}><span style={{fontSize:32}}>{t.emoji}</span><span style={{fontWeight:800,color:NAVY,fontSize:15}}>{t.label}</span>{(sc[t.id]>0||lw[t.id]>0)&&<span style={{fontSize:11,color:GRAY600,fontWeight:600}}>{sc[t.id]>0?"✓ "+sc[t.id]+" this session":""}{sc[t.id]>0&&lw[t.id]>sc[t.id]?" · ":""}{lw[t.id]>0?lw[t.id]+" all-time":""}</span>}</button>)}</div></Card>}
    {al&&al.simple&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{al.label}</h3></div>{al.steps.map((st2,i)=><div key={i}><SL n={i+1} t={st2.label}/>{st2.note?<div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:NAVY}}>Use the <strong>Direct Message</strong> playbook once they respond.</div>:<SB text={st2.script} i={i}/>}</div>)}<div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16,display:"flex",gap:10}}><Btn variant="success" onClick={()=>{logL(al.id);reset();}}>Next →</Btn><Btn variant="ghost" onClick={reset}>← Back</Btn></div></Card>}
    {al&&!al.simple&&!sub&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{al.label}</h3></div><p style={{color:GRAY600,fontSize:13,margin:"0 0 16px"}}>What did they say?</p><div style={{display:"flex",flexDirection:"column",gap:8}}>{al.subtypes.map(t=><button key={t.id} onClick={()=>setSub(t.id)} style={{background:al.color,border:"1.5px solid "+al.border,borderRadius:12,padding:"12px 16px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:3}}><span style={{fontWeight:700,color:NAVY,fontSize:14}}>{t.label}</span><span style={{fontSize:12,color:GRAY600,fontStyle:"italic"}}>{t.example}</span></button>)}</div></Card>}
    {al&&!al.simple&&as&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={()=>setSub(null)} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><div><div style={{fontWeight:800,color:NAVY,fontSize:15}}>{al.label}</div><div style={{fontSize:12,color:GRAY600}}>{as.label}</div></div></div>{al.id==="comment"&&<div><SL n={1} t="Reply publicly"/>{(as.pub||[]).map((r,i)=><SB key={i} text={r} i={i}/>)}<SL n={2} t="Then immediately DM"/><SB text={as.dm} i={99}/></div>}{al.id==="dm"&&<div><SL n={1} t="Reply within 24 hours"/><SB text={as.dm} i={0}/></div>}<div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16,display:"flex",gap:10}}><Btn variant="success" onClick={()=>{logL(al.id);reset();}}>Next →</Btn><Btn variant="ghost" onClick={()=>setSub(null)}>← Back</Btn></div></Card>}
    {st>0&&!active&&<Card><h3 style={{color:NAVY,fontSize:16,fontWeight:800,margin:"0 0 14px"}}>📊 {s?"Esta Sesión":"This Session"}</h3><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>{ND_LEADS.map(t=>sc[t.id]>0&&<div key={t.id} style={{background:t.color,border:"1.5px solid "+t.border,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{t.emoji}</span><span style={{fontWeight:800,color:NAVY,fontSize:14}}>{sc[t.id]}</span><span style={{fontSize:12,color:GRAY600}}>{t.label}</span></div>)}</div><div style={{background:NAVY,borderRadius:12,padding:16}}><p style={{color:YELLOW,fontWeight:700,margin:"0 0 4px",fontSize:14}}>{s?"Todo camino lleva a un DM. Cada DM es una oportunidad.":"Every path leads to a DM. Every DM is a chance to book a job."}</p><p style={{color:WHITE,fontSize:13,margin:0}}>{s?"Sigue adelante. Las primeras 48 horas lo son todo.":"Keep going. The first 48 hours are everything."}</p></div></Card>}
    <BottomNav onBack={()=>onBack("comment_path")}/>
  </div>;
}

// ── AMPLIFY ───────────────────────────────────────────────────────────────────
function AmplifyHome({flags,onNext,s}){
  const [selected,setSelected]=useState(null);
  const [bypass,setBypass]=useState(false);

  const postsDone=(flags.introPostCount||0)>=5;
  const commentsDone=(flags.commentCount||0)>=5;
  const goalsMet=postsDone&&commentsDone;

  if(!goalsMet&&!bypass){
    return <div>
      <SectionHeader emoji="⚡" title={s?"Amplificar":"Amplify"} subtitle=""/>
      <div style={{background:NAVY,borderRadius:16,padding:24,marginBottom:20}}>
        <h3 style={{color:YELLOW,fontWeight:900,fontSize:17,margin:"0 0 12px",textAlign:"center"}}>{"Before you amplify — hit your weekly goals first"}</h3>
        <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:"0 0 16px"}}>{"Amplify works best when your foundation is in place. We don't see that you've hit both weekly goals yet — 5 intro posts and 5 comments. If you already completed them but cleared your cache, no problem, just tap Continue to Amplify below."}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
          {!postsDone&&<div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>📣</div>
            <div style={{color:WHITE,fontWeight:800,fontSize:14,marginBottom:4}}>{"Intro Posts"}</div>
            <div style={{color:GRAY400,fontSize:12,marginBottom:12}}>{(flags.introPostCount||0)+" of 5 done"}</div>
            <Btn onClick={()=>onNext("post_path")} style={{fontSize:12,width:"100%",justifyContent:"center"}}>{"Go Complete →"}</Btn>
          </div>}
          {!commentsDone&&<div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>💬</div>
            <div style={{color:WHITE,fontWeight:800,fontSize:14,marginBottom:4}}>{"Comments"}</div>
            <div style={{color:GRAY400,fontSize:12,marginBottom:12}}>{(flags.commentCount||0)+" of 5 done"}</div>
            <Btn onClick={()=>onNext("comment_path")} style={{fontSize:12,width:"100%",justifyContent:"center"}}>{"Go Complete →"}</Btn>
          </div>}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:20,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>onNext("leads_main")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
        <Btn variant="ghost" onClick={()=>setBypass(true)} style={{fontSize:14}}>{"I already hit my goals — Continue to Amplify"}</Btn>
      </div>
    </div>;
  }
  return <div>
    <SectionHeader emoji="⚡" title={s?"Amplificar":"Amplify"} subtitle=""/>
    <div style={{background:NAVY,borderRadius:16,padding:24,marginBottom:20}}>
      <h3 style={{color:YELLOW,fontWeight:900,fontSize:18,margin:"0 0 12px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>⚡ {s?"Mantén el impulso":"Keep the momentum going"}</h3>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:"0 0 10px"}}>{"Every additional intro post puts your name in front of a new group of neighbors. Every additional comment puts your expertise in front of everyone watching that thread. The more you show up, the more your neighborhood knows who to call."}</p>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:"0 0 10px"}}>{"Amplify is designed to help you keep that momentum going — more posts, more comments, more visibility."}</p>
      <div style={{background:"rgba(255,183,6,0.12)",border:"1.5px solid "+YELLOW,borderRadius:10,padding:"12px 16px"}}>
        <p style={{color:YELLOW,fontSize:13,lineHeight:1.7,margin:0,fontWeight:700}}>{"Before you start: if you have unworked leads sitting in your notifications, head to Work Leads first. A warm lead today is worth more than a new post."}</p>
      </div>
    </div>
    <p style={{fontSize:13,color:GRAY600,margin:"0 0 14px",textAlign:"center"}}>{s?"¿Qué quieres hacer?":"What would you like to do?"}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
      {[
        {id:"amplify_posts",   emoji:"📣", label:"More Intro Posts",   labelEs:"Más Publicaciones de Introducción", sub:"Post in more groups to reach more neighbors.",         subEs:"Publica en más grupos para llegar a más vecinos."},
        {id:"amplify_comments",emoji:"💬", label:"More Comments",       labelEs:"Más Comentarios",                  sub:"Reply to more neighbor posts to build more trust.",    subEs:"Responde más publicaciones de vecinos."},
      ].map(opt=>{
        const isSel=selected===opt.id;
        return <div key={opt.id} onClick={()=>setSelected(opt.id)}
          style={{borderRadius:14,border:"2px solid "+(isSel?YELLOW:GRAY200),background:isSel?NAVY:WHITE,cursor:"pointer",padding:"28px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,textAlign:"center",transition:"all 0.18s",boxShadow:"0 2px 12px rgba(0,41,66,0.06)",position:"relative"}}>
          {isSel&&<div style={{position:"absolute",top:10,right:10,width:22,height:22,borderRadius:"50%",background:YELLOW,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
          <div style={{fontSize:36}}>{opt.emoji}</div>
          <div style={{fontWeight:800,fontSize:15,color:isSel?YELLOW:NAVY,lineHeight:1.3}}>{s?opt.labelEs:opt.label}</div>
          <div style={{fontSize:12,color:isSel?GRAY200:GRAY600,lineHeight:1.5}}>{s?opt.subEs:opt.sub}</div>
        </div>;
      })}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",paddingTop:20,borderTop:"1px solid "+GRAY200}}>
      <Btn variant="ghost" onClick={()=>onNext("leads_main")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
      <Btn onClick={()=>onNext(selected)} disabled={!selected} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
    </div>
  </div>;
}

// ── ACCOUNTABILITY TRACKER ───────────────────────────────────────────────────
function TrackerHome({onNext}){
  const s=useSp();
  return <div>
    <SectionHeader emoji="📊" title={s?"Rastreador de Responsabilidad":"Accountability Tracker"} subtitle=""/>
    <div style={{background:NAVY,borderRadius:20,padding:"48px 32px",textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:56,marginBottom:16}}>📊</div>
      <h2 style={{color:YELLOW,fontSize:22,fontWeight:900,margin:"0 0 12px"}}>{s?"Próximamente":"Coming Soon"}</h2>
      <p style={{color:WHITE,fontSize:14,lineHeight:1.8,margin:"0 0 8px"}}>{"The Accountability Tracker will help you log your weekly activity, measure results, and stay on track toward your goals."}</p>
      <p style={{color:GRAY400,fontSize:13,lineHeight:1.8,margin:0}}>{"We're building this out now. Check back soon."}</p>
    </div>
    <div style={{display:"flex",justifyContent:"flex-start",paddingTop:20,borderTop:"1px solid "+GRAY200}}>
      <Btn variant="ghost" onClick={()=>onNext("amplify_home")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
    </div>
  </div>;
}

// ── WEEK COMPLETE ─────────────────────────────────────────────────────────────
function WeekComplete({flags,onNext}){
  const s=useSp();
  return <div>
    <div style={{background:NAVY,borderRadius:20,padding:"40px 32px",textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:64,marginBottom:16}}>🏆</div>
      <h1 style={{color:YELLOW,fontSize:26,fontWeight:900,margin:"0 0 12px",lineHeight:1.3}}>{s?"¡Semana 2 Completa!":"Week 2 Complete!"}</h1>
      <p style={{color:WHITE,fontSize:15,lineHeight:1.8,margin:"0 0 20px"}}>{s?"Lo lograste. Completaste todos tus objetivos de la Semana 2.":"You did it. You completed every goal for Week 2."}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:4}}>📣</div>
          <div style={{color:YELLOW,fontWeight:900,fontSize:18}}>5</div>
          <div style={{color:WHITE,fontSize:12,marginTop:2}}>{s?"Publicaciones de Introducción":"Intro Posts"}</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:4}}>💬</div>
          <div style={{color:YELLOW,fontWeight:900,fontSize:18}}>5</div>
          <div style={{color:WHITE,fontSize:12,marginTop:2}}>{s?"Comentarios en Publicaciones":"Comments on Posts"}</div>
        </div>
      </div>
      <p style={{color:GRAY400,fontSize:13,lineHeight:1.8,margin:"0 0 24px"}}>{s?"Tu perfil está activo. Tu introducción está publicada. Dejaste comentarios en 5 publicaciones reales de vecinos. Tu presencia en Nextdoor está viva.":"Your profile is live. Your intro is posted. You left comments on 5 real neighbor posts. Your Nextdoor presence is alive."}</p>
      <p style={{color:WHITE,fontSize:13,lineHeight:1.8,margin:"0 0 24px"}}>{"Keep an eye on your Nextdoor notifications. When neighbors engage with your posts or comments, head to Work Leads for scripts to turn those conversations into booked jobs."}</p>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <Btn variant="ghost" onClick={()=>onNext("comment_generate")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
        <Btn onClick={()=>onNext("leads_main")} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
      </div>
    </div>
  </div>;
}

// ── Main App ──────────────────────────────────────────────────────────────────
const VALID_PHASES=new Set(["home","get_post","setup","setup_personal","setup_business","setup_business_video","setup_customers","post_path","post_coach","post_video","post_personal","post_group","post_loop","comment_path","comment_how","comment_video","comment_coach","comment_generate","leads_main","week_complete","amplify_home","amplify_posts","amplify_comments","amplify_generate","amplify_how","amplify_video","amplify_post_coach","amplify_post_video","amplify_post_personal","tracker_home"]);
export default function App(){
  const [phase,setPhaseRaw]=useState(()=>{const p=lsGet(LS_PHASE,"home");return VALID_PHASES.has(p)?p:"home";});
  const [flags,setFlagsRaw]=useState(()=>({...DEF_FLAGS,...lsGet(LS_FLAGS,{})}));
  const [inputs,setInputsRaw]=useState(()=>({...DEF_INPUTS,...lsGet(LS_INPUTS,{}),week1Post:MOCK_POST}));
  const [outputs,setOutputsRaw]=useState(()=>({...DEF_OUTPUTS,...lsGet(LS_OUTPUTS,{})}));
  const [lang,setLang]=useState(()=>lsGet("hcp_nd_lang","en"));
  const topRef=useRef(null);

  function setPhase(p){setPhaseRaw(p);lsSet(LS_PHASE,p);}
  function setFlag(k,v){setFlagsRaw(prev=>{const n={...prev,[k]:v};lsSet(LS_FLAGS,n);return n;});}
  function setInputs(fn){setInputsRaw(prev=>{const n=typeof fn==="function"?fn(prev):fn;lsSet(LS_INPUTS,n);return n;});}
  function setOutputs(fn){setOutputsRaw(prev=>{const n=typeof fn==="function"?fn(prev):fn;lsSet(LS_OUTPUTS,n);return n;});}
  function switchLang(l){setLang(l);lsSet("hcp_nd_lang",l);}
  useEffect(()=>{if(topRef.current)topRef.current.scrollIntoView({behavior:"smooth"});},[phase]);

  const setupDone=flags.setupPath&&flags.personalAccountDone&&flags.businessPageDone&&flags.customersDone;
  const postsDone=(flags.introPostCount||0)>=5;
  const commentsDone=(flags.commentCount||0)>=5;
  const weekComplete=setupDone&&postsDone&&commentsDone;
  const isHome=phase==="home";
  const s=lang==="es";

  function getNextPhase(){
    if(!flags.postConfirmed)return"get_post";
    if(!flags.setupPath)return"setup";
    if(!flags.personalAccountDone)return"setup_personal";
    if(!flags.businessPageDone)return"setup_business";
    if(!flags.customersDone)return"setup_customers";
    if(!flags.introPath||(flags.introPostCount||0)<5)return"post_path";

    if((flags.commentCount||0)<5)return flags.commentPath?"comment_generate":"comment_path";
    return"leads_main";
  }

  const sp2={flags,setFlag,inputs,setInputs,outputs,setOutputs,onNext:setPhase,onBack:setPhase};

  const HOME_STEPS=[
    {num:1,phase:"get_post",      label:s?"Importar Tu Publicación":"Import Your Week 1 Post",         sub:s?"Requerido antes de comenzar":"Required before anything else can begin",      done:flags.postConfirmed,locked:false},
    {num:2,phase:"setup_path",label:s?"Configuración de Cuenta":"Account Setup",                   sub:s?"Completa una vez — desbloquea tus bios":"Complete once — unlocks your bios",      done:setupDone,          locked:!flags.postConfirmed},
    {num:3,phase:!flags.introPath?"post_path":(flags.introPostCount||0)<1?"post_personal":(flags.introPostCount||0)<2?"post_group":(flags.introPostCount||0)<5?"post_loop":"post_loop",label:s?"Implementación Semanal":"Weekly Implementation",sub:s?"Llega a 5 y 5 para completar la semana":"Hit 5 and 5 to complete the week",done:postsDone&&commentsDone,locked:!setupDone},
    {num:4,phase:"leads_main",    label:s?"Trabajar Prospectos":"Work Leads",                           sub:s?"Guiones para cada DM, comentario y compartido":"Scripts for every DM, comment, like, and share",done:false,locked:false},
    {num:5,phase:"amplify_home",  label:s?"Amplificar":"Amplify",                                       sub:s?"Más publicaciones, más comentarios, más visibilidad":"More posts, more comments, more visibility",done:false,locked:false,bonus:true},
    {num:6,phase:"tracker_home",  label:s?"Rastreador de Responsabilidad":"Accountability Tracker",     sub:s?"Registra tu actividad y mide tus resultados":"Log your activity and measure your results",done:false,locked:false,bonus:true},
  ];

  return (
    <LangCtx.Provider value={lang}>
      <div style={{minHeight:"100vh",background:GRAY50,fontFamily:"'Inter',-apple-system,sans-serif"}}>
        {/* Header */}
        <div style={{background:NAVY,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{background:YELLOW,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:NAVY,fontSize:18}}>N</div>
            <div><div style={{color:WHITE,fontWeight:800,fontSize:16,lineHeight:1}}>Business Coaching Foundations</div><div style={{color:ND_GREEN,fontSize:12,fontWeight:600}}>Week 2 — Nextdoor Organic Strategy</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1.5px solid rgba(255,255,255,0.2)"}}>
              {["en","es"].map(l=><button key={l} onClick={()=>switchLang(l)} style={{padding:"6px 14px",fontWeight:700,fontSize:13,border:"none",cursor:"pointer",background:lang===l?YELLOW:"transparent",color:lang===l?NAVY:WHITE,transition:"all 0.2s"}}>{l.toUpperCase()}</button>)}
            </div>
            {!isHome&&<button onClick={()=>setPhase("home")} style={{background:YELLOW,border:"none",borderRadius:8,padding:"8px 18px",color:NAVY,fontSize:13,fontWeight:800,cursor:"pointer",marginLeft:16}}>{s?"Guardar y Salir":"Save & Exit"}</button>}
          </div>
        </div>

        <div ref={topRef}>
          {/* HOME */}
          {isHome&&<div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 60px"}}>
            <div style={{background:NAVY,borderRadius:16,padding:32,marginBottom:24,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏡</div>
              <h1 style={{color:WHITE,fontSize:24,fontWeight:900,margin:"0 0 12px",lineHeight:1.3}}>Week 2 — Nextdoor<br/><span style={{color:ND_GREEN}}>Organic Strategy</span></h1>
              <p style={{color:GRAY400,fontSize:14,lineHeight:1.8,margin:"0 0 24px",maxWidth:500,marginLeft:"auto",marginRight:"auto"}}>{s?"Completa la configuración de tu cuenta una vez, luego haz 5 publicaciones y 5 comentarios para alcanzar tu meta semanal.":"Complete your account setup once, then hit 5 intro posts and 5 comments to hit your weekly goal."}</p>
              <button onClick={()=>setPhase(getNextPhase())} style={{background:YELLOW,border:"none",borderRadius:12,padding:"14px 28px",color:NAVY,fontWeight:900,fontSize:16,cursor:"pointer"}}>
                {s?"Continuar →":("Continue → "+({get_post:"Import Post",setup:"Account Setup",setup_personal:"Personal Account",setup_business:"Business Page",setup_customers:"Get Reviews on Nextdoor",post_path:"Intro Posts",comment_path:"Comments",leads_main:"Work Leads",week_complete:"Week Complete"}[getNextPhase()]||"Next Step"))}
              </button>
            </div>
            {HOME_STEPS.map((step,si)=>{
              const isLocked=step.locked;
              return <div key={si} onClick={!isLocked?()=>setPhase(step.phase):undefined}
                style={{marginBottom:12,borderRadius:14,border:"1.5px solid "+(step.done?GREEN:step.bonus?"#C4B5FD":GRAY200),overflow:"hidden",opacity:isLocked?0.5:1,pointerEvents:isLocked?"none":"auto",boxShadow:"0 2px 12px rgba(0,41,66,0.06)",display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:step.done?"#F0FDF4":step.bonus?"#FAF5FF":WHITE,cursor:isLocked?"default":"pointer"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:step.done?GREEN:isLocked?GRAY200:NAVY,color:WHITE,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,flexShrink:0}}>
                  {step.done?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>:step.num}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:isLocked?GRAY400:step.done?"#065F46":NAVY,fontSize:15}}>{step.label}</div>
                  <div style={{fontSize:12,color:isLocked?GRAY400:GRAY600,marginTop:2}}>{step.sub}</div>
                </div>
                {isLocked?<span style={{background:GRAY100,color:GRAY400,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700}}>{s?"🔒 Bloqueado":"🔒 Locked"}</span>:step.bonus?<span style={{background:"#EDE9FE",color:"#6D28D9",borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700}}>{"Bonus"}</span>:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>}
              </div>;
            })}
            
          </div>}

          {/* INNER PHASES */}
          {!isHome&&<div style={{display:"flex",minHeight:"calc(100vh - 68px)"}}>
            <SideNav current={phase} onNavigate={setPhase} flags={flags}/>
            <div style={{flex:1,padding:"28px 40px 60px",minWidth:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"100%",maxWidth:720}}>
                {phase==="get_post"            &&<GetPost        inputs={inputs} setInputs={setInputs} setFlag={setFlag} onNext={setPhase}/>}
                {phase==="setup"               &&<SetupPath      setFlag={setFlag} onNext={setPhase} s={s}/>}
                {phase==="setup_personal"      &&(flags.setupPath==="coach"?<SetupPersonalCoach {...sp2}/>:<SetupPersonal  {...sp2}/>)}
                {phase==="setup_business"      &&(flags.setupPath==="coach"?<SetupBusinessCoach {...sp2}/>:<SetupBusiness  {...sp2}/>)}
                {phase==="setup_business_video"&&<VideoPlaceholder title="Business Page Setup — Video Walkthrough" titleEs="Página de Negocio — Video Tutorial" videoUrl={null} s={s} onBack={()=>setPhase("setup_personal")} backLabel={s?"← Atrás":"← Back"} onNext={()=>{setFlag("businessPageDone",true);setPhase("setup_customers");}}/>}
                {phase==="setup_customers"     &&<SetupCustomers {...sp2}/>}
                {phase==="post_path"       &&<PostPath       setFlag={setFlag} flags={flags} onNext={setPhase} s={s}/>}
                {phase==="post_coach"      &&<PostCoach      inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="post_video"      &&<PostVideo      flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="post_personal"   &&<PostPersonal   flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="post_group"      &&<PostGroup      flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="post_loop"       &&<PostLoop       flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="comment_path"    &&<CommentPath    flags={flags} setFlag={setFlag} onNext={setPhase} s={s}/>}
                {phase==="comment_how"     &&<CommentHow     flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="comment_video"   &&<CommentVideo   flags={flags} setFlag={setFlag} onNext={setPhase} onBack={setPhase} s={s}/>}
                {phase==="comment_coach"   &&<CommentCoach   flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="comment_generate"&&<CommentGenerate flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase}/>}
                {phase==="week_complete"   &&<WeekComplete   flags={flags} onNext={setPhase}/>}
                {phase==="tracker_home"    &&<TrackerHome    onNext={setPhase}/>}
                {phase==="amplify_home"    &&<AmplifyHome    flags={flags} onNext={setPhase} s={s}/>}
                {phase==="amplify_posts"        &&<PostPath      setFlag={setFlag} flags={flags} onNext={p=>setPhase(p==="post_coach"?"amplify_post_coach":p==="post_video"?"amplify_post_video":p==="post_personal"?"amplify_post_personal":p)} s={s}/>}
                {phase==="amplify_post_coach"   &&<PostCoach     inputs={inputs} onNext={()=>setPhase("amplify_comments")} onBack={()=>setPhase("amplify_posts")}/>}
                {phase==="amplify_post_video"   &&<PostVideo     flags={flags} setFlag={setFlag} inputs={inputs} onNext={()=>setPhase("amplify_comments")} onBack={()=>setPhase("amplify_posts")}/>}
                {phase==="amplify_post_personal"&&<PostPersonal  flags={flags} setFlag={setFlag} inputs={inputs} onNext={()=>setPhase("amplify_comments")} onBack={()=>setPhase("amplify_posts")}/>}
                {phase==="amplify_comments"&&<CommentPath    flags={flags} setFlag={setFlag} onNext={p=>setPhase(p==="comment_generate"?"amplify_generate":p==="comment_how"?"amplify_how":p==="comment_video"?"amplify_video":p)} s={s}/>}
                {phase==="amplify_how"      &&<CommentHow     flags={flags} setFlag={setFlag} inputs={inputs} onNext={()=>setPhase("amplify_generate")} onBack={()=>setPhase("amplify_comments")}/>}
                {phase==="amplify_video"    &&<CommentVideo   flags={flags} setFlag={setFlag} onNext={()=>setPhase("amplify_generate")} onBack={()=>setPhase("amplify_comments")} s={s}/>}
                {phase==="amplify_generate" &&<CommentGenerate flags={flags} setFlag={setFlag} inputs={inputs} onNext={setPhase} onBack={setPhase} amplify={true}/>}
                {phase==="leads_main"      &&<WorkLeads      flags={flags} setFlag={setFlag} onBack={setPhase}/>}
              </div>
            </div>
          </div>}
        </div>
      </div>
    </LangCtx.Provider>
  );
}