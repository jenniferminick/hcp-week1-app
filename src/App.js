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

// ── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  en: {
    headerSub: "Week 1 — Facebook Groups Organic Strategy",
    saveExit: "Save & Exit",
    coachDashboard: "Coach Dashboard",
    homeTitle: "Turn Your Story Into",
    homeTitle2: "Jobs on Your Calendar",
    homeDesc: "Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.",
    homeBadges: ["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"],
    continueLabel: "Continue where you left off",
    weekChecklist: "Your Week 1 Checklist",
    writePost: "Write Post",
    writePostDesc: "Answer 15 questions. AI writes your trust-building post.",
    writePostSub: (n) => `~8 min · ${n} of 15 answered`,
    postGroups: "Post in Groups",
    postGroupsDesc: "Find local Facebook groups and replicate your post to 10.",
    postGroupsSub: (n) => `~15 min · ${n} of 10 groups posted`,
    workLeads: "Work Leads",
    workLeadsDesc: "Turn every like, comment, share, and DM into a booked job.",
    workLeadsSub: "~5 min · Scripts for every engagement type",
    writePostTitle: "Write Your Post",
    writePostSubtitle: "How would you like to answer the questions?",
    typeAnswers: "Type My Answers",
    typeAnswersDesc: "Fill in each question at your own pace.",
    talkThrough: "Talk Through It",
    talkThroughDesc: "Speak your answers. A coach guides you through every question.",
    back: "← Back",
    previous: "← Previous",
    next: "Next →",
    of: "of",
    questionsAnswered: "questions answered",
    chapterComplete: "✓ Chapter complete!",
    answered: "answered",
    minWords: (n) => `Minimum ${n} word${n!==1?"s":""}`,
    examplesTitle: "Examples from other Pros:",
    needInspiration: "Need inspiration? →",
    hideExamples: "Hide examples ▲",
    typeHere: "Type your answer here...",
    stopTitle: "Stop Here — Wait for Your Session",
    stopDesc: "Your answers are saved. Don't go further until your Business Coach is live with you.",
    sessionTitle: "What happens in your session:",
    sessionSteps: ["Your coach reviews your answers with you","AI generates your trust-building Facebook post","You post it live in 10 local Facebook groups together"],
    findPhotoTitle: "Before Your Session — Find Your Photo",
    findPhotoDesc: "Based on your answers, here are personalized photo ideas just for you:",
    personalizing: "Personalizing your photo suggestions...",
    worksDoesnt: "Here's what works and what doesn't:",
    proTip: "Pro tip:",
    proTipText: "Pull up your camera roll right now and find 2-3 options. Have it ready to upload the moment your session starts.",
    readyText: "Ready? Only click this when your coach is with you.",
    readyBtn: "I'm in my session — let's continue →",
    goBackEdit: "← Go back and edit my answers",
    antiAdLabel: "✅ Anti-Ad — photos like these work great:",
    adLabel: "❌ Advertisement — avoid photos like these:",
    generatePost: "Generate My Post →",
    copyPost: "📋 Copy Post",
    copied: "✓ Copied!",
    regenerate: "↺ Regenerate",
    postCopied: "Post copied! 🎉",
    nextPickPhoto: "Next up: pick a photo.",
    choosePhoto: "📸 Choose My Photo →",
    stepGetPost: "Step 2 — Get & Copy Your Post",
    englishPost: "🇺🇸 English Post",
    spanishPost: "🇪🇸 Spanish Post (Vista previa)",
    spanishNote: "This is a preview — the English post is the one your coach will review.",
    writingPost: "Writing your post...",
    joinGroupTitle: "Step 1 — Join a Group",
    joinGroupSubtitle: "Find an active local Facebook group and join it. You only need one to start.",
    joined: "Joined — you're ready to post",
    didYouJoin: "Did you join the group?",
    iJoined: "I joined it →",
    continueBtn: "Continue →",
    choosePhotoTitle: "Step 3 — Choose Your Photo",
    choosePhotoSubtitle: "Pick one real photo of you. Your face needs to be clearly visible.",
    photoReady: "I Have My Photo Ready →",
    postItTitle: "Step 4 — Post It",
    postItSubtitle: "You're ready. Follow these steps exactly.",
    postSteps: ["Open the Facebook group and tap Write something","Paste your copied post","Attach your photo","Tap Post"],
    postIsLive: "My Post Is Live →",
    submitTitle: "Step 5 — Submit for Review",
    submitSubtitle: "Paste your live post URL or upload a screenshot so your coach can verify it.",
    crossPostTitle: "Step 6 — Cross-Post to 9 More Groups",
    crossPostSubtitle: "Same post. Same photo. No edits. Hit 10 total.",
    crossPostRules: ["Use the exact same post — do not change a single word.","Attach the exact same photo.","Do not add your phone number, website, or any contact info.","Public groups: post immediately. Private groups: join and post once approved."],
    howMany: "How many additional groups did you post in?",
    howManySub: "You already posted in 1 — tap how many more.",
    moreTogo: (total, left) => `Posted in <strong>${total} total groups</strong>. <strong>${left} more to go.</strong>`,
    tenDone: "10 Groups Done! →",
    goalTitle: "WEEK 1 GOAL ACHIEVED",
    goalDesc: "10 groups. 10 posts. Mission accomplished.",
    openLeads: "Open Lead Engagement →",
    leadsTitle: "Session Complete — Now We Execute",
    leadsSubtitle: "Watch this training video before working your leads.",
    watchedBtn: "✓ I watched the video — show me the playbook",
    alreadyWatched: "Already watched?",
    skipBtn: "Skip →",
    notBuilt: "You haven't built your story yet.",
    notBuiltDesc: "Complete the 3 chapters to generate your AI-written post — or paste an existing post below.",
    writeMyPost: "✍️ Write My Post",
    pastePost: "Paste your Facebook post here...",
    usePost: "Use This Post →",
    devShortcuts: "Dev shortcuts",
    fillSample: "Fill Sample Answers",
    skipStop: "Skip to Stop Screen",
    skipGroups: "Skip to Groups",
    skipLeads: "Skip to Leads",
    searchCity: "What city or area do you serve?",
    cityPlaceholder: "e.g. East Nashville",
    search: "Search",
    coachAccess: "Coach Access",
    enterPasscode: "Enter passcode",
    incorrectPasscode: "Incorrect passcode.",
    enterDashboard: "Enter Dashboard",
    cancel: "Cancel",
    submitReview: "✅ Submit for Coach Review →",
    pasteOrUpload: "Paste a URL or upload a screenshot to continue",
    whyNeeded: "Why do we need this?",
    whyNeededDesc: "Your coach needs to see the live post before approving it. A URL or a screenshot — you only need one.",
    pasteUrl: "Option 1 — Paste your Facebook post URL",
    urlAccepted: "✓ URL accepted!",
    uploadScreenshot: "Option 2 — Upload a screenshot",
    tapUpload: "Tap to upload screenshot",
    screenshotAccepted: "✓ Screenshot accepted!",
  },
  es: {
    headerSub: "Semana 1 — Estrategia Orgánica de Grupos de Facebook",
    saveExit: "Guardar y Salir",
    coachDashboard: "Panel del Coach",
    homeTitle: "Convierte Tu Historia en",
    homeTitle2: "Trabajos en Tu Calendario",
    homeDesc: "Crea una publicación de Facebook que genere confianza, ponla frente a tu comunidad y convierte el engagement en trabajos reservados.",
    homeBadges: ["⏱ ~29 min total","🎯 10 publicaciones en grupos","💬 Leads reales, trabajos reales"],
    continueLabel: "Continuar donde lo dejaste",
    weekChecklist: "Tu Lista de la Semana 1",
    writePost: "Escribir Publicación",
    writePostDesc: "Responde 15 preguntas. La IA escribe tu publicación.",
    writePostSub: (n) => `~8 min · ${n} de 15 respondidas`,
    postGroups: "Publicar en Grupos",
    postGroupsDesc: "Encuentra grupos locales de Facebook y replica tu publicación en 10.",
    postGroupsSub: (n) => `~15 min · ${n} de 10 grupos publicados`,
    workLeads: "Trabajar Leads",
    workLeadsDesc: "Convierte cada like, comentario y mensaje en un trabajo reservado.",
    workLeadsSub: "~5 min · Scripts para cada tipo de engagement",
    writePostTitle: "Escribe Tu Publicación",
    writePostSubtitle: "¿Cómo quieres responder las preguntas?",
    typeAnswers: "Escribir Mis Respuestas",
    typeAnswersDesc: "Completa cada pregunta a tu propio ritmo.",
    talkThrough: "Hablar con el Coach",
    talkThroughDesc: "Di tus respuestas en voz alta. Un coach te guía pregunta por pregunta.",
    back: "← Atrás",
    previous: "← Anterior",
    next: "Siguiente →",
    of: "de",
    questionsAnswered: "preguntas respondidas",
    chapterComplete: "✓ ¡Capítulo completo!",
    answered: "respondidas",
    minWords: (n) => `Mínimo ${n} palabra${n!==1?"s":""}`,
    examplesTitle: "Ejemplos de otros Pros:",
    needInspiration: "¿Necesitas inspiración? →",
    hideExamples: "Ocultar ejemplos ▲",
    typeHere: "Escribe tu respuesta aquí...",
    stopTitle: "Para Aquí — Espera Tu Sesión",
    stopDesc: "Tus respuestas están guardadas. No avances hasta que tu Coach esté en vivo contigo.",
    sessionTitle: "¿Qué pasa en tu sesión?",
    sessionSteps: ["Tu coach revisa tus respuestas contigo","La IA genera tu publicación de Facebook","La publicas en vivo en 10 grupos locales juntos"],
    findPhotoTitle: "Antes de Tu Sesión — Encuentra Tu Foto",
    findPhotoDesc: "Basado en tus respuestas, aquí hay ideas de fotos personalizadas para ti:",
    personalizing: "Personalizando tus sugerencias de fotos...",
    worksDoesnt: "Esto es lo que funciona y lo que no:",
    proTip: "Consejo Pro:",
    proTipText: "Abre tu galería ahora mismo y encuentra 2-3 opciones. Tenla lista para subir en el momento en que empiece tu sesión.",
    readyText: "¿Listo? Solo haz clic cuando tu coach esté contigo.",
    readyBtn: "Estoy en mi sesión — continuemos →",
    goBackEdit: "← Volver y editar mis respuestas",
    antiAdLabel: "✅ Anti-Anuncio — fotos como estas funcionan bien:",
    adLabel: "❌ Anuncio — evita fotos como estas:",
    generatePost: "Generar Mi Publicación →",
    copyPost: "📋 Copiar Publicación",
    copied: "✓ ¡Copiado!",
    regenerate: "↺ Regenerar",
    postCopied: "¡Publicación copiada! 🎉",
    nextPickPhoto: "Siguiente: elige una foto.",
    choosePhoto: "📸 Elegir Mi Foto →",
    stepGetPost: "Paso 2 — Obtener y Copiar Tu Publicación",
    englishPost: "🇺🇸 Publicación en Inglés",
    spanishPost: "🇪🇸 Publicación en Español (Vista previa)",
    spanishNote: "Esta es una vista previa — la publicación en inglés es la que revisará tu coach.",
    writingPost: "Escribiendo tu publicación...",
    joinGroupTitle: "Paso 1 — Únete a un Grupo",
    joinGroupSubtitle: "Encuentra un grupo activo local de Facebook y únete. Solo necesitas uno para empezar.",
    joined: "Te uniste — listo para publicar",
    didYouJoin: "¿Te uniste al grupo?",
    iJoined: "Me uní →",
    continueBtn: "Continuar →",
    choosePhotoTitle: "Paso 3 — Elige Tu Foto",
    choosePhotoSubtitle: "Elige una foto real tuya. Tu cara debe ser claramente visible.",
    photoReady: "Tengo Mi Foto Lista →",
    postItTitle: "Paso 4 — Publícala",
    postItSubtitle: "Estás listo. Sigue estos pasos exactamente.",
    postSteps: ["Abre el grupo de Facebook y toca Escribir algo","Pega tu publicación copiada","Adjunta tu foto","Toca Publicar"],
    postIsLive: "Mi Publicación Está Activa →",
    submitTitle: "Paso 5 — Enviar para Revisión",
    submitSubtitle: "Pega la URL de tu publicación o sube una captura para que tu coach pueda verificarla.",
    crossPostTitle: "Paso 6 — Publicar en 9 Grupos Más",
    crossPostSubtitle: "Misma publicación. Misma foto. Sin edits. Llega a 10 total.",
    crossPostRules: ["Usa exactamente la misma publicación — no cambies ni una palabra.","Adjunta exactamente la misma foto.","No añadas tu número de teléfono, sitio web ni información de contacto.","Grupos públicos: publica de inmediato. Grupos privados: únete y publica una vez aprobado."],
    howMany: "¿En cuántos grupos adicionales publicaste?",
    howManySub: "Ya publicaste en 1 — toca cuántos más.",
    moreTogo: (total, left) => `Publicaste en <strong>${total} grupos en total</strong>. <strong>Faltan ${left} más.</strong>`,
    tenDone: "¡10 Grupos Listos! →",
    goalTitle: "META DE LA SEMANA 1 ALCANZADA",
    goalDesc: "10 grupos. 10 publicaciones. Misión cumplida.",
    openLeads: "Abrir Engagement de Leads →",
    leadsTitle: "Sesión Completa — Ahora Ejecutamos",
    leadsSubtitle: "Mira este video de capacitación antes de trabajar tus leads.",
    watchedBtn: "✓ Vi el video — muéstrame el playbook",
    alreadyWatched: "¿Ya lo viste?",
    skipBtn: "Omitir →",
    notBuilt: "Aún no has construido tu historia.",
    notBuiltDesc: "Completa los 3 capítulos para generar tu publicación — o pega una existente abajo.",
    writeMyPost: "✍️ Escribir Mi Publicación",
    pastePost: "Pega tu publicación de Facebook aquí...",
    usePost: "Usar Esta Publicación →",
    devShortcuts: "Atajos de desarrollo",
    fillSample: "Llenar Respuestas de Muestra",
    skipStop: "Ir a Pantalla de Pausa",
    skipGroups: "Ir a Grupos",
    skipLeads: "Ir a Leads",
    searchCity: "¿Qué ciudad o área sirves?",
    cityPlaceholder: "ej. Este de Nashville",
    search: "Buscar",
    coachAccess: "Acceso del Coach",
    enterPasscode: "Ingresa el código",
    incorrectPasscode: "Código incorrecto.",
    enterDashboard: "Entrar al Panel",
    cancel: "Cancelar",
    submitReview: "✅ Enviar para Revisión del Coach →",
    pasteOrUpload: "Pega una URL o sube una captura para continuar",
    whyNeeded: "¿Por qué necesitamos esto?",
    whyNeededDesc: "Tu coach necesita ver la publicación en vivo antes de aprobarla. Una URL o una captura — solo necesitas una.",
    pasteUrl: "Opción 1 — Pega la URL de tu publicación",
    urlAccepted: "✓ ¡URL aceptada!",
    uploadScreenshot: "Opción 2 — Sube una captura de pantalla",
    tapUpload: "Toca para subir captura",
    screenshotAccepted: "✓ ¡Captura aceptada!",
  }
};

const QT = {
  en: [
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
  ],
  es: [
    { id:"name",          num:1,    chapter:"ch1", minWords:2,  label:"Tu Nombre",                   hint:"Nombre y apellido. Mínimo 2 palabras.",                                                                          placeholder:"ej. Carlos Reyes" },
    { id:"business",      num:2,    chapter:"ch1", minWords:2,  label:"Nombre del Negocio",          hint:"Nombre del negocio como aparece en línea. Mínimo 2 palabras.",                                                  placeholder:"ej. Reyes Home Services" },
    { id:"area",          num:3,    chapter:"ch1", minWords:8,  label:"Dónde Sirves",                hint:"Ciudades o vecindarios que atiendes y cuánto tiempo llevas en el área. Mínimo 8 palabras.",                     placeholder:"ej. Este de Nashville, Donelson y Hermitage - llevo trabajando en esta área 11 años" },
    { id:"knownFor",      num:4,    chapter:"ch1", minWords:3,  label:"Por Qué Te Conocen",          hint:"2-3 palabras específicas que describen en qué eres el experto. Sin palabras genéricas. Mínimo 3 palabras.",     placeholder:"ej. el detective de drenajes o el chico de calentadores de agua" },
    { id:"topServices",   num:5,    chapter:"ch1", minWords:4,  label:"Tus 2 Servicios Principales", hint:"Los dos servicios por los que más quieres ser conocido. Mínimo 4 palabras.",                                   placeholder:"ej. limpieza de drenajes e instalación de calentadores" },
    { id:"refuses",       num:"5b", chapter:"ch1", minWords:15, label:"Lo Que Te Niegas a Hacer",    hint:"Una cosa firme que te niegas a hacer que otros en tu industria hacen. Mínimo 15 palabras.",                    placeholder:"ej. Nunca le diré a alguien que necesita cambiar todo el sistema cuando una reparación pequeña soluciona el problema" },
    { id:"humanDetail",   num:6,    chapter:"ch2", minWords:15, label:"Un Detalle Humano",           hint:"Un detalle real sobre ti fuera del trabajo con especificidad: año, color, nombre o contexto. Mínimo 15 palabras.", placeholder:"ej. Llevo años restaurando una Ford Bronco 1967 roja que encontré oxidándose en un granero" },
    { id:"localPlace",    num:7,    chapter:"ch2", minWords:4,  label:"Sabor Local - Lugar",         hint:"El nombre real de un lugar local específico que genuinamente te encanta. Mínimo 4 palabras.",                  placeholder:"ej. Mas Tacos Por Favor en East Nashville" },
    { id:"localActivity", num:"7b", chapter:"ch2", minWords:10, label:"Qué Haces Ahí",              hint:"Exactamente qué haces o qué siempre pides ahí. Mínimo 10 palabras.",                                           placeholder:"ej. siempre pido el plato de tacos de pollo y me los como afuera en la acera" },
    { id:"mission",       num:8,    chapter:"ch2", minWords:3,  label:"Tu Misión",                   hint:"Completa: Estoy en una misión para encontrar el mejor ___ . Mínimo 3 palabras.",                              placeholder:"ej. pollo picante en Nashville o taco de desayuno en la ciudad" },
    { id:"whyStarted",    num:9,    chapter:"ch3", minWords:20, label:"Por Qué Empezaste",           hint:"El momento real que te impulsó a comenzar tu negocio. Sé honesto y específico. Mínimo 20 palabras.",          placeholder:"ej. Me cansé de ver a mi antiguo jefe cobrarle tres veces más de lo debido a clientes mayores - salí un día y nunca volví" },
    { id:"whatChanged",   num:"9b", chapter:"ch3", minWords:10, label:"¿Qué Cambió?",               hint:"Un cambio real y concreto en tu vida o familia desde que saliste por tu cuenta. Mínimo 10 palabras.",           placeholder:"ej. Ahora llego a cenar con mi familia casi todas las noches y entrené el equipo de béisbol de mi hijo esta primavera" },
    { id:"heroCrisis",    num:10,   chapter:"ch3", minWords:20, label:"Momento Héroe - La Crisis",   hint:"Pinta el cuadro completo de quién estaba en problemas, cómo era la situación, qué estaba en juego. Mínimo 20 palabras.", placeholder:"ej. Una señora mayor me llamó a las 7pm en Nochebuena, llevaba dos días sin calefacción y sus nietos llegaban por la mañana" },
    { id:"heroSacrifice", num:"10b",chapter:"ch3", minWords:10, label:"Momento Héroe - El Sacrificio", hint:"Qué hiciste exactamente o a qué renunciaste. Mínimo 10 palabras.",                                          placeholder:"ej. Manejé 40 minutos, trabajé dos horas y solo le cobré el costo de la pieza" },
    { id:"heroPayoff",    num:"10c",chapter:"ch3", minWords:10, label:"Momento Héroe - El Resultado", hint:"La reacción emocional real, de ellos o tuya. Mínimo 10 palabras.",                                           placeholder:"ej. Me tomó la mano al salir y dijo que le iba a contar a todos sobre mí" },
  ]
};

const INSPO = {
  en: {
    name:         ["Lisa Tran", "Derek Fowler", "Carlos Reyes"],
    business:     ["Tran Electrical Services", "Fowler Plumbing", "Reyes Landscaping"],
    area:         ["Brentwood, Franklin, and Spring Hill — been serving these communities for 8 years now", "North Austin and Round Rock — my family has lived here my whole life, going on 34 years"],
    knownFor:     ["same-day water heater guy", "the no-mess electrician", "lawn rescue specialist"],
    topServices:  ["panel upgrades and EV charger installs", "water heater replacement and drain cleaning", "lawn care and seasonal cleanups"],
    refuses:      ["I will never quote a job over the phone just to lock someone in and then inflate the price once I am on site", "I refuse to recommend a full replacement when a simple repair will solve the problem"],
    humanDetail:  ["I coach my daughter's soccer team every Saturday and we haven't missed a game in three seasons", "I've been restoring a 1972 Chevelle in my garage for two years and my son started helping me on weekends"],
    localPlace:   ["Turnip Truck Organic Market in East Nashville", "Pinewood Social in the Gulch", "Barista Parlor on Gallatin Ave"],
    localActivity:["always grab the breakfast tacos and eat them on the patio before the rush hits", "take my kids there every Sunday after church and we always split the pancakes"],
    mission:      ["breakfast burrito in Phoenix", "smash burger in Dallas", "fish tacos in San Diego"],
    whyStarted:   ["I watched my old boss talk down to customers like they were stupid and one day I just couldn't take it anymore and walked out", "After my dad got overcharged by a contractor I decided I was going to be the guy people could actually trust"],
    whatChanged:  ["I finally stopped missing my kids' bedtime every night and coached little league for the first time this spring", "My wife says I actually smile when I come home now instead of walking in exhausted and defeated"],
    heroCrisis:   ["A young mom called me on a Friday afternoon — her water heater had flooded her basement and family was coming in for a birthday party the next morning", "An elderly man called me in August — his AC had been out for four days during a heat advisory"],
    heroSacrifice:["I drove out there after my daughter's recital, worked until midnight, and only charged for parts", "I cancelled my Saturday plans and spent the whole day getting it fixed at cost"],
    heroPayoff:   ["She called me the next week just to say thank you and has sent me three referrals since", "He shook my hand for a long time and said I reminded him of his son"],
  },
  es: {
    name:         ["María González", "Roberto Herrera", "Ana Martínez"],
    business:     ["González Plomería", "Herrera Electricidad", "Martínez Paisajismo"],
    area:         ["Este de Nashville, Donelson y Hermitage — llevo trabajando en esta área más de 10 años", "Houston Norte y Spring Branch — mi familia ha vivido aquí toda la vida, más de 25 años"],
    knownFor:     ["el chico de calentadores al mismo día", "el electricista sin desorden", "especialista en rescate de jardines"],
    topServices:  ["actualización de paneles e instalación de cargadores de autos eléctricos", "reemplazo de calentadores y limpieza de drenajes", "cuidado de jardines y limpiezas de temporada"],
    refuses:      ["Nunca voy a cotizar un trabajo por teléfono solo para asegurar al cliente y luego inflar el precio cuando llegue", "Me niego a recomendar un reemplazo completo cuando una reparación simple soluciona el problema"],
    humanDetail:  ["Entreno al equipo de fútbol de mi hija cada sábado por la mañana y no nos hemos perdido un partido en tres temporadas", "Llevo dos años restaurando un Chevelle 1972 en mi garaje y mi hijo adolescente ha empezado a ayudarme los fines de semana"],
    localPlace:   ["Mas Tacos Por Favor en East Nashville", "La Michoacana en el vecindario", "El Pupusódromo de la Calle Principal"],
    localActivity:["siempre pido los tacos de desayuno y me los como en el patio antes de que llegue la multitud", "llevo a mis hijos ahí cada domingo después de la iglesia y siempre compartimos los tamales"],
    mission:      ["el mejor birria en Nashville", "el mejor taco de canasta en la ciudad", "la mejor horchata del área"],
    whyStarted:   ["Me cansé de ver a mi antiguo jefe tratar a los clientes como si fueran tontos y un día simplemente no pude más y me fui", "Después de que mi papá fue cobrado de más por un contratista que se aprovechó de que no sabía, decidí ser la persona en quien la gente puede confiar"],
    whatChanged:  ["Por fin dejé de perderme la hora de dormir de mis hijos todas las noches y entrené las ligas menores por primera vez esta primavera", "Mi esposa dice que ahora llego a casa sonriendo en vez de entrar agotado y derrotado"],
    heroCrisis:   ["Una mamá joven me llamó un viernes por la tarde — el calentador había inundado su sótano y la familia llegaba para una fiesta de cumpleaños a la mañana siguiente", "Un señor mayor me llamó en agosto — su aire acondicionado llevaba cuatro días sin funcionar durante una advertencia de calor"],
    heroSacrifice:["Fui después del recital de mi hija, trabajé hasta la medianoche y solo cobré las piezas", "Cancelé mis planes del sábado y pasé todo el día arreglándolo al costo"],
    heroPayoff:   ["Me llamó la semana siguiente solo para decir gracias y desde entonces me ha mandado tres referencias", "Me estrechó la mano por mucho tiempo y dijo que le recordaba a su hijo"],
  }
};

const CHAPTER_META_I18N = {
  en: {
    ch1:{ emoji:"🙋", title:"Chapter 1 — Who You Are",      why:"Before someone trusts you with their home, they need clarity on who you are and what you do. Confusion kills trust. Clarity builds credibility." },
    ch2:{ emoji:"🏡", title:"Chapter 2 — Your Real Life",   why:"This is where we prove you are real. Bots write generic. Humans write specifics. Specific details create connection. Connection builds trust." },
    ch3:{ emoji:"❤️", title:"Chapter 3 — What Shaped You",  why:"Quality work is expected. Trust is earned. Emotional connection separates you from any Pro will do. When people feel something, they engage." },
  },
  es: {
    ch1:{ emoji:"🙋", title:"Capítulo 1 — Quién Eres",           why:"Antes de que alguien te confíe su hogar, necesita claridad sobre quién eres y qué haces. La confusión mata la confianza. La claridad construye credibilidad." },
    ch2:{ emoji:"🏡", title:"Capítulo 2 — Tu Vida Real",         why:"Aquí es donde demostramos que eres real. Los bots escriben genérico. Los humanos escriben específico. Los detalles crean conexión. La conexión construye confianza." },
    ch3:{ emoji:"❤️", title:"Capítulo 3 — Lo Que Te Formó",      why:"El buen trabajo se espera. La confianza se gana. La conexión emocional te separa del montón. Cuando la gente siente algo, se involucra." },
  }
};

function lsGet(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

const NAV_SECTIONS_I18N = {
  en: [
    { id:"write",     label:"Write Post",     phases:["ch1","ch2","ch3","waitforcoach"] },
    { id:"grouppost", label:"Post in Groups", phases:["groups","getpost","photo","dopost","approval","replicate"] },
    { id:"leads",     label:"Work Leads",     phases:["leads","amplify"] },
  ],
  es: [
    { id:"write",     label:"Escribir",       phases:["ch1","ch2","ch3","waitforcoach"] },
    { id:"grouppost", label:"Publicar",       phases:["groups","getpost","photo","dopost","approval","replicate"] },
    { id:"leads",     label:"Leads",          phases:["leads","amplify"] },
  ],
};

const PHASE_LABELS_I18N = {
  en: { ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3", waitforcoach:"Stop Here", groups:"1. Join a Group", getpost:"2. Get & Copy Post", photo:"3. Choose Photo", dopost:"4. Post It", approval:"5. Submit for Review", replicate:"6. Cross-Post", leads:"Work Leads", amplify:"Amplify" },
  es: { ch1:"Capítulo 1", ch2:"Capítulo 2", ch3:"Capítulo 3", waitforcoach:"Pausa", groups:"1. Únete a un Grupo", getpost:"2. Obtener Publicación", photo:"3. Elegir Foto", dopost:"4. Publicar", approval:"5. Enviar Revisión", replicate:"6. Replicar", leads:"Trabajar Leads", amplify:"Amplificar" },
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

const GOOD_PHOTOS = [
  { url:"https://i.imgur.com/F7Ur9Rf.png", label:"You with family outdoors", labelEs:"Tú con tu familia al aire libre", desc:"Real moment, face visible, natural light.", descEs:"Momento real, cara visible, luz natural." },
  { url:"https://i.imgur.com/HWxgfnO.png", label:"You with your partner", labelEs:"Tú con tu pareja", desc:"Warm, approachable, human connection.", descEs:"Cálido, accesible, conexión humana." },
  { url:"https://i.imgur.com/Cv43HJt.png", label:"Special life moment", labelEs:"Momento especial de vida", desc:"Shows who you are outside of work.", descEs:"Muestra quién eres fuera del trabajo." },
];
const BAD_PHOTOS = [
  { url:"https://i.imgur.com/l8KAdix.png", label:"Working but no face", labelEs:"Trabajando pero sin cara", desc:"No face = no connection. People buy from people.", descEs:"Sin cara = sin conexión. La gente le compra a personas." },
  { url:"https://i.imgur.com/vCVlGIm.png", label:"Logo or branding", labelEs:"Logo o marca", desc:"Looks like an ad. Kills the neighbor feel instantly.", descEs:"Parece un anuncio. Mata el ambiente de vecino al instante." },
  { url:"https://i.imgur.com/7rvGL6O.png", label:"No people in the photo", labelEs:"Sin personas en la foto", desc:"Nothing to connect with. You need to be in it.", descEs:"Nada con qué conectar. Necesitas estar en ella." },
];

const BOOKING_SCRIPT = "I've got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";
const LEAD_TYPES = [
  { id:"like", emoji:"👍", label:"Like or Emoji", color:"#FEF9EC", border:YELLOW, simple:true,
    steps:[
      { label:"Within 24 hours, send this DM to each person who reacted", script:"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?" },
      { label:"Then follow the DM strategy based on their response", note:true },
    ]},
  { id:"comment", emoji:"💬", label:"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false,
    subtypes:[
      { id:"comment_service_q", label:"Asked about a service you offer", example:'"Do you do drain cleaning?"', publicReplies:["@[Name] great question. I do handle [service type], and quality is always guaranteed."], dmScript:"Hey [Name], thanks so much for commenting. We absolutely can help with [service]. " + BOOKING_SCRIPT },
      { id:"comment_area_q", label:"Asked about your service area", example:'"Do you service Donelson?"', publicReplies:["@[Name] great question. We do service [city name], we'd love to help you out."], dmScript:"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious — is there something specific going on I can help with?" },
      { id:"comment_needs_now", label:"Needs help now", example:'"I was just about to call someone!"', publicReplies:["@[Name] we'd love to help serve you and your family."], dmScript:"Hey [Name], so glad you reached out. " + BOOKING_SCRIPT },
      { id:"comment_praise", label:"Praise or encouragement", example:'"Love this post!"', publicReplies:["@[Name] really appreciate the kind words!"], dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I'd be glad to take care of you." },
    ]},
  { id:"share", emoji:"🔁", label:"Share", color:"#F0FDF4", border:"#86EFAC", simple:true,
    steps:[
      { label:"Comment on their share", script:"@[Name] really appreciate that. Supporting local businesses helps the whole community." },
      { label:"Then send this DM", script:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I'd be glad to take care of you." },
    ]},
  { id:"dm", emoji:"✉️", label:"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false,
    subtypes:[
      { id:"dm_service_yes", label:"Asked about a service you offer", example:'"Do you do water heater installs?"', dmScript:"Hey, thanks so much for reaching out. We absolutely can help with [service name]. " + BOOKING_SCRIPT },
      { id:"dm_praise", label:"Praise or encouragement", example:'"Way to go!"', dmScript:"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I'd be glad to take care of you." },
    ]},
];

function wordCount(str) { return (str||"").trim().split(/\s+/).filter(Boolean).length; }

async function callClaude(messages, system) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:2000, messages };
  if (system) body.system = system;
  const r = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  const d = await r.json();
  return (d.content||[]).filter(b => b.type==="text").map(b => b.text).join("") || "";
}

async function findFacebookGroups(city, count) {
  const reply = await callClaude([{ role:"user", content:"Generate "+count+" realistic Facebook group names for the "+city+" area that a home service contractor could post in. Sort Public first.\n\nReturn ONLY a raw JSON array:\n[{\"name\": \"group name\", \"type\": \"Community or Homeowners or Family or Buy/Sell or Neighborhood\", \"members\": \"e.g. 4.2K\", \"privacy\": \"Public or Private\"}]" }]);
  const match = reply.match(/\[[\s\S]*?\]/); if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]); if (!Array.isArray(parsed)) return [];
    return parsed.filter(g => g.name).map(g => ({...g, url:"https://www.facebook.com/search/groups/?q="+encodeURIComponent(g.name)})).sort((a,b) => a.privacy==="Public"?-1:1);
  } catch(e) { return []; }
}

async function generateAIPost(ans, lang) {
  const isEs = lang === "es";
  const p = "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.\n\n"
    +"Answers:\n1. Name: "+(ans.name||"")+"\n2. Business: "+(ans.business||"")+"\n3. Area: "+(ans.area||"")
    +"\n4. Known For: "+(ans.knownFor||"")+"\n5. Services: "+(ans.topServices||"")+"\n5b. Refuses: "+(ans.refuses||"")
    +"\n6. Human Detail: "+(ans.humanDetail||"")+"\n7. Local Place: "+(ans.localPlace||"")+"\n7b. Activity: "+(ans.localActivity||"")
    +"\n8. Mission: "+(ans.mission||"")+"\n9. Why Started: "+(ans.whyStarted||"")+"\n9b. Changed: "+(ans.whatChanged||"")
    +"\n10. Crisis: "+(ans.heroCrisis||"")+"\n10b. Sacrifice: "+(ans.heroSacrifice||"")+"\n10c. Payoff: "+(ans.heroPayoff||"")
    +"\n\nSTRICT NO-HALLUCINATION: Only use facts from answers above.\n"
    +"RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. No em dashes. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.\n"
    +(isEs ? "Write the ENTIRE post in Spanish. Use natural, warm, conversational Spanish as spoken in Latin American communities in the US.\n" : "")
    +"STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Hero moment 8-12 lines, (4) Neighbor proof, (5) End ONLY with: \""+(isEs ? "También estoy en una misión para encontrar el mejor [mission] en [city]. ¿Alguna sugerencia?" : "Also, I'm on a mission to find the best [mission] in [city]. Any suggestions?")+"\"\n"
    +"Output post only. No labels.";
  return await callClaude([{ role:"user", content:p }]);
}

function getWriteStatus(answers, lang) {
  const qs = QT[lang];
  const n = qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  if (n === 0) return { label: lang==="es"?"No Iniciado":"Not Started", color:GRAY400, bg:GRAY100 };
  if (n < qs.length) return { label: lang==="es"?"En Progreso":"In Progress", color:"#92400E", bg:"#FEF9EC" };
  return { label: lang==="es"?"Listo":"Done", color:"#065F46", bg:"#D1FAE5" };
}
function getGroupStatus(completedSections, coachApproved, postCount, lang) {
  if (!completedSections.includes("grouppost") && postCount === 0 && !coachApproved) return { label:lang==="es"?"No Iniciado":"Not Started", color:GRAY400, bg:GRAY100 };
  if (completedSections.includes("grouppost")) return { label:lang==="es"?"Listo":"Done", color:"#065F46", bg:"#D1FAE5" };
  if (coachApproved) return { label:lang==="es"?"En Revisión":"Needs Review", color:"#1D4ED8", bg:"#DBEAFE" };
  return { label:lang==="es"?"En Progreso":"In Progress", color:"#92400E", bg:"#FEF9EC" };
}
function getLeadsStatus(dmSent, stacked, lang) {
  if (!dmSent) return { label:lang==="es"?"No Iniciado":"Not Started", color:GRAY400, bg:GRAY100 };
  if (!stacked) return { label:lang==="es"?"En Progreso":"In Progress", color:"#92400E", bg:"#FEF9EC" };
  return { label:lang==="es"?"Listo":"Done", color:"#065F46", bg:"#D1FAE5" };
}
function getNextStep(answers, post, completedSections, coachApproved, postCount, dmSent, stacked, lang) {
  const qs = QT[lang];
  const n = qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  const t = T[lang];
  if (n === 0) return { label: lang==="es"?"Comenzar a Escribir Tu Publicación":"Start Writing Your Post", phase:"writechoice", emoji:"✍️" };
  if (n < qs.length) { const nq = qs.find(q => wordCount(answers[q.id]) < q.minWords); return { label: lang==="es"?`Continuar — ${n} de 15 listas`:`Continue Writing — ${n} of 15 done`, phase:nq?nq.chapter:"ch1", emoji:"✍️" }; }
  if (!post) return { label: lang==="es"?"Generar Tu Publicación":"Generate Your Post", phase:"getpost", emoji:"✨" };
  if (!coachApproved) return { label: lang==="es"?"Publicar en Grupos":"Post in Groups & Get Coach Approval", phase:"groups", emoji:"📣" };
  if (!completedSections.includes("grouppost")) return { label: lang==="es"?"Replicar en 10 Grupos":"Cross-Post to 10 Groups", phase:"replicate", emoji:"🔁" };
  if (!dmSent) return { label: lang==="es"?"Empezar a Trabajar Leads":"Start Working Your Leads", phase:"leads", emoji:"🔥" };
  return { label: lang==="es"?"¡Semana 1 Completa!":"Week 1 Complete — Keep Going!", phase:"leads", emoji:"🎯" };
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

function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display:"flex", background:"rgba(255,255,255,0.12)", borderRadius:99, padding:3, gap:2 }}>
      {["en","es"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?WHITE:"transparent", color:lang===l?NAVY:WHITE, border:"none", borderRadius:99, padding:"4px 14px", fontSize:12, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}>
          {l==="en"?"EN":"ES"}
        </button>
      ))}
    </div>
  );
}

function PhaseNav({ current, onNavigate, completedSections, lang }) {
  if (NO_NAV_PHASES.includes(current)) return null;
  const NAV_SECTIONS = NAV_SECTIONS_I18N[lang];
  const PHASE_LABELS = PHASE_LABELS_I18N[lang];
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
    if (onPreviewChange && previewValue) onPreviewChange(previewValue.replace(/\s*\[🎤.*\]$/, "").trimEnd());
  }
  if (!listening) {
    return (
      <span style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:3 }}>
        <button type="button" onClick={startListening} style={{ background:GRAY100, border:"1.5px solid "+GRAY200, borderRadius:"50%", width:sz, height:sz, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
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
function GroupActionRow({ group, onConfirmed, t }) {
  const [opened, setOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  if (confirmed) {
    return (
      <div style={{ background:"#F0FDF4", border:"1.5px solid #86EFAC", borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>✅</span>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#065F46", fontSize:14 }}>{group.name}</div><div style={{ fontSize:12, color:"#065F46" }}>{t.joined}</div></div>
        <Btn onClick={onConfirmed} style={{ fontSize:13, padding:"8px 16px" }}>{t.continueBtn}</Btn>
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
          <span style={{ fontSize:13, color:GRAY600 }}>{t.didYouJoin}</span>
          <button onClick={() => setConfirmed(true)} style={{ background:YELLOW, color:NAVY, border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{t.iJoined}</button>
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

function PhotoGuideReal({ lang }) {
  const t = T[lang];
  return (
    <>
      <div style={{ fontWeight:700, color:GREEN, fontSize:13, marginBottom:10 }}>{t.antiAdLabel}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:24 }}>
        {GOOD_PHOTOS.map((g,i) => (
          <div key={i} style={{ border:"2.5px solid #86EFAC", borderRadius:12, overflow:"hidden", background:"#F0FDF4" }}>
            <div style={{ position:"relative", paddingBottom:"75%", background:GRAY100 }}>
              <img src={g.url} alt={g.label} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", top:6, left:6, background:GREEN, color:WHITE, borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800 }}>✓ ANTI-AD</div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontWeight:700, color:"#166534", fontSize:12, marginBottom:2 }}>{lang==="es"?g.labelEs:g.label}</div>
              <div style={{ fontSize:11, color:"#166534", lineHeight:1.4 }}>{lang==="es"?g.descEs:g.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontWeight:700, color:RED, fontSize:13, marginBottom:10 }}>{t.adLabel}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
        {BAD_PHOTOS.map((b,i) => (
          <div key={i} style={{ border:"2.5px solid #FCA5A5", borderRadius:12, overflow:"hidden", background:"#FEF2F2" }}>
            <div style={{ position:"relative", paddingBottom:"75%", background:GRAY100 }}>
              <img src={b.url} alt={b.label} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", top:6, left:6, background:RED, color:WHITE, borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800 }}>✗ AD</div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontWeight:700, color:"#991B1B", fontSize:12, marginBottom:2 }}>{lang==="es"?b.labelEs:b.label}</div>
              <div style={{ fontSize:11, color:"#991B1B", lineHeight:1.4 }}>{lang==="es"?b.descEs:b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EvidenceCapture({ onSubmit, t }) {
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
        <p style={{ margin:0, fontSize:13, color:NAVY, fontWeight:600, marginBottom:4 }}>{t.whyNeeded}</p>
        <p style={{ margin:0, fontSize:13, color:GRAY600, lineHeight:1.6 }}>{t.whyNeededDesc}</p>
      </div>
      <div style={{ marginBottom:20, padding:16, borderRadius:12, border:"2px solid "+(urlValid?GREEN:GRAY200), background:urlValid?"#F0FDF4":WHITE }}>
        <label style={{ display:"block", fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{t.pasteUrl}</label>
        <input type="url" value={url} onChange={e => { setUrl(e.target.value); if (screenshot) { setScreenshot(null); setScreenshotName(""); } }} placeholder="https://www.facebook.com/groups/..."
          style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(urlValid?GREEN:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit", background:"transparent" }} />
        {urlValid && <div style={{ marginTop:8 }}><span style={{ color:GREEN, fontWeight:700, fontSize:13 }}>{t.urlAccepted}</span></div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <div style={{ flex:1, height:1, background:GRAY200 }} /><span style={{ fontSize:12, color:GRAY400, fontWeight:700 }}>OR</span><div style={{ flex:1, height:1, background:GRAY200 }} />
      </div>
      <div style={{ marginBottom:24, padding:16, borderRadius:12, border:"2px solid "+(screenshot?GREEN:GRAY200), background:screenshot?"#F0FDF4":WHITE }}>
        <label style={{ display:"block", fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{t.uploadScreenshot}</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
        {!screenshot ? (
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{ width:"100%", border:"2px dashed "+GRAY200, borderRadius:10, padding:"20px 16px", background:GRAY50, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:26 }}>📸</span>
            <span style={{ fontWeight:700, color:NAVY, fontSize:14 }}>{t.tapUpload}</span>
          </button>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>🖼️</span>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#065F46", fontSize:14 }}>{screenshotName}</div><div style={{ fontSize:12, color:GREEN, fontWeight:600 }}>{t.screenshotAccepted}</div></div>
            <button onClick={() => { setScreenshot(null); setScreenshotName(""); }} style={{ background:"none", border:"none", color:GRAY400, fontSize:20, cursor:"pointer" }}>×</button>
          </div>
        )}
      </div>
      <Btn onClick={() => hasEvidence && onSubmit({ url:urlValid?url:null, screenshot })} disabled={!hasEvidence} style={{ width:"100%", justifyContent:"center" }}>
        {hasEvidence ? t.submitReview : t.pasteOrUpload}
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
                  {QT.en.filter(q => s.answers && s.answers[q.id]).map(q => (
                    <div key={q.id} style={{ background:GRAY50, borderRadius:10, padding:"10px 12px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:GRAY400, marginBottom:3 }}>Q{q.num} {q.label}</div>
                      <div style={{ fontSize:13, color:GRAY800, lineHeight:1.5 }}>{s.answers[q.id]}</div>
                    </div>
                  ))}
                </div>
                {s.post && <div><div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:8 }}>Generated Post (English):</div><div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:16, fontSize:13, color:GRAY800, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.post}</div></div>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function WaitForCoach({ answers, onContinue, onBack, lang }) {
  const t = T[lang];
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prompt = lang === "es"
      ? "Eres un coach de negocios. Basado en las respuestas de este Pro, dale exactamente 3 ideas de fotos para su publicación de Facebook — Buena, Mejor y La Mejor. Cada una debe ser una oración corta y directa. Referencia detalles reales de sus respuestas.\n\nNombre: "+(answers.name||"")+"\nDetalle humano: "+(answers.humanDetail||"")+"\nLugar local: "+(answers.localPlace||"")+"\nActividad local: "+(answers.localActivity||"")+"\n\nDevuelve SOLO este formato exacto:\nBUENA: [una oración]\nMEJOR: [una oración]\nLA MEJOR: [una oración]"
      : "You are a business coach. Based on this Pro's answers, give them exactly 3 photo ideas — Good, Better, and Best. Each should be one short punchy sentence referencing their actual answers.\n\nName: "+(answers.name||"")+"\nHuman detail: "+(answers.humanDetail||"")+"\nLocal place: "+(answers.localPlace||"")+"\nLocal activity: "+(answers.localActivity||"")+"\n\nReturn ONLY this exact format:\nGOOD: [one sentence]\nBETTER: [one sentence]\nBEST: [one sentence]";

    callClaude([{ role:"user", content: prompt }])
      .then(r => { setSuggestion(r); setLoading(false); })
      .catch(() => {
        setSuggestion(lang==="es"
          ? "BUENA: Una foto tuya en tu lugar favorito del vecindario.\nMEJOR: Tú con un familiar haciendo algo que amas.\nLA MEJOR: Un momento real y espontáneo que muestra tu personalidad fuera del trabajo."
          : "GOOD: A solo shot of you at your favorite local spot.\nBETTER: You with a family member doing something you love.\nBEST: A candid real moment that shows your personality outside of work.");
        setLoading(false);
      });
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
          <h2 style={{ color:NAVY, fontSize:24, fontWeight:900, margin:"0 0 6px" }}>{t.stopTitle}</h2>
          <p style={{ color:NAVY, fontSize:14, lineHeight:1.6, margin:0, opacity:0.8 }}>{t.stopDesc}</p>
        </div>
      </div>

      <Card>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <span style={{ fontSize:28 }}>📸</span>
          <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{t.findPhotoTitle}</h3>
        </div>
        <p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, marginBottom:16 }}>{t.findPhotoDesc}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
          {loading ? (
            <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:10, color:GRAY400, fontSize:13, padding:"14px 16px", background:GRAY50, borderRadius:10 }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width:16, height:16, border:"2px solid "+GRAY200, borderTopColor:NAVY, borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }} />
              {t.personalizing}
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
        <p style={{ color:GRAY600, fontSize:13, fontWeight:600, marginBottom:12 }}>{t.worksDoesnt}</p>
        <PhotoGuideReal lang={lang} />
        <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 16px", fontSize:13, color:NAVY, lineHeight:1.7, marginTop:20 }}>
          💡 <strong>{t.proTip}</strong> {t.proTipText}
        </div>
      </Card>

      <Card style={{ background:NAVY }}>
        <h3 style={{ color:YELLOW, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>{t.sessionTitle}</h3>
        {t.sessionSteps.map((step, i) => (
          <div key={i} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
            <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{i+1}</div>
            <p style={{ margin:0, fontSize:14, color:WHITE, paddingTop:3, lineHeight:1.6 }}>{step}</p>
          </div>
        ))}
      </Card>

      <Card style={{ textAlign:"center", background:GRAY50, border:"2px solid "+YELLOW }}>
        <p style={{ color:NAVY, fontWeight:700, fontSize:15, margin:"0 0 16px" }}>{t.readyText}</p>
        <Btn onClick={onContinue} style={{ margin:"0 auto" }}>{t.readyBtn}</Btn>
      </Card>
      <div style={{ textAlign:"center", marginTop:8 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer", textDecoration:"underline" }}>{t.goBackEdit}</button>
      </div>
    </div>
  );
}

const SHIMMER_CSS = `@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`;

function ChapterProgressBar({ chapter, answers, lang }) {
  const qs = QT[lang].filter(q => q.chapter === chapter);
  const answered = qs.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  const total = qs.length;
  const visualPct = Math.max(15, total===0?0:Math.round((answered/total)*100));
  const complete = answered===total && total>0;
  const t = T[lang];
  return (
    <div style={{ marginBottom:20 }}>
      <style>{SHIMMER_CSS}</style>
      <div style={{ fontSize:12, marginBottom:6 }}><span style={{ fontWeight:600, color:complete?GREEN:GRAY600 }}>{complete ? t.chapterComplete : `${answered} ${t.of} ${total} ${t.answered}`}</span></div>
      <div style={{ background:GRAY200, borderRadius:99, height:10, overflow:"hidden" }}>
        <div style={{ height:10, borderRadius:99, width:visualPct+"%", background:complete?"#10B981":YELLOW, transition:"width 0.55s cubic-bezier(0.4,0,0.2,1)", position:"relative", overflow:"hidden" }}>
          {complete && <div style={{ position:"absolute", top:0, left:0, height:"100%", width:"40%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)", animation:"shimmer 0.8s ease 0.2s 2" }} />}
        </div>
      </div>
    </div>
  );
}

function ProgressiveForm({ answers, onAnswer, onExit, onComplete, validationFeedback, lang, initialPhase, onPhaseChange }) {
  const ALL_QUESTIONS = QT[lang];
  const startIdx = ALL_QUESTIONS.findIndex(q => q.chapter===initialPhase);
  const [idx, setIdx] = useState(startIdx>=0?startIdx:0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showInspo, setShowInspo] = useState(false);
  const textareaRef = useRef(null);
  const q = ALL_QUESTIONS[idx];
  const meta = CHAPTER_META_I18N[lang][q.chapter];
  const t = T[lang];
  const wc = wordCount(answers[q.id]);
  const met = wc >= q.minWords;
  const isLastQ = idx === ALL_QUESTIONS.length-1;
  const isFirstQ = idx === 0;
  const totalAnswered = ALL_QUESTIONS.filter(x => wordCount(answers[x.id]) >= x.minWords).length;
  const inspoExamples = (INSPO[lang][q.id]) || [];

  useEffect(() => { if (visible && textareaRef.current) setTimeout(() => textareaRef.current && textareaRef.current.focus(), 320); }, [idx, visible]);
  useEffect(() => { onPhaseChange(q.chapter); setShowInspo(false); }, [idx]);

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
          <div style={{ fontSize:12, color:GRAY400, marginTop:2 }}>{totalAnswered} {t.of} {ALL_QUESTIONS.length} {t.questionsAnswered}</div>
        </div>
      </div>
      <Card style={{ minHeight:340, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={slideStyle}>
          <ChapterProgressBar chapter={q.chapter} answers={answers} lang={lang} />
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
          <p style={{ fontSize:12, color:GRAY600, fontStyle:"italic", margin:"0 0 10px" }}>{q.placeholder}</p>
          <textarea ref={textareaRef} value={answers[q.id]||""} onChange={e => onAnswer(q.id, e.target.value)} placeholder={t.typeHere} rows={3}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+borderColor, borderRadius:10, padding:"10px 14px", fontSize:14, color:GRAY800, fontFamily:"inherit", resize:"vertical", outline:"none", background:bgColor, marginBottom:6 }} />
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, minHeight:18 }}>
            {wc > 0 ? (
              <><div style={{ flex:1, background:GRAY200, borderRadius:99, height:4, overflow:"hidden" }}><div style={{ background:met?GREEN:RED, height:4, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }} /></div><span style={{ fontSize:11, fontWeight:700, color:met?GREEN:RED, whiteSpace:"nowrap" }}>{met?"✓ ":""}{wc} / {q.minWords} words{met?"":" min"}</span></>
            ) : <span style={{ fontSize:11, color:GRAY400 }}>{t.minWords(q.minWords)}</span>}
          </div>
          {inspoExamples.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <button type="button" onClick={() => setShowInspo(v => !v)}
                style={{ background:"transparent", border:"2px solid "+NAVY, borderRadius:8, color:NAVY, fontSize:13, fontWeight:700, cursor:"pointer", padding:"8px 16px", display:"inline-flex", alignItems:"center", gap:6, marginBottom:showInspo?8:0 }}>
                💡 {showInspo ? t.hideExamples : t.needInspiration}
              </button>
              {showInspo && (
                <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:NAVY, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>{t.examplesTitle}</div>
                  {inspoExamples.map((ex, i) => (
                    <div key={i} style={{ fontSize:13, color:GRAY800, lineHeight:1.6, marginBottom:i<inspoExamples.length-1?8:0, paddingBottom:i<inspoExamples.length-1?8:0, borderBottom:i<inspoExamples.length-1?"1px solid #FDE68A":"none" }}>{ex}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"space-between" }}>
            <Btn variant="ghost" onClick={handleBack} style={{ fontSize:13, padding:"8px 14px" }}>{isFirstQ ? t.back : t.previous}</Btn>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:GRAY400 }}>{idx+1} / {ALL_QUESTIONS.length}</span>
              <Btn onClick={handleNext} disabled={!met||animating}>{t.next}</Btn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LeadEngagement({ onBack, onAmplify }) {
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
              <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
                <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>✓ Mark as Worked</Btn>
                <Btn variant="ghost" onClick={reset}>← Back</Btn>
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

function Amplify({ city, week1Total }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amplifyCount, setAmplifyCount] = useState(0);
  const totalPosted = (week1Total||0) + amplifyCount;
  async function fetchGroups() {
    if (!city || city === "Your City") { setError("Please enter your city."); return; }
    setLoading(true); setError("");
    try { const fresh = await findFacebookGroups(city, 20); setGroups(fresh); if (!fresh.length) setError("No groups found. Try a nearby city."); }
    catch(e) { setError("Could not load groups."); }
    setLoading(false);
  }
  useEffect(() => { if (city && city !== "Your City") fetchGroups(); }, []);
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

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("hcp_lang") || "en"; } catch { return "en"; } });
  useEffect(() => { try { localStorage.setItem("hcp_lang", lang); } catch {} }, [lang]);
  const [appPhase, setAppPhase] = useState(() => lsGet("hcp_phase", "lane"));
  const [answers, setAnswers] = useState(() => lsGet("hcp_answers", {}));
  const [post, setPost] = useState(() => lsGet("hcp_post", ""));
  const [postEs, setPostEs] = useState(() => lsGet("hcp_post_es", ""));
  const [flags, setFlags] = useState(() => lsGet("hcp_flags", { postCount:0, coachApproved:false, tenDone:false, dmSent:false, stacked:false, completedSections:[] }));

  useEffect(() => { lsSet("hcp_answers", answers); }, [answers]);
  useEffect(() => { lsSet("hcp_phase", appPhase); }, [appPhase]);
  useEffect(() => { lsSet("hcp_post", post); }, [post]);
  useEffect(() => { lsSet("hcp_post_es", postEs); }, [postEs]);
  useEffect(() => { lsSet("hcp_flags", flags); }, [flags]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [copiedGetpost, setCopiedGetpost] = useState(false);
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
  const topRef = useRef(null);

  const t = T[lang];
  const ALL_QUESTIONS = QT[lang];
  const { postCount, coachApproved, tenDone, dmSent, stacked, completedSections } = flags;
  const setFlag = (key, val) => setFlags(prev => ({...prev, [key]:val}));
  const setAnswer = (id, val) => setAnswers(prev => ({...prev, [id]:val}));
  const devFill = () => setAnswers(SAMPLE_ANSWERS);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior:"smooth" }); }, [appPhase]);

  const ch3Met = QT[lang].filter(q => q.chapter==="ch3").every(q => wordCount(answers[q.id]) >= q.minWords);
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
    setValidationFeedback({});
    setAppPhase(nextPhase);
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

  async function handleGeneratePost() {
    setPostLoading(true); setPostError(""); setPost(""); setPostEs("");
    try {
      const [enPost, esPost] = await Promise.all([
        generateAIPost(answers, "en"),
        generateAIPost(answers, "es"),
      ]);
      setPost(enPost);
      setPostEs(esPost);
      setFlag("completedSections", completedSections.includes("write") ? completedSections : [...completedSections,"write"]);
      await saveSubmission(answers, enPost, "Post Generated");
    } catch(e) { setPostError("Could not generate post. Please check your connection and try again."); }
    setPostLoading(false);
  }

  const writeStatus  = getWriteStatus(answers, lang);
  const groupStatus  = getGroupStatus(completedSections, coachApproved, postCount, lang);
  const leadsStatus  = getLeadsStatus(dmSent, stacked, lang);
  const nextStep     = getNextStep(answers, post, completedSections, coachApproved, postCount, dmSent, stacked, lang);
  const answeredCount = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;

  function StatusTag({ status }) {
    return <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:status.bg, color:status.color, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{status.label==="Done"||status.label==="Listo"?"✓ ":status.label==="In Progress"||status.label==="En Progreso"?"● ":"○ "}{status.label}</span>;
  }

  return (
    <div style={{ minHeight:"100vh", background:GRAY50, fontFamily:"'Inter', -apple-system, sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)} />}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 8px", textAlign:"center" }}>{t.coachAccess}</h3>
            <input type="password" value={passcodeInput} onChange={e => { setPasscodeInput(e.target.value); setPasscodeError(false); }}
              onKeyDown={e => { if (e.key==="Enter") { if (passcodeInput===COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); } }}
              placeholder={t.enterPasscode}
              style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?RED:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }} />
            {passcodeError && <p style={{ color:RED, fontSize:12, margin:"0 0 8px" }}>{t.incorrectPasscode}</p>}
            <Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if (passcodeInput===COACH_PASSCODE) { setShowDashboard(true); setShowCoachLogin(false); setPasscodeInput(""); } else setPasscodeError(true); }}>{t.enterDashboard}</Btn>
            <button onClick={() => { setShowCoachLogin(false); setPasscodeInput(""); setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16, lineHeight:1 }}>Business Coaching Foundations</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>{t.headerSub}</div></div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LangToggle lang={lang} setLang={setLang} />
          {appPhase==="lane" ? (
            <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.coachDashboard}</button>
          ) : (
            <button onClick={() => setAppPhase("lane")} style={{ background:YELLOW, border:"none", borderRadius:8, padding:"8px 18px", color:NAVY, fontSize:13, fontWeight:800, cursor:"pointer" }}>{t.saveExit}</button>
          )}
        </div>
      </div>

      <div ref={topRef} style={{ maxWidth:680, margin:"0 auto", padding:"28px 16px 60px" }}>
        <PhaseNav current={appPhase} onNavigate={id => setAppPhase(id)} completedSections={completedSections} lang={lang} />

        {/* HOME */}
        {appPhase==="lane" && (
          <div>
            <div style={{ background:NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
              <h1 style={{ color:WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>{t.homeTitle}<br /><span style={{ color:YELLOW }}>{t.homeTitle2}</span></h1>
              <p style={{ color:GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px", maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>{t.homeDesc}</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                {t.homeBadges.map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:WHITE }}>{s}</div>)}
              </div>
            </div>
            <button onClick={() => setAppPhase(nextStep.phase)}
              style={{ width:"100%", background:YELLOW, border:"none", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:24, boxShadow:"0 4px 20px rgba(254,183,5,0.35)" }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:11, fontWeight:700, color:NAVY, opacity:0.6, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>{t.continueLabel}</div>
                <div style={{ fontSize:16, fontWeight:900, color:NAVY }}>{nextStep.emoji} {nextStep.label}</div>
              </div>
              <div style={{ background:NAVY, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>
            <h3 style={{ color:NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>{t.weekChecklist}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {[
                { phase:"writechoice", icon:"✍️", bg:NAVY,       label:t.writePost,   status:writeStatus,  desc:t.writePostDesc,  sub:t.writePostSub(answeredCount) },
                { phase:"groups",      icon:"📣", bg:NAVY_LIGHT,  label:t.postGroups,  status:groupStatus,  desc:t.postGroupsDesc, sub:t.postGroupsSub(postCount+(coachApproved?1:0)) },
                { phase:"leads",       icon:"🔥", bg:"#065F46",   label:t.workLeads,   status:leadsStatus,  desc:t.workLeadsDesc,  sub:t.workLeadsSub },
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
              <div style={{ fontSize:13, color:GRAY600, marginBottom:8 }}>🧪 <strong>{t.devShortcuts}</strong></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {[
                  { label:t.fillSample,  fn:() => { devFill(); setAppPhase("ch1"); } },
                  { label:t.skipStop,    fn:() => { devFill(); setAppPhase("waitforcoach"); } },
                  { label:t.skipGroups,  fn:() => { devFill(); setAppPhase("groups"); } },
                  { label:t.skipLeads,   fn:() => { devFill(); setAppPhase("leads"); } },
                ].map((b,i) => <button key={i} onClick={b.fn} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{b.label}</button>)}
              </div>
            </div>
          </div>
        )}

        {/* WRITE CHOICE */}
        {appPhase==="writechoice" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("lane")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title={t.writePostTitle} subtitle={t.writePostSubtitle} />
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <button onClick={() => setAppPhase("ch1")} style={{ background:WHITE, border:"2px solid "+NAVY, borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:32, flexShrink:0 }}>⌨️</div>
                  <div><div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>{t.typeAnswers}</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>{t.typeAnswersDesc}</div></div>
                </button>
              </div>
            </Card>
          </>
        )}

        {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3") && (
          <ProgressiveForm answers={answers} onAnswer={setAnswer} onExit={() => setAppPhase("writechoice")} onComplete={() => setAppPhase("waitforcoach")} validationFeedback={validationFeedback} lang={lang} initialPhase={appPhase} onPhaseChange={setAppPhase} />
        )}

        {appPhase==="waitforcoach" && (
          <WaitForCoach answers={answers} onContinue={() => handleValidateAndAdvance(ALL_QUESTIONS, "groups")} onBack={() => setAppPhase("ch1")} lang={lang} />
        )}

        {/* GROUPS */}
        {appPhase==="groups" && (
          <Card>
            <SectionHeader emoji="🧭" title={t.joinGroupTitle} subtitle={t.joinGroupSubtitle} />
            {!answers.area && (
              <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:NAVY }}>{t.searchCity}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder={t.cityPlaceholder} style={{ flex:1, border:"2px solid "+GRAY200, borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", fontFamily:"inherit" }} />
                  <button onClick={() => { setGroups5([]); setGroupsLoading(true); findFacebookGroups(manualCity.trim()||"Your City",5).then(r => { setGroups5(r); setGroupsLoading(false); }).catch(() => setGroupsLoading(false)); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>{t.search}</button>
                </div>
              </div>
            )}
            {groupsLoading && <div style={{ textAlign:"center", padding:32 }}><p style={{ color:GRAY600 }}>🔍 Finding groups near {city}...</p></div>}
            {groupsError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, color:RED, fontSize:13 }}>{groupsError}</div>}
            {!groupsLoading && groups5.length > 0 && (
              <>
                <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:NAVY }}>💡 Click <strong>Open in Facebook</strong> next to a group. Join it, then come back and confirm.</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{groups5.map((g,i) => <GroupActionRow key={i} group={g} onConfirmed={() => setAppPhase("getpost")} t={t} />)}</div>
              </>
            )}
          </Card>
        )}

        {/* GET POST */}
        {appPhase==="getpost" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("groups")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="✍️" title={t.stepGetPost} />
              {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:GRAY600, fontSize:14 }}>{t.writingPost}</p></div>}
              {postError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{postError}</div>}
              {!postLoading && ch3Met && !post && <><p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, marginBottom:20 }}>{lang==="es"?"Tus respuestas están listas. Toca abajo y escribiremos tu publicación.":"Your story answers are ready. Tap below and we'll write your post."}</p><Btn onClick={handleGeneratePost}>{t.generatePost}</Btn></>}
              {!postLoading && ch3Met && post && (
                <>
                  {/* Side by side posts */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <div>
                      <div style={{ fontWeight:700, color:NAVY, fontSize:13, marginBottom:8 }}>{t.englishPost}</div>
                      <textarea value={post} onChange={e => setPost(e.target.value)} rows={16}
                        style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+NAVY, borderRadius:12, padding:14, fontSize:13, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:GRAY50 }} />
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:NAVY, fontSize:13, marginBottom:8 }}>{t.spanishPost}</div>
                      <div style={{ background:"#F8F0FF", border:"2px solid #D8B4FE", borderRadius:12, padding:14, fontSize:13, lineHeight:1.8, color:GRAY800, whiteSpace:"pre-wrap", minHeight:200, userSelect:"none", WebkitUserSelect:"none" }}>
                        {postEs || "—"}
                      </div>
                      <p style={{ fontSize:11, color:GRAY400, marginTop:6, fontStyle:"italic" }}>{t.spanishNote}</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
                    <Btn onClick={() => { try { const el=document.createElement("textarea"); el.value=post; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); setCopiedGetpost(true); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(post).then(()=>setCopiedGetpost(true)); } }} variant={copiedGetpost?"success":"primary"}>{copiedGetpost?t.copied:t.copyPost}</Btn>
                    <Btn variant="secondary" onClick={handleGeneratePost} disabled={postLoading}>{t.regenerate}</Btn>
                  </div>
                  {copiedGetpost && (
                    <div style={{ background:"#EFF6FF", border:"1.5px solid #93C5FD", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                      <div><div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:2 }}>{t.postCopied}</div><div style={{ fontSize:13, color:GRAY600 }}>{t.nextPickPhoto}</div></div>
                      <Btn onClick={() => setAppPhase("photo")}>{t.choosePhoto}</Btn>
                    </div>
                  )}
                </>
              )}
              {!postLoading && !ch3Met && (
                <>
                  <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:16, marginBottom:20 }}>
                    <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 6px" }}>{t.notBuilt}</p>
                    <p style={{ color:GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>{t.notBuiltDesc}</p>
                    <Btn onClick={() => setAppPhase("writechoice")}>{t.writeMyPost}</Btn>
                  </div>
                  <textarea value={post} onChange={e => setPost(e.target.value)} rows={10} placeholder={t.pastePost} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?NAVY:GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":GRAY50, outline:"none", marginBottom:14 }} />
                  {post && post.trim().length>=50 && <Btn onClick={() => setAppPhase("photo")}>{t.usePost}</Btn>}
                </>
              )}
            </Card>
          </>
        )}

        {appPhase==="photo" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("getpost")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="📸" title={t.choosePhotoTitle} subtitle={t.choosePhotoSubtitle} />
              <PhotoGuideReal lang={lang} />
            </Card>
            <Btn onClick={() => setAppPhase("dopost")}>{t.photoReady}</Btn>
          </>
        )}

        {appPhase==="dopost" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("photo")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="🚀" title={t.postItTitle} subtitle={t.postItSubtitle} />
              {t.postSteps.map((step, i) => (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:18, alignItems:"flex-start" }}>
                  <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, flexShrink:0 }}>{i+1}</div>
                  <p style={{ margin:0, fontSize:15, color:GRAY800, paddingTop:7, lineHeight:1.6 }}>{step}</p>
                </div>
              ))}
            </Card>
            <Btn onClick={() => setAppPhase("approval")}>{t.postIsLive}</Btn>
          </>
        )}

        {appPhase==="approval" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("dopost")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="📋" title={t.submitTitle} subtitle={t.submitSubtitle} />
              <EvidenceCapture t={t} onSubmit={(evidence) => { setFlag("coachApproved", true); saveSubmission(answers, post, "Needs Review", evidence); setAppPhase("replicate"); }} />
            </Card>
          </>
        )}

        {appPhase==="replicate" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("approval")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Card>
              <SectionHeader emoji="🔁" title={t.crossPostTitle} subtitle={t.crossPostSubtitle} />
              <div style={{ background:GRAY50, borderRadius:12, padding:16, marginBottom:20 }}>
                {t.crossPostRules.map((s,i) => (
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
              <h3 style={{ color:NAVY, margin:"0 0 8px", fontSize:18 }}>{t.howMany}</h3>
              <p style={{ color:GRAY600, fontSize:13, marginTop:0, marginBottom:16 }}>{t.howManySub}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => setFlag("postCount", n)} style={{ width:48, height:48, borderRadius:10, border:"2px solid "+(postCount===n?NAVY:GRAY200), background:postCount===n?NAVY:WHITE, color:postCount===n?YELLOW:GRAY600, fontWeight:800, fontSize:16, cursor:"pointer" }}>{n}</button>
                ))}
              </div>
              {postCount>0&&postCount<9 && <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:GRAY800 }} dangerouslySetInnerHTML={{ __html: t.moreTogo(postCount+1, 9-postCount) }} />}
              {postCount===9&&!tenDone && <Btn onClick={() => { setFlag("tenDone",true); setFlag("completedSections",[...completedSections,"grouppost"]); saveSubmission(answers,post,"10 Groups Done"); }}>{t.tenDone}</Btn>}
            </Card>
            {tenDone && (
              <Card style={{ background:NAVY, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🎯</div>
                <h2 style={{ color:YELLOW, fontSize:24, margin:"0 0 8px" }}>{t.goalTitle}</h2>
                <p style={{ color:WHITE, fontSize:15, lineHeight:1.8, margin:"0 0 20px" }}>{t.goalDesc}</p>
                <Btn onClick={() => setAppPhase("leads")}>{t.openLeads}</Btn>
              </Card>
            )}
          </>
        )}

        {appPhase==="leads" && <LeadEngagement onBack={() => setAppPhase("replicate")} onAmplify={() => setAppPhase("amplify")} />}

        {appPhase==="amplify" && (
          <>
            <div style={{ marginBottom:20 }}><Btn variant="ghost" onClick={() => setAppPhase("leads")} style={{ fontSize:13, padding:"8px 14px" }}>{t.back}</Btn></div>
            <Amplify city={city||manualCity||"Your City"} week1Total={postCount+1} />
          </>
        )}
      </div>
    </div>
  );
}