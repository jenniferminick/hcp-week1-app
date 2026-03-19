import { useState, useRef, useEffect, useCallback } from "react";

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
const STORAGE_KEY = "hbc_week1_progress";

// ── US States + Canadian Provinces ───────────────────────────────────────────
const STATE_OPTIONS = [
  { value:"", label:"State / Province" },
  // US States
  { value:"AL", label:"Alabama" },{ value:"AK", label:"Alaska" },{ value:"AZ", label:"Arizona" },
  { value:"AR", label:"Arkansas" },{ value:"CA", label:"California" },{ value:"CO", label:"Colorado" },
  { value:"CT", label:"Connecticut" },{ value:"DE", label:"Delaware" },{ value:"FL", label:"Florida" },
  { value:"GA", label:"Georgia" },{ value:"HI", label:"Hawaii" },{ value:"ID", label:"Idaho" },
  { value:"IL", label:"Illinois" },{ value:"IN", label:"Indiana" },{ value:"IA", label:"Iowa" },
  { value:"KS", label:"Kansas" },{ value:"KY", label:"Kentucky" },{ value:"LA", label:"Louisiana" },
  { value:"ME", label:"Maine" },{ value:"MD", label:"Maryland" },{ value:"MA", label:"Massachusetts" },
  { value:"MI", label:"Michigan" },{ value:"MN", label:"Minnesota" },{ value:"MS", label:"Mississippi" },
  { value:"MO", label:"Missouri" },{ value:"MT", label:"Montana" },{ value:"NE", label:"Nebraska" },
  { value:"NV", label:"Nevada" },{ value:"NH", label:"New Hampshire" },{ value:"NJ", label:"New Jersey" },
  { value:"NM", label:"New Mexico" },{ value:"NY", label:"New York" },{ value:"NC", label:"North Carolina" },
  { value:"ND", label:"North Dakota" },{ value:"OH", label:"Ohio" },{ value:"OK", label:"Oklahoma" },
  { value:"OR", label:"Oregon" },{ value:"PA", label:"Pennsylvania" },{ value:"RI", label:"Rhode Island" },
  { value:"SC", label:"South Carolina" },{ value:"SD", label:"South Dakota" },{ value:"TN", label:"Tennessee" },
  { value:"TX", label:"Texas" },{ value:"UT", label:"Utah" },{ value:"VT", label:"Vermont" },
  { value:"VA", label:"Virginia" },{ value:"WA", label:"Washington" },{ value:"WV", label:"West Virginia" },
  { value:"WI", label:"Wisconsin" },{ value:"WY", label:"Wyoming" },{ value:"DC", label:"Washington D.C." },
  // Canadian Provinces
  { value:"AB", label:"Alberta" },{ value:"BC", label:"British Columbia" },{ value:"MB", label:"Manitoba" },
  { value:"NB", label:"New Brunswick" },{ value:"NL", label:"Newfoundland & Labrador" },
  { value:"NS", label:"Nova Scotia" },{ value:"NT", label:"Northwest Territories" },
  { value:"NU", label:"Nunavut" },{ value:"ON", label:"Ontario" },{ value:"PE", label:"Prince Edward Island" },
  { value:"QC", label:"Quebec" },{ value:"SK", label:"Saskatchewan" },{ value:"YT", label:"Yukon" },
];

// ── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "Business Coaching Foundations",
    appSubtitle: "Week 1 — Facebook Organic Strategy",
    saveExit: "Save & Exit",
    saved: "Saved!",
    home: "⌂ Home",
    coachDashboard: "Coach Dashboard",
    coachAccess: "Coach Access",
    enterPasscode: "Enter passcode",
    incorrectPasscode: "Incorrect passcode.",
    enterDashboard: "Enter Dashboard",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    continueWhere: "Continue where you left off",
    startWriting: "Start Writing Your Post",
    generatePost: "Generate Your Post",
    crossPost: "Cross-Post to More Groups",
    week1Checklist: "Your Week 1 Checklist",
    notStarted: "Not Started",
    inProgress: "In Progress",
    done: "Done",
    writePost: "Write Post",
    writePostDesc: "Answer 10 questions. AI writes your trust-building post.",
    writePostTime: "~8 min",
    postInGroups: "Post in Groups",
    postInGroupsDesc: "Find local Facebook groups and replicate your post to 10.",
    postInGroupsTime: "~15 min",
    workLeads: "Work Leads",
    workLeadsDesc: "Turn every like, comment, share, and DM into a booked job.",
    workLeadsTime: "~5 min",
    amplify: "Amplify",
    amplifyDesc: "Post in more groups to keep generating fresh leads.",
    amplifyTime: "Ongoing",
    totalStats: ["⏱ ~29 min total","🎯 10 group posts","💬 Real leads, real jobs"],
    heroHeadline: "Turn Your Story Into",
    heroHighlight: "Jobs on Your Calendar",
    heroDesc: "Build a trust-building Facebook post, get it in front of your community, and convert engagement into booked jobs.",
    writePostTitle: "Write Your Post",
    writePostSubtitle: "How would you like to answer the questions?",
    typeAnswers: "Type My Answers",
    typeAnswersDesc: "Fill in each question at your own pace. Mic icon available to dictate.",
    talkThrough: "Talk Through It",
    talkThroughDesc: "Speak your answers. An AI coach guides you through every question.",
    yourStoryProgress: "Your Story Progress",
    needInspiration: "💡 Need inspiration?",
    hideInspiration: "💡 Hide inspiration",
    exampleAnswers: "Example answers — use as a guide only",
    loadingExamples: "Loading examples...",
    guidesOnly: "These are guides only — write your own real version.",
    listening: "Listening...",
    micBlocked: "Mic blocked.",
    micError: "Mic error.",
    addDetail: "Add one more detail — a name, place, number, or year.",
    pickFear: "Pick the fear you focus on",
    quickPick: "Quick pick",
    step1Join: "Step 1 — Join a Group",
    step1Subtitle: "Find an active local Facebook group and join it. You only need one to start.",
    cityLabel: "What city do you serve?",
    cityPlaceholder: "e.g. East Nashville",
    neighborhoodsLabel: "Nearby neighborhoods (optional)",
    neighborhoodsPlaceholder: "e.g. Donelson, Hermitage",
    yearsLabel: "Years serving this area",
    yearsPlaceholder: "e.g. 11",
    searchGroups: "Search",
    groupsNote: "💡 These are search suggestions — each button opens a Facebook search for that group type in your area. Browse the results and join a public group.",
    searchOnFb: "Search on Facebook",
    findingGroups: "Finding groups near",
    searchFailed: "Search failed.",
    step2GeneratePost: "Step 2 — Generate Post",
    needPostToContinue: "You will need a post to continue.",
    needPostDesc: "Go back to Write Post to build your story, or paste an existing post below.",
    writeMyPost: "Write My Post",
    pastePostLabel: "Or paste your existing post here:",
    pastePlaceholder: "Paste your Facebook post here...",
    writingPost: "Writing your post... about 15 seconds.",
    couldNotGenerate: "Could not generate post. Please try again.",
    tryAgain: "Try again",
    copyPost: "Copy Post",
    copied: "Copied!",
    regenerate: "Regenerate",
    step3Photo: "Step 3 — Choose Your Photo",
    step3Subtitle: "Your photo is the first thing people see. The right one doubles your engagement.",
    photoIdeasTitle: "📷 Photo ideas based on your story",
    generatingIdeas: "Generating personalized ideas...",
    goodPhotos: "✅ Anti-Ad photos — these build trust",
    badPhotos: "❌ Ad photos — these kill trust",
    step4Post: "Step 4 — Post It",
    step4Subtitle: "Follow these steps exactly. Use your personal account, not your business page.",
    personalWarning: "Post from your PERSONAL account, not your business page.",
    personalWarningDesc: "Facebook shows personal posts to way more people. Log in as yourself before you post.",
    postSteps: ["Open the Facebook group you joined and tap Write something","Paste your copied post","Attach your photo","Tap Post"],
    step5Approval: "Step 5 — Coach Approval",
    postIsLive: "Your post is live!",
    readyForAudit: "Let your coach know you are ready for your audit. Here is exactly what they will be checking.",
    coachAudit: "🔍 The Coach Audit — 5 Things We Check",
    tapToSeeWhy: "Tap any row to see why it matters.",
    step6CrossPost: "Step 6 — Join and Cross-Post",
    step6Subtitle: "Find 9 more public groups, join them, and post in each one. Same post. Same photo. No edits.",
    crossPostSteps: ["Search for local groups using the links below and join 9 more public groups.","Use the exact same post — do not change a single word.","Attach the exact same photo. Do not add your phone number, website, or any contact info.","Post immediately in each public group once you have joined."],
    loadingGroupSuggestions: "Loading group suggestions...",
    achievementUnlocked: "🏆 Achievement Unlocked!",
    missionComplete: "🎯 Mission Complete!",
    week1Done: "🔥 Week 1 = Done!",
    celebMsgs: [
      { h:"🏆 Achievement Unlocked!", s:"10 groups. 1 post. Zero sales pitches. Let's go!" },
      { h:"🎯 Mission Complete!",     s:"You showed up as a neighbor. That's the whole game." },
      { h:"🔥 Week 1 = Done!",        s:"Anti-Ad strategy executed. Leads incoming." },
    ],
    hereIsWhatYouDid: "Here is what you executed this week:",
    celebItems: [
      { emoji:"👥", title:"Joined 10 local Facebook groups",    desc:"You are now inside the conversations happening in your city." },
      { emoji:"✍️", title:"Created a trust-first intro post",   desc:"No sales pitch. No contact info. Just your story." },
      { emoji:"📣", title:"Posted across 10 groups",            desc:"Your face and your story are now in front of thousands of local homeowners." },
      { emoji:"👤", title:"Posted as a neighbor, not a business",desc:"Personal account. Real story. That is exactly why this works." },
    ],
    celebQuote: "You joined the groups. You wrote the post. You executed the Anti-Ad strategy.",
    celebQuote2: "You showed up as a neighbor, not a salesperson. Your leads are already coming in.",
    workYourLeads: "Work Your Leads",
    workLeadsSubtitle: "Pick the type of engagement. Follow the steps. Book the job.",
    thisSession: "this session",
    jobsBooked: "jobs booked",
    logBookedJob: "+ Log a booked job:",
    numJobs: "# of jobs",
    addJobs: "Add Jobs",
    timeKillsDeals: "Time kills deals. First 24–48 hours are everything.",
    whatEngagement: "What kind of engagement did you get?",
    tapForSteps: "Tap one to get exact steps and scripts.",
    whatDidTheySay: "What did they say?",
    markAsWorked: "Mark as Worked",
    differentResponse: "Different Response",
    logDMs: (n) => `Log ${n} DM${n!==1?"s":""}`,
    howManyDMs: "How many people did you DM?",
    everyPathLeads: "Every path leads to a DM. Every DM is a chance to book a job.",
    keepGoing: "Keep going. The first 48 hours are everything.",
    keepMomentum: "Keep the momentum going",
    keepMomentumDesc: "Done working this batch? Head to Amplify to post in more groups.",
    goToAmplify: "Go to Amplify",
    amplifyTitle: "Amplify",
    amplifySubtitle: "Keep the momentum going.",
    totalGroupsPosted: "total groups posted",
    postedInGroup: "+ Posted in Another Group",
    moreGroupsNearYou: "More groups near you",
    findingGroupsNear: "Finding groups near",
    sessionCompleteTitle: "Session Complete — Now We Execute",
    sessionCompleteSubtitle: "Watch this training video before working your leads.",
    trainingVideo: "Lead Engagement Training Video",
    coachDashboardTitle: "Coach Dashboard",
    submissions: "submissions",
    refresh: "Refresh",
    loading: "Loading...",
    noSubmissions: "No submissions yet.",
    viewDetails: "View Details ▼",
    hideDetails: "Hide Details ▲",
    generatedPost: "Generated Post:",
    postGenerated: "Post Generated",
    coachApproved: "Coach Approved",
    do: "DO",
    not: "NOT",
    answersOf: (a,t) => `${a} of ${t} answered`,
    devShortcuts: "🧪 Dev shortcuts",
    fillSample: "Fill Sample Answers",
    skipGenerate: "Skip to Generate Post",
    skipStep5: "Skip to Step 5",
    skipLeads: "Skip to Leads",
    reRecord: "Re-record",
    yourAnswersSoFar: "📝 Your Answers So Far",
    processing: "Processing...",
    coachSpeaking: "Coach speaking...",
    tapToStart: "Tap to start",
    startVoiceSession: "Start Voice Session",
    voiceCoachGreeting: "Hey! I am going to walk you through a series of questions to build your story. Tap Start and I will guide you through everything.",
    statePlaceholder: "State / Province",
    cityRequired: "Please enter your city.",
    stateRequired: "Please select your state or province.",
    saveExitToast: "Progress saved! You can close this tab and return anytime.",
  },
  es: {
    appTitle: "Fundamentos de Coaching de Negocios",
    appSubtitle: "Semana 1 — Estrategia Orgánica de Facebook",
    saveExit: "Guardar y Salir",
    saved: "¡Guardado!",
    home: "⌂ Inicio",
    coachDashboard: "Panel del Coach",
    coachAccess: "Acceso del Coach",
    enterPasscode: "Ingresa el código",
    incorrectPasscode: "Código incorrecto.",
    enterDashboard: "Entrar al Panel",
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    continueWhere: "Continúa donde lo dejaste",
    startWriting: "Empieza a Escribir Tu Publicación",
    generatePost: "Genera Tu Publicación",
    crossPost: "Publicar en Más Grupos",
    week1Checklist: "Tu Lista de la Semana 1",
    notStarted: "No Iniciado",
    inProgress: "En Progreso",
    done: "Completado",
    writePost: "Escribir Publicación",
    writePostDesc: "Responde 10 preguntas. La IA escribe tu publicación de confianza.",
    writePostTime: "~8 min",
    postInGroups: "Publicar en Grupos",
    postInGroupsDesc: "Encuentra grupos locales de Facebook y replica tu publicación en 10.",
    postInGroupsTime: "~15 min",
    workLeads: "Trabajar Prospectos",
    workLeadsDesc: "Convierte cada me gusta, comentario, compartir y DM en un trabajo reservado.",
    workLeadsTime: "~5 min",
    amplify: "Amplificar",
    amplifyDesc: "Publica en más grupos para seguir generando nuevos prospectos.",
    amplifyTime: "Continuo",
    totalStats: ["⏱ ~29 min en total","🎯 10 publicaciones en grupos","💬 Prospectos reales, trabajos reales"],
    heroHeadline: "Convierte Tu Historia en",
    heroHighlight: "Trabajos en Tu Agenda",
    heroDesc: "Crea una publicación de Facebook que genere confianza, ponla frente a tu comunidad y convierte el engagement en trabajos reservados.",
    writePostTitle: "Escribe Tu Publicación",
    writePostSubtitle: "¿Cómo te gustaría responder las preguntas?",
    typeAnswers: "Escribir Mis Respuestas",
    typeAnswersDesc: "Completa cada pregunta a tu propio ritmo. Icono de micrófono disponible para dictado.",
    talkThrough: "Hablarlo",
    talkThroughDesc: "Di tus respuestas. Un coach de IA te guía en cada pregunta.",
    yourStoryProgress: "Progreso de Tu Historia",
    needInspiration: "💡 ¿Necesitas inspiración?",
    hideInspiration: "💡 Ocultar inspiración",
    exampleAnswers: "Ejemplos — úsalos solo como guía",
    loadingExamples: "Cargando ejemplos...",
    guidesOnly: "Son solo guías — escribe tu propia versión real.",
    listening: "Escuchando...",
    micBlocked: "Micrófono bloqueado.",
    micError: "Error de micrófono.",
    addDetail: "Agrega un detalle más — un nombre, lugar, número o año.",
    pickFear: "Elige el miedo en el que te enfocas",
    quickPick: "Selección rápida",
    step1Join: "Paso 1 — Unirse a un Grupo",
    step1Subtitle: "Encuentra un grupo local activo de Facebook y únete. Solo necesitas uno para empezar.",
    cityLabel: "¿Qué ciudad atiendes?",
    cityPlaceholder: "ej. Nashville Este",
    neighborhoodsLabel: "Vecindarios cercanos (opcional)",
    neighborhoodsPlaceholder: "ej. Donelson, Hermitage",
    yearsLabel: "Años sirviendo esta área",
    yearsPlaceholder: "ej. 11",
    searchGroups: "Buscar",
    groupsNote: "💡 Estas son sugerencias de búsqueda — cada botón abre una búsqueda de Facebook de ese tipo de grupo en tu área. Explora los resultados y únete a un grupo público.",
    searchOnFb: "Buscar en Facebook",
    findingGroups: "Buscando grupos cerca de",
    searchFailed: "Búsqueda fallida.",
    step2GeneratePost: "Paso 2 — Generar Publicación",
    needPostToContinue: "Necesitarás una publicación para continuar.",
    needPostDesc: "Regresa a Escribir Publicación para construir tu historia, o pega una publicación existente abajo.",
    writeMyPost: "Escribir Mi Publicación",
    pastePostLabel: "O pega tu publicación existente aquí:",
    pastePlaceholder: "Pega tu publicación de Facebook aquí...",
    writingPost: "Escribiendo tu publicación... unos 15 segundos.",
    couldNotGenerate: "No se pudo generar la publicación. Por favor inténtalo de nuevo.",
    tryAgain: "Intentar de nuevo",
    copyPost: "Copiar Publicación",
    copied: "¡Copiado!",
    regenerate: "Regenerar",
    step3Photo: "Paso 3 — Elige Tu Foto",
    step3Subtitle: "Tu foto es lo primero que la gente ve. La correcta duplica tu engagement.",
    photoIdeasTitle: "📷 Ideas de fotos basadas en tu historia",
    generatingIdeas: "Generando ideas personalizadas...",
    goodPhotos: "✅ Fotos Anti-Anuncio — estas generan confianza",
    badPhotos: "❌ Fotos de Anuncio — estas destruyen la confianza",
    step4Post: "Paso 4 — Publicarlo",
    step4Subtitle: "Sigue estos pasos exactamente. Usa tu cuenta personal, no tu página de negocios.",
    personalWarning: "Publica desde tu cuenta PERSONAL, no tu página de negocios.",
    personalWarningDesc: "Facebook muestra las publicaciones personales a muchas más personas. Inicia sesión como tú mismo antes de publicar.",
    postSteps: ["Abre el grupo de Facebook al que te uniste y toca Escribe algo","Pega tu publicación copiada","Adjunta tu foto","Toca Publicar"],
    step5Approval: "Paso 5 — Aprobación del Coach",
    postIsLive: "¡Tu publicación está en vivo!",
    readyForAudit: "Avísale a tu coach que estás listo para tu auditoría. Aquí exactamente lo que revisarán.",
    coachAudit: "🔍 La Auditoría del Coach — 5 Cosas que Verificamos",
    tapToSeeWhy: "Toca cualquier fila para ver por qué importa.",
    step6CrossPost: "Paso 6 — Unirse y Publicar en Más Grupos",
    step6Subtitle: "Encuentra 9 grupos públicos más, únete a ellos y publica en cada uno. Misma publicación. Misma foto. Sin editar.",
    crossPostSteps: ["Busca grupos locales usando los enlaces de abajo y únete a 9 grupos públicos más.","Usa exactamente la misma publicación — no cambies ni una palabra.","Adjunta exactamente la misma foto. No añadas tu teléfono, sitio web ni información de contacto.","Publica inmediatamente en cada grupo público una vez que te hayas unido."],
    loadingGroupSuggestions: "Cargando sugerencias de grupos...",
    celebMsgs: [
      { h:"🏆 ¡Logro Desbloqueado!", s:"10 grupos. 1 publicación. Cero argumentos de venta. ¡Vamos!" },
      { h:"🎯 ¡Misión Cumplida!",   s:"Te mostraste como vecino. Ese es todo el juego." },
      { h:"🔥 ¡Semana 1 = Lista!",  s:"Estrategia Anti-Anuncio ejecutada. Prospectos llegando." },
    ],
    hereIsWhatYouDid: "Esto es lo que ejecutaste esta semana:",
    celebItems: [
      { emoji:"👥", title:"Te uniste a 10 grupos locales de Facebook",    desc:"Ahora estás dentro de las conversaciones que ocurren en tu ciudad." },
      { emoji:"✍️", title:"Creaste una publicación de confianza",   desc:"Sin argumento de venta. Sin información de contacto. Solo tu historia." },
      { emoji:"📣", title:"Publicaste en 10 grupos",            desc:"Tu cara y tu historia están ahora frente a miles de propietarios locales." },
      { emoji:"👤", title:"Publicaste como vecino, no como empresa",desc:"Cuenta personal. Historia real. Exactamente por eso funciona." },
    ],
    celebQuote: "Te uniste a los grupos. Escribiste la publicación. Ejecutaste la estrategia Anti-Anuncio.",
    celebQuote2: "Te mostraste como vecino, no como vendedor. Tus prospectos ya están llegando.",
    workYourLeads: "Trabaja Tus Prospectos",
    workLeadsSubtitle: "Elige el tipo de engagement. Sigue los pasos. Reserva el trabajo.",
    thisSession: "esta sesión",
    jobsBooked: "trabajos reservados",
    logBookedJob: "+ Registrar trabajo reservado:",
    numJobs: "# de trabajos",
    addJobs: "Agregar Trabajos",
    timeKillsDeals: "El tiempo mata los tratos. Las primeras 24–48 horas son todo.",
    whatEngagement: "¿Qué tipo de engagement obtuviste?",
    tapForSteps: "Toca uno para obtener pasos y guiones exactos.",
    whatDidTheySay: "¿Qué dijeron?",
    markAsWorked: "Marcar como Trabajado",
    differentResponse: "Respuesta Diferente",
    logDMs: (n) => `Registrar ${n} DM${n!==1?"s":""}`,
    howManyDMs: "¿Cuántas personas enviaste DM?",
    everyPathLeads: "Cada camino lleva a un DM. Cada DM es una oportunidad de reservar un trabajo.",
    keepGoing: "Sigue adelante. Las primeras 48 horas son todo.",
    keepMomentum: "Mantén el impulso",
    keepMomentumDesc: "¿Terminaste con este lote? Ve a Amplificar para publicar en más grupos.",
    goToAmplify: "Ir a Amplificar",
    amplifyTitle: "Amplificar",
    amplifySubtitle: "Mantén el impulso.",
    totalGroupsPosted: "grupos publicados en total",
    postedInGroup: "+ Publiqué en Otro Grupo",
    moreGroupsNearYou: "Más grupos cerca de ti",
    findingGroupsNear: "Buscando grupos cerca de",
    sessionCompleteTitle: "Sesión Completa — Ahora Ejecutamos",
    sessionCompleteSubtitle: "Mira este video de entrenamiento antes de trabajar tus prospectos.",
    trainingVideo: "Video de Entrenamiento de Engagement de Prospectos",
    coachDashboardTitle: "Panel del Coach",
    submissions: "envíos",
    refresh: "Actualizar",
    loading: "Cargando...",
    noSubmissions: "Sin envíos aún.",
    viewDetails: "Ver Detalles ▼",
    hideDetails: "Ocultar Detalles ▲",
    generatedPost: "Publicación Generada:",
    postGenerated: "Publicación Generada",
    coachApproved: "Coach Aprobado",
    do: "SÍ",
    not: "NO",
    answersOf: (a,t) => `${a} de ${t} respondidas`,
    devShortcuts: "🧪 Atajos de desarrollo",
    fillSample: "Llenar Respuestas de Muestra",
    skipGenerate: "Saltar a Generar Publicación",
    skipStep5: "Saltar al Paso 5",
    skipLeads: "Saltar a Prospectos",
    reRecord: "Re-grabar",
    yourAnswersSoFar: "📝 Tus Respuestas Hasta Ahora",
    processing: "Procesando...",
    coachSpeaking: "Coach hablando...",
    tapToStart: "Toca para empezar",
    startVoiceSession: "Iniciar Sesión de Voz",
    voiceCoachGreeting: "¡Hola! Voy a guiarte a través de una serie de preguntas para construir tu historia. Toca Iniciar y te guiaré en todo.",
    statePlaceholder: "Estado / Provincia",
    cityRequired: "Por favor ingresa tu ciudad.",
    stateRequired: "Por favor selecciona tu estado o provincia.",
    saveExitToast: "¡Progreso guardado! Puedes cerrar esta pestaña y volver en cualquier momento.",
  }
};

// ── Translated Questions ──────────────────────────────────────────────────────
const QUESTIONS_EN = [
  { id:"name",        num:1,  chapter:"ch1", minWords:2,  validate:"name",       label:"Your Name",              question:"What is your first and last name?",                                                                                                 hint:"Write it exactly how you want it shown publicly.",                                                                                                                         examples:["Daniel Reyes","Taryn Sinnen"],                                                                                                   voiceQ:"What is your first and last name?",                                    placeholder:"e.g. Daniel Reyes" },
  { id:"business",    num:2,  chapter:"ch1", minWords:1,  validate:"business",   label:"Business Name",          question:"What is your business name as it appears online?",                                                                               hint:"Use the exact spelling and spacing people would see on Google or Facebook.",                                                                                                examples:["Reyes Heating and Air","Zach's Mobile Repair"],                                                                                  voiceQ:"What is your business name exactly as it appears on Google or Facebook?", placeholder:"e.g. Reyes Heating and Air" },
  { id:"area",        num:3,  chapter:"ch1", minWords:2,  validate:"area",       label:"Service Area",           question:"What city and state/province do you serve, plus any surrounding neighborhoods — and how long have you been there?",              hint:"Your city and state are filled in from the dropdowns above. Add nearby neighborhoods and years served here.",                                                              examples:["Donelson, Hermitage. 11 years.","Gilbert, Chandler. 8 years."],                                                                  voiceQ:"What city and state do you serve, plus surrounding areas, and how long have you been there?", placeholder:"e.g. Donelson, Hermitage. 11 years." },
  { id:"fear",        num:4,  chapter:"ch1", minWords:12, validate:"fear",       label:"Customer Fear You Fix",  question:"Which homeowner fear do you focus on overcoming, and what is the one thing you do every job so customers never feel that fear?",  hint:"Pick ONE fear, then give ONE habit you do every job.",                                                                                                                      examples:["Lack of communication. I send a quick update if anything changes so nobody is left wondering.","Getting overcharged. I show options and prices before I start."],        voiceQ:"Which homeowner fear do you focus on overcoming, and what is one specific thing you do every job?", placeholder:"e.g. Lack of communication. I send a quick update any time something changes.", fearChips:["Getting overcharged","Being left with a mess","Lack of communication"] },
  { id:"humanDetail", num:5,  chapter:"ch2", minWords:6,  label:"Real Life Detail",              question:"What is one specific real life detail about you that neighbors would relate to?",                                                                hint:"Pick ONE and be specific. Family moment, hobby, weekend routine.",                                                                                                          examples:["Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen.","I am restoring a 1991 candy-green Chevy with my son."],                voiceQ:"Tell me one specific real life detail about you that neighbors would relate to.", placeholder:"e.g. Most Saturdays I am on the sidelines at 10U softball with a cooler and way too much sunscreen." },
  { id:"localFlavor", num:6,  chapter:"ch2", minWords:8,  validate:"localFlavor",label:"Local Place You Love",   question:"What is one specific local place you love, and what do you do there or always get there?",                                      hint:"Use the real name. Park, bakery, restaurant, market — anything local.",                                                                                                    examples:["Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets.","Shelby Bottoms Greenway, we ride bikes to the overlook, then get ice cream."],           voiceQ:"What is one specific local place you genuinely love? Give me the real name and what you always do there.", placeholder:"e.g. Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets." },
  { id:"mission",     num:7,  chapter:"ch2", minWords:1,  label:"Mission Fill-in",               question:"Fill in the blank: I am on a mission to find the best ______. Any suggestions?",                                                               hint:"Choose something people have strong opinions on. Keep it short.",                                                                                                           examples:["tacos","pizza","breakfast spot","coffee","donuts","BBQ"],                                                                                                               voiceQ:"Fill in this blank: I am on a mission to find the best blank in my city. What is it?", placeholder:"e.g. tacos", missionChips:["donuts","pizza","breakfast spot","coffee","tacos","BBQ"] },
  { id:"whyStarted",  num:8,  chapter:"ch3", minWords:12, label:"Why You Started",               question:"What is the real moment that pushed you to start your own business?",                                                                           hint:"Tell it like you would tell a friend. Include what you felt in that moment.",                                                                                               examples:["I got tired of watching my old boss charge elderly customers three times what a job was worth.","I missed one too many dinners and my kid asked if I was working again."], voiceQ:"Tell me the real moment that pushed you to start your own business.", placeholder:"e.g. I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a job the homeowner did not need." },
  { id:"whatChanged", num:9,  chapter:"ch3", minWords:10, label:"What Changed After",             question:"After you started your business, what is one real-life thing you can do now that you could not before?",                                        hint:"Make it something a neighbor can picture in one sentence.",                                                                                                                examples:["I am home to eat dinner with my family instead of coming in after everyone is asleep.","I can coach my kid's team on weeknights, and I do not miss games anymore."],      voiceQ:"After starting your own business, what is one real thing you can do now that you could not before?", placeholder:"e.g. I am home to eat dinner with my family instead of coming in after everyone is asleep." },
  { id:"heroMoment",  num:10, chapter:"ch3", minWords:25, validate:"hero",       label:"Hero Moment",            question:"Tell one Hero Moment story where you helped a customer. What was happening, what did you do, and what did they say or do after?", hint:"Tell it like a short scene. Include one detail you remember so it feels real.",                                                                                          examples:["A single mom had no AC during a heat wave. I found it was a capacitor, showed her the price, fixed it fast, and she said thank you for not scaring me."],               voiceQ:"Tell me one Hero Moment story — a time you went above and beyond for a customer.", placeholder:"What was happening...\nWhat did you do...\nWhat did they say or do after..." },
];

const QUESTIONS_ES = [
  { id:"name",        num:1,  chapter:"ch1", minWords:2,  validate:"name",       label:"Tu Nombre",              question:"¿Cuál es tu nombre y apellido?",                                                                                                hint:"Escríbelo exactamente como quieres que aparezca públicamente.",                                                                                                            examples:["Daniel Reyes","Taryn Sinnen"],                                                                                                   voiceQ:"¿Cuál es tu nombre y apellido?",                                       placeholder:"ej. Daniel Reyes" },
  { id:"business",    num:2,  chapter:"ch1", minWords:1,  validate:"business",   label:"Nombre del Negocio",     question:"¿Cuál es el nombre de tu negocio tal como aparece en línea?",                                                                   hint:"Usa la ortografía y el espaciado exactos que las personas verían en Google o Facebook.",                                                                                   examples:["Reyes Calefacción y Aire","Reparación Móvil de Zach"],                                                                           voiceQ:"¿Cuál es el nombre exacto de tu negocio en Google o Facebook?",        placeholder:"ej. Reyes Calefacción y Aire" },
  { id:"area",        num:3,  chapter:"ch1", minWords:2,  validate:"area",       label:"Área de Servicio",       question:"¿A qué ciudad y estado/provincia sirves, más vecindarios cercanos — y cuánto tiempo llevas ahí?",                              hint:"Tu ciudad y estado están en los menús de arriba. Agrega vecindarios cercanos y años aquí.",                                                                                examples:["Donelson, Hermitage. 11 años.","Gilbert, Chandler. 8 años."],                                                                    voiceQ:"¿A qué ciudad y estado sirves, más áreas cercanas, y cuánto tiempo llevas ahí?", placeholder:"ej. Donelson, Hermitage. 11 años." },
  { id:"fear",        num:4,  chapter:"ch1", minWords:12, validate:"fear",       label:"Miedo del Cliente que Resuelves", question:"¿En qué miedo del propietario te enfocas y qué haces en cada trabajo para que los clientes nunca lo sientan?",        hint:"Elige UN miedo, luego da UN hábito que haces en cada trabajo.",                                                                                                            examples:["Falta de comunicación. Envío una actualización rápida si algo cambia para que nadie se quede preguntando.","Cobros excesivos. Muestro opciones y precios antes de empezar."], voiceQ:"¿En qué miedo del propietario te enfocas y qué haces en cada trabajo?", placeholder:"ej. Falta de comunicación. Envío una actualización cuando algo cambia.", fearChips:["Cobros excesivos","Dejar un desastre","Falta de comunicación"] },
  { id:"humanDetail", num:5,  chapter:"ch2", minWords:6,  label:"Detalle de Vida Real",           question:"¿Cuál es un detalle específico de tu vida real con el que los vecinos se identificarían?",                                                     hint:"Elige UNO y sé específico. Momento familiar, hobby, rutina de fin de semana.",                                                                                             examples:["La mayoría de los sábados estoy en la orilla del campo en el softbol con una hielera y demasiado protector solar.","Estoy restaurando un Chevy verde caramelo de 1991 con mi hijo."], voiceQ:"Dime un detalle específico de tu vida real con el que los vecinos se identificarían.", placeholder:"ej. La mayoría de los sábados estoy en la orilla del campo en el softbol con una hielera." },
  { id:"localFlavor", num:6,  chapter:"ch2", minWords:8,  validate:"localFlavor",label:"Lugar Local que Amas",    question:"¿Cuál es un lugar local específico que amas y qué haces o siempre pides ahí?",                                                  hint:"Usa el nombre real. Parque, panadería, restaurante, mercado — cualquier cosa local.",                                                                                      examples:["Tacos El Gordo, siempre los tacos de birria, sin arrepentimientos.","Parque Shelby, andamos en bici al mirador, luego helado."],    voiceQ:"¿Cuál es un lugar local que genuinamente amas? Dame el nombre real y lo que siempre haces ahí.", placeholder:"ej. Tacos El Gordo, siempre los tacos de birria, sin arrepentimientos." },
  { id:"mission",     num:7,  chapter:"ch2", minWords:1,  label:"Misión",                         question:"Completa el espacio: Estoy en una misión para encontrar los mejores ______. ¿Alguna sugerencia?",                                              hint:"Elige algo sobre lo que la gente tenga opiniones fuertes. Mantenlo corto.",                                                                                                 examples:["tacos","pizza","lugar de desayuno","café","donas","BBQ"],                                                                                                               voiceQ:"Completa este espacio: Estoy en una misión para encontrar el mejor _____ en mi ciudad. ¿Cuál es?", placeholder:"ej. tacos", missionChips:["donas","pizza","desayuno","café","tacos","BBQ"] },
  { id:"whyStarted",  num:8,  chapter:"ch3", minWords:12, label:"Por Qué Empezaste",               question:"¿Cuál fue el momento real que te impulsó a iniciar tu propio negocio?",                                                                         hint:"Cuéntalo como se lo contarías a un amigo. Incluye lo que sentiste en ese momento.",                                                                                        examples:["Me cansé de ver a mi antiguo jefe cobrar tres veces más de lo que valía el trabajo a clientes mayores.","Me perdí demasiadas cenas y mi hijo preguntó si estaba trabajando de nuevo."], voiceQ:"Cuéntame el momento real que te impulsó a iniciar tu propio negocio.", placeholder:"ej. Recuerdo estar sentado en mi camión después de una llamada sintiéndome mal, porque mi antigua empresa quería que hiciera un trabajo que el propietario no necesitaba." },
  { id:"whatChanged", num:9,  chapter:"ch3", minWords:10, label:"Qué Cambió Después",              question:"Después de iniciar tu negocio, ¿cuál es una cosa real que puedes hacer ahora que antes no podías?",                                            hint:"Hazlo algo que un vecino pueda imaginar en una oración.",                                                                                                                  examples:["Estoy en casa para cenar con mi familia en lugar de llegar cuando todos están dormidos.","Puedo entrenar al equipo de mi hijo entre semana y no me pierdo los juegos."], voiceQ:"Después de iniciar tu propio negocio, ¿cuál es una cosa real que puedes hacer ahora que antes no podías?", placeholder:"ej. Estoy en casa para cenar con mi familia en lugar de llegar cuando todos están dormidos." },
  { id:"heroMoment",  num:10, chapter:"ch3", minWords:25, validate:"hero",       label:"Momento Héroe",           question:"Cuenta una historia de Momento Héroe donde ayudaste a un cliente. ¿Qué pasaba, qué hiciste y qué dijeron o hicieron después?",   hint:"Cuéntalo como una escena corta. Incluye un detalle que recuerdas para que se sienta real.",                                                                                  examples:["Una mamá soltera no tenía AC durante una ola de calor. Era un capacitor, le mostré el precio, lo arreglé rápido y dijo gracias por no asustarme."],                     voiceQ:"Cuéntame una historia de Momento Héroe — una vez que fuiste más allá por un cliente.", placeholder:"¿Qué estaba pasando...\n¿Qué hiciste...\n¿Qué dijeron o hicieron después..." },
];

const AUDIT_ITEMS_EN = [
  { label:"Posted from a personal account",            doThis:"Your personal Facebook profile",                            notThat:"Your business page or a brand account",                              tip:"Facebook's algorithm shows personal posts to far more people than business pages. This is one of the most important rules." },
  { label:"Post has a hook, story, and closing question", doThis:"Starts with something real, tells a moment, ends with your mission question", notThat:"A list of services, a promo, or generic intro text", tip:"The hook grabs attention, the story builds trust, and the closing question drives comments — which drives reach." },
  { label:"Nothing was added to the post",             doThis:"Exact post as generated — word for word",                   notThat:"Phone number, email, website, or booking link added",                tip:"Adding contact info turns it into an ad. The whole strategy depends on it feeling like a neighbor post, not a sales pitch." },
  { label:"Nothing was removed from the post",         doThis:"Full post intact including the mission question at the end", notThat:"Trimmed, shortened, or missing sections",                           tip:"Every part of the post structure has a purpose. The mission question at the end is what drives comments and engagement." },
  { label:"Appropriate photo attached",                doThis:"Real photo of your face — candid, natural, personal",       notThat:"Stock photo, logo, truck only, AI-generated image, or dark selfie", tip:"The photo is the first thing people see. A real face builds instant connection. Anything else signals 'ad' and people scroll past." },
];

const AUDIT_ITEMS_ES = [
  { label:"Publicado desde una cuenta personal",       doThis:"Tu perfil personal de Facebook",                            notThat:"Tu página de negocios o una cuenta de marca",                        tip:"El algoritmo de Facebook muestra publicaciones personales a muchas más personas que las páginas de negocios. Esta es una de las reglas más importantes." },
  { label:"La publicación tiene gancho, historia y pregunta de cierre", doThis:"Empieza con algo real, cuenta un momento, termina con tu pregunta de misión", notThat:"Una lista de servicios, una promo o texto de introducción genérico", tip:"El gancho capta atención, la historia genera confianza y la pregunta de cierre impulsa comentarios — lo que impulsa el alcance." },
  { label:"No se agregó nada a la publicación",        doThis:"Publicación exacta como se generó — palabra por palabra",   notThat:"Número de teléfono, email, sitio web o enlace de reserva agregado",  tip:"Agregar información de contacto la convierte en un anuncio. Toda la estrategia depende de que se sienta como una publicación de vecino." },
  { label:"No se eliminó nada de la publicación",      doThis:"Publicación completa incluyendo la pregunta de misión al final", notThat:"Recortada, acortada o con secciones faltantes",                tip:"Cada parte de la estructura de la publicación tiene un propósito. La pregunta de misión al final impulsa comentarios y engagement." },
  { label:"Foto apropiada adjunta",                    doThis:"Foto real de tu cara — casual, natural, personal",          notThat:"Foto de stock, logo, solo el camión, imagen de IA o selfie oscuro",  tip:"La foto es lo primero que la gente ve. Una cara real genera conexión instantánea. Cualquier otra cosa señala 'anuncio' y la gente pasa de largo." },
];

const NAV_SECTIONS = [
  { id:"write",     label_en:"Write Post",     label_es:"Escribir",   icon:"✍️", phases:["ch1","ch2","ch3"], noSubs:true },  { id:"grouppost", label_en:"Post in Groups", label_es:"En Grupos",  icon:"📣", phases:["groups","getpost","photo","dopost","approval","replicate"] },
  { id:"leads",     label_en:"Work Leads",     label_es:"Prospectos", icon:"🔥", phases:["leads"] },
  { id:"amplify",   label_en:"Amplify",        label_es:"Amplificar", icon:"📡", phases:["amplify"] },
];

const PHASE_LABELS_EN = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3",
  groups:"1. Join a Group", getpost:"2. Generate Post",
  photo:"3. Add Photo", dopost:"4. Post It",
  approval:"5. Coach Approval", replicate:"6. Cross-Post",
  leads:"Work Leads", amplify:"Amplify",
};

const PHASE_LABELS_ES = {
  ch1:"Capítulo 1", ch2:"Capítulo 2", ch3:"Capítulo 3",
  groups:"1. Unirse a un Grupo", getpost:"2. Generar Publicación",
  photo:"3. Agregar Foto", dopost:"4. Publicarlo",
  approval:"5. Aprobación Coach", replicate:"6. Más Grupos",
  leads:"Trabajar Prospectos", amplify:"Amplificar",
};

const NO_NAV_PHASES = ["lane","voice","celebrate"];

const SAMPLE_ANSWERS = {
  name:"Marcus Webb", business:"Webb Home Services",
  area:"East Nashville, TN — Donelson and Hermitage. 11 years.",
  fear:"Lack of communication. I send a quick text update any time something changes on a job so nobody is left wondering.",
  humanDetail:"Most Saturdays I am on the sidelines at my son's baseball game with a cooler and way too much sunscreen.",
  localFlavor:"Mas Tacos Por Favor in East Nashville. Always get the chicken taco plate standing outside on the sidewalk.",
  mission:"hot chicken",
  whyStarted:"I remember sitting in my truck after a call feeling sick because my old company wanted me to push a bigger job the homeowner did not need.",
  whatChanged:"I am home to eat dinner with my family instead of coming in after everyone is asleep.",
  heroMoment:"An elderly woman called me at 7pm on Christmas Eve. Her heat had been out two days and grandkids were coming. I drove 40 minutes, worked in the cold, only charged her for the part. She grabbed my hand and said she would tell everyone she knew. She has sent four referrals.",
};

const BOOKING_EN = "I have got a few openings this week. Want me to save you a spot? I just need your name, address, email address, and phone number and I will handle the rest.";
const BOOKING_ES = "Tengo algunas aperturas esta semana. ¿Quieres que te reserve un lugar? Solo necesito tu nombre, dirección, correo electrónico y número de teléfono y me encargo del resto.";

function getLEAD_TYPES(lang) {
  const BOOKING = lang === "es" ? BOOKING_ES : BOOKING_EN;
  return [
    { id:"like",    emoji:"👍", label:lang==="es"?"Me Gusta o Emoji":"Like or Emoji",   color:"#FEF9EC", border:YELLOW,    simple:true,
      steps:[
        { label:lang==="es"?"Dentro de 24 horas, envía este DM a cada persona que reaccionó":"Within 24 hours, send this DM to each person who reacted", script:lang==="es"?"Hola [Nombre], ¡realmente agradezco la reacción en mi publicación! Cuanto más gente interactúa, más Facebook la muestra en la comunidad, así que gracias por ayudar a un negocio pequeño como el mío. Con curiosidad, ¿qué te llamó la atención?":"Hey [Name], really appreciate the reaction on my post! The more people who engage, the more Facebook shows it around the community, so thank you for helping a small business like mine. Just curious, what stood out to you?" },
        { label:lang==="es"?"Luego sigue la estrategia de DM según su respuesta":"Then follow the DM strategy based on their response", note:true }
      ]
    },
    { id:"comment", emoji:"💬", label:lang==="es"?"Comentario":"Comment", color:"#EFF6FF", border:"#93C5FD", simple:false, subtypes:[
      { id:"cs1", label:lang==="es"?"Preguntó sobre un servicio que ofreces":"Asked about a service you offer",    example:lang==="es"?"¿Haces limpieza de drenaje?":"Do you do drain cleaning?",        publicReplies:[lang==="es"?"@[Nombre] excelente pregunta. Sí manejamos [tipo de servicio], y la calidad siempre está garantizada.":"@[Name] great question. I do handle [service type], and quality is always guaranteed."],     dmScript:lang==="es"?"Hola [Nombre], muchas gracias por comentar. Absolutamente podemos ayudar con [servicio]. "+BOOKING:"Hey [Name], thanks so much for commenting. We absolutely can help with [service]. "+BOOKING },
      { id:"cs2", label:lang==="es"?"Preguntó sobre tu área de servicio":"Asked about your service area",      example:lang==="es"?"¿Trabajas en Donelson?":"Do you service Donelson?",         publicReplies:[lang==="es"?"@[Nombre] excelente pregunta. Sí servimos [nombre de ciudad], nos encantaría ayudarte.":"@[Name] great question. We do service [city name], we would love to help you out."],         dmScript:lang==="es"?"Hola [Nombre], gracias por comunicarte. Sí, absolutamente servimos [área]. Con curiosidad, ¿hay algo específico en lo que pueda ayudarte?":"Hey [Name], thanks for reaching out. Yes, we absolutely service [area]. Just curious, is there something specific going on I can help with?" },
      { id:"cs3", label:lang==="es"?"Necesita ayuda ahora":"Needs help now",                     example:lang==="es"?"¡Estaba a punto de llamar a alguien!":"I was just about to call someone!", publicReplies:[lang==="es"?"@[Nombre] nos encantaría ayudarte a ti y a tu familia.":"@[Name] we would love to help serve you and your family."],                                  dmScript:lang==="es"?"Hola [Nombre], qué bueno que te comunicaste. "+BOOKING:"Hey [Name], so glad you reached out. "+BOOKING },
      { id:"cs4", label:lang==="es"?"Elogio o apoyo":"Praise or encouragement",            example:lang==="es"?"¡Amo esta publicación!":"Love this post! Keep it up!",      publicReplies:[lang==="es"?"@[Nombre] realmente aprecio las amables palabras. ¡Hace que todos los días largos valgan la pena!":"@[Name] really appreciate the kind words! Makes all the long days worth it."],                dmScript:lang==="es"?"Hola [Nombre], realmente aprecio el apoyo. Si alguna vez necesitas ayuda con [servicios], con gusto me encargo.":"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." },
      { id:"cs5", label:lang==="es"?"Cliente anterior o testimonio":"Past customer or testimonial",       example:lang==="es"?"¡Hizo un excelente trabajo para nosotros el año pasado!":"He did great work for us last year!", publicReplies:[lang==="es"?"@[Nombre] clientes recurrentes como tú son lo que me mantienen adelante. Agradezco tu apoyo.":"@[Name] repeat customers like you are what keep me going. Grateful for your support."],   dmScript:lang==="es"?"Tu recomendación significa el mundo para mí. ¿Conoces a alguien más que pueda necesitar [servicios]?":"Your recommendation means the world to me. Do you know anyone else who could use [services]?" },
      { id:"cs6", label:lang==="es"?"Referencia o interés futuro":"Referral or future interest",        example:lang==="es"?"¡Se lo compartiré a mi vecino!":"I will share this with my neighbor!", publicReplies:[lang==="es"?"@[Nombre] realmente aprecio eso. Apoyar a los negocios locales ayuda a toda la comunidad.":"@[Name] really appreciate that. Supporting local businesses helps the whole community."],  dmScript:lang==="es"?"Hola [Nombre], el mejor cumplido que alguien puede darnos es referir a alguien. ¿Podrías compartir su nombre y número de teléfono?":"Hey [Name], the best compliment someone can give us is to refer us. Could you share their name and phone number?" },
      { id:"cs7", label:lang==="es"?"Conexión comunitaria":"Community connection",               example:lang==="es"?"¡Necesitamos más personas como tú!":"We need more people like you!",     publicReplies:[lang==="es"?"@[Nombre] gracias. Nuestra comunidad merece trabajo honesto y eso es lo que siempre haré.":"@[Name] thank you. Our community deserves honest work and that is what I will always stand for."], dmScript:lang==="es"?"Me encanta ser parte de [ciudad/comunidad]. Si alguna vez necesitas ayuda en tu casa, con gusto te ayudo.":"I love being part of [city/community]. If you ever need help at your place, I would be glad to." },
    ]},
    { id:"share", emoji:"🔁", label:lang==="es"?"Compartir":"Share", color:"#F0FDF4", border:"#86EFAC", simple:true,
      steps:[
        { label:lang==="es"?"Comenta en su compartido":"Comment on their share", script:lang==="es"?"@[Nombre] realmente aprecio eso. Apoyar a los negocios locales ayuda a toda la comunidad.":"@[Name] really appreciate that. Supporting local businesses helps the whole community." },
        { label:lang==="es"?"Luego envía este DM":"Then send this DM",      script:lang==="es"?"Hola [Nombre], realmente aprecio el apoyo. Si alguna vez necesitas ayuda con [servicios], con gusto me encargo.":"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." }
      ]
    },
    { id:"dm", emoji:"✉️", label:lang==="es"?"Mensaje Directo":"Direct Message", color:"#FDF4FF", border:"#D8B4FE", simple:false, subtypes:[
      { id:"ds1",  label:lang==="es"?"Preguntó sobre un servicio que ofreces":"Asked about a service you offer",       example:lang==="es"?"¿Instalas calentadores de agua?":"Do you do water heater installs?",       dmScript:lang==="es"?"Hola, muchas gracias por comunicarte. Absolutamente podemos ayudar con [nombre del servicio]. "+BOOKING:"Hey, thanks so much for reaching out. We absolutely can help with [service name]. "+BOOKING },
      { id:"ds2",  label:lang==="es"?"Preguntó sobre un servicio que no ofreces":"Asked about a service you do not offer",example:lang==="es"?"¿Reparas techos?":"Do you do roof repairs?",               dmScript:lang==="es"?"Hola, muchas gracias por comunicarte. No ofrecemos [servicio] pero sí ofrecemos [tus servicios]. ¿Hay algún otro elemento en tu lista que podamos ayudarte?":"Hey, thanks so much for reaching out. We do not provide [service] but we do provide [your services]. Is there another item on your to-do list we can help with?" },
      { id:"ds3",  label:lang==="es"?"Pregunta general o verificación de área":"General question or area check",        example:lang==="es"?"¿Trabajas en Hermitage?":"Do you service Hermitage?",             dmScript:lang==="es"?"Hola, muchas gracias por comunicarte. [Inserta tu respuesta a su pregunta aquí.]":"Hey, thanks so much for reaching out. [Insert your answer to their question here.]" },
      { id:"ds4",  label:lang==="es"?"Necesita ayuda ahora":"Needs help now",                        example:lang==="es"?"¡Estaba a punto de llamar a alguien!":"I was just about to call someone!",     dmScript:lang==="es"?"Hola, muchas gracias por comunicarte. "+BOOKING:"Hey, thanks so much for reaching out. "+BOOKING },
      { id:"ds5",  label:lang==="es"?"Elogio o apoyo":"Praise or encouragement",               example:lang==="es"?"¡Bien hecho! Me encanta lo que estás haciendo.":"Way to go! Love what you are doing.",   dmScript:lang==="es"?"Hola [Nombre], realmente aprecio el apoyo. Si alguna vez necesitas ayuda con [servicios], con gusto me encargo.":"Hey [Name], really appreciate the encouragement. If you ever need help with [services], I would be glad to take care of you." },
      { id:"ds6",  label:lang==="es"?"Cliente anterior o testimonio":"Past customer or testimonial",          example:lang==="es"?"¡Hizo nuestro revestimiento el año pasado!":"He did our siding last year!",           dmScript:lang==="es"?"Tu recomendación significa el mundo para mí. ¿Conoces a alguien más que pueda necesitar [servicios]?":"Your recommendation means the world to me. Do you know anyone else who could use [services]?" },
      { id:"ds7",  label:lang==="es"?"Referencia o interés futuro":"Referral or future interest",           example:lang==="es"?"¿Puedes ayudar a mi amigo?":"Can you help my friend?",               dmScript:lang==="es"?"Hola, muchas gracias por comunicarte. ¿Podrías compartir su nombre y número de teléfono?":"Hey, thanks so much for reaching out. Could you share their name and phone number?" },
      { id:"ds8",  label:lang==="es"?"Conexión comunitaria":"Community connection",             example:lang==="es"?"¡Necesitamos más personas como tú!":"We need more people like you!",         dmScript:lang==="es"?"Me encanta ser parte de [ciudad/comunidad]. Si alguna vez necesitas ayuda en tu casa, con gusto te ayudo.":"I love being part of [city/community]. If you ever need help at your place, I would be glad to." },
      { id:"ds9",  label:lang==="es"?"Competidor o par":"Competitor or peer",                example:lang==="es"?"Ofrecemos los mismos servicios en otra ciudad.":"We do the same services in another town.", dmScript:lang==="es"?"Qué bueno saber de ti. Si alguna vez tienes trabajos de desbordamiento fuera de tu enfoque, no dudes en enviármelos.":"Great to hear from you. If you ever have overflow jobs outside your focus, feel free to send them my way." },
      { id:"ds10", label:lang==="es"?"Apoyo emocional o basado en valores":"Emotional support or values-based",     example:lang==="es"?"Estoy muy orgulloso de ti. ¡Bendiciones!":"I am so proud of you. Blessings!",      dmScript:lang==="es"?"Qué amable de tu parte. Mensajes como este me recuerdan por qué empecé este negocio. Gracias.":"That is so kind of you. Messages like this remind me why I started this business. Thank you." },
    ]},
  ];
}

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
  if (q.validate === "hero") { if (words.length < 25) return { ok:false, reason:"short" }; }
  return { ok:true };
}

const FOLLOWUP_TEMPLATES_EN = {
  name:        ["I did not catch a full name. What is your first and last name?"],
  business:    ["What is the exact name of your business as it appears on Google or Facebook?"],
  area:        { default:["And how long have you been serving that area?"] },
  fear:        ["Pick one of the three fears and tell me one specific thing you do every job to prevent it."],
  humanDetail: ["Add one more detail. A name, a number, a place, or a year."],
  localFlavor: ["Give me the actual name of the spot and one thing you always do or order there."],
  mission:     ["Just say the one thing. Tacos, pizza, donuts, coffee, whatever people have strong opinions on."],
  whyStarted:  ["What were you actually feeling in that moment?"],
  whatChanged: ["Make it something a neighbor can picture. One real thing different in your daily life now."],
  heroMoment:  ["Add one more detail. What did they say, what did you see, or what do you still remember?"],
};

const FOLLOWUP_TEMPLATES_ES = {
  name:        ["No capté un nombre completo. ¿Cuál es tu nombre y apellido?"],
  business:    ["¿Cuál es el nombre exacto de tu negocio en Google o Facebook?"],
  area:        { default:["¿Y cuánto tiempo llevas sirviendo esa área?"] },
  fear:        ["Elige uno de los tres miedos y dime una cosa específica que haces en cada trabajo para prevenirlo."],
  humanDetail: ["Agrega un detalle más. Un nombre, número, lugar o año."],
  localFlavor: ["Dame el nombre real del lugar y una cosa que siempre haces o pides ahí."],
  mission:     ["Solo di una cosa. Tacos, pizza, donas, café, lo que sea sobre lo que la gente tenga opiniones fuertes."],
  whyStarted:  ["¿Qué estabas sintiendo realmente en ese momento?"],
  whatChanged: ["Hazlo algo que un vecino pueda imaginar. Una cosa real diferente en tu vida diaria ahora."],
  heroMoment:  ["Agrega un detalle más. ¿Qué dijeron, qué viste o qué aún recuerdas?"],
};

const GOOD_PHOTOS = ["https://i.imgur.com/F7Ur9Rf.png","https://i.imgur.com/HWxgfnO.png","https://i.imgur.com/Cv43HJt.png"];
const BAD_PHOTOS  = ["https://i.imgur.com/l8KAdix.png","https://i.imgur.com/vCVlGIm.png","https://i.imgur.com/7rvGL6O.png"];

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
    name: city+" "+s, type: i<5?"Community":i<10?"Homeowners":"Neighborhood",
    url: "https://www.facebook.com/groups/search/?q="+encodeURIComponent(city+" "+s),
  }));
}
async function findFacebookGroups(city, count) { return buildFacebookGroups(city, count); }

async function generateAIPost(ans, lang) {
  const city = (ans.area||"").split(/[,.]/)[0].trim() || "my city";
  const isEs = lang === "es";
  const lines = [
    isEs ? "Eres un redactor profesional escribiendo publicaciones de Facebook para propietarios de negocios de servicios para el hogar." : "You are a professional copywriter writing scroll-stopping neighborly Facebook posts for home service business owners.",
    isEs ? "NO ALUCINES: Usa SOLO los hechos indicados." : "STRICT NO-HALLUCINATION: Use ONLY facts explicitly stated below.",
    "Answers:", "1. Name: "+(ans.name||""), "2. Business: "+(ans.business||""), "3. Area: "+(ans.area||""),
    "4. Customer fear: "+(ans.fear||""), "5. Real life detail: "+(ans.humanDetail||""),
    "6. Local flavor: "+(ans.localFlavor||""), "7. Mission: "+(ans.mission||""),
    "8. Why started: "+(ans.whyStarted||""), "9. What changed: "+(ans.whatChanged||""),
    "10. Hero moment: "+(ans.heroMoment||""),
    isEs ? "REGLAS: Solo primera persona. Nunca usar: profesionalismo, integridad, excelencia, calidad, compromiso, confiable, experto. NUNCA usar guiones largos. Sin CTA, teléfono o sitio web. 330-450 palabras. Párrafos cortos." : "RULES: First person only. Never use: professionalism, integrity, excellence, quality work, commitment, reliable, expert, top-notch. NEVER use em dashes or double hyphens. No CTA, phone, or website. Fix all grammar. 330-450 words. Short paragraphs.",
    isEs ? "ESTRUCTURA: (1) Gancho vulnerable, (2) Ancla de identidad, (3) Miedo + hábito, (4) Momento héroe como escena vívida, (5) Prueba de vecino con detalle de vida real + lugar local, (6) Terminar SOLO con: Además, estoy en una misión para encontrar los mejores "+( ans.mission||"[misión]")+" en "+city+". ¿Alguna sugerencia?" : "STRUCTURE: (1) Vulnerable hook, (2) Identity anchor, (3) Fear + habit, (4) Hero moment as vivid scene, (5) Neighbor proof with real life detail + local flavor, (6) End ONLY with: Also, I am on a mission to find the best "+(ans.mission||"[mission]")+" in "+city+". Any suggestions?",
    isEs ? "Escribe en español. Solo la publicación, sin etiquetas." : "Output post only. No labels.",
  ];
  return await callClaude([{ role:"user", content:lines.join("\n") }]);
}

// ── localStorage persistence ──────────────────────────────────────────────────
function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}
function loadFromStorage() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch(e) { return null; }
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
function CardNav({ onBack, onNext, nextDisabled, nextLabel, firstQuestion, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"row", justifyContent:firstQuestion||!onBack?"flex-end":"space-between", alignItems:"stretch", gap:16, marginTop:24, paddingTop:20, borderTop:"1px solid "+GRAY100 }}>
      {onBack && !firstQuestion && <button onClick={onBack} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:GRAY100, color:GRAY600 }}>{(t||T.en).back}</button>}
      {onNext && <button onClick={onNext} disabled={!!nextDisabled} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:YELLOW, color:NAVY, opacity:nextDisabled?0.4:1 }}>{nextLabel||(t||T.en).next}</button>}
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
function GroupTable({ groups, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {groups.map((g,i) => (
        <div key={i} style={{ background:i%2===0?WHITE:GRAY50, border:"1px solid "+GRAY200, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, color:NAVY, fontSize:14 }}>{g.name}</div></div>
          <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:WHITE, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, display:"inline-flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            {t.searchOnFb}
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function SidebarNav({ current, onNavigate, completedSections, lang }) {
  const t = T[lang];
  const PHASE_LABELS = lang === "es" ? PHASE_LABELS_ES : PHASE_LABELS_EN;
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
          const sLabel = lang === "es" ? section.label_es : section.label_en;
          return (
            <div key={section.id} style={{ marginBottom:4 }}>
              <button onClick={() => onNavigate(section.phases[0])}
                style={{ width:"100%", border:"none", background:"transparent", display:"flex", alignItems:"center", gap:10, padding:"11px 20px", cursor:"pointer", borderLeft:sectionActive?"3px solid "+YELLOW:"3px solid transparent" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:15, flexShrink:0 }}>{section.icon}</span>
                <span style={{ fontWeight:800, fontSize:13, flex:1, color:sectionDone?GREEN:sectionActive?YELLOW:GRAY400 }}>{sectionDone?"✓ ":""}{sLabel}</span>
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

// ── Dev Shortcuts ─────────────────────────────────────────────────────────────
function DevShortcuts({ setAnswers, setPost, setAppPhase, t }) {
  return (
    <div style={{ background:"#FEF9EC", border:"1.5px dashed "+YELLOW, borderRadius:10, padding:"10px 16px", marginTop:16 }}>
      <div style={{ fontSize:13, color:GRAY600, marginBottom:8 }}>{t.devShortcuts}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setAppPhase("ch1"); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.fillSample}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setAppPhase("getpost"); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipGenerate}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("approval"); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipStep5}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("leads"); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipLeads}</button>
      </div>
    </div>
  );
}

// ── Voice Mode ────────────────────────────────────────────────────────────────
function VoiceMode({ onComplete, lang }) {
  const t = T[lang];
  const ALL_QUESTIONS = lang === "es" ? QUESTIONS_ES : QUESTIONS_EN;
  const FOLLOWUP_TEMPLATES = lang === "es" ? FOLLOWUP_TEMPLATES_ES : FOLLOWUP_TEMPLATES_EN;
  const S = useRef({ qIdx:0, answers:{}, rerecordId:null, busy:false, wantMic:false, followupCount:0, partialAnswers:{} });
  const [displayQIdx, setDisplayQIdx] = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState({});
  const [coachMsg, setCoachMsg] = useState(t.voiceCoachGreeting);
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
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = lang === "es" ? "es-US" : "en-US";
      u.rate=0.95; u.pitch=1.05;
      const tmo = setTimeout(() => { window.speechSynthesis.cancel(); S.current.busy=false; if (after) after(); else openMic(); }, Math.max(3000, msg.length*65));
      u.onend  = () => { clearTimeout(tmo); S.current.busy=false; if (after) after(); else openMic(); };
      u.onerror= () => { clearTimeout(tmo); S.current.busy=false; if (after) after(); else openMic(); };
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
      const retry = Array.isArray(tmpl) ? tmpl[0] : (tmpl.default ? tmpl.default[0] : q.voiceQ);
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
    if (isLast) { coachSay(lang==="es"?"Eso es todo lo que necesito. Increíble trabajo. Vamos a construir tu publicación ahora.":"That is everything I need. Amazing work. Let us build your post now.", () => setUiStatus("done")); }
    else if (rid) { coachSay(lang==="es"?"Listo, respuesta guardada.":"Got it, answer saved.", () => openMic()); }
    else { S.current.qIdx=qi+1; setDisplayQIdx(qi+1); coachSay((lang==="es"?"Excelente. ":"Great. ")+(nextQ.voiceQ||nextQ.hint), () => openMic()); }
  }
  useEffect(() => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition; if (!SR) { setMicErr(lang==="es"?"Reconocimiento de voz no compatible.":"Speech recognition not supported."); return; }
    const r = new SR(); r.continuous=false; r.interimResults=true; r.lang=lang==="es"?"es-US":"en-US";
    r.onresult = e => { const l=e.results[e.results.length-1]; const txt=l[0].transcript; setTranscript(txt); if (!l.isFinal) return; if (!txt.trim()||S.current.busy) return; S.current.busy=true; S.current.wantMic=false; setUiStatus("thinking"); handleAnswer(txt.trim()); };
    r.onerror  = e => { if (e.error==="no-speech") { if (S.current.wantMic&&!S.current.busy) try{r.start();}catch(_){} return; } S.current.wantMic=false; setMicErr(e.error==="not-allowed"?t.micBlocked:t.micError); setUiStatus("idle"); };
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
          <div style={{ flex:1 }}>{isT ? <p style={{ color:GRAY400, fontSize:14, margin:0, fontStyle:"italic" }}>{t.processing}</p> : <p style={{ color:WHITE, fontSize:16, margin:0, lineHeight:1.8 }}>{coachMsg}</p>}</div>
        </div>
      </Card>
      {uiStatus!=="idle" && uiStatus!=="done" && (
        <Card>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:8, paddingBottom:8 }}>
            <button type="button" onClick={isL?closeMic:openMic} disabled={isT||isS}
              style={{ background:isL?RED:isS||isT?GRAY400:GRAY200, border:"none", borderRadius:"50%", width:80, height:80, cursor:isT||isS?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isL?"0 0 0 10px rgba(239,68,68,0.15)":"none", transition:"all 0.3s" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={isL?WHITE:GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
            </button>
            <span style={{ fontSize:13, color:isL?RED:isS?YELLOW:GRAY400, fontWeight:isL||isS?600:400 }}>{isL?t.listening:isT?t.processing:isS?t.coachSpeaking:t.tapToStart}</span>
            {micErr && <span style={{ fontSize:12, color:RED }}>{micErr}</span>}
            {transcript && <div style={{ background:"#F0F7FF", border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", width:"100%", boxSizing:"border-box", fontSize:14, color:GRAY800, lineHeight:1.7 }}><div style={{ fontSize:11, color:GRAY400, marginBottom:4, fontWeight:600 }}>{lang==="es"?"DIJISTE:":"YOU SAID:"}</div>{transcript}</div>}
          </div>
          {activeQ && <div style={{ marginTop:12, padding:"12px 14px", background:GRAY50, borderRadius:10 }}><span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700, marginRight:6 }}>Q{activeQ.num}</span><span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{activeQ.question}</span></div>}
        </Card>
      )}
      {uiStatus!=="idle" && <div style={{ marginBottom:12 }}><div style={{ background:GRAY200, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:YELLOW, borderRadius:99, height:6, width:Math.round((answered/ALL_QUESTIONS.length)*100)+"%", transition:"width 0.4s" }}/></div></div>}
      {uiStatus==="idle" && <div style={{ textAlign:"center", marginTop:8 }}><Btn onClick={() => { const q=ALL_QUESTIONS[0]; coachSay((lang==="es"?"¡Muy bien, construyamos tu historia! ":"Alright, let us build your story! ")+(q.voiceQ||q.hint), () => openMic()); }}>{t.startVoiceSession}</Btn></div>}
      {answered > 0 && (
        <Card>
          <h3 style={{ color:NAVY, margin:"0 0 16px", fontSize:16 }}>{t.yourAnswersSoFar}</h3>
          {ALL_QUESTIONS.filter(q=>displayAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+GRAY200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><span style={{ background:NAVY, color:YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{q.num}</span><span style={{ fontWeight:700, color:NAVY, fontSize:13 }}>{q.question}</span></div>
                  <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{displayAnswers[q.id]}</p>
                </div>
                <button onClick={() => { S.current.rerecordId=q.id; const rq=ALL_QUESTIONS.find(x=>x.id===q.id); setTranscript(""); coachSay((lang==="es"?"No hay problema, rehagamos eso. ":"No problem, let us redo that. ")+(rq.voiceQ||rq.hint), () => openMic()); }} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, color:GRAY600, cursor:"pointer", flexShrink:0 }}>{t.reRecord}</button>
              </div>
            </div>
          ))}
        </Card>
      )}
      {uiStatus==="done" && <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><Btn onClick={() => onComplete({...S.current.answers})}>{t.next} →</Btn></div>}
    </div>
  );
}

// ── Q3 Area Input — single row: city+neighborhoods | state | years ────────────
function AreaInput({ value, onChange, lang }) {
  const t = T[lang];

  const [cityArea, setCityArea] = useState(() => {
    if (!value) return "";
    // Extract everything before the state abbreviation as the city/area field
    const withoutState = value.replace(/,?\s*\b[A-Z]{2}\b/, "").replace(/—.*$/,"").replace(/\.\s*\d+\s*(year|yr|años|año).*/i,"").trim().replace(/[.,]+$/,"").trim();
    return withoutState;
  });
  const [stateVal, setStateVal] = useState(() => {
    if (!value) return "";
    const m = value.match(/\b([A-Z]{2})\b/);
    return m ? m[1] : "";
  });
  const [years, setYears] = useState(() => {
    if (!value) return "";
    const m = value.match(/(\d+)\s*(year|yr|años|año)/i);
    return m ? m[1] : "";
  });
  const [areaErr, setAreaErr] = useState("");
  const [stateErr, setStateErr] = useState("");

  useEffect(() => {
    if (!cityArea && !stateVal) return;
    let composed = cityArea.trim();
    if (stateVal) composed += (composed ? ", " : "") + stateVal;
    if (years.trim()) {
      const yrWord = lang === "es" ? "años" : "years";
      composed += ". " + years.trim() + " " + yrWord + ".";
    }
    onChange(composed);
  }, [cityArea, stateVal, years]);

  const cityLabel    = lang === "es" ? "Ciudad y área de servicio *" : "City & service area *";
  const cityPH       = lang === "es" ? "ej. Nashville Este, Donelson, Hermitage" : "e.g. East Nashville, Donelson, Hermitage";
  const yearsLabel   = lang === "es" ? "Años" : "Years";
  const yearsPH      = lang === "es" ? "ej. 11" : "e.g. 11";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Single row: city/area | state | years */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 90px", gap:10, alignItems:"start" }}>
        {/* City + neighborhoods combined */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:GRAY600, display:"block", marginBottom:4 }}>{cityLabel}</label>
          <input
            value={cityArea}
            onChange={e => { setCityArea(e.target.value); if(areaErr) setAreaErr(""); }}
            placeholder={cityPH}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(areaErr?RED:cityArea?GREEN:GRAY200), borderRadius:10, padding:"10px 12px", fontSize:14, color:GRAY800, fontFamily:"inherit", outline:"none" }}
          />
          {areaErr && <p style={{ color:RED, fontSize:11, margin:"4px 0 0" }}>{areaErr}</p>}
        </div>

        {/* State / Province dropdown */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:GRAY600, display:"block", marginBottom:4 }}>{t.statePlaceholder} *</label>
          <select
            value={stateVal}
            onChange={e => { setStateVal(e.target.value); if(stateErr) setStateErr(""); }}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(stateErr?RED:stateVal?GREEN:GRAY200), borderRadius:10, padding:"10px 10px", fontSize:14, color:stateVal?GRAY800:GRAY400, fontFamily:"inherit", outline:"none", background:WHITE, cursor:"pointer" }}
          >
            {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {stateErr && <p style={{ color:RED, fontSize:11, margin:"4px 0 0" }}>{stateErr}</p>}
        </div>

        {/* Years */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:GRAY600, display:"block", marginBottom:4 }}>{yearsLabel}</label>
          <input
            type="number" min="0" max="99"
            value={years}
            onChange={e => setYears(e.target.value)}
            placeholder={yearsPH}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+GRAY200, borderRadius:10, padding:"10px 10px", fontSize:14, color:GRAY800, fontFamily:"inherit", outline:"none" }}
          />
        </div>
      </div>

      {/* Live preview */}
      {value && (
        <div style={{ background:GRAY50, borderRadius:8, padding:"8px 12px", fontSize:12, color:GRAY600 }}>
          <span style={{ fontWeight:700, color:NAVY }}>{lang==="es"?"Vista previa: ":"Preview: "}</span>{value}
        </div>
      )}
    </div>
  );
}

// ── Type Mode ─────────────────────────────────────────────────────────────────
function TypeMode({ onComplete, savedAnswers, onAnswerChange, lang, onSwitchToVoice }) {
  const t = T[lang];
  const ALL_QUESTIONS = lang === "es" ? QUESTIONS_ES : QUESTIONS_EN;
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
  const isAreaQ = q.id === "area";

  useEffect(() => {
    setShowInspiration(false); setInspirationExamples([]);
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition; if (!SR) { setMicErr(lang==="es"?"Reconocimiento de voz no compatible.":"Speech recognition not supported."); return; }
    const r = new SR(); r.continuous=false; r.interimResults=false; r.lang=lang==="es"?"es-US":"en-US";
    r.onresult = e => { const txt=e.results[0][0].transcript; const c=savedAnswers[q.id]||""; onAnswerChange(q.id, c?c+" "+txt:txt); setMicL(false); };
    r.onerror  = e => { setMicL(false); setMicErr(e.error==="not-allowed"?t.micBlocked:t.micError); };
    r.onend    = () => setMicL(false);
    recogRef.current = r;
    return () => { try { r.stop(); } catch(_) {} };
  }, [qIdx, lang]);

  const toggleMic = () => { if (!recogRef.current) return; if (micL) { try{recogRef.current.stop();}catch(_){} setMicL(false); } else { try{recogRef.current.start();setMicL(true);setMicErr("");}catch(_){} } };

  const handleNext = () => {
    if (isAreaQ) {
      // For area, just need city+state to be set (value will be composed)
      if (!value || value.trim().length < 3) { setShowError(true); return; }
    } else {
      if (!met) { setShowError(true); return; }
    }
    setShowError(false);
    if (isLast) onComplete(savedAnswers);
    else { setQIdx(i=>i+1); setMicErr(""); setShowError(false); }
  };
  const handleBack = () => { if (qIdx>0) { setQIdx(i=>i-1); setMicErr(""); setShowError(false); } };

  const handleInspiration = async () => {
    setShowInspiration(v => !v);
    if (inspirationExamples.length>0 || showInspiration) return;
    setInspirationLoading(true);
    try {
      const promptLang = lang === "es" ? "Responde ÚNICAMENTE con un array JSON de 3 strings en español. Sin markdown." : "Return ONLY a JSON array of 3 strings. No markdown.";
      const reply = await callClaude([{ role:"user", content:"Give 3 short vivid example answers for this question from a home service business owner:\n\nQuestion: "+q.question+"\nContext: "+q.hint+"\n\n"+promptLang }]);
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
          <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{t.yourStoryProgress}</span>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontWeight:800, fontSize:14, color:pct===100?GREEN:NAVY }}>{t.answersOf(answered, ALL_QUESTIONS.length)}</span>
            {onSwitchToVoice && (
              <button onClick={onSwitchToVoice} style={{ background:"none", border:"none", fontSize:12, color:GRAY400, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit" }}>
                {lang==="es"?"🎤 Prefiero hablar":"🎤 Prefer to talk?"}
              </button>
            )}
          </div>
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
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.pickFear}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.fearChips.map((chip,i) => {
                const sel = value.toLowerCase().startsWith(chip.toLowerCase());
                return (
                  <button key={i} onClick={() => { if (sel) { onAnswerChange(q.id, value.replace(new RegExp("^"+chip+"\\.?\\s*","i"),"").trim()); } else { onAnswerChange(q.id, chip+". "+value.replace(new RegExp("^(Getting overcharged|Being left with a mess|Lack of communication|Cobros excesivos|Dejar un desastre|Falta de comunicación)\\.?\\s*","i"),"").trim()); } }}
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
            <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.quickPick}</p>
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

        {/* Q3 special area input */}
        {isAreaQ ? (
          <AreaInput value={value} onChange={val => { onAnswerChange(q.id, val); if(showError) setShowError(false); }} lang={lang}/>
        ) : (
          <>
            {/* First example always visible */}
            {(q.examples||[]).length > 0 && (
              <div style={{ marginBottom:12, background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:"10px 14px" }}>
                <p style={{ fontSize:11, fontWeight:700, color:GRAY400, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{lang==="es"?"Ejemplo":"Example"}</p>
                <p style={{ fontSize:13, color:GRAY600, margin:0, lineHeight:1.6, fontStyle:"italic" }}>"{q.examples[0]}"</p>
                {(q.examples||[]).length > 1 && !showInspiration && (
                  <button onClick={handleInspiration} style={{ background:"none", border:"none", fontSize:12, color:GRAY400, cursor:"pointer", padding:"6px 0 0", textDecoration:"underline", fontFamily:"inherit" }}>
                    {lang==="es"?"Ver más ejemplos":"See more examples"}
                  </button>
                )}
              </div>
            )}
            {showInspiration && (
              <div style={{ marginBottom:12, background:"#FFFBEB", border:"1.5px solid "+YELLOW, borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:GRAY600, margin:"0 0 12px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.exampleAnswers}</p>
                {inspirationLoading
                  ? <p style={{ fontSize:13, color:GRAY400, fontStyle:"italic", margin:0 }}>{t.loadingExamples}</p>
                  : (inspirationExamples.length>0 ? inspirationExamples : q.examples||[]).map((ex,i,arr) => (
                    <div key={i} style={{ marginBottom:i<arr.length-1?12:0 }}>
                      <p style={{ fontSize:13, color:GRAY800, margin:0, lineHeight:1.7, fontStyle:"italic" }}>"{ex}"</p>
                      {i<arr.length-1 && <div style={{ borderTop:"1px solid "+GRAY200, marginTop:12 }}/>}
                    </div>
                  ))
                }
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                  <p style={{ fontSize:11, color:GRAY400, margin:0 }}>{t.guidesOnly}</p>
                  <button onClick={() => setShowInspiration(false)} style={{ background:"none", border:"none", fontSize:12, color:GRAY400, cursor:"pointer", textDecoration:"underline", fontFamily:"inherit" }}>
                    {lang==="es"?"Ocultar":"Hide"}
                  </button>
                </div>
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
            {micL && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>{t.listening}</p>}
            {micErr && <p style={{ fontSize:12, color:RED, margin:"6px 0 0" }}>{micErr}</p>}
            {wc>0 && q.minWords>1 && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                <div style={{ flex:1, background:GRAY100, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:met?GREEN:YELLOW, height:6, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }}/></div>
                {met && <span style={{ fontSize:12, fontWeight:700, color:GREEN, whiteSpace:"nowrap" }}>✓</span>}
              </div>
            )}
          </>
        )}
        {showError && <div style={{ background:"#FEF2F2", border:"1.5px solid #FCA5A5", borderRadius:10, padding:"10px 14px", marginTop:12, fontSize:13, color:"#991B1B", fontWeight:600 }}>{isAreaQ ? t.cityRequired : t.addDetail}</div>}
        <CardNav onBack={qIdx>0?handleBack:undefined} onNext={handleNext} nextLabel={t.next} firstQuestion={qIdx===0} t={t}/>
      </div>
    </div>
  );
}

// ── Get Post ──────────────────────────────────────────────────────────────────
function GetPost({ allCh3Met, post, postEn, postLoading, postError, answers, onGenerate, onSetPost, onNext, onBack, onWritePost, lang }) {
  const t = T[lang];
  const [copied, setCopied] = useState(false);
  const [everCopied, setEverCopied] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const originalPostRef = useRef("");  // stores the AI-generated version
  const [isEdited, setIsEdited] = useState(false);
  const taRef = useRef(null);
  useEffect(() => {
    if (!taRef.current||!post) return;
    taRef.current.style.height="auto";
    requestAnimationFrame(() => { if (taRef.current) taRef.current.style.height=taRef.current.scrollHeight+"px"; });
  }, [post]);
  // When a fresh post arrives (generate/regenerate), store it as the original
  useEffect(() => {
    if (post && !postLoading) {
      originalPostRef.current = post;
      setIsEdited(false);
    }
  }, [postLoading]);
  const handleCopy = () => {
    if (!post) return;
    try { const el=document.createElement("textarea"); el.value=post; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(post); }
    setCopied(true); setEverCopied(true);
  };
  const handleCopyEn = () => {
    if (!postEn) return;
    try { const el=document.createElement("textarea"); el.value=postEn; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(postEn); }
    setCopiedEn(true); setEverCopied(true);
    setTimeout(() => setCopiedEn(false), 2500);
  };

  // Auto-expand English section when translation arrives
  useEffect(() => { if (postEn && lang === "es") setShowEn(true); }, [postEn]);
  const handleResetToOriginal = () => {
    onSetPost(originalPostRef.current);
    setIsEdited(false);
    setCopied(false);
    setEverCopied(false);
  };
  useEffect(() => { if (allCh3Met && !post && !postLoading) onGenerate(answers); }, []);
  return (
    <Card>
      <SectionHeader emoji="✍️" title={t.step2GeneratePost}/>
      {!allCh3Met && !post && (
        <div style={{ background:"#FEF9EC", border:"1.5px solid "+YELLOW, borderRadius:10, padding:16, marginBottom:20 }}>
          <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 6px" }}>{t.needPostToContinue}</p>
          <p style={{ color:GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>{t.needPostDesc}</p>
          <Btn onClick={onWritePost}>{t.writeMyPost}</Btn>
        </div>
      )}
      {!allCh3Met && (
        <>
          <p style={{ fontSize:13, fontWeight:600, color:NAVY, margin:"0 0 8px" }}>{t.pastePostLabel}</p>
          <textarea value={post} onChange={e=>onSetPost(e.target.value)} rows={10} placeholder={t.pastePlaceholder} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?NAVY:GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":GRAY50, outline:"none" }}/>
        </>
      )}
      {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:GRAY600, fontSize:14 }}>{t.writingPost}</p></div>}
      {postError && !postLoading && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{t.couldNotGenerate} <button onClick={() => onGenerate(answers)} style={{ background:"none", border:"none", color:NAVY, fontWeight:700, cursor:"pointer", textDecoration:"underline", fontSize:13 }}>{t.tryAgain}</button></div>}
      {post && !postLoading && (
        <>
          {/* Spanish post label */}
          {lang === "es" && (
            <p style={{ fontSize:12, fontWeight:700, color:GRAY400, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 6px" }}>
              🇪🇸 Publicación en español — revisa y edita si necesitas
            </p>
          )}
          <textarea ref={taRef} value={post} onChange={e => {
            onSetPost(e.target.value);
            setCopied(false);
            if (lang !== "es") setEverCopied(false);
            setIsEdited(e.target.value !== originalPostRef.current);
            e.target.style.height="auto";
            e.target.style.height=e.target.scrollHeight+"px";
          }}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, fontFamily:"inherit", resize:"none", background:GRAY50, outline:"none", marginBottom:14, overflow:"hidden", display:"block" }}/>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:20 }}>
            {lang !== "es" && (
              <Btn onClick={handleCopy} variant={copied?"success":"primary"}>{copied?t.copied:t.copyPost}</Btn>
            )}
            <button onClick={() => { setCopied(false); setEverCopied(false); setIsEdited(false); onGenerate(answers); }} disabled={postLoading} style={{ background:"none", border:"none", fontSize:13, fontWeight:700, color:GRAY600, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>{t.regenerate}</button>
            {isEdited && (
              <button onClick={handleResetToOriginal} style={{ background:"none", border:"none", fontSize:13, color:GRAY400, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>
                ↩ Volver al original
              </button>
            )}
          </div>

          {/* English translation — only shown in Spanish mode */}
          {lang === "es" && (
            <div style={{ borderTop:"2px solid "+GRAY200, paddingTop:20, marginTop:4 }}>
              <button onClick={() => setShowEn(v=>!v)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>
                <div>
                  <span style={{ fontSize:13, fontWeight:800, color:NAVY }}>🇺🇸 English Translation</span>
                  <span style={{ fontSize:12, color:GRAY400, marginLeft:8 }}>
                    {postEn ? "Copy this to post" : "Generating..."}
                  </span>
                </div>
                <span style={{ color:GRAY400, fontSize:13 }}>{showEn ? "▲" : "▼"}</span>
              </button>
              {showEn && (
                <div style={{ marginTop:14 }}>
                  {!postEn ? (
                    <div style={{ padding:"20px 0", textAlign:"center", color:GRAY400, fontSize:13 }}>
                      ⏳ Translating your post...
                    </div>
                  ) : (
                    <>
                      <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:GRAY800, whiteSpace:"pre-wrap", marginBottom:12 }}>
                        {postEn}
                      </div>
                      <Btn onClick={handleCopyEn} variant={copiedEn?"success":"primary"}>
                        {copiedEn ? "✓ Copied!" : "📋 Copy Post"}
                      </Btn>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <CardNav onBack={onBack} onNext={everCopied?onNext:undefined} nextDisabled={!everCopied} nextLabel={t.next} t={t}/>
    </Card>
  );
}

// ── Audit Row ─────────────────────────────────────────────────────────────────
function AuditRow({ item, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1.5px solid "+GRAY200, borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", background:WHITE }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{item.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#D1FAE5", color:"#065F46", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{t.do}</span>
              <span style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{item.doThis}</span>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{t.not}</span>
              <span style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{item.notThat}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:GRAY400, fontSize:14, flexShrink:0, padding:"2px 4px" }}>{open?"▲":"▼"}</button>
      </div>
      {open && <div style={{ background:"#FFFBEB", borderTop:"1px solid "+GRAY200, padding:"12px 16px", display:"flex", gap:10 }}><span style={{ fontSize:16, flexShrink:0 }}>💡</span><p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{item.tip}</p></div>}
    </div>
  );
}

// ── Photo Step ────────────────────────────────────────────────────────────────
function PhotoStep({ answers, onBack, onNext, lang }) {
  const t = T[lang];
  const [photoIdeas, setPhotoIdeas] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function gen() {
      setLoading(true);
      try {
        const isEs = lang === "es";
        const prompt = "A home service business owner filled out these details:\n- Human detail: "+(answers.humanDetail||"not provided")+"\n- Local place: "+(answers.localFlavor||"not provided")+"\n- Why started: "+(answers.whyStarted||"not provided")+"\n- Hero moment: "+(answers.heroMoment||"not provided")+"\n\nGive 3 personalized Facebook photo ideas rated Good, Better, Best. Return ONLY valid JSON"+(isEs?", in Spanish":"")+", no markdown:\n{\"good\":{\"label\":\"short title\",\"desc\":\"1 sentence\"},\"better\":{\"label\":\"short title\",\"desc\":\"1 sentence tied to their details\"},\"best\":{\"label\":\"short title\",\"desc\":\"1 sentence most trust-building for them\"}}";
        const reply = await callClaude([{ role:"user", content:prompt }]);
        const cleaned = reply.replace(/```json/gi,"").replace(/```/g,"").trim();
        const s=cleaned.indexOf("{"), e=cleaned.lastIndexOf("}");
        if (s!==-1&&e!==-1) setPhotoIdeas(JSON.parse(cleaned.slice(s,e+1)));
        else throw new Error("parse");
      } catch(_) {
        setPhotoIdeas({ good:{label:lang==="es"?"Cualquier foto real tuya":"Any real photo of you",desc:lang==="es"?"Cara visible, luz natural, parece una persona real.":"Face visible, natural light, looks like a real person."}, better:{label:lang==="es"?"Haciendo algo que amas":"You doing something you love",desc:lang==="es"?"Un hobby, el juego de tus hijos, tu lugar local.":"A hobby, your kids' game, your local spot."}, best:{label:lang==="es"?"Un momento candid en el trabajo":"A candid moment on the job",desc:lang==="es"?"Tú trabajando, sonriendo, cara visible. Muestra quién eres y qué haces.":"You working, smiling, face clearly visible. Shows who you are and what you do."} });
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
      <SectionHeader emoji="📸" title={t.step3Photo} subtitle={t.step3Subtitle}/>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:12 }}>{t.photoIdeasTitle}</div>
        {loading
          ? <div style={{ textAlign:"center", padding:24, color:GRAY400, fontSize:13 }}>{t.generatingIdeas}</div>
          : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {tiers.map(tier => (
                <div key={tier.key} style={{ background:tier.color, border:"1.5px solid "+tier.border, borderRadius:12, padding:"14px 12px", display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ background:tier.border, color:tier.textColor, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800, letterSpacing:"0.04em", alignSelf:"flex-start" }}>{tier.badge}</span>
                  <div style={{ fontWeight:800, color:NAVY, fontSize:14, lineHeight:1.3 }}>{photoIdeas[tier.key].label}</div>
                  <div style={{ fontSize:12, color:GRAY600, lineHeight:1.5 }}>{photoIdeas[tier.key].desc}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700, color:GREEN, fontSize:13, marginBottom:10 }}>{t.goodPhotos}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {GOOD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #86EFAC", aspectRatio:"1", background:GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.style.display="flex";e.target.parentNode.style.alignItems="center";e.target.parentNode.style.justifyContent="center";e.target.parentNode.innerHTML="<span style='font-size:28px'>📸</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
        <div style={{ fontWeight:700, color:RED, fontSize:13, marginBottom:10 }}>{t.badPhotos}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {BAD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #FCA5A5", aspectRatio:"1", background:GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.style.display="flex";e.target.parentNode.style.alignItems="center";e.target.parentNode.style.justifyContent="center";e.target.parentNode.innerHTML="<span style='font-size:28px'>🚫</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
      </div>
      <CardNav onBack={onBack} onNext={onNext} t={t}/>
    </Card>
  );
}

// ── Lead Engagement ───────────────────────────────────────────────────────────
function LeadEngagement({ onBack, onAmplify, lang, leadsLog, setLeadsLog, totalJobs, setTotalJobs, onMarkStarted }) {
  const t = T[lang];
  const LEAD_TYPES = getLEAD_TYPES(lang);
  const [watched, setWatched] = useState(() => {
    try { return localStorage.getItem("hbc_lead_video_watched") === "1"; } catch(e) { return false; }
  });
  const [active, setActive]   = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [jobsInput, setJobsInput] = useState("");
  const [likeCount, setLikeCount] = useState(1);
  const log = leadsLog;
  const activeLead    = LEAD_TYPES.find(l=>l.id===active);
  const activeSubtype = activeLead && subtype ? (activeLead.subtypes||[]).find(s=>s.id===subtype) : null;
  const sessionCounts = LEAD_TYPES.reduce((acc,lt) => { acc[lt.id]=log.filter(l=>l.type===lt.id).length; return acc; }, {});
  const sessionTotal  = log.length;

  // Mark leads section as started the first time they land here
  useEffect(() => { if (onMarkStarted) onMarkStarted(); }, []);

  function copyText(text, idx) {
    try { const el=document.createElement("textarea"); el.value=text; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(text); }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  }
  function logLead(tid, n) { const num=n||1; setLeadsLog(p=>[...p,...Array.from({length:num},()=>({type:tid,timestamp:Date.now()}))]); }
  function reset() { setActive(null); setSubtype(null); setLikeCount(1); }

  function ScriptBox({ text, idx }) {
    return (
      <div style={{ background:GRAY50, border:"1.5px solid "+GRAY200, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <p style={{ fontSize:14, color:GRAY800, lineHeight:1.8, margin:"0 0 10px", fontStyle:"italic" }}>"{text}"</p>
        <button onClick={() => copyText(text,idx)} style={{ background:copiedIdx===idx?GREEN:NAVY, color:copiedIdx===idx?WHITE:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{copiedIdx===idx?t.copied:lang==="es"?"Copiar Guión":"Copy Script"}</button>
      </div>
    );
  }

  if (!watched) {
    return (
      <Card>
        <SectionHeader emoji="🎉" title={t.sessionCompleteTitle} subtitle={t.sessionCompleteSubtitle}/>
        <div style={{ background:"#EFF6FF", borderRadius:12, padding:16, marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, color:NAVY, fontWeight:600 }}>{t.trainingVideo}</p>
          <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:10, overflow:"hidden", marginBottom:14 }}>
            <iframe src="https://fast.wistia.net/embed/iframe/indqjc1oov?autoPlay=false" title={t.trainingVideo} allowFullScreen style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none", borderRadius:10 }}/>
          </div>
          <button onClick={() => { try { localStorage.setItem("hbc_lead_video_watched","1"); } catch(e){} setWatched(true); }} style={{ background:"none", border:"none", fontSize:13, color:GRAY400, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>
            {lang==="es"?"Saltar — ya vi esto":"Skip — I've already seen this"}
          </button>
        </div>
        <CardNav onBack={onBack} onNext={() => { try { localStorage.setItem("hbc_lead_video_watched","1"); } catch(e){} setWatched(true); }} nextLabel={t.next} t={t}/>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ background:NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>{t.workYourLeads}</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>{t.workLeadsSubtitle}</p></div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:YELLOW, fontWeight:900, fontSize:24, lineHeight:1 }}>{sessionTotal}</div><div style={{ color:GRAY400, fontSize:10, marginTop:3 }}>{t.thisSession}</div></div>
            <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:GREEN, fontWeight:900, fontSize:24, lineHeight:1 }}>{totalJobs}</div><div style={{ color:GREEN, fontSize:10, marginTop:3 }}>{t.jobsBooked}</div></div>
          </div>
        </div>
        <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(255,255,255,0.08)", borderRadius:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:WHITE, fontSize:13, fontWeight:600 }}>{t.logBookedJob}</span>
          <input type="number" min="1" value={jobsInput} onChange={e=>setJobsInput(e.target.value)} placeholder={t.numJobs} style={{ width:90, border:"2px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"7px 10px", fontSize:15, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", background:WHITE }}/>
          <Btn onClick={() => { const n=parseInt(jobsInput); if(n>0){setTotalJobs(j=>j+n);setJobsInput("");} }} disabled={!jobsInput||parseInt(jobsInput)<1} style={{ fontSize:13 }}>{t.addJobs}</Btn>        </div>
        <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10 }}><p style={{ color:WHITE, fontSize:13, margin:0 }}>{t.timeKillsDeals}</p></div>
      </Card>
      {!active && (
        <Card>
          <h3 style={{ color:NAVY, fontSize:17, fontWeight:800, margin:"0 0 6px" }}>{t.whatEngagement}</h3>
          <p style={{ color:GRAY600, fontSize:13, margin:"0 0 20px" }}>{t.tapForSteps}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {LEAD_TYPES.map(lt => (
              <button key={lt.id} onClick={() => { setActive(lt.id); setSubtype(null); }} style={{ background:lt.color, border:"2px solid "+lt.border, borderRadius:14, padding:"18px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:32 }}>{lt.emoji}</span>
                <span style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{lt.label}</span>
                {sessionCounts[lt.id]>0 && <span style={{ fontSize:11, color:GRAY600, fontWeight:600 }}>{sessionCounts[lt.id]} {t.thisSession}</span>}
              </button>
            ))}
          </div>
        </Card>
      )}
      {activeLead && activeLead.simple && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          {activeLead.steps.map((step,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontWeight:700, color:NAVY, fontSize:14, paddingTop:2 }}>{step.label}</div>
              </div>
              {step.note ? <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:NAVY }}>{lang==="es"?"Usa el libro de jugadas de ":"Use the "}<strong>{lang==="es"?"Mensaje Directo":"Direct Message"}</strong>{lang==="es"?" una vez que respondan.":" playbook once they respond."}</div> : <ScriptBox text={step.script} idx={i}/>}
            </div>
          ))}
          {activeLead.id==="like" ? (
            <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16 }}>
              <p style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"0 0 12px" }}>{t.howManyDMs}</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <input type="number" min="1" value={likeCount} onChange={e=>setLikeCount(Math.max(1,parseInt(e.target.value)||1))} style={{ width:90, border:"2px solid "+NAVY, borderRadius:10, padding:"10px 14px", fontSize:22, fontWeight:800, color:NAVY, outline:"none", textAlign:"center", fontFamily:"inherit", background:WHITE }}/>
                <Btn variant="success" onClick={() => { logLead(activeLead.id,likeCount); reset(); }}>{t.logDMs(likeCount)}</Btn>
              </div>
              <Btn variant="ghost" onClick={reset}>{t.back}</Btn>
            </div>
          ) : (
            <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
              <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>{t.markAsWorked}</Btn>
              <Btn variant="ghost" onClick={reset}>{t.back}</Btn>
            </div>
          )}
        </Card>
      )}
      {activeLead && !activeLead.simple && !subtype && (
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          <p style={{ color:GRAY600, fontSize:13, margin:"0 0 16px" }}>{t.whatDidTheySay}</p>
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
            <button onClick={() => setSubtype(null)} style={{ background:GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <div><div style={{ fontWeight:800, color:NAVY, fontSize:15 }}>{activeLead.label}</div><div style={{ fontSize:12, color:GRAY600 }}>{activeSubtype.label}</div></div>
          </div>
          {activeLead.id==="comment" && (
            <div>
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{lang==="es"?"1. Responde públicamente":"1. Reply publicly"}</div>
              {activeSubtype.publicReplies.map((r,i) => <ScriptBox key={i} text={r} idx={i}/>)}
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, margin:"16px 0 8px" }}>{lang==="es"?"2. Luego envía DM inmediatamente":"2. Then immediately DM"}</div>
              <ScriptBox text={activeSubtype.dmScript} idx={99}/>
            </div>
          )}
          {activeLead.id==="dm" && (
            <div>
              <div style={{ fontWeight:700, color:NAVY, fontSize:14, marginBottom:8 }}>{lang==="es"?"1. Responde dentro de 24 horas":"1. Reply within 24 hours"}</div>
              <ScriptBox text={activeSubtype.dmScript} idx={0}/>
            </div>
          )}
          <div style={{ borderTop:"1px solid "+GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
            <Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>{t.markAsWorked}</Btn>
            <Btn variant="ghost" onClick={() => setSubtype(null)}>{t.differentResponse}</Btn>
          </div>
        </Card>
      )}
      {sessionTotal>0 && !active && (
        <Card>
          <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>{lang==="es"?"Esta Sesión":"This Session"}</h3>
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
            <p style={{ color:YELLOW, fontWeight:700, margin:"0 0 4px", fontSize:14 }}>{t.everyPathLeads}</p>
            <p style={{ color:WHITE, fontSize:13, margin:0 }}>{t.keepGoing}</p>
          </div>
        </Card>
      )}
      {!active && (
        <Card style={{ background:"linear-gradient(135deg,#002942,#003a5c)", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
          <h3 style={{ color:YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>{t.keepMomentum}</h3>
          <p style={{ color:GRAY400, fontSize:13, lineHeight:1.7, margin:"0 0 20px" }}>{t.keepMomentumDesc}</p>
          <div style={{ display:"flex", gap:12, justifyContent:"space-between" }}>
            <Btn variant="ghost" onClick={onBack} style={{ background:"rgba(255,255,255,0.1)", color:WHITE }}>{t.back}</Btn>
            <Btn onClick={onAmplify}>{t.goToAmplify}</Btn>
          </div>
        </Card>
      )}
    </>
  );
}

// ── Amplify ───────────────────────────────────────────────────────────────────
function AmplifyScreen({ onBack, city, lang, onMarkStarted }) {
  const t = T[lang];
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extra, setExtra] = useState(0);
  useEffect(() => {
    if (onMarkStarted) onMarkStarted();
    findFacebookGroups(city||"Your City",10).then(r=>{setGroups(r);setLoading(false);}).catch(()=>setLoading(false));
  }, [city]);
  return (
    <>
      <Card style={{ background:NAVY }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div><h2 style={{ color:YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>{t.amplifyTitle}</h2><p style={{ color:GRAY400, fontSize:13, margin:0 }}>{t.amplifySubtitle}</p></div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 20px", textAlign:"center" }}>
            <div style={{ color:YELLOW, fontWeight:900, fontSize:32, lineHeight:1 }}>{10+extra}</div>
            <div style={{ color:GRAY400, fontSize:11, marginTop:4 }}>{t.totalGroupsPosted}</div>
          </div>
        </div>
      </Card>
      <Card><Btn variant="success" onClick={() => setExtra(n=>n+1)}>{t.postedInGroup}</Btn></Card>
      <Card>
        <h3 style={{ color:NAVY, fontSize:16, fontWeight:800, margin:"0 0 16px" }}>{t.moreGroupsNearYou}</h3>
        {loading && <p style={{ color:GRAY600, fontSize:14 }}>{t.findingGroupsNear} {city}...</p>}
        {!loading && groups.length>0 && <GroupTable groups={groups} t={t}/>}
      </Card>
      <div style={{ marginTop:8 }}><Btn variant="ghost" onClick={onBack}>← {t.back}</Btn></div>
    </>
  );
}

// ── Coach Dashboard ───────────────────────────────────────────────────────────
function CoachDashboard({ onClose, lang }) {
  const t = T[lang];
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
          <div><div style={{ color:WHITE, fontWeight:800, fontSize:16 }}>{t.coachDashboardTitle}</div><div style={{ color:YELLOW, fontSize:12, fontWeight:600 }}>{subs.length} {t.submissions}</div></div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={load} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.refresh}</button>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.back}</button>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 16px 60px" }}>
        {loading && <Card><p style={{ textAlign:"center", color:GRAY600, padding:40 }}>{t.loading}</p></Card>}
        {!loading && subs.length===0 && <Card><div style={{ textAlign:"center", padding:20 }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><p style={{ color:GRAY600 }}>{t.noSubmissions}</p></div></Card>}
        {!loading && subs.map((s,i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontWeight:800, color:NAVY, fontSize:17 }}>{s.name||"Unknown"}</div>
                <div style={{ fontSize:13, color:GRAY600, marginTop:2 }}>{s.business} — {s.city}</div>
                <div style={{ fontSize:12, color:GRAY400, marginTop:4 }}>{s.timestamp?new Date(s.timestamp).toLocaleString():"—"}</div>
              </div>
              <span style={{ background:"#DBEAFE", color:"#1D4ED8", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.status||t.postGenerated}</span>
            </div>
            <button onClick={() => setExpanded(expanded===i?null:i)} style={{ marginTop:14, background:GRAY50, border:"1px solid "+GRAY200, borderRadius:8, padding:"6px 14px", fontSize:12, color:NAVY, fontWeight:600, cursor:"pointer" }}>{expanded===i?t.hideDetails:t.viewDetails}</button>
            {expanded===i && s.post && <div style={{ marginTop:16 }}><div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:8 }}>{t.generatedPost}</div><div style={{ background:GRAY50, border:"1px solid "+GRAY200, borderRadius:10, padding:16, fontSize:13, color:GRAY800, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.post}</div></div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Celebration ───────────────────────────────────────────────────────────────
function CelebrationScreen({ onNext, onBack, lang }) {
  const t = T[lang];
  const [msg] = useState(() => t.celebMsgs[Math.floor(Math.random()*t.celebMsgs.length)]);
  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#002942,#003a5c)", borderRadius:20, padding:"40px 32px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:16, lineHeight:1 }}>🎯</div>
        <h1 style={{ color:YELLOW, fontSize:28, fontWeight:900, margin:"0 0 12px" }}>{msg.h}</h1>
        <p style={{ color:WHITE, fontSize:18, margin:0, fontWeight:600 }}>{msg.s}</p>
      </div>
      <Card>
        <h3 style={{ color:NAVY, fontSize:17, fontWeight:800, margin:"0 0 16px" }}>{t.hereIsWhatYouDid}</h3>
        {t.celebItems.map((item,i) => (
          <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:GRAY50, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
            <span style={{ fontSize:24, flexShrink:0 }}>{item.emoji}</span>
            <div><div style={{ fontWeight:800, color:NAVY, fontSize:14, marginBottom:3 }}>{item.title}</div><div style={{ fontSize:13, color:GRAY600, lineHeight:1.5 }}>{item.desc}</div></div>
          </div>
        ))}
        <div style={{ background:NAVY, borderRadius:14, padding:20, marginBottom:24, marginTop:8 }}>
          <p style={{ color:YELLOW, fontWeight:900, fontSize:15, margin:"0 0 8px" }}>{t.celebQuote}</p>
          <p style={{ color:WHITE, fontSize:14, margin:0, lineHeight:1.8 }}>{t.celebQuote2}</p>
        </div>
        <CardNav onBack={onBack} onNext={onNext} nextLabel={t.next} t={t}/>
      </Card>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const isDev = typeof window !== "undefined" && window.location.search.indexOf("dev=true") !== -1;

  // Load persisted state on mount
  const persisted = loadFromStorage();

  const [lang, setLang]                   = useState(persisted?.lang || "en");
  const [appPhase, setAppPhase]           = useState(persisted?.appPhase || "lane");
  const [answers, setAnswers]             = useState(persisted?.answers || {});
  const [post, setPost]                   = useState(persisted?.post || "");
  const [postEn, setPostEn]               = useState(persisted?.postEn || "");
  const [postLoading, setPostLoading]     = useState(false);
  const [postError, setPostError]         = useState("");
  const [groups5, setGroups5]             = useState([]);
  const [groups20, setGroups20]           = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError]     = useState("");
  const [manualCity, setManualCity]       = useState(persisted?.manualCity || "");
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showDashboard, setShowDashboard]   = useState(false);
  const [passcodeInput, setPasscodeInput]   = useState("");
  const [passcodeError, setPasscodeError]   = useState(false);
  const [completedSections, setCompletedSections] = useState(persisted?.completedSections || []);
  const [leadsLog, setLeadsLog]                   = useState(persisted?.leadsLog || []);
  const [totalJobs, setTotalJobs]                 = useState(persisted?.totalJobs || 0);
  const [saveFlash, setSaveFlash]           = useState(false);
  const [saveToast, setSaveToast]           = useState(false);
  const topRef = useRef(null);

  const t = T[lang];
  const showSidebar = !NO_NAV_PHASES.includes(appPhase);

  // Auto-save to localStorage whenever key state changes
  useEffect(() => {
    saveToStorage({ lang, appPhase, answers, post, postEn, manualCity, completedSections, leadsLog, totalJobs });
  }, [lang, appPhase, answers, post, postEn, manualCity, completedSections, leadsLog, totalJobs]);

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior:"smooth" }); }, [appPhase]);

  const city = answers.area ? answers.area.split(/[,—]/)[0].replace(/[^a-zA-Z\s]/g,"").trim() : manualCity.trim() || "Your City";

  useEffect(() => {
    if (appPhase==="groups" && groups5.length===0 && !groupsLoading) {
      setGroupsLoading(true); setGroupsError("");
      findFacebookGroups(city,5).then(r=>{setGroups5(r);setGroupsLoading(false);}).catch(()=>{setGroupsLoading(false);setGroupsError(t.searchFailed);});
    }    if (appPhase==="replicate" && groups20.length===0 && !groupsLoading) {
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
      const rec = { name, business:data.business||"", city:(data.area||manualCity||"").split(/[,—]/)[0].replace(/[^a-zA-Z\s]/g,"").trim(), answers:data, post:gp!==undefined?gp:(prev.post||""), status:status||prev.status||t.postGenerated, postGenerated:true, timestamp:prev.timestamp||Date.now(), updatedAt:Date.now() };
      await window.storage.set(key, JSON.stringify(rec), true);
    } catch(e) {}
  }

  async function handleGeneratePost(ans) {
    const a = ans||answers;
    setPostLoading(true); setPostError("");
    setPostEn("");
    try {
      const g = await generateAIPost(a, lang);
      const c = g.replace(/\u2014/g,",").replace(/--/g,",").trim();
      if (!c||c.length<50) throw new Error("empty");
      setPost(c);
      setCompletedSections(p => p.includes("write")?p:[...p,"write"]);
      await saveSubmission(a, c, t.postGenerated);
      // If Spanish, silently generate English translation in the background
      if (lang === "es") {
        callClaude([{ role:"user", content:"Translate the following Facebook post from Spanish to English. Keep the same tone, structure, and line breaks. Output only the translated post, no labels or explanation.\n\n"+c }])
          .then(translated => { if (translated && translated.length > 50) setPostEn(translated.trim()); })
          .catch(() => {});
      }
    } catch(e) { setPostError(t.couldNotGenerate); }
    setPostLoading(false);
  }

  function handleSaveExit() {
    saveToStorage({ lang, appPhase, answers, post, postEn, manualCity, completedSections, leadsLog, totalJobs });
    setSaveFlash(true);
    setSaveToast(true);
    setTimeout(() => setSaveFlash(false), 2000);
    setTimeout(() => setSaveToast(false), 4000);
  }

  const ALL_QUESTIONS = lang === "es" ? QUESTIONS_ES : QUESTIONS_EN;
  const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");
  const allCh3Met = ch3Qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const answeredN = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  const AUDIT_ITEMS = lang === "es" ? AUDIT_ITEMS_ES : AUDIT_ITEMS_EN;

  return (
    <div style={{ minHeight:"100vh", background:GRAY100, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)} lang={lang}/>}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:NAVY, fontSize:18, fontWeight:800, margin:"0 0 16px", textAlign:"center" }}>{t.coachAccess}</h3>
            <input type="password" value={passcodeInput} onChange={e=>{setPasscodeInput(e.target.value);setPasscodeError(false);}}
              onKeyDown={e=>{if(e.key==="Enter"){if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true);}}}
              placeholder={t.enterPasscode} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?RED:GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }}/>
            {passcodeError && <p style={{ color:RED, fontSize:12, margin:"0 0 8px" }}>{t.incorrectPasscode}</p>}
            <Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true); }}>{t.enterDashboard}</Btn>
            <button onClick={() => { setShowCoachLogin(false);setPasscodeInput("");setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:GRAY400, fontSize:13, cursor:"pointer", padding:"4px 0" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:NAVY, color:WHITE, borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:600, zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", gap:10, whiteSpace:"nowrap" }}>
          <span style={{ fontSize:18 }}>✅</span> {t.saveExitToast}
        </div>
      )}

      {/* Header */}
      <div style={{ background:NAVY, padding:"0 16px", height:HEADER_H, display:"flex", alignItems:"center", justifyContent:"space-between", position:"fixed", top:0, left:0, right:0, zIndex:160, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:YELLOW, borderRadius:10, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:NAVY, fontSize:16 }}>H</div>
          <div>
            <div style={{ color:WHITE, fontWeight:800, fontSize:14, lineHeight:1 }}>{t.appTitle}</div>
            <div style={{ color:YELLOW, fontSize:11, fontWeight:600 }}>{t.appSubtitle}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Language toggle */}
          <div style={{ display:"inline-flex", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, overflow:"hidden" }}>
            {["en","es"].map(l => <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?YELLOW:"transparent", color:lang===l?NAVY:WHITE, border:"none", padding:"5px 12px", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{l==="en"?"EN":"ES"}</button>)}
          </div>
          {/* Save & Exit button */}
          {appPhase !== "lane" && (
            <button onClick={handleSaveExit}
              style={{ background:saveFlash?GREEN:"rgba(255,255,255,0.1)", border:"1px solid "+(saveFlash?"transparent":"rgba(255,255,255,0.25)"), borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.3s", display:"flex", alignItems:"center", gap:5 }}>
              {saveFlash ? <>✓ {t.saved}</> : t.saveExit}
            </button>
          )}
          {appPhase==="lane" && <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.coachDashboard}</button>}
          {appPhase!=="lane" && <button onClick={() => { saveToStorage({ lang, appPhase, answers, post, manualCity, completedSections }); setAppPhase("lane"); }} style={{ background:YELLOW, border:"none", borderRadius:8, padding:"7px 16px", color:NAVY, fontSize:12, fontWeight:800, cursor:"pointer" }}>{t.home}</button>}
        </div>
      </div>

      <SidebarNav current={appPhase} onNavigate={setAppPhase} completedSections={completedSections} lang={lang}/>

      <div style={{ paddingTop:HEADER_H, marginLeft:showSidebar?SIDEBAR_W:0, transition:"margin-left 0.2s ease", minHeight:"calc(100vh - "+HEADER_H+"px)" }}>
        <div ref={topRef} style={{ maxWidth:680, margin:"0 auto", padding:"28px 16px 60px" }}>

          {/* HOME */}
          {appPhase==="lane" && (
            <div>
              <div style={{ background:NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
                <h1 style={{ color:WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>{t.heroHeadline}<br/><span style={{ color:YELLOW }}>{t.heroHighlight}</span></h1>
                <p style={{ color:GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px" }}>{t.heroDesc}</p>
                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                  {t.totalStats.map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:WHITE }}>{s}</div>)}
                </div>
              </div>
              <button onClick={() => { if(answeredN===0) setAppPhase("ch1"); else if(!post) setAppPhase("getpost"); else setAppPhase("replicate"); }}
                style={{ width:"100%", background:YELLOW, border:"none", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:24, boxShadow:"0 4px 20px rgba(254,183,5,0.35)" }}>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:NAVY, opacity:0.6, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.05em" }}>{t.continueWhere}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:NAVY }}>{answeredN===0?t.startWriting:!post?t.generatePost:t.crossPost}</div>
                </div>
                <div style={{ background:NAVY, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </button>

              <h3 style={{ color:NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>{t.week1Checklist}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {[
                  {
                    phase:"ch1", icon:"✍️", bg:NAVY,
                    title:t.writePost, desc:t.writePostDesc, time:t.writePostTime,
                    progress:t.answersOf(answeredN, ALL_QUESTIONS.length),
                    status: answeredN===0
                      ? {l:t.notStarted, bg:GRAY100, fg:GRAY400}
                      : answeredN < ALL_QUESTIONS.length
                        ? {l:t.inProgress, bg:"#FEF9EC", fg:"#92400E"}
                        : {l:t.done, bg:"#D1FAE5", fg:"#065F46"},
                  },
                  {
                    phase:"groups", icon:"📣", bg:NAVY_LIGHT,
                    title:t.postInGroups, desc:t.postInGroupsDesc, time:t.postInGroupsTime,
                    progress: lang==="es"?"10 publicaciones en grupos":"10 group posts",
                    status: completedSections.includes("grouppost")
                      ? {l:t.done, bg:"#D1FAE5", fg:"#065F46"}
                      : post
                        ? {l:t.inProgress, bg:"#FEF9EC", fg:"#92400E"}
                        : {l:t.notStarted, bg:GRAY100, fg:GRAY400},
                  },
                  {
                    phase:"leads", icon:"🔥", bg:"#065F46",
                    title:t.workLeads, desc:t.workLeadsDesc, time:t.workLeadsTime,
                    progress: leadsLog.length > 0
                      ? (lang==="es" ? leadsLog.length+" prospectos trabajados" : leadsLog.length+" leads worked")
                      : (lang==="es"?"Guiones para cada tipo":"Scripts for every type"),
                    status: totalJobs > 0
                      ? {l:t.done, bg:"#D1FAE5", fg:"#065F46"}
                      : completedSections.includes("leads")
                        ? {l:t.inProgress, bg:"#FEF9EC", fg:"#92400E"}
                        : {l:t.notStarted, bg:GRAY100, fg:GRAY400},
                  },
                  {
                    phase:"amplify", icon:"📡", bg:"#4F46E5",
                    title:t.amplify, desc:t.amplifyDesc, time:t.amplifyTime,
                    progress: lang==="es"?"Llega más lejos":"Cast a wider net",
                    status: completedSections.includes("amplify")
                      ? {l:t.done, bg:"#D1FAE5", fg:"#065F46"}
                      : {l:t.notStarted, bg:GRAY100, fg:GRAY400},
                  },
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
              {isDev && <DevShortcuts setAnswers={setAnswers} setPost={setPost} setAppPhase={setAppPhase} t={t}/>}
            </div>
          )}

          {appPhase==="voice" && <VoiceMode onComplete={va => { setAnswers(va); setAppPhase("groups"); handleGeneratePost(va); }} lang={lang}/>}

          {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3") && (
            <TypeMode onComplete={va => { setAnswers(va); setAppPhase("groups"); }} savedAnswers={answers} onAnswerChange={(id,val) => setAnswers(prev => ({...prev,[id]:val}))} lang={lang} onSwitchToVoice={() => setAppPhase("voice")}/>
          )}

          {appPhase==="groups" && (
            <Card>
              <SectionHeader emoji="🧭" title={t.step1Join} subtitle={t.step1Subtitle}/>
              {!answers.area && !manualCity && (
                <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
                  <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:600, color:NAVY }}>{t.cityLabel}</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={manualCity} onChange={e=>setManualCity(e.target.value)} placeholder={t.cityPlaceholder} style={{ flex:1, border:"2px solid "+GRAY200, borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", fontFamily:"inherit" }}/>
                    <button onClick={() => { setGroups5([]); setGroupsError(""); setGroupsLoading(true); findFacebookGroups(manualCity||"Nashville",5).then(r=>{setGroups5(r);setGroupsLoading(false);}).catch(()=>setGroupsLoading(false)); }} style={{ background:NAVY, color:YELLOW, border:"none", borderRadius:8, padding:"8px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>{t.searchGroups}</button>
                  </div>
                </div>
              )}
              {groupsLoading && <div style={{ textAlign:"center", padding:32 }}><p style={{ color:GRAY600 }}>{t.findingGroups} {city}...</p></div>}
              {groupsError && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:RED, fontSize:13 }}>{groupsError}</div>}
              {!groupsLoading && groups5.length>0 && (
                <>
                  <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:NAVY, lineHeight:1.6 }}>{t.groupsNote}</div>
                  <GroupTable groups={groups5} t={t}/>
                </>
              )}
              <CardNav onBack={() => setAppPhase("lane")} onNext={() => setAppPhase("getpost")} t={t}/>
            </Card>
          )}

          {appPhase==="getpost" && <GetPost allCh3Met={allCh3Met} post={post} postEn={postEn} postLoading={postLoading} postError={postError} answers={answers} onGenerate={handleGeneratePost} onSetPost={setPost} onNext={() => setAppPhase("photo")} onBack={() => setAppPhase("groups")} onWritePost={() => setAppPhase("ch1")} lang={lang}/>}

          {appPhase==="photo" && <PhotoStep answers={answers} onBack={() => setAppPhase("getpost")} onNext={() => setAppPhase("dopost")} lang={lang}/>}

          {appPhase==="dopost" && (
            <Card>
              <SectionHeader emoji="🚀" title={t.step4Post} subtitle={t.step4Subtitle}/>
              <div style={{ background:"#FEF2F2", border:"1.5px solid "+RED, borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
                <div>
                  <p style={{ fontWeight:800, color:"#991B1B", fontSize:14, margin:"0 0 4px" }}>{t.personalWarning}</p>
                  <p style={{ fontSize:13, color:"#991B1B", margin:0, lineHeight:1.6 }}>{t.personalWarningDesc}</p>
                </div>
              </div>
              {t.postSteps.map((s,i) => (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:18, alignItems:"flex-start" }}>
                  <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, flexShrink:0 }}>{i+1}</div>
                  <p style={{ margin:0, fontSize:15, color:GRAY800, paddingTop:7, lineHeight:1.6 }}>{s}</p>
                </div>
              ))}
              <CardNav onBack={() => setAppPhase("photo")} onNext={() => setAppPhase("approval")} t={t}/>
            </Card>
          )}

          {appPhase==="approval" && (
            <Card>
              <SectionHeader emoji="📋" title={t.step5Approval}/>
              <div style={{ background:"#EFF6FF", borderRadius:12, padding:20, marginBottom:24, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:10 }}>👋</div>
                <p style={{ color:NAVY, fontWeight:700, fontSize:15, margin:"0 0 8px" }}>{t.postIsLive}</p>
                <p style={{ color:GRAY600, fontSize:14, lineHeight:1.7, margin:0 }}>{t.readyForAudit}</p>
              </div>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontWeight:800, color:NAVY, fontSize:15, marginBottom:4 }}>{t.coachAudit}</div>
                <p style={{ fontSize:13, color:GRAY600, margin:"0 0 16px" }}>{t.tapToSeeWhy}</p>
                {AUDIT_ITEMS.map((item,i) => <AuditRow key={i} item={item} t={t}/>)}
              </div>
              <CardNav onBack={() => setAppPhase("dopost")} onNext={() => { saveSubmission(answers,post,t.coachApproved); setAppPhase("replicate"); }} t={t}/>
            </Card>
          )}

          {appPhase==="replicate" && (
            <Card>
              <SectionHeader emoji="🔁" title={t.step6CrossPost} subtitle={t.step6Subtitle}/>
              <div style={{ background:GRAY50, borderRadius:12, padding:16, marginBottom:24 }}>
                {t.crossPostSteps.map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ background:YELLOW, color:NAVY, borderRadius:99, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <p style={{ margin:0, fontSize:13, color:GRAY800, lineHeight:1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              {groupsLoading && <p style={{ color:GRAY600, fontSize:14, textAlign:"center" }}>{t.loadingGroupSuggestions}</p>}
              {!groupsLoading && groups20.length>0 && <div style={{ marginBottom:20 }}><GroupTable groups={groups20} t={t}/></div>}
              <CardNav onBack={() => setAppPhase("approval")} onNext={() => { setCompletedSections(p=>p.includes("grouppost")?p:[...p,"grouppost"]); saveSubmission(answers,post,lang==="es"?"10 Grupos Completados":"10 Groups Done"); setAppPhase("celebrate"); }} nextLabel={t.next} t={t}/>
            </Card>
          )}

          {appPhase==="celebrate" && <CelebrationScreen onNext={() => setAppPhase("leads")} onBack={() => setAppPhase("replicate")} lang={lang}/>}
          {appPhase==="leads"     && <LeadEngagement onBack={() => setAppPhase("celebrate")} onAmplify={() => setAppPhase("amplify")} lang={lang} leadsLog={leadsLog} setLeadsLog={setLeadsLog} totalJobs={totalJobs} setTotalJobs={setTotalJobs} onMarkStarted={() => setCompletedSections(p=>p.includes("leads")?p:[...p,"leads"])}/>}
          {appPhase==="amplify"   && <AmplifyScreen onBack={() => setAppPhase("leads")} city={city} lang={lang} onMarkStarted={() => setCompletedSections(p=>p.includes("amplify")?p:[...p,"amplify"])}/>}

        </div>
      </div>
    </div>
  );
}