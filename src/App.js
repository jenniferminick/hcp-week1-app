import { useState, useRef, useEffect } from "react";

const NAVY = "#002942";
const NAVY_LIGHT = "#003a5c";
const YELLOW = "#FEB705";
const WHITE = "#FFFFFF";
const GRAY50 = "#F8FAFC";
const GRAY100 = "#F1F5F9";
const GRAY200 = "#E2E8F0";
const GRAY400 = "#94A3B8";
const GRAY600 = "#475569";
const GRAY800 = "#1E293B";
const GREEN = "#10B981";
const RED = "#EF4444";
const COACH_PASSCODE = "coach123";

const NAV_SECTIONS = [
  { id: "write",     label: "Write Post",     phases: ["ch1","ch2","ch3"] },
  { id: "grouppost", label: "Post in Groups", phases: ["groups","getpost","copypost","photo","dopost","approval","replicate"] },
  { id: "leads",     label: "Work Leads",     phases: ["leads"] },
];

const PHASE_LABELS = {
  ch1: "Chapter 1", ch2: "Chapter 2", ch3: "Chapter 3",
  groups: "1. Join a Group", getpost: "2. Get Your Post", copypost: "3. Copy Post",
  photo: "4. Add Photo", dopost: "5. Post It", approval: "6. Get Approval", replicate: "7. Cross-Post",
  leads: "Lead Engagement",
};

const NO_NAV_PHASES = ["lane","writechoice","voice"];

const SAMPLE_ANSWERS = {
  name: "Marcus Webb", business: "Webb Home Services",
  area: "East Nashville, Donelson, and Hermitage - been working this area for going on 11 years now",
  knownFor: "slow drain detective", topServices: "drain cleaning and water heater installs",
  refuses: "I will never tell someone they need a full repipe just to run up a bill when a simple repair will fix the problem just fine",
  humanDetail: "I have been slowly restoring a 1967 candy apple red Ford Bronco I found rusting in a barn two summers ago and my son comes out to the garage every Saturday to help me wrench on it",
  localPlace: "Mas Tacos Por Favor in East Nashville",
  localActivity: "always get the chicken taco plate and eat it standing outside on the sidewalk no matter what the weather is doing",
  mission: "hot chicken in Nashville",
  whyStarted: "I got tired of watching my old boss charge elderly customers three times what a job was worth and then sleeping just fine at night - I walked out one afternoon and never looked back and it was the best decision I ever made",
  whatChanged: "Now I make it home for dinner most nights and I coached my son's baseball team this spring for the first time",
  heroCrisis: "An elderly woman called me at 7pm on Christmas Eve her heat had been out for two days and she had her three grandkids coming in from out of town the next morning and she was in tears on the phone when I picked up",
  heroSacrifice: "I drove 40 minutes out there worked two hours in the cold and only charged her for the cost of the part because I was not going to let her spend Christmas worrying about a bill",
  heroPayoff: "She grabbed my hand on the way out and told me she was going to tell everyone she knew about me and she has sent me four referrals since that night",
};

const ALL_QUESTIONS = [
  { id: "name",          num: 1,    chapter: "ch1", minWords: 2,  label: "Your Name",                    hint: "First and last name. Minimum 2 words.",                                                                           placeholder: "e.g. Sarah Mitchell" },
  { id: "business",      num: 2,    chapter: "ch1", minWords: 2,  label: "Business Name",                hint: "Business name as shown online. Minimum 2 words.",                                                                 placeholder: "e.g. Mitchell Home Services" },
  { id: "area",          num: 3,    chapter: "ch1", minWords: 8,  label: "Where You Serve",              hint: "Cities or neighborhoods you serve and how long you have been in the area. Minimum 8 words.",                      placeholder: "e.g. East Nashville, Donelson, and Hermitage - been working this area for going on 11 years now" },
  { id: "knownFor",      num: 4,    chapter: "ch1", minWords: 3,  label: "Your Known For",               hint: "2-3 specific words that describe what you are the go-to person for. No generic words. Minimum 3 words.",          placeholder: "e.g. slow drain detective or same-day water heater guy" },
  { id: "topServices",   num: 5,    chapter: "ch1", minWords: 4,  label: "Top 2 Services",               hint: "The two services you most want to be known for. Minimum 4 words.",                                               placeholder: "e.g. drain cleaning and water heater installs" },
  { id: "refuses",       num: "5b", chapter: "ch1", minWords: 15, label: "What You Refuse to Do",        hint: "One firm thing you refuse to do that others in your industry do. Minimum 15 words.",                             placeholder: "e.g. I will never tell someone they need a full repipe just to run up a bill when a simple repair will fix the problem just fine" },
  { id: "humanDetail",   num: 6,    chapter: "ch2", minWords: 15, label: "One Human Detail",             hint: "One real detail about you outside work with specifics like year, color, name, or context. Minimum 15 words.",    placeholder: "e.g. I have been slowly restoring a 1967 candy apple red Ford Bronco I found rusting in a barn two years ago" },
  { id: "localPlace",    num: 7,    chapter: "ch2", minWords: 4,  label: "Local Flavor - Place",         hint: "The actual name of one specific local place you genuinely love. Minimum 4 words.",                               placeholder: "e.g. Mas Tacos Por Favor in East Nashville" },
  { id: "localActivity", num: "7b", chapter: "ch2", minWords: 10, label: "What You Do There",            hint: "Exactly what you do or always order there. Minimum 10 words.",                                                  placeholder: "e.g. always get the chicken taco plate and eat it standing outside on the sidewalk" },
  { id: "mission",       num: 8,    chapter: "ch2", minWords: 3,  label: "Your Mission Question",        hint: "Fill in the blank: I am on a mission to find the best blank. Minimum 3 words.",                                 placeholder: "e.g. hot chicken in Nashville or breakfast taco in town" },
  { id: "whyStarted",    num: 9,    chapter: "ch3", minWords: 20, label: "Why You Started",              hint: "The real moment that pushed you to start your business. Be honest and specific. Minimum 20 words.",              placeholder: "e.g. I got tired of watching my old boss charge elderly customers three times what a job was worth and sleeping fine at night - I walked out and never looked back" },
  { id: "whatChanged",   num: "9b", chapter: "ch3", minWords: 10, label: "What Did It Change?",          hint: "A real concrete change in your life or family since going out on your own. Minimum 10 words.",                  placeholder: "e.g. Now I make it home for dinner most nights and I coached my son's baseball team this spring" },
  { id: "heroCrisis",    num: 10,   chapter: "ch3", minWords: 20, label: "Hero Moment - The Crisis",     hint: "Paint the full picture of who was in trouble, what the situation looked like, what was at stake. Minimum 20 words.", placeholder: "e.g. An elderly woman called me at 7pm on Christmas Eve, her heat had been out for two days, and she had her grandkids coming in the morning" },
  { id: "heroSacrifice", num: "10b",chapter: "ch3", minWords: 10, label: "Hero Moment - The Sacrifice",  hint: "What you actually did or gave up. Minimum 10 words.",                                                            placeholder: "e.g. I drove 40 minutes, worked two hours, and only charged her for the cost of the part" },
  { id: "heroPayoff",    num: "10c",chapter: "ch3", minWords: 10, label: "Hero Moment - The Payoff",     hint: "The real emotional reaction, theirs or yours. Minimum 10 words.",                                               placeholder: "e.g. She grabbed my hand on the way out and said she was going to tell everyone she knew about me" },
];

const ch1Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch1");
const ch2Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch2");
const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");

const BOOKING_SCRIPT = `I've got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I'll handle the rest.`;

const LEAD_TYPES = [
  {
    id: "like", emoji: "👍", label: "Like or Emoji", color: "#FEF9EC", border: YELLOW,
    simple: true, batch: true,
    steps: [
      { label: "Within 24 hours, send this DM to each person who reacted", script: `Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?` },
      { label: "Then follow the DM strategy based on their response", note: true },
    ],
  },
  {
    id: "comment", emoji: "💬", label: "Comment", color: "#EFF6FF", border: "#93C5FD",
    simple: false,
    subtypes: [
      { id: "comment_service_q", label: "Asked about a service you offer", example: '"Do you do drain cleaning?"',
        publicReplies: [`@[Name] great question. I do handle [service type], and quality is always guaranteed.`, `@[Name] yes! Whether it's [service A] or [service B], we make sure it's done right every time.`],
        dmScript: `Hey [Name], thanks so much for commenting. I didn't want to get into the details publicly. We absolutely can help with [service]. ${BOOKING_SCRIPT}` },
      { id: "comment_area_q", label: "Asked about your service area", example: '"Do you service Donelson?"',
        publicReplies: [`@[Name] great question. We do service [city name], we'd love to help you out.`, `@[Name] yes! Whether it's [service A] or [service B], we make sure it's done right every time.`],
        dmScript: `Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious — is there something specific going on I can help with?` },
      { id: "comment_needs_now", label: "Needs help now", example: '"I was just about to call someone!"',
        publicReplies: [`@[Name] we'd love to help serve you and your family.`, `@[Name] the stars have aligned — we'd be glad to help.`],
        dmScript: `Hey [Name], so glad you reached out. ${BOOKING_SCRIPT}` },
      { id: "comment_praise", label: "Praise or encouragement", example: '"Love this post! Keep it up!"',
        publicReplies: [`@[Name] really appreciate the kind words! Makes all the long days worth it.`, `@[Name] thanks so much. Our community is what makes our work so rewarding.`],
        dmScript: `Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you.` },
      { id: "comment_testimonial", label: "Past customer or testimonial", example: '"He did great work for us last year!"',
        publicReplies: [`@[Name] repeat customers like you are what keep me going. Grateful for your support.`, `@[Name] thanks for sharing your experience! Referrals and word of mouth are how small businesses like mine grow.`],
        dmScript: `Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?` },
      { id: "comment_referral", label: "Referral or future interest", example: '"I\'ll share this with my neighbor!"',
        publicReplies: [`@[Name] really appreciate that. Supporting local businesses helps the whole community.`, `@[Name] thanks so much. I'd love to earn their trust the same way I earned yours.`],
        dmScript: `Hey [Name], really appreciate that. The best compliment someone can give us is to refer us to someone else. We'd love to help them out — could you share their name and phone number?` },
      { id: "comment_community", label: "Community connection", example: '"We need more people like you in this town!"',
        publicReplies: [`@[Name] thank you. Our community deserves honest work and that's what I'll always stand for.`, `@[Name] love that! If you see me around, definitely say hi.`],
        dmScript: `I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I'd be glad to.` },
    ],
  },
  {
    id: "share", emoji: "🔁", label: "Share", color: "#F0FDF4", border: "#86EFAC",
    simple: true,
    steps: [
      { label: "Comment on their share", script: `@[Name] really appreciate that. Supporting local businesses helps the whole community.` },
      { label: "Then send this DM", script: `Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you.` },
    ],
  },
  {
    id: "dm", emoji: "✉️", label: "Direct Message", color: "#FDF4FF", border: "#D8B4FE",
    simple: false,
    subtypes: [
      { id: "dm_service_yes", label: "Asked about a service you offer", example: '"Do you do water heater installs?"',
        dmScript: `Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. We absolutely can help with [service name]. ${BOOKING_SCRIPT}` },
      { id: "dm_service_no", label: "Asked about a service you don't offer", example: '"Do you do roof repairs?"',
        dmScript: `Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. We don't provide [service you don't offer] but we do provide [services you offer]. Is there another item on your to-do list we can help with?` },
      { id: "dm_general_q", label: "General question or area check", example: '"Do you service Hermitage?"',
        dmScript: `Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. [Insert your answer to their question here.]` },
      { id: "dm_needs_now", label: "Needs help now", example: '"I was just about to call someone — DMing you now!"',
        dmScript: `Hey, thanks so much for reaching out. I really appreciate it. I wasn't sure how that post would land, so it means a lot that it resonated. ${BOOKING_SCRIPT}` },
      { id: "dm_praise", label: "Praise or encouragement", example: '"Way to go! Love what you\'re doing."',
        dmScript: `Hey [Name], really appreciate the encouragement. Means a lot to know the work we're doing is connecting with people. If you ever need help with [services], I'd be glad to take care of you.` },
      { id: "dm_testimonial", label: "Past customer or testimonial", example: '"He did our siding last year — highly recommend!"',
        dmScript: `Your recommendation means the world to me. Referrals and word of mouth are what keep small businesses like mine alive. Do you know anyone else who could use [services]?` },
      { id: "dm_referral", label: "Referral or future interest", example: '"Can you help my friend?"',
        dmScript: `Hey, thanks so much for reaching out. I really appreciate it. The best compliment someone can give us is to refer us to someone else. We'd love to help them out — could you share their name and phone number?` },
      { id: "dm_community", label: "Community connection", example: '"We need more people like you in this town!"',
        dmScript: `I love being part of [city/community], and I want people here to know they have someone they can trust for [services]. If you ever need help at your place, I'd be glad to.` },
      { id: "dm_competitor", label: "Competitor or peer", example: '"We do the same services in another town."',
        dmScript: `Great to hear from you, [Name]. I've found there's more than enough work to go around, and sometimes the right partnership can be a win-win. If you ever have overflow jobs or something outside your focus, feel free to send them my way. I'll do the same for you.` },
      { id: "dm_emotional", label: "Emotional support or values-based", example: '"I\'m so proud of you. Blessings to you!"',
        dmScript: `That's so kind of you, [Name]. Messages like this remind me why I started this business. Thank you for taking the time to say that.` },
    ],
  },
];

function wordCount(str) { return (str || "").trim().split(/\s+/).filter(Boolean).length; }
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 1;
  window.speechSynthesis.speak(u);
}

async function callClaude(messages, system) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 2000, messages };
  if (system) body.system = system;
  const headers = { "Content-Type": "application/json" };
  const key = process.env.REACT_APP_ANTHROPIC_KEY;
  if (key) { headers["x-api-key"] = key; headers["anthropic-version"] = "2023-06-01"; }
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(body) });
  const d = await r.json();
  return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("") || "";
}

async function validateChapterAnswers(questions, answers) {
  const block = questions.map(q => "Q" + q.num + " - " + q.label + ": " + (answers[q.id] || "(no answer)")).join("\n");
  const reply = await callClaude([{ role: "user", content: "You are a business coach reviewing answers for a Facebook story post. Check each for real specificity - real names, places, actions, emotions. Vague generic answers are not acceptable.\n\nANSWERS:\n" + block + "\n\nReturn only JSON: {\"passed\": true or false, \"feedback\": {\"questionId\": \"coaching message\"}}. Only include IDs needing improvement." }]);
  try {
    const clean = reply.replace(/```json|```/g, "").trim();
    const s = clean.indexOf("{"); const e = clean.lastIndexOf("}");
    return s !== -1 ? JSON.parse(clean.slice(s, e + 1)) : { passed: true, feedback: {} };
  } catch(e) { return { passed: true, feedback: {} }; }
}

async function findFacebookGroups(city, count) {
  const reply = await callClaude([{ role: "user", content: "Generate " + count + " realistic Facebook group names for the " + city + " area that a home service contractor could post in. Sort them: Public groups first, then Private. Within each, sort by member count descending.\n\nReturn ONLY a raw JSON array:\n[{\"name\": \"group name\", \"type\": \"Community or Homeowners or Family or Buy/Sell or Neighborhood\", \"members\": \"e.g. 4.2K\", \"privacy\": \"Public or Private\"}]" }]);
  const match = reply.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    const groups = parsed.filter(g => g.name).map(g => Object.assign({}, g, { url: "https://www.facebook.com/search/groups/?q=" + encodeURIComponent(g.name) }));
    // Sort: Public first, then by member count descending
    return groups.sort((a, b) => {
      if (a.privacy === b.privacy) {
        const aM = parseFloat((a.members || "0").replace(/[^0-9.]/g, "") || 0) * (a.members && a.members.includes("K") ? 1000 : 1);
        const bM = parseFloat((b.members || "0").replace(/[^0-9.]/g, "") || 0) * (b.members && b.members.includes("K") ? 1000 : 1);
        return bM - aM;
      }
      return a.privacy === "Public" ? -1 : 1;
    });
  } catch(e) { return []; }
}

async function generateAIPost(ans) {
  const p = "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.\n\n"
    + "Answers:\n1. Name: " + (ans.name||"") + "\n2. Business: " + (ans.business||"") + "\n3. Area: " + (ans.area||"")
    + "\n4. Known For: " + (ans.knownFor||"") + "\n5. Services: " + (ans.topServices||"") + "\n5b. Refuses: " + (ans.refuses||"")
    + "\n6. Human Detail: " + (ans.humanDetail||"") + "\n7. Local Place: " + (ans.localPlace||"") + "\n7b. Activity: " + (ans.localActivity||"")
    + "\n8. Mission: " + (ans.mission||"") + "\n9. Why Started: " + (ans.whyStarted||"") + "\n9b. Changed: " + (ans.whatChanged||"")
    + "\n10. Crisis: " + (ans.heroCrisis||"") + "\n10b. Sacrifice: " + (ans.heroSacrifice||"") + "\n10c. Payoff: " + (ans.heroPayoff||"")
    + "\n\nSTRICT NO-HALLUCINATION: Only use facts from answers above. Never invent details.\n"
    + "RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. No em dashes. No CTA, phone, or website. Fix all grammar and capitalization. 330-450 words. Short paragraphs.\n"
    + "STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Hero moment as vivid 8-12 line scene, (4) Neighbor proof with refusal + human detail + local place, (5) End ONLY with: \"Also, I'm on a mission to find the best [mission] in [city]. Any suggestions?\"\n"
    + "Output post only. No labels.";
  return await callClaude([{ role: "user", content: p }]);
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={Object.assign({ background: WHITE, borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,41,66,0.08)", marginBottom: 20 }, style || {})}>{children}</div>;
}
function Btn({ children, onClick, variant, style, disabled }) {
  const v = variant || "primary";
  const base = { border: "none", borderRadius: 10, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 };
  const vars = { primary: { background: YELLOW, color: NAVY }, secondary: { background: NAVY, color: WHITE }, success: { background: GREEN, color: WHITE }, ghost: { background: GRAY100, color: GRAY600 } };
  return <button onClick={onClick} disabled={!!disabled} style={Object.assign({}, base, vars[v] || vars.primary, { opacity: disabled ? 0.5 : 1 }, style || {})}>{children}</button>;
}
function SectionHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ color: GRAY600, margin: "8px 0 0", fontSize: 14, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}
function WhyBlock({ text }) {
  return <div style={{ borderLeft: "4px solid " + YELLOW, background: GRAY50, borderRadius: "0 10px 10px 0", padding: "14px 16px 14px 20px", marginBottom: 24 }}><p style={{ margin: 0, fontSize: 14, color: GRAY600, fontStyle: "italic", lineHeight: 1.7 }}>{"💡 " + text}</p></div>;
}
function TimeBadge({ phase }) {
  const times = { ch1: "~3 min", ch2: "~2 min", ch3: "~3 min", leads: "~5 min" };
  const t = times[phase]; if (!t) return null;
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 99, padding: "3px 12px", fontSize: 12, color: "#1D4ED8", fontWeight: 600, marginBottom: 20 }}>{"⏱ Estimated time: " + t}</div>;
}
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY400, marginBottom: 4 }}><span>{current} of {total} answered</span><span>{pct}%</span></div>
      <div style={{ background: GRAY200, borderRadius: 99, height: 6 }}><div style={{ background: YELLOW, borderRadius: 99, height: 6, width: pct + "%", transition: "width 0.4s" }} /></div>
    </div>
  );
}

function PhaseNav({ current, onNavigate, completedSections }) {
  if (NO_NAV_PHASES.includes(current)) return null;
  const activeSection = NAV_SECTIONS.find(s => s.phases.includes(current));
  if (!activeSection) return null;
  const subPhases = activeSection.phases;
  const currentSubIdx = subPhases.indexOf(current);
  const sectionPct = subPhases.length === 0 ? 0 : Math.round(((currentSubIdx + 1) / subPhases.length) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
        {NAV_SECTIONS.map(section => {
          const sectionActive = section.phases.includes(current);
          const sectionDone = completedSections.includes(section.id);
          return (
            <div key={section.id} style={{ flex: 1, minWidth: 0 }}>
              <div onClick={() => onNavigate && onNavigate(section.phases[0])}
                style={{ background: sectionDone ? GREEN : sectionActive ? NAVY : GRAY200, color: sectionDone ? WHITE : sectionActive ? YELLOW : GRAY600, borderRadius: sectionActive ? "10px 10px 0 0" : 10, padding: "8px 14px", fontSize: 13, fontWeight: 800, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                {sectionDone ? "✓ " : ""}{section.label}
              </div>
              {sectionActive && (
                <div style={{ background: GRAY50, border: "1px solid " + GRAY200, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
                  {subPhases.map((p, i) => {
                    const isDone = i < currentSubIdx;
                    const isActive = p === current;
                    return (
                      <div key={p} onClick={e => { e.stopPropagation(); onNavigate && onNavigate(p); }}
                        style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: isDone ? "#D1FAE5" : isActive ? YELLOW : GRAY200, color: isDone ? "#065F46" : isActive ? NAVY : GRAY400, cursor: "pointer", textAlign: "center", transition: "all 0.2s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {isDone ? "✓ " : ""}{PHASE_LABELS[p] || p}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: GRAY400, marginBottom: 4 }}>
          <span style={{ fontWeight: 600, color: GRAY600 }}>{activeSection.label}</span>
          <span style={{ fontWeight: 700, color: sectionPct === 100 ? GREEN : NAVY }}>{sectionPct}% complete</span>
        </div>
        <div style={{ background: GRAY200, borderRadius: 99, height: 10 }}>
          <div style={{ background: sectionPct === 100 ? GREEN : YELLOW, borderRadius: 99, height: 10, width: sectionPct + "%", transition: "width 0.4s ease" }} />
        </div>
      </div>
    </div>
  );
}

function MicBtn({ onTranscript, size }) {
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState("");
  const recogRef = useRef(null);
  const sz = size || 30;
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.continuous = false; r.interimResults = false; r.lang = "en-US";
    r.onresult = e => { onTranscript(e.results[0][0].transcript); setListening(false); };
    r.onerror = e => { setListening(false); setErr(e.error === "not-allowed" ? "Mic blocked." : "Mic error."); };
    r.onend = () => setListening(false);
    recogRef.current = r;
  }, []);
  const toggle = () => {
    if (!recogRef.current) return;
    if (listening) { recogRef.current.stop(); setListening(false); }
    else { try { recogRef.current.start(); setListening(true); setErr(""); } catch(e) {} }
  };
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <button type="button" onClick={toggle} style={{ background: listening ? RED : GRAY200, border: "none", borderRadius: "50%", width: sz, height: sz, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 5px rgba(239,68,68,0.2)" : "none", transition: "all 0.2s", flexShrink: 0 }}>
        <svg width={sz * 0.44} height={sz * 0.44} viewBox="0 0 24 24" fill={listening ? WHITE : GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
      </button>
      {listening && <span style={{ fontSize: 10, color: RED }}>Listening...</span>}
      {err && <span style={{ fontSize: 10, color: RED }}>{err}</span>}
    </span>
  );
}

function QField({ q, value, onChange, aiFeedback }) {
  const wc = wordCount(value);
  const met = wc >= q.minWords;
  const hasText = wc > 0;
  const borderColor = !hasText ? GRAY200 : met ? GREEN : RED;
  const bgColor = !hasText ? WHITE : met ? "#F0FDF4" : "#FFF5F5";
  const handleMic = text => { const c = value || ""; onChange(q.id, c ? c + " " + text : text); };
  return (
    <div id={"qfield-" + q.id} style={{ marginBottom: 20, borderRadius: 12, padding: aiFeedback ? "14px 14px 4px" : 0, background: aiFeedback ? "#FFF5F5" : "transparent", border: aiFeedback ? "2px solid #FCA5A5" : "2px solid transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ background: aiFeedback ? RED : NAVY, color: aiFeedback ? WHITE : YELLOW, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>Q{q.num}</span>
        <span style={{ fontWeight: 700, color: aiFeedback ? RED : NAVY, fontSize: 15 }}>{q.label}</span>
        <MicBtn onTranscript={handleMic} size={28} />
      </div>
      <p style={{ fontSize: 13, color: GRAY600, marginBottom: 4, marginTop: 0 }}>{q.hint}</p>
      <p style={{ fontSize: 12, color: GRAY400, marginBottom: 6, marginTop: 0, fontStyle: "italic" }}>{q.placeholder}</p>
      {aiFeedback && <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#7F1D1D", lineHeight: 1.7, display: "flex", gap: 8 }}><span>💬</span><span>{aiFeedback}</span></div>}
      <textarea value={value} onChange={e => onChange(q.id, e.target.value)} placeholder="Type or tap mic to speak..." rows={2}
        style={{ width: "100%", boxSizing: "border-box", border: "2px solid " + borderColor, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: GRAY800, fontFamily: "inherit", resize: "vertical", outline: "none", transition: "border 0.15s", background: bgColor, marginBottom: 4 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, minHeight: 20 }}>
        {hasText ? (
          <>
            <div style={{ flex: 1, background: GRAY200, borderRadius: 99, height: 4, overflow: "hidden" }}>
              <div style={{ background: met ? GREEN : RED, height: 4, borderRadius: 99, width: Math.min((wc / q.minWords) * 100, 100) + "%", transition: "width 0.2s" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: met ? GREEN : RED, whiteSpace: "nowrap" }}>{met ? "✓ " : ""}{wc} / {q.minWords} words{met ? "" : " min"}</span>
          </>
        ) : <span style={{ fontSize: 11, color: GRAY400 }}>Minimum {q.minWords} word{q.minWords !== 1 ? "s" : ""}</span>}
      </div>
    </div>
  );
}

function GroupTable({ groups, showNum }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ background: NAVY }}>{(showNum ? ["#"] : []).concat(["Group Name","Privacy","Members","Type"]).map(h => <th key={h} style={{ padding: "10px 12px", color: YELLOW, textAlign: "left", fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? WHITE : GRAY50, borderBottom: "1px solid " + GRAY200 }}>
              {showNum && <td style={{ padding: "10px 12px", color: GRAY400, fontWeight: 700, fontSize: 12 }}>{i + 2}</td>}
              <td style={{ padding: "10px 12px" }}>
                <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontWeight: 600, textDecoration: "underline" }}>{g.name}</a>
                <span style={{ display: "block", fontSize: 11, marginTop: 2, color: GRAY400 }}>Opens Facebook search</span>
              </td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ background: g.privacy === "Public" ? "#D1FAE5" : "#FEF9EC", color: g.privacy === "Public" ? "#065F46" : "#92400E", borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{g.privacy || "—"}</span>
              </td>
              <td style={{ padding: "10px 12px", color: GRAY600 }}>{g.members || "—"}</td>
              <td style={{ padding: "10px 12px" }}><span style={{ background: NAVY_LIGHT, color: YELLOW, borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{g.type}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoachDashboard({ onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [testMsg, setTestMsg] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const result = await window.storage.list("submission:", true);
      const keys = (result && result.keys) ? result.keys : [];
      const items = [];
      for (let i = 0; i < keys.length; i++) {
        try { const r = await window.storage.get(keys[i], true); if (r && r.value) items.push(JSON.parse(r.value)); } catch(e) {}
      }
      setSubmissions(items.sort((a, b) => b.timestamp - a.timestamp));
    } catch(e) { setSubmissions([]); }
    setLoading(false);
  }

  async function doTestSave() {
    setTestMsg("Saving...");
    try {
      await window.storage.set("submission:test_pro", JSON.stringify({ name: "Test Pro", business: "Test Biz", city: "Nashville", answers: {}, post: "Test post", status: "Post Generated", postGenerated: true, timestamp: Date.now(), updatedAt: Date.now() }), true);
      setTestMsg("Saved! Click Refresh.");
      setTimeout(loadData, 600);
    } catch(e) { setTestMsg("Error: " + e.message); }
  }

  useEffect(() => { loadData(); }, []);

  const STATUS_BADGES = [
    { label: "Post Generated", bg: "#DBEAFE", fg: "#1D4ED8" },
    { label: "Coach Approved", bg: "#FEF9C3", fg: "#854D0E" },
    { label: "10 Groups Done", bg: "#D1FAE5", fg: "#065F46" },
  ];
  const STATUS_ORDER = ["Post Generated","Coach Approved","10 Groups Done"];

  return (
    <div style={{ position: "fixed", inset: 0, background: GRAY100, zIndex: 300, overflowY: "auto" }}>
      <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: YELLOW, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: NAVY, fontSize: 18 }}>H</div>
          <div><div style={{ color: WHITE, fontWeight: 800, fontSize: 16, lineHeight: 1 }}>Coach Dashboard</div><div style={{ color: YELLOW, fontSize: 12, fontWeight: 600 }}>{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</div></div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadData} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 14px", color: WHITE, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↺ Refresh</button>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 14px", color: WHITE, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Back to App</button>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px 60px" }}>
        {loading && <Card><p style={{ textAlign: "center", color: GRAY600, padding: 40 }}>Loading...</p></Card>}
        {!loading && submissions.length === 0 && (
          <Card>
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: GRAY600, fontSize: 14, marginBottom: 20 }}>No submissions yet.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={doTestSave} style={{ background: YELLOW, color: NAVY, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>🧪 Write Test Entry</button>
                <button onClick={loadData} style={{ background: NAVY, color: WHITE, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>↺ Refresh</button>
              </div>
              {testMsg && <p style={{ marginTop: 14, fontWeight: 700, fontSize: 13, color: testMsg.startsWith("Saving") ? GRAY400 : testMsg.startsWith("Error") ? RED : GREEN }}>{testMsg}</p>}
            </div>
          </Card>
        )}
        {!loading && submissions.map((s, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: 17 }}>{s.name || "Unknown"}</div>
                <div style={{ fontSize: 13, color: GRAY600, marginTop: 2 }}>{s.business} · {s.city}</div>
                <div style={{ fontSize: 12, color: GRAY400, marginTop: 4 }}>{s.timestamp ? new Date(s.timestamp).toLocaleString() : "—"}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATUS_BADGES.map(badge => STATUS_ORDER.indexOf(s.status) >= STATUS_ORDER.indexOf(badge.label) ? (
                  <span key={badge.label} style={{ background: badge.bg, color: badge.fg, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>✓ {badge.label}</span>
                ) : null)}
              </div>
            </div>
            <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ marginTop: 14, background: GRAY50, border: "1px solid " + GRAY200, borderRadius: 8, padding: "6px 14px", fontSize: 12, color: NAVY, fontWeight: 600, cursor: "pointer" }}>
              {expanded === i ? "Hide Details ▲" : "View Details ▼"}
            </button>
            {expanded === i && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {ALL_QUESTIONS.filter(q => s.answers && s.answers[q.id]).map(q => (
                    <div key={q.id} style={{ background: GRAY50, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: GRAY400, marginBottom: 3 }}>Q{q.num} {q.label}</div>
                      <div style={{ fontSize: 13, color: GRAY800, lineHeight: 1.5 }}>{s.answers[q.id]}</div>
                    </div>
                  ))}
                </div>
                {s.post && <div><div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Generated Post:</div><div style={{ background: GRAY50, border: "1px solid " + GRAY200, borderRadius: 10, padding: 16, fontSize: 13, color: GRAY800, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{s.post}</div></div>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function VoiceMode({ onComplete }) {
  const [voiceStep, setVoiceStep] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [voiceAnswers, setVoiceAnswers] = useState({});
  const [transcript, setTranscript] = useState("");
  const [coachMsg, setCoachMsg] = useState("Hey! I am going to walk you through a series of questions to build your story. Tap the mic once and I will guide you through everything.");
  const [aiThinking, setAiThinking] = useState(false);
  const [rerecordId, setRerecordId] = useState(null);
  const [listening, setListening] = useState(false);
  const [micErr, setMicErr] = useState("");
  const recogRef = useRef(null);
  const activeRef = useRef(false);
  const processingRef = useRef(false);
  const qIdxRef = useRef(0);
  const rerecordRef = useRef(null);

  useEffect(() => { qIdxRef.current = qIdx; }, [qIdx]);
  useEffect(() => { rerecordRef.current = rerecordId; }, [rerecordId]);

  const answeredCount = Object.values(voiceAnswers).filter(v => v && v.trim()).length;
  const activeQ = rerecordRef.current ? ALL_QUESTIONS.find(x => x.id === rerecordRef.current) : ALL_QUESTIONS[qIdx];

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicErr("Speech recognition not supported."); return; }
    const r = new SR(); r.continuous = true; r.interimResults = false; r.lang = "en-US";
    r.onresult = async e => {
      const last = e.results[e.results.length - 1];
      if (!last.isFinal || processingRef.current) return;
      const text = last[0].transcript;
      processingRef.current = true; setTranscript(text); setAiThinking(true);
      const q = rerecordRef.current ? ALL_QUESTIONS.find(x => x.id === rerecordRef.current) : ALL_QUESTIONS[qIdxRef.current];
      const nextQ = ALL_QUESTIONS[Math.min(qIdxRef.current + 1, ALL_QUESTIONS.length - 1)];
      const reply = await callClaude([{ role: "user", content: "You are a warm conversational business coach. Keep responses short and natural.\n\nQuestion: " + q.label + " (" + q.hint + ")\nAnswer: " + text + "\nMin words: " + q.minWords + "\n\nIf specific and meets word count: Start with ACCEPT, one warm sentence, then ask: " + nextQ.hint + "\nIf too vague or short: Start with FOLLOWUP, one short coaching question." }]);
      const isAccept = reply.trim().toUpperCase().startsWith("ACCEPT");
      const msg = reply.replace(/^ACCEPT\s*/i, "").replace(/^FOLLOWUP\s*/i, "").trim();
      setCoachMsg(msg); speak(msg); setAiThinking(false);
      if (isAccept) {
        const id = rerecordRef.current || q.id;
        setVoiceAnswers(prev => Object.assign({}, prev, { [id]: text }));
        setTranscript(""); setRerecordId(null);
        if (!rerecordRef.current && qIdxRef.current < ALL_QUESTIONS.length - 1) { setQIdx(i => i + 1); setVoiceStep("listening"); }
        else if (!rerecordRef.current) { setVoiceStep("done"); activeRef.current = false; r.stop(); }
        else { setVoiceStep("listening"); }
      } else { setVoiceStep("coaching"); }
      processingRef.current = false;
    };
    r.onerror = e => { if (e.error === "no-speech") return; setMicErr(e.error === "not-allowed" ? "Mic blocked." : "Mic error: " + e.error); setListening(false); activeRef.current = false; };
    r.onend = () => { if (activeRef.current) { try { r.start(); } catch(e) {} } else { setListening(false); } };
    recogRef.current = r;
    return () => { activeRef.current = false; try { r.stop(); } catch(e) {} };
  }, []);

  const startListening = () => { if (!recogRef.current) return; try { recogRef.current.start(); activeRef.current = true; setListening(true); setMicErr(""); } catch(e) {} };
  const stopListening = () => { if (!recogRef.current) return; activeRef.current = false; recogRef.current.stop(); setListening(false); };
  const handleStart = () => { setVoiceStep("listening"); const msg = ALL_QUESTIONS[0].hint; setCoachMsg(msg); speak(msg); setTimeout(startListening, 600); };
  const handleRerecord = id => { setRerecordId(id); const q = ALL_QUESTIONS.find(x => x.id === id); const msg = "Sure, let's redo that. " + q.hint; setCoachMsg(msg); speak(msg); setTranscript(""); setVoiceStep("rerecord"); if (!listening) startListening(); };
  useEffect(() => { if (voiceStep === "done") setCoachMsg("That is everything I need. Amazing work. Let's build your post now."); }, [voiceStep]);

  const chapterLabel = activeQ ? { ch1: "Chapter 1", ch2: "Chapter 2", ch3: "Chapter 3" }[activeQ.chapter] : "";

  return (
    <div>
      <Card style={{ background: NAVY, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ background: YELLOW, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={NAVY}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
          </div>
          <div style={{ flex: 1 }}>{aiThinking ? <p style={{ color: GRAY400, fontSize: 14, margin: 0, fontStyle: "italic" }}>Processing...</p> : <p style={{ color: WHITE, fontSize: 16, margin: 0, lineHeight: 1.8 }}>{coachMsg}</p>}</div>
        </div>
      </Card>
      {voiceStep !== "intro" && voiceStep !== "done" && (
        <Card>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 8, paddingBottom: 8 }}>
            <button type="button" onClick={listening ? stopListening : startListening}
              style={{ background: listening ? RED : GRAY200, border: "none", borderRadius: "50%", width: 80, height: 80, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? "0 0 0 8px rgba(239,68,68,0.2)" : "none", transition: "all 0.3s" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={listening ? WHITE : GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
            </button>
            <span style={{ fontSize: 13, color: listening ? RED : GRAY400, fontWeight: listening ? 600 : 400 }}>{listening ? "Listening - speak your answer" : "Tap to resume"}</span>
            {micErr && <span style={{ fontSize: 12, color: RED }}>{micErr}</span>}
            {transcript && <div style={{ background: "#F0F7FF", border: "2px solid " + NAVY, borderRadius: 10, padding: "10px 14px", width: "100%", boxSizing: "border-box", fontSize: 14, color: GRAY800, lineHeight: 1.7 }}><div style={{ fontSize: 11, color: GRAY400, marginBottom: 4, fontWeight: 600 }}>YOU SAID:</div>{transcript}</div>}
          </div>
          {activeQ && <details style={{ marginTop: 8 }}><summary style={{ fontSize: 12, color: GRAY400, cursor: "pointer", userSelect: "none" }}>{chapterLabel} · Q{activeQ.num} of {ALL_QUESTIONS.length} · <span style={{ textDecoration: "underline" }}>See current question</span></summary><div style={{ marginTop: 8, padding: "10px 14px", background: GRAY50, borderRadius: 10, fontSize: 13, color: GRAY600, lineHeight: 1.6 }}><strong style={{ color: NAVY }}>{activeQ.label}</strong><br />{activeQ.hint}</div></details>}
        </Card>
      )}
      {voiceStep !== "intro" && <div style={{ marginBottom: 12 }}><ProgressBar current={answeredCount} total={ALL_QUESTIONS.length} /></div>}
      {voiceStep === "intro" && <div style={{ textAlign: "center", marginTop: 8 }}><Btn onClick={handleStart}>Start Voice Session</Btn></div>}
      {answeredCount > 0 && (
        <Card>
          <h3 style={{ color: NAVY, margin: "0 0 16px", fontSize: 16 }}>Your Answers So Far</h3>
          {ALL_QUESTIONS.filter(q => voiceAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid " + GRAY200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}><span style={{ background: NAVY, color: YELLOW, borderRadius: 6, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>Q{q.num}</span><span style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{q.label}</span></div>
                  <p style={{ margin: 0, fontSize: 13, color: GRAY800, lineHeight: 1.6 }}>{voiceAnswers[q.id]}</p>
                </div>
                <button onClick={() => handleRerecord(q.id)} style={{ background: GRAY100, border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: GRAY600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>🎤 Re-record</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {voiceStep === "done" && <div style={{ marginTop: 8 }}><Btn onClick={() => onComplete(voiceAnswers)}>Continue to Post in Groups →</Btn></div>}
    </div>
  );
}

// ── BatchLogger ───────────────────────────────────────────────────────────────
function BatchLogger({ onLog, onBack }) {
  const [val, setVal] = useState("1");
  const n = parseInt(val) || 0;
  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 4px" }}>How many people did you DM?</p>
      <p style={{ fontSize: 12, color: GRAY600, margin: "0 0 12px" }}>Defaults to 1 — change if you sent to multiple people.</p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <input type="number" min="1" value={val} onChange={e => setVal(e.target.value)}
          style={{ width: 80, border: "2px solid " + NAVY, borderRadius: 10, padding: "10px 12px", fontSize: 20, fontWeight: 800, color: NAVY, outline: "none", fontFamily: "inherit", textAlign: "center" }} />
        <Btn onClick={() => { if (n > 0) onLog(n); }} disabled={n < 1}>
          {"Log " + (n > 0 ? n : "-") + " DM" + (n !== 1 ? "s" : "") + " \u2713"}
        </Btn>
      </div>
      <Btn variant="ghost" onClick={onBack}>← Back</Btn>
    </div>
  );
}

// ── Amplify ───────────────────────────────────────────────────────────────────
function Amplify({ city, week1Total }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prevGroups, setPrevGroups] = useState([]);
  const [amplifyCount, setAmplifyCount] = useState(0);
  const totalPosted = (week1Total || 0) + amplifyCount;

  async function fetchGroups() {
    setLoading(true); setError("");
    try {
      const fresh = await findFacebookGroups(city, 20);
      let result = fresh;
      if (fresh.length < 5 && prevGroups.length > 0) {
        const combined = [...fresh];
        for (let g of prevGroups) {
          if (!combined.find(x => x.name === g.name)) combined.push(g);
          if (combined.length >= 20) break;
        }
        result = combined;
      }
      setPrevGroups(groups);
      setGroups(result);
    } catch(e) { setError("Could not load groups. Check your connection and try again."); }
    setLoading(false);
  }

  useEffect(() => { fetchGroups(); }, []);

  return (
    <>
      <Card style={{ background: NAVY }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ color: YELLOW, fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>⚡ Amplify</h2>
            <p style={{ color: GRAY400, fontSize: 13, margin: 0 }}>Keep the momentum going. Post in more groups. Expand your reach.</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
            <div style={{ color: YELLOW, fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{totalPosted}</div>
            <div style={{ color: GRAY400, fontSize: 11, marginTop: 2 }}>total groups posted</div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
          <p style={{ color: WHITE, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            🔁 <strong style={{ color: YELLOW }}>Same post. Same photo. No edits.</strong> Every new group is more visibility. Visibility creates opportunity.
          </p>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: "0 0 2px" }}>Track your Amplify posts</h3>
            <p style={{ color: GRAY600, fontSize: 13, margin: 0 }}>Tap each time you post in a new group.</p>
          </div>
          <div style={{ background: GRAY50, border: "2px solid " + YELLOW, borderRadius: 12, padding: "8px 18px", textAlign: "center" }}>
            <div style={{ color: NAVY, fontWeight: 900, fontSize: 24, lineHeight: 1 }}>{amplifyCount}</div>
            <div style={{ color: GRAY600, fontSize: 11, marginTop: 2 }}>this session</div>
          </div>
        </div>
        <Btn variant="success" onClick={() => setAmplifyCount(c => c + 1)}>+ Posted in Another Group</Btn>
        {amplifyCount > 0 && (
          <div style={{ marginTop: 14, background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: NAVY, lineHeight: 1.6 }}>
            🎯 You have now posted in <strong>{totalPosted} total groups</strong>. Keep going.
          </div>
        )}
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: 0 }}>Groups near {city}</h3>
          <button onClick={fetchGroups} disabled={loading}
            style={{ background: NAVY, color: YELLOW, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Loading..." : "↺ Refresh List"}
          </button>
        </div>
        <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: NAVY, lineHeight: 1.6 }}>
          💡 Click a group name to search for it on Facebook. Join and post using your saved post and photo.
        </div>
        {error && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 12, color: RED, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        {loading && <p style={{ color: GRAY600, fontSize: 14, textAlign: "center", padding: 24 }}>🔍 Finding groups near {city}...</p>}
        {!loading && groups.length > 0 && <GroupTable groups={groups} showNum={false} />}
      </Card>
    </>
  );
}

// ── Lead Engagement ───────────────────────────────────────────────────────────
function LeadEngagement({ onBack, city, week1Total }) {
  const [mode, setMode] = useState("leads");
  const [active, setActive] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [log, setLog] = useState([]);

  const activeLead = LEAD_TYPES.find(l => l.id === active);
  const activeSubtype = activeLead && subtype ? (activeLead.subtypes || []).find(s => s.id === subtype) : null;

  function copyScript(text, idx) {
    try {
      const el = document.createElement("textarea");
      el.value = text; el.style.position = "fixed"; el.style.opacity = "0";
      document.body.appendChild(el); el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    } catch(e) { navigator.clipboard && navigator.clipboard.writeText(text); }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function logLead(typeId) { setLog(prev => [...prev, { type: typeId, timestamp: Date.now() }]); }
  function reset() { setActive(null); setSubtype(null); setCopiedIdx(null); }

  const counts = LEAD_TYPES.reduce((acc, t) => { acc[t.id] = log.filter(l => l.type === t.id).length; return acc; }, {});
  const total = log.length;

  function ScriptBlock({ text, idx }) {
    return (
      <div style={{ background: GRAY50, border: "1.5px solid " + GRAY200, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
        <p style={{ fontSize: 14, color: GRAY800, lineHeight: 1.8, margin: "0 0 10px", fontStyle: "italic" }}>"{text}"</p>
        <button onClick={() => copyScript(text, idx)}
          style={{ background: copiedIdx === idx ? GREEN : NAVY, color: copiedIdx === idx ? WHITE : YELLOW, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          {copiedIdx === idx ? "✓ Copied!" : "📋 Copy Script"}
        </button>
      </div>
    );
  }

  function StepLabel({ num, text }) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "16px 0 8px" }}>
        <div style={{ background: YELLOW, color: NAVY, borderRadius: 99, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, flexShrink: 0, marginTop: 1 }}>{num}</div>
        <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, paddingTop: 2 }}>{text}</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={onBack} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: GRAY200, borderRadius: 12, padding: 4 }}>
        {[{ id: "leads", label: "💬 Work Leads" }, { id: "amplify", label: "⚡ Amplify" }].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); reset(); }}
            style={{ flex: 1, background: mode === m.id ? NAVY : "transparent", color: mode === m.id ? YELLOW : GRAY600, border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* AMPLIFY MODE */}
      {mode === "amplify" && <Amplify city={city} week1Total={week1Total} />}

      {/* LEADS MODE */}
      {mode === "leads" && (
        <>
          {/* Header */}
          <Card style={{ background: NAVY, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ color: YELLOW, fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>Work Your Leads</h2>
                <p style={{ color: GRAY400, fontSize: 13, margin: 0 }}>Pick the type of engagement you got. Follow the steps. Book the job.</p>
              </div>
              {total > 0 && (
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
                  <div style={{ color: YELLOW, fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{total}</div>
                  <div style={{ color: GRAY400, fontSize: 11, marginTop: 2 }}>leads worked</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 14, padding: "12px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
              <p style={{ color: WHITE, fontSize: 13, margin: 0, lineHeight: 1.7 }}>⚡ <strong style={{ color: YELLOW }}>Time kills deals.</strong> The first 24–48 hours are everything. Don't let any engagement go cold.</p>
            </div>
          </Card>

          {/* Lead type picker */}
          {!active && (
            <Card>
              <h3 style={{ color: NAVY, fontSize: 17, fontWeight: 800, margin: "0 0 6px" }}>What kind of engagement did you get?</h3>
              <p style={{ color: GRAY600, fontSize: 13, margin: "0 0 20px" }}>Tap one to get the exact steps and scripts for that situation.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {LEAD_TYPES.map(t => (
                  <button key={t.id} onClick={() => { setActive(t.id); setSubtype(null); }}
                    style={{ background: t.color, border: "2px solid " + t.border, borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 32 }}>{t.emoji}</span>
                    <span style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>{t.label}</span>
                    {counts[t.id] > 0 && <span style={{ fontSize: 11, color: GRAY600, fontWeight: 600 }}>✓ {counts[t.id]} worked</span>}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Simple lead (Like, Share) */}
          {activeLead && activeLead.simple && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <button onClick={reset} style={{ background: GRAY100, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GRAY600, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <span style={{ fontSize: 26 }}>{activeLead.emoji}</span>
                <h3 style={{ color: NAVY, fontSize: 18, fontWeight: 800, margin: 0 }}>{activeLead.label}</h3>
              </div>
              {activeLead.steps.map((step, i) => (
                <div key={i}>
                  <StepLabel num={i + 1} text={step.label} />
                  {step.note
                    ? <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: NAVY, lineHeight: 1.6 }}>Use the <strong>Direct Message</strong> playbook to handle their reply once they respond.</div>
                    : <ScriptBlock text={step.script} idx={i} />}
                </div>
              ))}
              <div style={{ borderTop: "1px solid " + GRAY200, paddingTop: 16, marginTop: 16 }}>
                {activeLead.id === "like" ? (
                  <BatchLogger onLog={(n) => { for (let i = 0; i < n; i++) logLead("like"); reset(); }} onBack={reset} />
                ) : (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>✓ Done — Mark as Worked</Btn>
                    <Btn variant="ghost" onClick={reset}>← Try Another</Btn>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Complex lead — pick subtype */}
          {activeLead && !activeLead.simple && !subtype && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <button onClick={reset} style={{ background: GRAY100, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GRAY600, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <span style={{ fontSize: 26 }}>{activeLead.emoji}</span>
                <h3 style={{ color: NAVY, fontSize: 18, fontWeight: 800, margin: 0 }}>{activeLead.label}</h3>
              </div>
              <p style={{ color: GRAY600, fontSize: 13, margin: "0 0 16px" }}>What did they say?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeLead.subtypes.map(s => (
                  <button key={s.id} onClick={() => setSubtype(s.id)}
                    style={{ background: activeLead.color, border: "1.5px solid " + activeLead.border, borderRadius: 12, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{s.label}</span>
                    <span style={{ fontSize: 12, color: GRAY600, fontStyle: "italic" }}>{s.example}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Complex lead — scripts */}
          {activeLead && !activeLead.simple && activeSubtype && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <button onClick={() => setSubtype(null)} style={{ background: GRAY100, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: GRAY600, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <span style={{ fontSize: 26 }}>{activeLead.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>{activeLead.label}</div>
                  <div style={{ fontSize: 12, color: GRAY600 }}>{activeSubtype.label}</div>
                </div>
              </div>
              {activeLead.id === "comment" && (
                <>
                  <StepLabel num={1} text="Reply publicly using one of these" />
                  {activeSubtype.publicReplies.map((r, i) => <ScriptBlock key={i} text={r} idx={i} />)}
                  <StepLabel num={2} text="Then immediately send this DM" />
                  <ScriptBlock text={activeSubtype.dmScript} idx={99} />
                </>
              )}
              {activeLead.id === "dm" && (
                <>
                  <StepLabel num={1} text="Reply within 24 hours" />
                  <ScriptBlock text={activeSubtype.dmScript} idx={0} />
                  {(activeSubtype.id === "dm_service_yes" || activeSubtype.id === "dm_needs_now") && (
                    <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: NAVY, lineHeight: 1.6, marginTop: 4 }}>
                      💡 <strong>After booking</strong>, schedule the customer in Housecall Pro and tag them as <strong>"Facebook Groups"</strong>.
                    </div>
                  )}
                </>
              )}
              <div style={{ borderTop: "1px solid " + GRAY200, paddingTop: 16, marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>✓ Done — Mark as Worked</Btn>
                <Btn variant="ghost" onClick={() => setSubtype(null)}>← Different Response</Btn>
              </div>
            </Card>
          )}

          {/* Lead log */}
          {total > 0 && !active && (
            <Card>
              <h3 style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>📊 Leads Worked This Session</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {LEAD_TYPES.map(t => counts[t.id] > 0 && (
                  <div key={t.id} style={{ background: t.color, border: "1.5px solid " + t.border, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{t.emoji}</span>
                    <span style={{ fontWeight: 800, color: NAVY, fontSize: 14 }}>{counts[t.id]}</span>
                    <span style={{ fontSize: 12, color: GRAY600 }}>{t.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: NAVY, borderRadius: 12, padding: 16 }}>
                <p style={{ color: YELLOW, fontWeight: 700, margin: "0 0 4px", fontSize: 14 }}>Every path leads to a DM. Every DM is a chance to book a job.</p>
                <p style={{ color: WHITE, fontSize: 13, margin: 0 }}>Keep going. The first 48 hours are everything.</p>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [appPhase, setAppPhase] = useState("lane");
  const [lane, setLane] = useState(null);
  const [answers, setAnswers] = useState({});
  const [post, setPost] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedGetpost, setCopiedGetpost] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState({});
  const [groups5, setGroups5] = useState([]);
  const [groups20, setGroups20] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [coachApproved, setCoachApproved] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [tenDone, setTenDone] = useState(false);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const topRef = useRef(null);

  const setAnswer = (id, val) => setAnswers(prev => Object.assign({}, prev, { [id]: val }));
  const chMet = qs => qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const ch1Met = chMet(ch1Qs);
  const ch2Met = chMet(ch2Qs);
  const ch3Met = chMet(ch3Qs);
  const devFill = () => setAnswers(SAMPLE_ANSWERS);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); }, [appPhase]);

  const city = answers.area
    ? answers.area.split(/[,\-\u2013\u2014]/)[0].replace(/\b(in the|area|been|here|for|years|going on|about|over|past|nearly|almost)\b.*/i, "").replace(/[^a-zA-Z\s]/g, "").trim()
    : manualCity.trim() || "Your City";

  useEffect(() => {
    if (appPhase === "groups" && groups5.length === 0 && !groupsLoading) {
      setGroupsLoading(true); setGroupsError("");
      findFacebookGroups(city, 5).then(r => { setGroups5(r); setGroupsLoading(false); if (!r.length) setGroupsError("Could not find groups automatically. Try searching Facebook manually for your city + community group."); }).catch(() => { setGroupsLoading(false); setGroupsError("Search failed."); });
    }
    if ((appPhase === "replicate") && groups20.length === 0 && !groupsLoading) {
      setGroupsLoading(true);
      findFacebookGroups(city, 20).then(r => { setGroups20(r); setGroupsLoading(false); }).catch(() => setGroupsLoading(false));
    }
  }, [appPhase]);

  async function handleValidateAndAdvance(questions, nextPhase, andThen) {
    const allMet = questions.every(q => wordCount(answers[q.id]) >= q.minWords);
    if (allMet) { setValidationFeedback({}); setAppPhase(nextPhase); if (andThen) andThen(); return; }
    setValidating(true); setValidationFeedback({});
    let result;
    try { result = await validateChapterAnswers(questions, answers); } catch(e) { result = { passed: true, feedback: {} }; }
    setValidating(false);
    if (result.passed) { setValidationFeedback({}); setAppPhase(nextPhase); if (andThen) andThen(); }
    else {
      setValidationFeedback(result.feedback || {});
      const firstId = Object.keys(result.feedback || {})[0];
      if (firstId) setTimeout(() => { const el = document.getElementById("qfield-" + firstId); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
    }
  }

  async function saveSubmission(a, generatedPost, status) {
    const data = a || answers;
    const name = (data.name || "Unknown").trim();
    const key = "submission:" + name.replace(/\s+/g, "_").toLowerCase() + "_" + (data.business || "biz").replace(/\s+/g, "_").toLowerCase();
    try {
      let prev = {};
      try { const ex = await window.storage.get(key, true); if (ex && ex.value) prev = JSON.parse(ex.value); } catch(e) {}
      const rec = { name, business: data.business || "", city: (data.area || manualCity || "").split(/[,\-]/)[0].replace(/[^a-zA-Z\s]/g, "").trim(), answers: data, post: generatedPost !== undefined ? generatedPost : (prev.post || ""), status: status || prev.status || "Post Generated", postGenerated: true, timestamp: prev.timestamp || Date.now(), updatedAt: Date.now() };
      await window.storage.set(key, JSON.stringify(rec), true);
    } catch(e) {}
  }

  async function handleGeneratePost(ans) {
    const a = ans || answers;
    setPostLoading(true); setPostError("");
    try {
      const generated = await generateAIPost(a);
      setPost(generated);
      setCompletedSections(prev => prev.includes("write") ? prev : [...prev, "write"]);
      await saveSubmission(a, generated, "Post Generated");
    } catch(e) { setPostError("Could not generate post. Please check your connection and try again."); }
    setPostLoading(false);
  }

  const handleVoiceComplete = va => { setAnswers(va); setAppPhase("groups"); };

  return (
    <div style={{ minHeight: "100vh", background: GRAY100, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)} />}
      {showCoachLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: WHITE, borderRadius: 20, padding: 32, maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>🔐</div>
            <h3 style={{ color: NAVY, fontSize: 18, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>Coach Access</h3>
            <p style={{ color: GRAY600, fontSize: 13, textAlign: "center", margin: "0 0 20px" }}>Enter your passcode to view the dashboard.</p>
            <input type="password" value={passcodeInput} onChange={e => { setPasscodeInput(e.target.value); setPasscodeError(false); }}
              onKeyDown={e => { if (e.key === "Enter") { if (passcodeInput === COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); } }}
              placeholder="Enter passcode"
              style={{ width: "100%", boxSizing: "border-box", border: "2px solid " + (passcodeError ? RED : GRAY200), borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", marginBottom: 8 }} />
            {passcodeError && <p style={{ color: RED, fontSize: 12, margin: "0 0 8px" }}>Incorrect passcode.</p>}
            <Btn style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={() => { if (passcodeInput === COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); }}>Enter Dashboard</Btn>
            <button onClick={() => { setShowCoachLogin(false); setPasscodeInput(""); setPasscodeError(false); }} style={{ width: "100%", background: "none", border: "none", color: GRAY400, fontSize: 13, cursor: "pointer", padding: "4px 0" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {appPhase !== "lane" && <button onClick={() => setAppPhase("lane")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 12px", color: WHITE, fontSize: 12, fontWeight: 600, cursor: "pointer", marginRight: 4 }}>⌂ Home</button>}
          <div style={{ background: YELLOW, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: NAVY, fontSize: 18 }}>H</div>
          <div><div style={{ color: WHITE, fontWeight: 800, fontSize: 16, lineHeight: 1 }}>Business Coaching Foundations</div><div style={{ color: YELLOW, fontSize: 12, fontWeight: 600 }}>Week 1 — Facebook Groups Organic Strategy</div></div>
        </div>
        <button onClick={() => setShowCoachLogin(true)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 14px", color: WHITE, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Coach Dashboard</button>
      </div>

      <div ref={topRef} style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 60px" }}>
        <PhaseNav current={appPhase} onNavigate={id => setAppPhase(id)} completedSections={completedSections} />

        {/* HOME */}
        {appPhase === "lane" && (
          <div>
            <div style={{ background: NAVY, borderRadius: 16, padding: 32, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
              <h1 style={{ color: WHITE, fontSize: 24, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.3 }}>Turn Your Story Into<br /><span style={{ color: YELLOW }}>Jobs on Your Calendar</span></h1>
              <p style={{ color: GRAY400, fontSize: 14, lineHeight: 1.8, margin: "0 0 20px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>This system walks you through building a trust-building Facebook post, getting it in front of your community, and converting engagement into booked jobs.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"].map((s,i) => <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: WHITE }}>{s}</div>)}
              </div>
            </div>
            <h3 style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>Where would you like to start?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div onClick={() => setAppPhase("writechoice")} style={{ background: WHITE, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,41,66,0.08)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <div style={{ background: NAVY, padding: "16px 16px 14px" }}><div style={{ fontSize: 28, marginBottom: 6 }}>✍️</div><div style={{ color: YELLOW, fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Write Post</div><div style={{ color: GRAY400, fontSize: 11, lineHeight: 1.4 }}>Build your story and generate your post</div></div>
                <div style={{ padding: "14px 16px", flex: 1 }}><p style={{ color: GRAY600, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>Answer questions about your story. AI writes your post.</p><span style={{ color: NAVY, fontWeight: 700, fontSize: 12 }}>~8 min →</span></div>
              </div>
              <div onClick={() => setAppPhase("groups")} style={{ background: WHITE, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,41,66,0.08)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <div style={{ background: NAVY_LIGHT, padding: "16px 16px 14px" }}><div style={{ fontSize: 28, marginBottom: 6 }}>📣</div><div style={{ color: YELLOW, fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Post in Groups</div><div style={{ color: GRAY400, fontSize: 11, lineHeight: 1.4 }}>Find groups and post your content</div></div>
                <div style={{ padding: "14px 16px", flex: 1 }}><p style={{ color: GRAY600, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>Already have your post? Find groups and replicate to 10.</p><span style={{ color: NAVY, fontWeight: 700, fontSize: 12 }}>~15 min →</span></div>
              </div>
              <div onClick={() => setAppPhase("leads")} style={{ background: WHITE, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,41,66,0.08)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <div style={{ background: "#065F46", padding: "16px 16px 14px" }}><div style={{ fontSize: 28, marginBottom: 6 }}>🔥</div><div style={{ color: "#D1FAE5", fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Work Leads</div><div style={{ color: "#6EE7B7", fontSize: 11, lineHeight: 1.4 }}>Convert engagement into booked jobs</div></div>
                <div style={{ padding: "14px 16px", flex: 1 }}><p style={{ color: GRAY600, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>Posts are live. Turn every like, comment, and DM into a job.</p><span style={{ color: GREEN, fontWeight: 700, fontSize: 12 }}>~5 min →</span></div>
              </div>
            </div>

          </div>
        )}

        {/* WRITE CHOICE */}
        {appPhase === "writechoice" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("lane")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title="Write Your Post" subtitle="How would you like to answer the questions?" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button onClick={() => { setLane("type"); setAppPhase("ch1"); }} style={{ background: WHITE, border: "2px solid " + NAVY, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>⌨️</div>
                  <div><div style={{ fontWeight: 800, color: NAVY, fontSize: 15, marginBottom: 4 }}>Type My Answers</div><div style={{ fontSize: 13, color: GRAY600, lineHeight: 1.5 }}>Fill in each question at your own pace. Mic icon available to dictate.</div></div>
                </button>
                <button onClick={() => { setLane("voice"); setAppPhase("voice"); }} style={{ background: NAVY, border: "2px solid " + NAVY, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>🎤</div>
                  <div><div style={{ fontWeight: 800, color: YELLOW, fontSize: 15, marginBottom: 4 }}>Talk Through It</div><div style={{ fontSize: 13, color: GRAY400, lineHeight: 1.5 }}>Speak your answers. A coach guides you through every question.</div></div>
                </button>
              </div>
            </Card>
          </>
        )}

        {/* VOICE */}
        {appPhase === "voice" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("writechoice")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <VoiceMode onComplete={handleVoiceComplete} />
          </>
        )}

        {/* CH1 */}
        {appPhase === "ch1" && (
          <Card>
            <SectionHeader emoji="🙋" title="Chapter 1 — Who You Are" />
            <TimeBadge phase="ch1" />
            <WhyBlock text="Before someone trusts you with their home, they need clarity on who you are and what you do. Confusion kills trust. Clarity builds credibility." />
            <ProgressBar current={ch1Qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length} total={ch1Qs.length} />
            <div style={{ height: 16 }} />
            {ch1Qs.map(q => <QField key={q.id} q={q} value={answers[q.id] || ""} onChange={setAnswer} aiFeedback={validationFeedback[q.id]} />)}
            {Object.keys(validationFeedback).length > 0 && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#991B1B", fontWeight: 600 }}>⬆️ A few answers need more detail. See highlighted questions above.</div>}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Btn variant="ghost" onClick={() => { setAppPhase("writechoice"); setValidationFeedback({}); }}>← Back</Btn>
              <Btn onClick={() => handleValidateAndAdvance(ch1Qs, "ch2")} disabled={!ch1Met || validating}>{validating ? "Checking..." : "Continue to Chapter 2 →"}</Btn>
            </div>
            {!ch1Met && <p style={{ fontSize: 12, color: GRAY400, marginTop: 8 }}>All questions must meet their minimum word count to continue.</p>}
          </Card>
        )}

        {/* CH2 */}
        {appPhase === "ch2" && (
          <Card>
            <SectionHeader emoji="🏡" title="Chapter 2 — Your Real Life" />
            <TimeBadge phase="ch2" />
            <WhyBlock text="This is where we prove you are real. Bots write generic. Humans write specifics. Specific details create connection. Connection builds trust." />
            <ProgressBar current={ch2Qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length} total={ch2Qs.length} />
            <div style={{ height: 16 }} />
            {ch2Qs.map(q => <QField key={q.id} q={q} value={answers[q.id] || ""} onChange={setAnswer} aiFeedback={validationFeedback[q.id]} />)}
            {Object.keys(validationFeedback).length > 0 && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#991B1B", fontWeight: 600 }}>⬆️ A few answers need more detail. See highlighted questions above.</div>}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="ghost" onClick={() => { setAppPhase("ch1"); setValidationFeedback({}); }}>← Back</Btn>
              <Btn onClick={() => handleValidateAndAdvance(ch2Qs, "ch3")} disabled={!ch2Met || validating}>{validating ? "Checking..." : "Continue to Chapter 3 →"}</Btn>
            </div>
          </Card>
        )}

        {/* CH3 */}
        {appPhase === "ch3" && (
          <Card>
            <SectionHeader emoji="❤️" title="Chapter 3 — What Shaped You" />
            <TimeBadge phase="ch3" />
            <WhyBlock text="Quality work is expected. Trust is earned. Emotional connection separates you from any Pro will do. When people feel something, they engage." />
            <ProgressBar current={ch3Qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length} total={ch3Qs.length} />
            <div style={{ height: 16 }} />
            {ch3Qs.map(q => <QField key={q.id} q={q} value={answers[q.id] || ""} onChange={setAnswer} aiFeedback={validationFeedback[q.id]} />)}
            {Object.keys(validationFeedback).length > 0 && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#991B1B", fontWeight: 600 }}>⬆️ A few answers need more detail. See highlighted questions above.</div>}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="ghost" onClick={() => { setAppPhase("ch2"); setValidationFeedback({}); }}>← Back</Btn>
              <Btn onClick={() => handleValidateAndAdvance(ch3Qs, "groups")} disabled={!ch3Met || validating}>{validating ? "Checking..." : "Continue to Post in Groups →"}</Btn>
            </div>
          </Card>
        )}

        {/* STEP 1 — Join a Group */}
        {appPhase === "groups" && (
          <>
            <Card>
              <SectionHeader emoji="🧭" title="Step 1 — Join a Group" subtitle="Find an active local Facebook group and join it. You only need one to start." />
              {!answers.area && (
                <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: NAVY }}>What city or area do you serve?</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={manualCity} onChange={e => setManualCity(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { setGroups5([]); setGroupsError(""); setGroupsLoading(true); findFacebookGroups(manualCity.trim() || "Your City", 5).then(r => { setGroups5(r); setGroupsLoading(false); if (!r.length) setGroupsError("No groups found. Try a different city name."); }).catch(() => { setGroupsLoading(false); setGroupsError("Search failed."); }); } }}
                      placeholder="e.g. East Nashville"
                      style={{ flex: 1, border: "2px solid " + GRAY200, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => { const c = manualCity.trim() || "Your City"; setGroups5([]); setGroupsError(""); setGroupsLoading(true); findFacebookGroups(c, 5).then(r => { setGroups5(r); setGroupsLoading(false); if (!r.length) setGroupsError("No groups found. Try a different city name."); }).catch(() => { setGroupsLoading(false); setGroupsError("Search failed."); }); }}
                      style={{ background: NAVY, color: YELLOW, border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Search</button>
                  </div>
                </div>
              )}
              {groupsLoading && <div style={{ textAlign: "center", padding: 32 }}><p style={{ color: GRAY600 }}>🔍 Finding groups near {city}...</p></div>}
              {groupsError && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 14, marginBottom: 16, color: RED, fontSize: 13 }}>{groupsError}</div>}
              {!groupsLoading && groups5.length > 0 && (
                <>
                  <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: NAVY, lineHeight: 1.6 }}>💡 Click a group name to open Facebook. Find it, click in, and join. Public groups are listed first.</div>
                  <GroupTable groups={groups5} showNum={false} />
                </>
              )}
            </Card>
            <Btn onClick={() => setAppPhase("getpost")}>I Joined a Group →</Btn>
          </>
        )}

        {/* STEP 2 — Get Your Post */}
        {appPhase === "getpost" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("groups")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title="Step 2 — Get Your Post" />
              {postLoading && (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
                  <p style={{ color: GRAY600, fontSize: 14, marginBottom: 4 }}>Writing your post...</p>
                  <p style={{ color: GRAY400, fontSize: 13 }}>This should only take about a minute.</p>
                </div>
              )}
              {postError && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 14, marginBottom: 16, color: RED, fontSize: 13 }}>{postError}</div>}
              {!postLoading && ch3Met && !post && (
                <>
                  <p style={{ color: GRAY600, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>Your story answers are ready. Tap the button below and we'll write your post for you.</p>
                  <Btn onClick={() => handleGeneratePost()}>Generate My Post →</Btn>
                </>
              )}
              {!postLoading && ch3Met && post && (
                <>
                  <textarea value={post} onChange={e => setPost(e.target.value)} rows={14}
                    style={{ width: "100%", boxSizing: "border-box", border: "2px solid " + NAVY, borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.8, color: GRAY800, fontFamily: "inherit", resize: "vertical", background: GRAY50, marginBottom: 14 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Btn onClick={() => {
                      try {
                        const el = document.createElement("textarea"); el.value = post; el.style.position = "fixed"; el.style.opacity = "0";
                        document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
                        setCopiedGetpost(true);
                      } catch(e) { navigator.clipboard && navigator.clipboard.writeText(post).then(() => setCopiedGetpost(true)).catch(() => setCopiedGetpost(true)); }
                    }} variant={copiedGetpost ? "success" : "primary"} style={{ alignSelf: "flex-start" }}>{copiedGetpost ? "✓ Copied!" : "📋 Copy Post"}</Btn>
                    {copiedGetpost && (
                      <div style={{ background: "#EFF6FF", border: "1.5px solid #93C5FD", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, marginBottom: 2 }}>Post copied! 🎉</div>
                          <div style={{ fontSize: 13, color: GRAY600 }}>Next up: pick a photo to post with it.</div>
                        </div>
                        <Btn onClick={() => setAppPhase("photo")}>📸 Choose My Photo →</Btn>
                      </div>
                    )}
                  </div>
                </>
              )}
              {!postLoading && !ch3Met && (
                <>
                  <div style={{ background: "#FEF9EC", border: "1.5px solid " + YELLOW, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, color: NAVY, fontSize: 14, margin: "0 0 6px" }}>You haven't built your story yet.</p>
                    <p style={{ color: GRAY600, fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>Complete the 3 chapters to generate your AI-written post — or paste an existing post below.</p>
                    <Btn onClick={() => setAppPhase("writechoice")}>✍️ Write My Post (Chapters 1–3)</Btn>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 8 }}>Or paste an existing post here:</p>
                  <textarea value={post} onChange={e => setPost(e.target.value)} rows={10} placeholder="Paste your Facebook post here..."
                    style={{ width: "100%", boxSizing: "border-box", border: "2px solid " + (post ? NAVY : GRAY200), borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.8, color: GRAY800, fontFamily: "inherit", resize: "vertical", background: post ? "#F0F7FF" : GRAY50, outline: "none", marginBottom: 14 }} />
                  {post && post.trim().length >= 50 && (
                    <Btn onClick={() => setAppPhase("photo")}>Use This Post — Choose Photo →</Btn>
                  )}
                </>
              )}
            </Card>
          </>
        )}

        {/* STEP 3 — Copy Post (back-compat) */}
        {appPhase === "copypost" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("getpost")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="📋" title="Step 3 — Copy Your Post" subtitle="Read it over, make any edits, then copy it." />
              <textarea value={post} onChange={e => setPost(e.target.value)} rows={14}
                style={{ width: "100%", boxSizing: "border-box", border: "2px solid " + NAVY, borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.8, color: GRAY800, fontFamily: "inherit", resize: "vertical", background: GRAY50 }} />
              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={() => { navigator.clipboard.writeText(post).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); }} variant={copied ? "success" : "primary"}>{copied ? "✓ Copied!" : "📋 Copy Post"}</Btn>
                {copied && <Btn variant="secondary" onClick={() => setAppPhase("photo")}>Next: Choose Photo →</Btn>}
              </div>
            </Card>
          </>
        )}

        {/* STEP 4 — Add Photo */}
        {appPhase === "photo" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("getpost")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="📸" title="Step 4 — Choose Your Photo" subtitle="Pick one real photo of you. Your face needs to be clearly visible." />
              <div style={{ fontWeight: 700, color: GREEN, fontSize: 13, marginBottom: 10 }}>✅ GOOD — choose one of these:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10, marginBottom: 20 }}>
                {[{emoji:"😊",label:"You with family",desc:"Smiling face, bright natural light."},{emoji:"☕",label:"You at your local spot",desc:"Candid shot where you hang out."},{emoji:"🔧",label:"Candid job-site photo",desc:"You working, face clearly visible."}].map((g,i) => <div key={i} style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{g.emoji}</div><div style={{fontWeight:700,color:"#166534",fontSize:13,marginBottom:4}}>{g.label}</div><div style={{fontSize:11,color:"#166534",lineHeight:1.4}}>{g.desc}</div></div>)}
              </div>
              <div style={{ fontWeight: 700, color: RED, fontSize: 13, marginBottom: 10 }}>❌ DO NOT use these:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
                {[{emoji:"🚛",label:"Truck only",desc:"No face = no connection."},{emoji:"🖼️",label:"Logo or flyer",desc:"Looks like an ad."},{emoji:"🕶️",label:"Dark selfie",desc:"Hard to connect with."},{emoji:"🤖",label:"AI or stock photo",desc:"People can tell."}].map((b,i) => <div key={i} style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:28,marginBottom:6}}>{b.emoji}</div><div style={{fontWeight:700,color:"#991B1B",fontSize:13,marginBottom:4}}>{b.label}</div><div style={{fontSize:11,color:"#991B1B",lineHeight:1.4}}>{b.desc}</div></div>)}
              </div>
            </Card>
            <Btn onClick={() => setAppPhase("dopost")}>I Have My Photo Ready →</Btn>
          </>
        )}

        {/* STEP 5 — Post It */}
        {appPhase === "dopost" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("photo")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="🚀" title="Step 5 — Post It" subtitle="You're ready. Follow these steps exactly in the Facebook group." />
              {[{num:1,text:"Open the Facebook group you joined and tap Write something"},{num:2,text:"Paste your copied post"},{num:3,text:"Attach your photo"},{num:4,text:"Tap Post"}].map(s => (
                <div key={s.num} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                  <div style={{ background: YELLOW, color: NAVY, borderRadius: 99, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{s.num}</div>
                  <p style={{ margin: 0, fontSize: 15, color: GRAY800, paddingTop: 7, lineHeight: 1.6 }}>{s.text}</p>
                </div>
              ))}
            </Card>
            <Btn onClick={() => setAppPhase("approval")}>My Post Is Live →</Btn>
          </>
        )}

        {/* STEP 6 — Coach Approval */}
        {appPhase === "approval" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("dopost")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="📋" title="Step 6 — Coach Approval" subtitle="Let your coach know you're ready for your post audit." />
              <div style={{ background: "#EFF6FF", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>👋</div>
                <p style={{ color: NAVY, fontWeight: 700, fontSize: 15, margin: "0 0 8px" }}>Your post is live!</p>
                <p style={{ color: GRAY600, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Let your coach know you are ready for your audit. Once they have reviewed and approved it, tap the button below.</p>
              </div>
              <Btn onClick={() => { setCoachApproved(true); saveSubmission(answers, post, "Coach Approved"); setAppPhase("replicate"); }} style={{ width: "100%", justifyContent: "center" }}>
                ✅ Coach Reviewed and Approved My Post
              </Btn>
            </Card>
          </>
        )}

        {/* STEP 7 — Cross-Post */}
        {appPhase === "replicate" && (
          <>
            <div style={{ marginBottom: 20 }}><Btn variant="ghost" onClick={() => setAppPhase("approval")} style={{ fontSize: 13, padding: "8px 14px" }}>← Back</Btn></div>
            <Card>
              <SectionHeader emoji="🔁" title="Step 7 — Cross-Post to 9 More Groups" subtitle="Same post. Same photo. No edits. Hit 10 total to complete your Week 1 goal." />
              <div style={{ background: GRAY50, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                {["Use the exact same post — do not change a single word.","Attach the exact same photo.","Do not add your phone number, website, or any contact info.","Public groups: post immediately. Private groups: join and post once approved."].map((s,i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ background: YELLOW, color: NAVY, borderRadius: 99, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
                    <p style={{ margin: 0, fontSize: 13, color: GRAY800, lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading && <p style={{ color: GRAY600, fontSize: 14, textAlign: "center" }}>🔍 Loading groups...</p>}
              {!groupsLoading && groups20.length > 0 && <div style={{ marginBottom: 20 }}><GroupTable groups={groups20} showNum={true} /></div>}
            </Card>
            <Card>
              <h3 style={{ color: NAVY, margin: "0 0 8px", fontSize: 18 }}>How many additional groups did you post in?</h3>
              <p style={{ color: GRAY600, fontSize: 13, marginTop: 0, marginBottom: 16 }}>You already posted in 1 — tap how many more you completed.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => setPostCount(n)} style={{ width: 48, height: 48, borderRadius: 10, border: "2px solid " + (postCount === n ? NAVY : GRAY200), background: postCount === n ? NAVY : WHITE, color: postCount === n ? YELLOW : GRAY600, fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "all 0.15s" }}>{n}</button>
                ))}
              </div>
              {postCount > 0 && postCount < 9 && <div style={{ background: "#FEF9EC", border: "1.5px solid " + YELLOW, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: GRAY800, lineHeight: 1.6 }}>You have posted in <strong>{postCount + 1} total groups</strong>. You still have <strong>{9 - postCount} more to go</strong>. Keep going.</div>}
              {postCount === 9 && !tenDone && <Btn variant="success" onClick={() => { setTenDone(true); setCompletedSections(prev => prev.includes("grouppost") ? prev : [...prev, "grouppost"]); saveSubmission(answers, post, "10 Groups Done"); }}>10 Groups Done! 🎯</Btn>}
            </Card>
            {tenDone && (
              <Card style={{ background: NAVY, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
                <h2 style={{ color: YELLOW, fontSize: 24, margin: "0 0 8px" }}>WEEK 1 GOAL ACHIEVED</h2>
                <p style={{ color: WHITE, fontSize: 15, lineHeight: 1.8, margin: "0 0 20px" }}>10 groups. 10 posts. Mission accomplished.</p>
                <Btn onClick={() => setAppPhase("leads")}>Open Lead Engagement →</Btn>
              </Card>
            )}
          </>
        )}

        {/* LEADS */}
        {appPhase === "leads" && <LeadEngagement onBack={() => setAppPhase("replicate")} city={city} week1Total={postCount + 1} />}
      </div>
    </div>
  );
}