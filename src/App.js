import { useState, useEffect, useRef, createContext, useContext } from "react";

const W1_NAVY = "#002942";
const W1_NAVY_LIGHT = "#003a5c";
const W1_YELLOW = "#FEB705";
const W1_WHITE = "#FFFFFF";
const W1_GRAY50 = "#F8FAFC";
const W1_GRAY100 = "#F1F5F9";
const W1_GRAY200 = "#E2E8F0";
const W1_GRAY300 = "#CBD5E1";
const W1_GRAY400 = "#94A3B8";
const W1_GRAY600 = "#475569";
const W1_GRAY800 = "#1E293B";
const W1_GREEN = "#10B981";
const W1_RED = "#EF4444";
const COACH_PASSCODE = "coach123";
const W1_SIDEBAR_W = 220;
const W1_HEADER_H = 56;
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
    appSubtitle: "Week 1: Facebook Groups Organic Strategy",
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
    totalStats: ["🎯 10 group posts","💬 Real leads, real jobs"],
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
    step5Approval: "Step 8 — Coach Approval",
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
    logDMs: (n) => "Log "+n+" DM"+(n!==1?"s":"")+",",
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
    answersOf: (a,t) => a+" of "+t+" answered",
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
    allWeeks: "← All Weeks",
  },
  es: {
    appTitle: "Fundamentos de Coaching de Negocios",
    appSubtitle: "Semana 1: Estrategia Orgánica de Grupos de Facebook",
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
    totalStats: ["🎯 10 publicaciones en grupos","💬 Prospectos reales, trabajos reales"],
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
    step5Approval: "Paso 8 — Aprobación del Coach",
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
    logDMs: (n) => "Registrar "+n+" DM"+(n!==1?"s":"")+",",
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
    answersOf: (a,t) => a+" de "+t+" respondidas",
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
    allWeeks: "← Todas las Semanas",
  }
};

// ── Translated Questions ──────────────────────────────────────────────────────
const QUESTIONS_EN = [
  { id:"name",        num:1,  chapter:"ch1", minWords:2,  validate:"name",       label:"Your Name",              question:"What's your first and last name?",                                                                                                 hint:"Write it exactly how you want it shown publicly.",                                                                                                                         examples:["Daniel Reyes","Taryn Sinnen"],                                                                                                   voiceQ:"What is your first and last name?",                                    placeholder:"e.g. Daniel Reyes" },
  { id:"business",    num:2,  chapter:"ch1", minWords:1,  validate:"business",   label:"Business Name",          question:"What's your business name as it appears online?",                                                                               hint:"Use the exact spelling and spacing people would see on Google or Facebook.",                                                                                                examples:["Reyes Heating and Air","Zach's Mobile Repair"],                                                                                  voiceQ:"What is your business name exactly as it appears on Google or Facebook?", placeholder:"e.g. Reyes Heating and Air" },
  { id:"area",        num:3,  chapter:"ch1", minWords:6,  validate:"area",       label:"Service Area",           question:"What's your service area, and how long have you been serving it?",              hint:"List your main city plus nearby areas. Then add how long you've served there. If less than 1 year, add one short line on why you chose this area.",                                                              examples:["Nashville, Donelson, Mt. Juliet, TN. 14 years.","Mesa, Gilbert, Chandler, AZ. 8 years.","New to the area, but my kids go to school here and we're building our life here."],                                                                  voiceQ:"What is your service area and how long have you been serving it?", placeholder:"e.g. Nashville, Donelson, Mt. Juliet. 14 years." },
  { id:"fear",        num:4,  chapter:"ch1", minWords:12, validate:"fear",       label:"Customer Fear You Fix",  question:"Homeowners' biggest fears when hiring a contractor are getting overcharged, being left with a mess, or lack of communication. Pick the one fear you work hardest to prevent — then tell us the one thing you do on every job to make sure it never happens.",  hint:"Pick ONE fear, then give ONE habit you do every job. Keep it simple and real.",                                                                                                                      examples:["Lack of communication. I use Housecall Pro's on my way text with the tech photo and name, then I send a quick update if anything changes so nobody is left wondering.","Getting overcharged. I show options and prices before I start, I get approval in writing, and the final invoice always matches what we agreed to.","Being left with a mess. I wear shoe covers, use drop cloths, and I do a final walk-through so the customer sees the home is cleaner than we found it."],        voiceQ:"Which homeowner fear do you focus on overcoming, and what is one specific thing you do every job?", placeholder:"e.g. Lack of communication. I send a quick update any time something changes.", fearChips:["Getting overcharged","Being left with a mess","Lack of communication"] },
  { id:"humanDetail", num:5,  chapter:"ch2", minWords:6,  label:"Real Life Detail",              question:"Outside of work, what's one thing about your life that a neighbor could connect with — a hobby, family moment, weekend routine, or something you're weirdly into?",                                                           hint:"The more specific the better. A name, a place, a number — something that makes it feel real.",                                              examples:["Most Saturdays I'm on the sidelines at 10U softball with a cooler and way too much sunscreen, cheering like it's the World Series.","I'm restoring a 1991 candy-green Chevy with my son, and we're slowly learning that \"one quick fix\" is always a lie.","I'm training for a half marathon, so if you see me jogging before sunrise, just know I'm working off my weekend donut habit."],  voiceQ:"Tell me one specific real life detail about you that neighbors would relate to.", placeholder:"e.g. Most Saturdays I'm on the sidelines at 10U softball with a cooler and way too much sunscreen." },
  { id:"localFlavor", num:6,  chapter:"ch2", minWords:8,  validate:"localFlavor",label:"Local Place You Love",   question:"What's one specific local place you love, and what do you do there or always get there?",                                        hint:"This can be a park, trail, farmers market, school event, gym, church, festival, coffee shop, bakery, or restaurant. Use the real name.",                                   examples:["Shelby Bottoms Greenway, we ride bikes to the overlook, then reward ourselves with ice cream on the way back.","The Saturday farmers market downtown, I grab apple cider donuts first, then I actually shop like an adult.","East High Friday night football, home side, kickoff to final whistle, no excuses.","Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets."], voiceQ:"What is one specific local place you genuinely love? Give me the real name and what you always do there.", placeholder:"e.g. Five Daughters Bakery, maple bacon donut and coffee, every time, no regrets." },
  { id:"mission",     num:7,  chapter:"ch2", minWords:1,  label:"Mission Fill-in",               question:"Fill in the blank with the specific thing you want locals to recommend — \"I'm on a mission to find the best ________. Any suggestions?\"",    hint:"Choose something people have strong opinions on. Keep it short.",                                                                                                           examples:["tacos","pizza","breakfast spot","coffee","donuts","BBQ","burgers","wings"],                                                                                             voiceQ:"Fill in this blank: I am on a mission to find the best blank in my city. What is it?", placeholder:"e.g. tacos", missionChips:["donuts","pizza","breakfast spot","coffee","tacos","BBQ"] },
  { id:"whyStarted",  num:8,  chapter:"ch3", minWords:12, label:"Why You Started",               question:"What's the real moment that pushed you to start your own business?",                                                                             hint:"Tell it like you'd tell a friend. Include what you felt in that moment.",                                                                                                   examples:["I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a bigger job the homeowner didn't need. I drove home thinking, I can't build a life doing this.","I missed one too many dinners and my kid asked if I was \"working again.\" That one question hit me harder than anything, and I decided to build a business that let me show up at home and still take care of people.","I watched homeowners get talked down to and left in the dark, and it bothered me more than I can explain. I wanted to run a business where customers feel respected, informed, and in control."], voiceQ:"Tell me the real moment that pushed you to start your own business.", placeholder:"e.g. I remember sitting in my truck after a call feeling sick, because my old company wanted me to push a job the homeowner did not need." },
  { id:"whatChanged", num:9,  chapter:"ch3", minWords:10, label:"What Changed After",             question:"After you started your business, what's one real-life thing you can do now that you couldn't before?",                                           hint:"Make it something a neighbor can picture in one sentence.",                                                                                                                examples:["I'm home to eat dinner with my family instead of coming in after everyone's asleep.","I can coach my kid's team on weeknights, and I don't miss games anymore.","I can finally take Sundays off, and we do pancakes and church without me being on my phone.","I'm not being pushed to upsell people, and I sleep better knowing I'm doing things the right way."], voiceQ:"After starting your own business, what is one real thing you can do now that you could not before?", placeholder:"e.g. I'm home to eat dinner with my family instead of coming in after everyone's asleep." },
  { id:"heroMoment",  num:10, chapter:"ch3", minWords:25, validate:"hero",       label:"Hero Moment",            question:"Tell one \"Hero Moment\" story where you helped a customer. What was happening, what did you do, and what did they say or do after?", hint:"Tell it like a short scene. Include one detail you remember so it feels real.",                                                                                         examples:["A single mom had no AC during a heat wave and thought she needed a full replacement. I found it was a capacitor, showed her the price before I touched anything, fixed it fast, and she just exhaled and said, \"Thank you for not scaring me.\"","An older homeowner smelled gas and was scared to stay inside. I shut everything down, found the leak, made it safe, and he kept repeating, \"Nobody's ever explained it to me like that.\"","A customer was told they needed a new system, but it was a simple part I had on the truck. When it turned back on, they laughed, then admitted they were five minutes away from tears before I showed up."], voiceQ:"Tell me one Hero Moment story — a time you went above and beyond for a customer.", placeholder:"What was happening...\nWhat did you do...\nWhat did they say or do after..." },
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
  { id:"write",     label_en:"Write Post",     label_es:"Escribir",   icon:"✍️", phases:["ch1","ch2","ch3"], noSubs:true },
  { id:"grouppost", label_en:"Post in Groups", label_es:"En Grupos",  icon:"📣", phases:["dopost","approval","replicate"] },
  { id:"leads",     label_en:"Work Leads",     label_es:"Prospectos", icon:"🔥", phases:["leads"], noSubs:true },
  { id:"amplify",   label_en:"Amplify",        label_es:"Amplificar", icon:"📡", phases:["amplify"], noSubs:true },
  { id:"tracker",   label_en:"Accountability Tracker", label_es:"Rastreador", icon:"📊", phases:["tracker"], comingSoon:false, noSubs:true },
];

const PHASE_LABELS_EN = {
  ch1:"Chapter 1", ch2:"Chapter 2", ch3:"Chapter 3",
  dopost:"1. Post It",
  approval:"2. Coach Approval", replicate:"3. Cross-Post",
  leads:"Work Leads", amplify:"Amplify",
};

const PHASE_LABELS_ES = {
  ch1:"Capítulo 1", ch2:"Capítulo 2", ch3:"Capítulo 3",
  dopost:"1. Publicarlo",
  approval:"2. Aprobación Coach", replicate:"3. Más Grupos",
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
    { id:"like",    emoji:"👍", label:lang==="es"?"Me Gusta o Emoji":"Like or Emoji",   color:"#FEF9EC", border:W1_YELLOW,    simple:true,
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

async function W1_callClaude(messages, system) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:2000, messages };
  if (system) body.system = system;
  const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
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
  return await W1_callClaude([{ role:"user", content:lines.join("\n") }]);
}

// ── localStorage persistence ──────────────────────────────────────────────────
function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}
function loadFromStorage() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch(e) { return null; }
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function W1Card({ children, style }) {
  return <div style={{ background:W1_WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:20, ...(style||{}) }}>{children}</div>;
}
function W1Btn({ children, onClick, variant, style, disabled }) {
  const v = variant||"primary";
  const base = { borderRadius:10, padding:"13px 24px", fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 };
  const vars = { primary:{background:W1_YELLOW,color:W1_NAVY,border:"none"}, secondary:{background:W1_NAVY,color:W1_WHITE,border:"none"}, success:{background:W1_GREEN,color:W1_WHITE,border:"none"}, ghost:{background:"transparent",color:W1_GRAY600,border:"1.5px solid "+W1_GRAY300} };
  return <button onClick={onClick} disabled={!!disabled} style={{ ...base, ...(vars[v]||vars.primary), opacity:disabled?0.5:1, ...(style||{}) }}>{children}</button>;
}
function CardNav({ onBack, onNext, nextDisabled, nextLabel, firstQuestion, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"row", justifyContent:firstQuestion||!onBack?"flex-end":"space-between", alignItems:"stretch", gap:16, marginTop:24, paddingTop:20, borderTop:"1px solid "+W1_GRAY100 }}>
      {onBack && !firstQuestion && <button onClick={onBack} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:W1_GRAY100, color:W1_GRAY600 }}>{(t||T.en).back}</button>}
      {onNext && <button onClick={onNext} disabled={!!nextDisabled} style={{ border:"none", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:56, padding:"0 28px", background:W1_YELLOW, color:W1_NAVY, opacity:nextDisabled?0.4:1 }}>{nextLabel||(t||T.en).next}</button>}
    </div>
  );
}
function W1SectionHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:32, marginBottom:8 }}>{emoji}</div>
      <h2 style={{ fontSize:22, fontWeight:800, color:W1_NAVY, margin:0 }}>{title}</h2>
      {subtitle && <p style={{ color:W1_GRAY600, margin:"8px 0 0", fontSize:14, lineHeight:1.6 }}>{subtitle}</p>}
    </div>
  );
}
function GroupTable({ groups, t }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {groups.map((g,i) => (
        <div key={i} style={{ background:i%2===0?W1_WHITE:W1_GRAY50, border:"1px solid "+W1_GRAY200, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, color:W1_NAVY, fontSize:14 }}>{g.name}</div></div>
          <a href={g.url} target="_blank" rel="noopener noreferrer" style={{ background:"#1877F2", color:W1_WHITE, borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, display:"inline-flex", alignItems:"center", gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            {t.searchOnFb}
          </a>
        </div>
      ))}
    </div>
  );
}

const POSTSTEP_LABELS_EN = [
  "1. Join a group",
  "2. Tap Join",
  "3. Open group",
  "4. Write something",
  "5. Copy & paste post",
  "6. Attach photo",
  "7. Tap Post",
  "8. Coach Approval",
  "9. Cross-Post",
];
const POSTSTEP_LABELS_ES = [
  "1. Unirse a un grupo",
  "2. Tocar Unirse",
  "3. Abrir grupo",
  "4. Escribir algo",
  "5. Copiar y pegar",
  "6. Adjuntar foto",
  "7. Publicar",
  "8. Aprobación Coach",
  "9. Más Grupos",
];

// Maps each step index to which appPhase it belongs
const POSTSTEP_PHASES = [
  "dopost","dopost","dopost","dopost","dopost","dopost","dopost",
  "approval","replicate",
];
// Maps each step index to which postStepIdx it represents (only meaningful for dopost steps)
const POSTSTEP_DOPOST_IDX = [0,1,2,3,4,5,6, null, null];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function SidebarNav({ current, onNavigate, completedSections, lang, postStep, onJumpPostStep }) {
  const t = T[lang];
  const PHASE_LABELS = lang === "es" ? PHASE_LABELS_ES : PHASE_LABELS_EN;
  const POSTSTEP_LABELS = lang === "es" ? POSTSTEP_LABELS_ES : POSTSTEP_LABELS_EN;
  const showNav = !NO_NAV_PHASES.includes(current);
  const activeSection = NAV_SECTIONS.find(s => s.phases.includes(current));
  return (
    <div style={{ position:"fixed", top:W1_HEADER_H, left:0, bottom:0, width:W1_SIDEBAR_W, background:W1_NAVY, zIndex:90, overflowY:"auto", display:"flex", flexDirection:"column", boxShadow:"2px 0 12px rgba(0,0,0,0.15)", opacity:showNav?1:0, pointerEvents:showNav?"auto":"none" }}>
      <div style={{ padding:"20px 0 32px" }}>
        {NAV_SECTIONS.map(section => {
          const sectionActive = activeSection && section.id === activeSection.id;
          const sectionDone   = completedSections.includes(section.id);
          const subPhases     = section.phases;
          const currentSubIdx = subPhases.indexOf(current);
          const sLabel = lang === "es" ? section.label_es : section.label_en;
          return (
            <div key={section.id} style={{ marginBottom:4 }}>
              <button onClick={() => !section.comingSoon && onNavigate(section.phases[0])}
                style={{ width:"100%", border:"none", background:"transparent", display:"flex", alignItems:"center", gap:10, padding:"11px 20px", cursor:section.comingSoon?"default":"pointer", borderLeft:sectionActive?"3px solid "+W1_YELLOW:"3px solid transparent" }}
                onMouseEnter={e => { if (!section.comingSoon) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:20, flexShrink:0 }}>{section.icon}</span>
                <span style={{ fontWeight:900, fontSize:16, flex:1, color:sectionDone?W1_GREEN:sectionActive?W1_YELLOW:section.comingSoon?"rgba(255,255,255,0.3)":W1_WHITE, lineHeight:1.2 }}>{sectionDone?"✓ ":""}{sLabel}</span>
                {section.comingSoon && <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>SOON</span>}
              </button>
              {sectionActive && !section.noSubs && (
                <div style={{ marginLeft:36, marginBottom:6, position:"relative" }}>
                  <div style={{ position:"absolute", left:4, top:0, bottom:0, width:2, background:"rgba(255,255,255,0.08)", borderRadius:1 }}/>
                  {/* For grouppost section: show all 9 steps as one continuous list */}
                  {section.id === "grouppost" ? (
                    POSTSTEP_LABELS.map((label, i) => {
                      const stepPhase = POSTSTEP_PHASES[i];
                      const dopostIdx = POSTSTEP_DOPOST_IDX[i];
                      // Determine active: dopost steps use postStep, others use current phase
                      const isActive = stepPhase === "dopost"
                        ? current === "dopost" && postStep === dopostIdx
                        : current === stepPhase;
                      // Done: all dopost sub-steps before current, or entire dopost phase done, or phase passed
                      const isDone = stepPhase === "dopost"
                        ? (current === "dopost" && dopostIdx < postStep) || (current === "approval" || current === "replicate")
                        : stepPhase === "approval"
                          ? current === "replicate"
                          : false;
                      return (
                        <button key={i}
                          onClick={() => {
                            if (stepPhase === "dopost") { onJumpPostStep && onJumpPostStep(dopostIdx); onNavigate("dopost"); }
                            else onNavigate(stepPhase);
                          }}
                          style={{ width:"100%", border:"none", background:isActive?"rgba(254,183,5,0.1)":"transparent", display:"flex", alignItems:"center", gap:10, padding:"7px 12px 7px 18px", cursor:"pointer", borderRadius:"0 8px 8px 0", position:"relative" }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}>
                          <span style={{ position:"absolute", left:-1, width:10, height:10, borderRadius:"50%", background:isDone?W1_GREEN:isActive?W1_YELLOW:"#1e3a52", border:isActive?"2px solid "+W1_YELLOW:isDone?"2px solid "+W1_GREEN:"2px solid rgba(255,255,255,0.15)", boxSizing:"border-box" }}/>
                          <span style={{ fontSize:12, fontWeight:isActive?700:400, color:isActive?W1_YELLOW:isDone?"#6EE7B7":W1_GRAY400 }}>{isDone?"✓ ":""}{label}</span>
                        </button>
                      );
                    })
                  ) : (
                    /* Normal phase sub-list for non-grouppost sections */
                    subPhases.map((p,i) => {
                      const isDone   = i < currentSubIdx;
                      const isActive = p === current;
                      return (
                        <button key={p} onClick={() => onNavigate(p)}
                          style={{ width:"100%", border:"none", background:isActive?"rgba(254,183,5,0.1)":"transparent", display:"flex", alignItems:"center", gap:10, padding:"7px 12px 7px 18px", cursor:"pointer", borderRadius:"0 8px 8px 0", position:"relative" }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}>
                          <span style={{ position:"absolute", left:-1, width:10, height:10, borderRadius:"50%", background:isDone?W1_GREEN:isActive?W1_YELLOW:"#1e3a52", border:isActive?"2px solid "+W1_YELLOW:isDone?"2px solid "+W1_GREEN:"2px solid rgba(255,255,255,0.15)", boxSizing:"border-box" }}/>
                          <span style={{ fontSize:12, fontWeight:isActive?700:400, color:isActive?W1_YELLOW:isDone?"#6EE7B7":W1_GRAY400 }}>{isDone?"✓ ":""}{PHASE_LABELS[p]||p}</span>
                        </button>
                      );
                    })
                  )}
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
    <div style={{ background:"#FEF9EC", border:"1.5px dashed "+W1_YELLOW, borderRadius:10, padding:"10px 16px", marginTop:16 }}>
      <div style={{ fontSize:13, color:W1_GRAY600, marginBottom:8 }}>{t.devShortcuts}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setAppPhase("ch1"); }} style={{ background:W1_NAVY, color:W1_YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.fillSample}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setAppPhase("dopost"); }} style={{ background:W1_NAVY, color:W1_YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipGenerate}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("approval"); }} style={{ background:W1_NAVY, color:W1_YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipStep5}</button>
        <button onClick={() => { setAnswers(SAMPLE_ANSWERS); setPost("Sample post."); setAppPhase("leads"); }} style={{ background:W1_NAVY, color:W1_YELLOW, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.skipLeads}</button>
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
      <W1Card style={{ background:W1_NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ background:W1_YELLOW, borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:900, color:W1_NAVY, fontSize:14 }}>AI</div>
          <div style={{ flex:1 }}>{isT ? <p style={{ color:W1_GRAY400, fontSize:14, margin:0, fontStyle:"italic" }}>{t.processing}</p> : <p style={{ color:W1_WHITE, fontSize:16, margin:0, lineHeight:1.8 }}>{coachMsg}</p>}</div>
        </div>
      </W1Card>
      {uiStatus!=="idle" && uiStatus!=="done" && (
        <W1Card>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingTop:8, paddingBottom:8 }}>
            <button type="button" onClick={isL?closeMic:openMic} disabled={isT||isS}
              style={{ background:isL?W1_RED:isS||isT?W1_GRAY400:W1_GRAY200, border:"none", borderRadius:"50%", width:80, height:80, cursor:isT||isS?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isL?"0 0 0 10px rgba(239,68,68,0.15)":"none", transition:"all 0.3s" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill={isL?W1_WHITE:W1_GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
            </button>
            <span style={{ fontSize:13, color:isL?W1_RED:isS?W1_YELLOW:W1_GRAY400, fontWeight:isL||isS?600:400 }}>{isL?t.listening:isT?t.processing:isS?t.coachSpeaking:t.tapToStart}</span>
            {micErr && <span style={{ fontSize:12, color:W1_RED }}>{micErr}</span>}
            {transcript && <div style={{ background:"#F0F7FF", border:"2px solid "+W1_NAVY, borderRadius:10, padding:"10px 14px", width:"100%", boxSizing:"border-box", fontSize:14, color:W1_GRAY800, lineHeight:1.7 }}><div style={{ fontSize:11, color:W1_GRAY400, marginBottom:4, fontWeight:600 }}>{lang==="es"?"DIJISTE:":"YOU SAID:"}</div>{transcript}</div>}
          </div>
          {activeQ && <div style={{ marginTop:12, padding:"12px 14px", background:W1_GRAY50, borderRadius:10 }}><span style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700, marginRight:6 }}>Q{activeQ.num}</span><span style={{ fontWeight:700, color:W1_NAVY, fontSize:13 }}>{activeQ.question}</span></div>}
        </W1Card>
      )}
      {uiStatus!=="idle" && <div style={{ marginBottom:12 }}><div style={{ background:W1_GRAY200, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:W1_YELLOW, borderRadius:99, height:6, width:Math.round((answered/ALL_QUESTIONS.length)*100)+"%", transition:"width 0.4s" }}/></div></div>}
      {uiStatus==="idle" && <div style={{ textAlign:"center", marginTop:8 }}><W1Btn onClick={() => { const q=ALL_QUESTIONS[0]; coachSay((lang==="es"?"¡Muy bien, construyamos tu historia! ":"Alright, let us build your story! ")+(q.voiceQ||q.hint), () => openMic()); }}>{t.startVoiceSession}</W1Btn></div>}
      {answered > 0 && (
        <W1Card>
          <h3 style={{ color:W1_NAVY, margin:"0 0 16px", fontSize:16 }}>{t.yourAnswersSoFar}</h3>
          {ALL_QUESTIONS.filter(q=>displayAnswers[q.id]).map(q => (
            <div key={q.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+W1_GRAY200 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}><span style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:6, padding:"1px 6px", fontSize:11, fontWeight:700 }}>Q{q.num}</span><span style={{ fontWeight:700, color:W1_NAVY, fontSize:13 }}>{q.question}</span></div>
                  <p style={{ margin:0, fontSize:13, color:W1_GRAY800, lineHeight:1.6 }}>{displayAnswers[q.id]}</p>
                </div>
                <button onClick={() => { S.current.rerecordId=q.id; const rq=ALL_QUESTIONS.find(x=>x.id===q.id); setTranscript(""); coachSay((lang==="es"?"No hay problema, rehagamos eso. ":"No problem, let us redo that. ")+(rq.voiceQ||rq.hint), () => openMic()); }} style={{ background:W1_GRAY100, border:"none", borderRadius:8, padding:"4px 10px", fontSize:12, color:W1_GRAY600, cursor:"pointer", flexShrink:0 }}>{t.reRecord}</button>
              </div>
            </div>
          ))}
        </W1Card>
      )}
      {uiStatus==="done" && <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}><W1Btn onClick={() => onComplete({...S.current.answers})}>{t.next} →</W1Btn></div>}
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
          <label style={{ fontSize:12, fontWeight:700, color:W1_GRAY600, display:"block", marginBottom:4 }}>{cityLabel}</label>
          <input
            value={cityArea}
            onChange={e => { setCityArea(e.target.value); if(areaErr) setAreaErr(""); }}
            placeholder={cityPH}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(areaErr?W1_RED:cityArea?W1_GREEN:W1_GRAY200), borderRadius:10, padding:"10px 12px", fontSize:14, color:W1_GRAY800, fontFamily:"inherit", outline:"none" }}
          />
          {areaErr && <p style={{ color:W1_RED, fontSize:11, margin:"4px 0 0" }}>{areaErr}</p>}
        </div>

        {/* State / Province dropdown */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:W1_GRAY600, display:"block", marginBottom:4 }}>{t.statePlaceholder} *</label>
          <select
            value={stateVal}
            onChange={e => { setStateVal(e.target.value); if(stateErr) setStateErr(""); }}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(stateErr?W1_RED:stateVal?W1_GREEN:W1_GRAY200), borderRadius:10, padding:"10px 10px", fontSize:14, color:stateVal?W1_GRAY800:W1_GRAY400, fontFamily:"inherit", outline:"none", background:W1_WHITE, cursor:"pointer" }}
          >
            {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {stateErr && <p style={{ color:W1_RED, fontSize:11, margin:"4px 0 0" }}>{stateErr}</p>}
        </div>

        {/* Years */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:W1_GRAY600, display:"block", marginBottom:4 }}>{yearsLabel}</label>
          <input
            type="number" min="0" max="99"
            value={years}
            onChange={e => setYears(e.target.value)}
            placeholder={yearsPH}
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+W1_GRAY200, borderRadius:10, padding:"10px 10px", fontSize:14, color:W1_GRAY800, fontFamily:"inherit", outline:"none" }}
          />
        </div>
      </div>

      {/* Live preview */}
      {value && (
        <div style={{ background:W1_GRAY50, borderRadius:8, padding:"8px 12px", fontSize:12, color:W1_GRAY600 }}>
          <span style={{ fontWeight:700, color:W1_NAVY }}>{lang==="es"?"Vista previa: ":"Preview: "}</span>{value}
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
  const hasOpenedRef = useRef(false);
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
    setShowInspiration(hasOpenedRef.current);
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


  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ background:W1_WHITE, borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 4px 24px rgba(0,41,66,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:800, color:W1_NAVY, fontSize:15 }}>{t.yourStoryProgress}</span>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontWeight:800, fontSize:14, color:pct===100?W1_GREEN:W1_NAVY }}>{t.answersOf(answered, ALL_QUESTIONS.length)}</span>
            {onSwitchToVoice && (
              <button onClick={onSwitchToVoice} style={{ background:"none", border:"none", fontSize:12, color:W1_GRAY400, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit" }}>
                {lang==="es"?"🎤 Prefiero hablar":"🎤 Prefer to talk?"}
              </button>
            )}
          </div>
        </div>
        <div style={{ background:W1_GRAY100, borderRadius:99, height:14, overflow:"hidden", position:"relative" }}>
          <div style={{ background:pct===100?W1_GREEN:W1_YELLOW, borderRadius:99, height:"100%", width:pct+"%", transition:"width 0.5s ease", position:"relative" }}>
            {pct>8 && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:10, fontWeight:800, color:W1_NAVY }}>{pct}%</span>}
          </div>
        </div>
      </div>
      <div style={{ background:W1_WHITE, borderRadius:16, padding:28, boxShadow:"0 4px 24px rgba(0,41,66,0.08)", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:10 }}>
          <span style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:8, padding:"5px 12px", fontSize:13, fontWeight:800, flexShrink:0, marginTop:2 }}>Q{q.num}</span>
          <span style={{ fontWeight:800, color:W1_NAVY, fontSize:18, lineHeight:1.4 }}>{q.question}</span>
        </div>
        <p style={{ fontSize:14, color:W1_GRAY600, margin:"0 0 16px", lineHeight:1.7 }}>{q.hint}</p>

        {q.fearChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:W1_GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.pickFear}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.fearChips.map((chip,i) => {
                const sel = value.toLowerCase().startsWith(chip.toLowerCase());
                return (
                  <button key={i} onClick={() => { if (sel) { onAnswerChange(q.id, value.replace(new RegExp("^"+chip+"\\.?\\s*","i"),"").trim()); } else { onAnswerChange(q.id, chip+". "+value.replace(new RegExp("^(Getting overcharged|Being left with a mess|Lack of communication|Cobros excesivos|Dejar un desastre|Falta de comunicación)\\.?\\s*","i"),"").trim()); } }}
                    style={{ background:sel?W1_NAVY:W1_GRAY50, color:sel?W1_YELLOW:W1_GRAY800, border:"2px solid "+(sel?W1_NAVY:W1_GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    {sel?"✓ ":""}{chip}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {q.missionChips && (
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:W1_GRAY400, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.quickPick}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {q.missionChips.map((chip,i) => (
                <button key={i} onClick={() => onAnswerChange(q.id, value===chip?"":chip)}
                  style={{ background:value===chip?W1_NAVY:W1_GRAY50, color:value===chip?W1_YELLOW:W1_GRAY800, border:"2px solid "+(value===chip?W1_NAVY:W1_GRAY200), borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  {value===chip?"✓ ":""}{chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3 special area input */}
        {isAreaQ ? (
          <>
            {/* Examples — collapsible, same as other questions */}
            {(q.examples||[]).length > 0 && (
              <div style={{ marginBottom:14 }}>
                <button onClick={() => { const next = !showInspiration; setShowInspiration(next); if (next) hasOpenedRef.current = true; }}
                  style={{ background:"none", border:"none", padding:0, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", marginBottom: showInspiration ? 10 : 0 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:W1_NAVY }}>{lang==="es"?"Ver ejemplos":"See examples"}</span>
                  <span style={{ fontSize:11, color:W1_GRAY400 }}>{showInspiration ? "▲" : "▼"}</span>
                </button>
                {showInspiration && (
                  <div style={{ background:W1_GRAY50, border:"1px solid "+W1_GRAY200, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                    {(q.examples||[]).map((ex, i, arr) => (
                      <div key={i}>
                        <p style={{ fontSize:13, color:W1_GRAY800, margin:0, lineHeight:1.7, fontStyle:"italic" }}>{ex}</p>
                        {i < arr.length-1 && <div style={{ borderTop:"1px solid "+W1_GRAY200, marginTop:10 }}/>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <AreaInput value={value} onChange={val => { onAnswerChange(q.id, val); if(showError) setShowError(false); }} lang={lang}/>
          </>
        ) : (
          <>
            {/* Examples — collapsible, remembers if opened */}
            {(q.examples||[]).length > 0 && (
              <div style={{ marginBottom:14 }}>
                <button onClick={() => { const next = !showInspiration; setShowInspiration(next); if (next) hasOpenedRef.current = true; }}
                  style={{ background:"none", border:"none", padding:0, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", marginBottom: showInspiration ? 10 : 0 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:W1_NAVY }}>{lang==="es"?"Ver ejemplos":"See examples"}</span>
                  <span style={{ fontSize:11, color:W1_GRAY400 }}>{showInspiration ? "▲" : "▼"}</span>
                </button>
                {showInspiration && (
                  <div style={{ background:W1_GRAY50, border:"1px solid "+W1_GRAY200, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                    {(q.examples||[]).map((ex, i, arr) => (
                      <div key={i}>
                        <p style={{ fontSize:13, color:W1_GRAY800, margin:0, lineHeight:1.7, fontStyle:"italic" }}>{ex}</p>
                        {i < arr.length-1 && <div style={{ borderTop:"1px solid "+W1_GRAY200, marginTop:10 }}/>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{ position:"relative" }}>
              <textarea value={value} onChange={e => { onAnswerChange(q.id,e.target.value); if(showError)setShowError(false); }} placeholder={q.placeholder}
                rows={q.id==="heroMoment"?6:q.id==="whyStarted"||q.id==="fear"?4:3} autoFocus
                style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(showError?W1_RED:met?W1_GREEN:W1_GRAY200), borderRadius:12, padding:"14px 52px 14px 14px", fontSize:15, color:W1_GRAY800, fontFamily:"inherit", resize:"vertical", outline:"none", transition:"border 0.2s", background:W1_WHITE, lineHeight:1.8 }}/>
              <button type="button" onClick={toggleMic} style={{ position:"absolute", top:12, right:12, background:micL?W1_RED:W1_GRAY100, border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={micL?W1_WHITE:W1_GRAY600}><path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h-2v-2.07A8 8 0 0 1 4 11h2z"/></svg>
              </button>
            </div>
            {micL && <p style={{ fontSize:12, color:W1_RED, margin:"6px 0 0" }}>{t.listening}</p>}
            {micErr && <p style={{ fontSize:12, color:W1_RED, margin:"6px 0 0" }}>{micErr}</p>}
            {wc>0 && q.minWords>1 && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                <div style={{ flex:1, background:W1_GRAY100, borderRadius:99, height:6, overflow:"hidden" }}><div style={{ background:met?W1_GREEN:W1_YELLOW, height:6, borderRadius:99, width:Math.min((wc/q.minWords)*100,100)+"%", transition:"width 0.2s" }}/></div>
                {met && <span style={{ fontSize:12, fontWeight:700, color:W1_GREEN, whiteSpace:"nowrap" }}>✓</span>}
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
function W1GetPost({ allCh3Met, post, postEn, postLoading, postError, answers, onGenerate, onSetPost, onNext, onBack, onWritePost, lang }) {
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
    <W1Card>
      <W1SectionHeader emoji="✍️" title={t.step2GeneratePost}/>
      {!allCh3Met && !post && (
        <div style={{ background:"#FEF9EC", border:"1.5px solid "+W1_YELLOW, borderRadius:10, padding:16, marginBottom:20 }}>
          <p style={{ fontWeight:700, color:W1_NAVY, fontSize:14, margin:"0 0 6px" }}>{t.needPostToContinue}</p>
          <p style={{ color:W1_GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>{t.needPostDesc}</p>
          <W1Btn onClick={onWritePost}>{t.writeMyPost}</W1Btn>
        </div>
      )}
      {!allCh3Met && (
        <>
          <p style={{ fontSize:13, fontWeight:600, color:W1_NAVY, margin:"0 0 8px" }}>{t.pastePostLabel}</p>
          <textarea value={post} onChange={e=>onSetPost(e.target.value)} rows={10} placeholder={t.pastePlaceholder} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(post?W1_NAVY:W1_GRAY200), borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:W1_GRAY800, fontFamily:"inherit", resize:"vertical", background:post?"#F0F7FF":W1_GRAY50, outline:"none" }}/>
        </>
      )}
      {postLoading && <div style={{ textAlign:"center", padding:40 }}><div style={{ fontSize:32, marginBottom:12 }}>✨</div><p style={{ color:W1_GRAY600, fontSize:14 }}>{t.writingPost}</p></div>}
      {postError && !postLoading && <div style={{ background:"#FEF2F2", borderRadius:10, padding:14, marginBottom:16, color:W1_RED, fontSize:13 }}>{t.couldNotGenerate} <button onClick={() => onGenerate(answers)} style={{ background:"none", border:"none", color:W1_NAVY, fontWeight:700, cursor:"pointer", textDecoration:"underline", fontSize:13 }}>{t.tryAgain}</button></div>}
      {post && !postLoading && (
        <>
          {/* Spanish post label */}
          {lang === "es" && (
            <p style={{ fontSize:12, fontWeight:700, color:W1_GRAY400, textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 6px" }}>
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
            style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+W1_NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:W1_GRAY800, fontFamily:"inherit", resize:"none", background:W1_GRAY50, outline:"none", marginBottom:14, overflow:"hidden", display:"block" }}/>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:20 }}>
            {lang !== "es" && (
              <W1Btn onClick={handleCopy} variant={copied?"success":"primary"}>{copied?t.copied:t.copyPost}</W1Btn>
            )}
            <button onClick={() => { setCopied(false); setEverCopied(false); setIsEdited(false); onGenerate(answers); }} disabled={postLoading} style={{ background:"none", border:"none", fontSize:13, fontWeight:700, color:W1_GRAY600, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>{t.regenerate}</button>
            {isEdited && (
              <button onClick={handleResetToOriginal} style={{ background:"none", border:"none", fontSize:13, color:W1_GRAY400, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>
                ↩ Volver al original
              </button>
            )}
          </div>

          {/* English translation — only shown in Spanish mode */}
          {lang === "es" && (
            <div style={{ borderTop:"2px solid "+W1_GRAY200, paddingTop:20, marginTop:4 }}>
              <button onClick={() => setShowEn(v=>!v)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>
                <div>
                  <span style={{ fontSize:13, fontWeight:800, color:W1_NAVY }}>🇺🇸 English Translation</span>
                  <span style={{ fontSize:12, color:W1_GRAY400, marginLeft:8 }}>
                    {postEn ? "Copy this to post" : "Generating..."}
                  </span>
                </div>
                <span style={{ color:W1_GRAY400, fontSize:13 }}>{showEn ? "▲" : "▼"}</span>
              </button>
              {showEn && (
                <div style={{ marginTop:14 }}>
                  {!postEn ? (
                    <div style={{ padding:"20px 0", textAlign:"center", color:W1_GRAY400, fontSize:13 }}>
                      ⏳ Translating your post...
                    </div>
                  ) : (
                    <>
                      <div style={{ background:W1_GRAY50, border:"1.5px solid "+W1_GRAY200, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:W1_GRAY800, whiteSpace:"pre-wrap", marginBottom:12 }}>
                        {postEn}
                      </div>
                      <W1Btn onClick={handleCopyEn} variant={copiedEn?"success":"primary"}>
                        {copiedEn ? "✓ Copied!" : "📋 Copy Post"}
                      </W1Btn>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <CardNav onBack={onBack} onNext={everCopied?onNext:undefined} nextDisabled={!everCopied} nextLabel={t.next} t={t}/>
    </W1Card>
  );
}

// ── Audit Row ─────────────────────────────────────────────────────────────────
function AuditRow({ item, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1.5px solid "+W1_GRAY200, borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", background:W1_WHITE }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, marginBottom:8 }}>{item.label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#D1FAE5", color:"#065F46", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{t.do}</span>
              <span style={{ fontSize:12, color:W1_GRAY600, lineHeight:1.5 }}>{item.doThis}</span>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{t.not}</span>
              <span style={{ fontSize:12, color:W1_GRAY600, lineHeight:1.5 }}>{item.notThat}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:W1_GRAY400, fontSize:14, flexShrink:0, padding:"2px 4px" }}>{open?"▲":"▼"}</button>
      </div>
      {open && <div style={{ background:"#FFFBEB", borderTop:"1px solid "+W1_GRAY200, padding:"12px 16px", display:"flex", gap:10 }}><span style={{ fontSize:16, flexShrink:0 }}>💡</span><p style={{ margin:0, fontSize:13, color:W1_GRAY800, lineHeight:1.6 }}>{item.tip}</p></div>}
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
        const reply = await W1_callClaude([{ role:"user", content:prompt }]);
        const BT3=String.fromCharCode(96);const cleaned=reply.split(BT3+BT3+BT3+"json").join("").split(BT3+BT3+BT3).join("").trim();
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
    { key:"best",   badge:"BEST ⭐", color:"#FEF9EC", border:W1_YELLOW,    textColor:"#92400E" },
  ];
  return (
    <W1Card>
      <W1SectionHeader emoji="📸" title={t.step3Photo} subtitle={t.step3Subtitle}/>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, marginBottom:12 }}>{t.photoIdeasTitle}</div>
        {loading
          ? <div style={{ textAlign:"center", padding:24, color:W1_GRAY400, fontSize:13 }}>{t.generatingIdeas}</div>
          : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {tiers.map(tier => (
                <div key={tier.key} style={{ background:tier.color, border:"1.5px solid "+tier.border, borderRadius:12, padding:"14px 12px", display:"flex", flexDirection:"column", gap:8 }}>
                  <span style={{ background:tier.border, color:tier.textColor, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800, letterSpacing:"0.04em", alignSelf:"flex-start" }}>{tier.badge}</span>
                  <div style={{ fontWeight:800, color:W1_NAVY, fontSize:14, lineHeight:1.3 }}>{photoIdeas[tier.key].label}</div>
                  <div style={{ fontSize:12, color:W1_GRAY600, lineHeight:1.5 }}>{photoIdeas[tier.key].desc}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700, color:W1_GREEN, fontSize:13, marginBottom:10 }}>{t.goodPhotos}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {GOOD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #86EFAC", aspectRatio:"1", background:W1_GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.style.display="flex";e.target.parentNode.style.alignItems="center";e.target.parentNode.style.justifyContent="center";e.target.parentNode.innerHTML="<span style='font-size:28px'>📸</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
        <div style={{ fontWeight:700, color:W1_RED, fontSize:13, marginBottom:10 }}>{t.badPhotos}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {BAD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"2px solid #FCA5A5", aspectRatio:"1", background:W1_GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.style.display="flex";e.target.parentNode.style.alignItems="center";e.target.parentNode.style.justifyContent="center";e.target.parentNode.innerHTML="<span style='font-size:28px'>🚫</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
        </div>
      </div>
      <CardNav onBack={onBack} onNext={onNext} t={t}/>
    </W1Card>
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
      <div style={{ background:W1_GRAY50, border:"1.5px solid "+W1_GRAY200, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
        <p style={{ fontSize:14, color:W1_GRAY800, lineHeight:1.8, margin:"0 0 10px", fontStyle:"italic" }}>"{text}"</p>
        <button onClick={() => copyText(text,idx)} style={{ background:copiedIdx===idx?W1_GREEN:W1_NAVY, color:copiedIdx===idx?W1_WHITE:W1_YELLOW, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{copiedIdx===idx?t.copied:lang==="es"?"Copiar Guión":"Copy Script"}</button>
      </div>
    );
  }

  if (!watched) {
    return (
      <W1Card>
        <W1SectionHeader emoji="🎉" title={t.sessionCompleteTitle} subtitle={t.sessionCompleteSubtitle}/>
        <div style={{ background:"#EFF6FF", borderRadius:12, padding:16, marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, color:W1_NAVY, fontWeight:600 }}>{t.trainingVideo}</p>
          <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:10, overflow:"hidden", marginBottom:14 }}>
            <iframe src="https://fast.wistia.net/embed/iframe/indqjc1oov?autoPlay=false" title={t.trainingVideo} allowFullScreen style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none", borderRadius:10 }}/>
          </div>
          <button onClick={() => { try { localStorage.setItem("hbc_lead_video_watched","1"); } catch(e){} setWatched(true); }} style={{ background:"none", border:"none", fontSize:13, color:W1_GRAY400, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>
            {lang==="es"?"Saltar — ya vi esto":"Skip — I've already seen this"}
          </button>
        </div>
        <CardNav onBack={onBack} onNext={() => { try { localStorage.setItem("hbc_lead_video_watched","1"); } catch(e){} setWatched(true); }} nextLabel={t.next} t={t}/>
      </W1Card>
    );
  }

  return (
    <>
      <W1Card style={{ background:W1_NAVY, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div><h2 style={{ color:W1_YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>{t.workYourLeads}</h2><p style={{ color:W1_GRAY400, fontSize:13, margin:0 }}>{t.workLeadsSubtitle}</p></div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:W1_YELLOW, fontWeight:900, fontSize:24, lineHeight:1 }}>{sessionTotal}</div><div style={{ color:W1_GRAY400, fontSize:10, marginTop:3 }}>{t.thisSession}</div></div>
            <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:72 }}><div style={{ color:W1_GREEN, fontWeight:900, fontSize:24, lineHeight:1 }}>{totalJobs}</div><div style={{ color:W1_GREEN, fontSize:10, marginTop:3 }}>{t.jobsBooked}</div></div>
          </div>
        </div>
        <div style={{ marginTop:14, padding:"14px 16px", background:"rgba(255,255,255,0.08)", borderRadius:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:W1_WHITE, fontSize:13, fontWeight:600 }}>{t.logBookedJob}</span>
          <input type="number" min="1" value={jobsInput} onChange={e=>setJobsInput(e.target.value)} placeholder={t.numJobs} style={{ width:90, border:"2px solid rgba(255,255,255,0.3)", borderRadius:8, padding:"7px 10px", fontSize:15, fontWeight:800, color:W1_NAVY, outline:"none", textAlign:"center", background:W1_WHITE }}/>
          <W1Btn onClick={() => { const n=parseInt(jobsInput); if(n>0){setTotalJobs(j=>j+n);setJobsInput("");} }} disabled={!jobsInput||parseInt(jobsInput)<1} style={{ fontSize:13 }}>{t.addJobs}</W1Btn>        </div>
        <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(255,255,255,0.06)", borderRadius:10 }}><p style={{ color:W1_WHITE, fontSize:13, margin:0 }}>{t.timeKillsDeals}</p></div>
      </W1Card>
      {!active && (
        <>
        <W1Card>
          <h3 style={{ color:W1_NAVY, fontSize:17, fontWeight:800, margin:"0 0 6px" }}>{t.whatEngagement}</h3>
          <p style={{ color:W1_GRAY600, fontSize:13, margin:"0 0 20px" }}>{t.tapForSteps}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {LEAD_TYPES.map(lt => (
              <button key={lt.id} onClick={() => { setActive(lt.id); setSubtype(null); }} style={{ background:lt.color, border:"2px solid "+lt.border, borderRadius:14, padding:"18px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:32 }}>{lt.emoji}</span>
                <span style={{ fontWeight:800, color:W1_NAVY, fontSize:15 }}>{lt.label}</span>
                {sessionCounts[lt.id]>0 && <span style={{ fontSize:11, color:W1_GRAY600, fontWeight:600 }}>{sessionCounts[lt.id]} {t.thisSession}</span>}
              </button>
            ))}
          </div>
        </W1Card>
        </>
      )}
      {activeLead && activeLead.simple && (
        <W1Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:W1_GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:W1_GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:W1_NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          {activeLead.steps.map((step,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ background:W1_YELLOW, color:W1_NAVY, borderRadius:99, width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, paddingTop:2 }}>{step.label}</div>
              </div>
              {step.note ? <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:13, color:W1_NAVY }}>{lang==="es"?"Usa el libro de jugadas de ":"Use the "}<strong>{lang==="es"?"Mensaje Directo":"Direct Message"}</strong>{lang==="es"?" una vez que respondan.":" playbook once they respond."}</div> : <ScriptBox text={step.script} idx={i}/>}
            </div>
          ))}
          {activeLead.id==="like" ? (
            <div style={{ borderTop:"1px solid "+W1_GRAY200, paddingTop:16, marginTop:16 }}>
              <p style={{ fontWeight:700, color:W1_NAVY, fontSize:14, margin:"0 0 12px" }}>{t.howManyDMs}</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <input type="number" min="1" value={likeCount} onChange={e=>setLikeCount(Math.max(1,parseInt(e.target.value)||1))} style={{ width:90, border:"2px solid "+W1_NAVY, borderRadius:10, padding:"10px 14px", fontSize:22, fontWeight:800, color:W1_NAVY, outline:"none", textAlign:"center", fontFamily:"inherit", background:W1_WHITE }}/>
                <W1Btn variant="success" onClick={() => { logLead(activeLead.id,likeCount); reset(); }}>{t.logDMs(likeCount)}</W1Btn>
              </div>
              <W1Btn variant="ghost" onClick={reset}>{t.back}</W1Btn>
            </div>
          ) : (
            <div style={{ borderTop:"1px solid "+W1_GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
              <W1Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>{t.markAsWorked}</W1Btn>
              <W1Btn variant="ghost" onClick={reset}>{t.back}</W1Btn>
            </div>
          )}
        </W1Card>
      )}
      {activeLead && !activeLead.simple && !subtype && (
        <W1Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={reset} style={{ background:W1_GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:W1_GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <h3 style={{ color:W1_NAVY, fontSize:18, fontWeight:800, margin:0 }}>{activeLead.label}</h3>
          </div>
          <p style={{ color:W1_GRAY600, fontSize:13, margin:"0 0 16px" }}>{t.whatDidTheySay}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {activeLead.subtypes.map(s => (
              <button key={s.id} onClick={() => setSubtype(s.id)} style={{ background:activeLead.color, border:"1.5px solid "+activeLead.border, borderRadius:12, padding:"12px 16px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap:3 }}>
                <span style={{ fontWeight:700, color:W1_NAVY, fontSize:14 }}>{s.label}</span>
                <span style={{ fontSize:12, color:W1_GRAY600, fontStyle:"italic" }}>{s.example}</span>
              </button>
            ))}
          </div>
        </W1Card>
      )}
      {activeLead && !activeLead.simple && activeSubtype && (
        <W1Card>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={() => setSubtype(null)} style={{ background:W1_GRAY100, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:W1_GRAY600, fontWeight:600, cursor:"pointer" }}>← {t.back}</button>
            <span style={{ fontSize:26 }}>{activeLead.emoji}</span>
            <div><div style={{ fontWeight:800, color:W1_NAVY, fontSize:15 }}>{activeLead.label}</div><div style={{ fontSize:12, color:W1_GRAY600 }}>{activeSubtype.label}</div></div>
          </div>
          {activeLead.id==="comment" && (
            <div>
              <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, marginBottom:8 }}>{lang==="es"?"1. Responde públicamente":"1. Reply publicly"}</div>
              {activeSubtype.publicReplies.map((r,i) => <ScriptBox key={i} text={r} idx={i}/>)}
              <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, margin:"16px 0 8px" }}>{lang==="es"?"2. Luego envía DM inmediatamente":"2. Then immediately DM"}</div>
              <ScriptBox text={activeSubtype.dmScript} idx={99}/>
            </div>
          )}
          {activeLead.id==="dm" && (
            <div>
              <div style={{ fontWeight:700, color:W1_NAVY, fontSize:14, marginBottom:8 }}>{lang==="es"?"1. Responde dentro de 24 horas":"1. Reply within 24 hours"}</div>
              <ScriptBox text={activeSubtype.dmScript} idx={0}/>
            </div>
          )}
          <div style={{ borderTop:"1px solid "+W1_GRAY200, paddingTop:16, marginTop:16, display:"flex", gap:10 }}>
            <W1Btn variant="success" onClick={() => { logLead(activeLead.id); reset(); }}>{t.markAsWorked}</W1Btn>
            <W1Btn variant="ghost" onClick={() => setSubtype(null)}>{t.differentResponse}</W1Btn>
          </div>
        </W1Card>
      )}
      {sessionTotal>0 && !active && (
        <W1Card>
          <h3 style={{ color:W1_NAVY, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>{lang==="es"?"Esta Sesión":"This Session"}</h3>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            {LEAD_TYPES.map(lt => sessionCounts[lt.id]>0 && (
              <div key={lt.id} style={{ background:lt.color, border:"1.5px solid "+lt.border, borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>{lt.emoji}</span>
                <span style={{ fontWeight:800, color:W1_NAVY, fontSize:14 }}>{sessionCounts[lt.id]}</span>
                <span style={{ fontSize:12, color:W1_GRAY600 }}>{lt.label}</span>
              </div>
            ))}
          </div>
          <div style={{ background:W1_NAVY, borderRadius:12, padding:16 }}>
            <p style={{ color:W1_YELLOW, fontWeight:700, margin:"0 0 4px", fontSize:14 }}>{t.everyPathLeads}</p>
            <p style={{ color:W1_WHITE, fontSize:13, margin:0 }}>{t.keepGoing}</p>
          </div>
        </W1Card>
      )}
      {!active && (
        <W1Card style={{ background:"linear-gradient(135deg,#002942,#003a5c)", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
          <h3 style={{ color:W1_YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>{t.keepMomentum}</h3>
          <p style={{ color:W1_GRAY400, fontSize:13, lineHeight:1.7, margin:0 }}>{t.keepMomentumDesc}</p>
        </W1Card>
      )}
      {!active && (
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
          <W1Btn variant="ghost" onClick={onBack}>{t.back}</W1Btn>
          <W1Btn onClick={onAmplify}>{t.next}</W1Btn>
        </div>
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
      <W1Card style={{ background:W1_NAVY }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div><h2 style={{ color:W1_YELLOW, fontSize:20, fontWeight:900, margin:"0 0 4px" }}>{t.amplifyTitle}</h2><p style={{ color:W1_GRAY400, fontSize:13, margin:0 }}>{t.amplifySubtitle}</p></div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 20px", textAlign:"center" }}>
            <div style={{ color:W1_YELLOW, fontWeight:900, fontSize:32, lineHeight:1 }}>{10+extra}</div>
            <div style={{ color:W1_GRAY400, fontSize:11, marginTop:4 }}>{t.totalGroupsPosted}</div>
          </div>
        </div>
      </W1Card>
      <W1Card><W1Btn variant="success" onClick={() => setExtra(n=>n+1)}>{t.postedInGroup}</W1Btn></W1Card>
      <W1Card>
        <h3 style={{ color:W1_NAVY, fontSize:16, fontWeight:800, margin:"0 0 16px" }}>{t.moreGroupsNearYou}</h3>
        {loading && <p style={{ color:W1_GRAY600, fontSize:14 }}>{t.findingGroupsNear} {city}...</p>}
        {!loading && groups.length>0 && <GroupTable groups={groups} t={t}/>}
      </W1Card>
      <div style={{ marginTop:8 }}><W1Btn variant="ghost" onClick={onBack}>← {t.back}</W1Btn></div>
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
    <div style={{ position:"fixed", inset:0, background:W1_GRAY100, zIndex:300, overflowY:"auto" }}>
      <div style={{ background:W1_NAVY, padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:W1_YELLOW, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:W1_NAVY, fontSize:18 }}>H</div>
          <div><div style={{ color:W1_WHITE, fontWeight:800, fontSize:16 }}>{t.coachDashboardTitle}</div><div style={{ color:W1_YELLOW, fontSize:12, fontWeight:600 }}>{subs.length} {t.submissions}</div></div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={load} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:W1_WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.refresh}</button>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:W1_WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.back}</button>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 16px 60px" }}>
        {loading && <W1Card><p style={{ textAlign:"center", color:W1_GRAY600, padding:40 }}>{t.loading}</p></W1Card>}
        {!loading && subs.length===0 && <W1Card><div style={{ textAlign:"center", padding:20 }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><p style={{ color:W1_GRAY600 }}>{t.noSubmissions}</p></div></W1Card>}
        {!loading && subs.map((s,i) => (
          <W1Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontWeight:800, color:W1_NAVY, fontSize:17 }}>{s.name||"Unknown"}</div>
                <div style={{ fontSize:13, color:W1_GRAY600, marginTop:2 }}>{s.business} — {s.city}</div>
                <div style={{ fontSize:12, color:W1_GRAY400, marginTop:4 }}>{s.timestamp?new Date(s.timestamp).toLocaleString():"—"}</div>
              </div>
              <span style={{ background:"#DBEAFE", color:"#1D4ED8", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.status||t.postGenerated}</span>
            </div>
            <button onClick={() => setExpanded(expanded===i?null:i)} style={{ marginTop:14, background:W1_GRAY50, border:"1px solid "+W1_GRAY200, borderRadius:8, padding:"6px 14px", fontSize:12, color:W1_NAVY, fontWeight:600, cursor:"pointer" }}>{expanded===i?t.hideDetails:t.viewDetails}</button>
            {expanded===i && s.post && <div style={{ marginTop:16 }}><div style={{ fontSize:13, fontWeight:700, color:W1_NAVY, marginBottom:8 }}>{t.generatedPost}</div><div style={{ background:W1_GRAY50, border:"1px solid "+W1_GRAY200, borderRadius:10, padding:16, fontSize:13, color:W1_GRAY800, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{s.post}</div></div>}
          </W1Card>
        ))}
      </div>
    </div>
  );
}

// ── Celebration ───────────────────────────────────────────────────────────────
function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [330, 392, 494, 587, 698, 880];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'square';
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.07;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + (i === notes.length-1 ? 0.5 : 0.08));
      o.start(t); o.stop(t + 0.6);
    });
  } catch(e) {}
}

function CelebrationScreen({ onNext, onBack, lang }) {
  const t = T[lang];
  const isEs = lang === "es";
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    playCelebrationSound();
    return () => clearTimeout(timer);
  }, []);

  const CONFETTI_COLORS = [W1_YELLOW, "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
  const confettiPieces = Array.from({length: 60}, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  const W1_LEADERBOARD = [
    { rank:"🥇", name:"Michael Metz", leads:786, jobs:32, revenue:"$14,656" },
    { rank:"🥈", name:"Jeffery Echols", leads:300, jobs:31, revenue:"$9,300" },
    { rank:"🥉", name:"Vinny Torregrossa", leads:1400, jobs:31, revenue:"$248,000" },
    { rank:"🏆", name:"Ray Alberts", leads:1332, jobs:30, revenue:"$36,000" },
    { rank:"🎁", name:"Alex & Kelsey Brown", leads:1373, jobs:30, revenue:"$33,000" },
  ];

  return (
    <div style={{ position:"relative" }}>
      {/* Confetti animation */}
      {showConfetti && (
        <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:999, overflow:"hidden" }}>
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
          {confettiPieces.map(p => (
            <div key={p.id} style={{
              position:"absolute", left:p.left+"%", top:"-20px",
              width:p.size+"px", height:p.size+"px",
              background:p.color, borderRadius: p.id%3===0?"50%":"2px",
              animation:`confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
              transform:`rotate(${p.rotation}deg)`,
            }}/>
          ))}
        </div>
      )}

      {/* Hero banner */}
      <div style={{ background:"linear-gradient(135deg,#002942,#003a5c)", borderRadius:20, padding:"36px 28px", marginBottom:20, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ fontSize:72, marginBottom:8, lineHeight:1 }}>🏆</div>
        <div style={{ background:W1_YELLOW, borderRadius:99, display:"inline-block", padding:"6px 20px", marginBottom:12 }}>
          <span style={{ color:W1_NAVY, fontWeight:900, fontSize:14, letterSpacing:"0.05em" }}>
            {isEs?"META DE IMPLEMENTACIÓN SEMANA 1 COMPLETADA":"WEEK 1 IMPLEMENTATION GOAL COMPLETE"}
          </span>
        </div>
        <h1 style={{ color:W1_YELLOW, fontSize:26, fontWeight:900, margin:"0 0 8px", lineHeight:1.2 }}>
          {isEs?"Eres un Vecino Pro ahora.":"You're a Neighborhood Pro now."}
        </h1>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, margin:0, lineHeight:1.7 }}>
          {isEs?"Publicaste tu historia. Entraste a 10 grupos. El vecindario ya sabe quién eres.":"You posted your story. You joined 10 groups. Your neighborhood now knows who you are."}
        </p>
      </div>

      {/* What you did */}
      <W1Card>
        <h3 style={{ color:W1_NAVY, fontSize:16, fontWeight:900, margin:"0 0 14px" }}>
          {isEs?"Lo que ejecutaste esta semana:":"What you executed this week:"}
        </h3>
        {[
          { emoji:"👥", title:isEs?"Entraste a 10 grupos locales de Facebook":"Joined 10 local Facebook groups", desc:isEs?"Ahora estás dentro de las conversaciones que suceden en tu ciudad.":"You're now inside the conversations happening in your city." },
          { emoji:"✍️", title:isEs?"Creaste una publicación de confianza":"Created a trust-first intro post", desc:isEs?"Sin venderte. Sin datos de contacto. Solo tu historia.":"No sales pitch. No contact info. Just your story." },
          { emoji:"📣", title:isEs?"Publicaste en 10 grupos":"Posted across 10 groups", desc:isEs?"Tu cara y tu historia están frente a miles de propietarios locales.":"Your face and your story are now in front of thousands of local homeowners." },
        ].map((item,i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", background:W1_GRAY50, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{item.emoji}</span>
            <div><div style={{ fontWeight:800, color:W1_NAVY, fontSize:13, marginBottom:2 }}>{item.title}</div><div style={{ fontSize:12, color:W1_GRAY600, lineHeight:1.5 }}>{item.desc}</div></div>
          </div>
        ))}
      </W1Card>

      {/* Fishing hook — work your leads */}
      <W1Card style={{ background:"#001e33", border:"2px solid "+W1_YELLOW }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🎣</div>
          <h3 style={{ color:W1_YELLOW, fontSize:18, fontWeight:900, margin:"0 0 8px" }}>
            {isEs?"Lanzaste la línea. Ahora recoge el pez grande.":"You cast the line. Now reel in a lunker."}
          </h3>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.8, margin:0 }}>
            {isEs?"Publicar en grupos es como lanzar la línea. Los prospectos son el pez mordiendo. Trabajar tus prospectos es recoger — y ahí es donde se hace el dinero real.":"Posting in groups is casting the line. The likes, comments, and DMs are the fish biting. Working your leads is reeling in — and that's where the real money gets made."}
          </p>
        </div>
        <div style={{ background:"rgba(254,183,5,0.1)", border:"1.5px solid "+W1_YELLOW, borderRadius:12, padding:"14px 16px" }}>
          <p style={{ color:W1_YELLOW, fontWeight:800, fontSize:13, margin:"0 0 6px" }}>
            {isEs?"Tu trabajo ahora mismo:":"Your job right now:"}
          </p>
          <p style={{ color:W1_WHITE, fontSize:13, lineHeight:1.7, margin:0 }}>
            {isEs?"Cada me gusta, comentario, compartido y DM que recibes es una oportunidad. Usa la sección Trabajar Prospectos para convertir cada interacción en un trabajo reservado antes de que la semana termine.":"Every like, comment, share, and DM you receive is an opportunity. Use the Work Leads section to convert every interaction into a booked job before the week is out."}
          </p>
        </div>
      </W1Card>

      {/* Real leaderboard */}
      <W1Card>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <span style={{ fontSize:22 }}>📊</span>
          <h3 style={{ color:W1_NAVY, fontSize:16, fontWeight:900, margin:0 }}>
            {isEs?"Resultados Reales de la Semana 1 — Tabla de Líderes":"Real Week 1 Results — Leaderboard"}
          </h3>
        </div>
        <p style={{ fontSize:13, color:W1_GRAY600, margin:"0 0 14px", lineHeight:1.6 }}>
          {isEs?"Esto es lo que los mejores Pros lograron con la misma estrategia que acabas de ejecutar:":"This is what the top Pros achieved with the same strategy you just executed:"}
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
          {W1_LEADERBOARD.map((pro, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:i===0?"#FEF9EC":W1_GRAY50, border:"1.5px solid "+(i===0?W1_YELLOW:W1_GRAY200), borderRadius:12, padding:"10px 14px" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{pro.rank}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, color:W1_NAVY, fontSize:13 }}>{pro.name}</div>
                <div style={{ fontSize:11, color:W1_GRAY600 }}>{pro.leads.toLocaleString()} {isEs?"prospectos":"leads"} · {pro.jobs} {isEs?"trabajos":"jobs"}</div>
              </div>
              <div style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:900, flexShrink:0 }}>
                {pro.revenue}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:W1_NAVY, borderRadius:12, padding:"12px 16px", textAlign:"center" }}>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, margin:"0 0 4px" }}>
            {isEs?"La diferencia entre ellos y el promedio:":"The difference between them and average:"}
          </p>
          <p style={{ color:W1_YELLOW, fontWeight:900, fontSize:14, margin:0 }}>
            {isEs?"Trabajaron sus prospectos. Cada. Uno.":"They worked their leads. Every. Single. One."}
          </p>
        </div>
      </W1Card>

      <CardNav onBack={onBack} onNext={onNext} nextLabel={t.next} t={t}/>
    </div>
  );
}

// ── Cross-Post Step ───────────────────────────────────────────────────────────

// Step 1: Open a group you're in and tap Write something
function CpFbOpenGroup() {
  return (
    <svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="130" fill="#ffffff" rx="8"/>
      {/* Group cover */}
      <rect width="400" height="56" fill="#E4E6EB" rx="8"/>
      <rect y="48" width="400" height="8" fill="#E4E6EB"/>
      {/* Group avatar */}
      <rect x="16" y="32" width="48" height="48" rx="8" fill="#BCC0C4" stroke="white" strokeWidth="3"/>
      <text x="40" y="63" textAnchor="middle" fontSize="22">🏘️</text>
      {/* Group name + meta */}
      <text x="76" y="80" fill="#1C1E21" fontSize="13" fontWeight="700">East Nashville Neighbors</text>
      <text x="76" y="94" fill="#65676B" fontSize="11">Public group · 6.1K members</text>
      {/* Write something bar */}
      <rect x="12" y="102" width="376" height="22" rx="11" fill="#F0F2F5" stroke="#E4E6EB" strokeWidth="1.5"/>
      <circle cx="30" cy="113" r="9" fill="#E4E6EB"/>
      <text x="46" y="117" fill="#65676B" fontSize="11">Write something...</text>
      {/* Arrow */}
      <polygon points="310,96 302,87 318,87" fill={W1_YELLOW}/>
      <rect x="230" y="76" width="158" height="18" rx="5" fill={W1_NAVY}/>
      <text x="309" y="89" textAnchor="middle" fill={W1_YELLOW} fontSize="10" fontWeight="700">Tap Write something</text>
    </svg>
  );
}

// Step 2: The "+ Add groups" button — the KEY step
function CpFbAddGroups() {
  return (
    <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="160" fill="#ffffff" rx="8"/>
      {/* Modal header */}
      <text x="200" y="24" textAnchor="middle" fill="#1C1E21" fontSize="14" fontWeight="700">Create post</text>
      <rect x="368" y="8" width="24" height="24" rx="12" fill="#E4E6EB"/>
      <text x="380" y="25" textAnchor="middle" fill="#65676B" fontSize="14">✕</text>
      <rect y="34" width="400" height="1" fill="#E4E6EB"/>
      {/* Profile row */}
      <circle cx="30" cy="54" r="16" fill="#E4E6EB"/>
      <circle cx="30" cy="49" r="7" fill="#BCC0C4"/>
      <path d="M16 64 Q30 56 44 64" fill="#BCC0C4"/>
      <text x="52" y="50" fill="#1C1E21" fontSize="12" fontWeight="700">Your Name</text>
      {/* Private group pill */}
      <rect x="52" y="56" width="92" height="20" rx="10" fill="#E4E6EB"/>
      <text x="98" y="70" textAnchor="middle" fill="#65676B" fontSize="10">🏘 Private group</text>
      {/* Add groups button — the hero element */}
      <rect x="150" y="56" width="118" height="20" rx="10" fill="white" stroke="#1877F2" strokeWidth="2"/>
      <text x="209" y="70" textAnchor="middle" fill="#1877F2" fontSize="10" fontWeight="700">+ Add groups  ˅</text>
      {/* Big callout arrow pointing to it */}
      <polygon points="209,100 199,88 219,88" fill={W1_YELLOW}/>
      <rect x="50" y="102" width="300" height="24" rx="7" fill={W1_NAVY}/>
      <text x="200" y="118" textAnchor="middle" fill={W1_YELLOW} fontSize="12" fontWeight="700">Tap here — select up to 9 more groups</text>
      {/* Write something placeholder */}
      <text x="20" y="144" fill="#65676B" fontSize="13">Write something...</text>
    </svg>
  );
}

// Step 3: Group picker dropdown with multiple groups selected
function CpFbGroupPicker() {
  return (
    <svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="170" fill="#ffffff" rx="8"/>
      {/* Dropdown header */}
      <rect width="400" height="36" fill="#F0F2F5" rx="8"/>
      <rect y="28" width="400" height="8" fill="#F0F2F5"/>
      <text x="200" y="22" textAnchor="middle" fill="#1C1E21" fontSize="13" fontWeight="700">Select groups</text>
      {/* Search bar */}
      <rect x="12" y="42" width="376" height="28" rx="14" fill="#F0F2F5"/>
      <text x="30" y="60" fill="#65676B" fontSize="12">🔍  Search your groups</text>
      {/* Group rows */}
      {[
        { name:"East Nashville Neighbors", checked:true,  y:84  },
        { name:"Nashville Homeowners Hub",  checked:true,  y:108 },
        { name:"Donelson Community",        checked:true,  y:132 },
        { name:"Nashville Buy Sell Trade",  checked:false, y:156 },
      ].map((g,i) => (
        <g key={i}>
          <rect x="12" y={g.y-14} width="376" height="22" rx="6" fill={g.checked?"#EFF6FF":"transparent"}/>
          <rect x="16" y={g.y-12} width="18" height="18" rx="4" fill={g.checked?"#1877F2":"#E4E6EB"} stroke={g.checked?"#1877F2":"#BCC0C4"} strokeWidth="1.5"/>
          {g.checked && <text x="25" y={g.y+1} textAnchor="middle" fill="white" fontSize="11" fontWeight="900">✓</text>}
          <text x="42" y={g.y+1} fill="#1C1E21" fontSize="12">{g.name}</text>
        </g>
      ))}
      {/* Bottom hint */}
      <rect x="0" y="160" width="400" height="10" fill="white"/>
    </svg>
  );
}

// Step 4: Post button with multiple group badges visible
function CpFbPostToAll() {
  return (
    <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="140" fill="#ffffff" rx="8"/>
      {/* Modal header */}
      <text x="200" y="22" textAnchor="middle" fill="#1C1E21" fontSize="14" fontWeight="700">Create post</text>
      <rect y="30" width="400" height="1" fill="#E4E6EB"/>
      {/* Group pills showing selected groups */}
      <rect x="12" y="38" width="74" height="18" rx="9" fill="#E8F0FE" stroke="#1877F2" strokeWidth="1"/>
      <text x="49" y="51" textAnchor="middle" fill="#1877F2" fontSize="9" fontWeight="700">🏘 E. Nashville</text>
      <rect x="92" y="38" width="80" height="18" rx="9" fill="#E8F0FE" stroke="#1877F2" strokeWidth="1"/>
      <text x="132" y="51" textAnchor="middle" fill="#1877F2" fontSize="9" fontWeight="700">🏘 Homeowners</text>
      <rect x="178" y="38" width="70" height="18" rx="9" fill="#E8F0FE" stroke="#1877F2" strokeWidth="1"/>
      <text x="213" y="51" textAnchor="middle" fill="#1877F2" fontSize="9" fontWeight="700">🏘 Donelson</text>
      <text x="262" y="51" fill="#65676B" fontSize="10">+ 7 more</text>
      {/* Post text lines */}
      <rect x="12" y="64" width="300" height="7" rx="3" fill="#E4E6EB"/>
      <rect x="12" y="76" width="240" height="7" rx="3" fill="#E4E6EB"/>
      <rect x="12" y="88" width="260" height="7" rx="3" fill="#E4E6EB"/>
      {/* Photo thumbnail */}
      <rect x="328" y="60" width="56" height="42" rx="6" fill="#E4E6EB"/>
      <text x="356" y="86" textAnchor="middle" fontSize="20">🧑</text>
      {/* Post button */}
      <rect x="12" y="108" width="376" height="26" rx="6" fill="#1877F2"/>
      <text x="200" y="125" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Post</text>
      {/* Arrow */}
      <polygon points="200,104 192,96 208,96" fill={W1_YELLOW}/>
    </svg>
  );
}

function CrossPostStep({ onBack, onNext, lang, groups, groupsLoading, t, post, postEn }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  function copyPost() {
    const textToCopy = (lang === "es" && postEn) ? postEn : post;
    if (!textToCopy) return;
    try { const el=document.createElement("textarea"); el.value=textToCopy; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(textToCopy); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  }

  const steps = [
    {
      num: 1,
      label: lang === "es" ? "Únete a 9 grupos más cerca de ti" : "Join 9 more groups near you",
      detail: lang === "es"
        ? "Busca estos grupos en Facebook y únete a todos los que puedas antes de publicar. Grupos públicos — publicas de inmediato. Grupos privados — únete y espera aprobación."
        : "Search these groups on Facebook and join as many as you can before posting. Public groups — post immediately. Private groups — join and wait for approval.",
      illustration: null,
      extra: (!groupsLoading && groups && groups.length > 0) ? (
        <div style={{ marginTop:4 }}>
          <GroupTable groups={groups} t={t}/>
        </div>
      ) : groupsLoading ? (
        <p style={{ color:W1_GRAY600, fontSize:14, marginTop:16 }}>{t.loadingGroupSuggestions}</p>
      ) : null,
    },
    {
      num: 2,
      label: lang === "es" ? "Abre un grupo y toca \"Escribir algo\"" : "Open a group and tap \"Write something\"",
      detail: lang === "es"
        ? "Ve a cualquier grupo de Facebook al que te hayas unido. Toca el cuadro Escribir algo en la parte superior del feed."
        : "Go to any Facebook group you've joined. Tap the Write something box at the top of the feed.",
      illustration: <CpFbOpenGroup />,
    },
    {
      num: 3,
      label: lang === "es" ? "Toca \"+ Agregar grupos\" y selecciona hasta 9 más" : "Tap \"+ Add groups\" and select up to 9 more",
      detail: lang === "es"
        ? "Este es el paso clave. Toca el botón + Agregar grupos junto a tu nombre. Selecciona hasta 9 grupos más — tu publicación llegará a todos a la vez."
        : "This is the key step. Tap the + Add groups button next to your name. Select up to 9 more groups — your post will go to all of them at once.",
      badge: lang === "es" ? "⭐ Paso clave" : "⭐ Key step",
      illustration: <CpFbAddGroups />,
    },
    {
      num: 4,
      label: lang === "es" ? "Elige los grupos en los que quieres publicar" : "Choose which groups to post in",
      detail: lang === "es"
        ? "Busca y selecciona grupos de vecinos, propietarios de viviendas y comunidades locales. Marca todos los relevantes para tu área de servicio."
        : "Search and check off neighbors, homeowners, and local community groups. Check every one relevant to your service area.",
      illustration: <CpFbGroupPicker />,
    },
    {
      num: 5,
      label: lang === "es" ? "Pega tu publicación, adjunta tu foto y toca Publicar" : "Paste your post, attach your photo, and tap Post",
      detail: lang === "es"
        ? "Pega exactamente la misma publicación. Adjunta la misma foto. Toca el botón azul Publicar — llega a todos los grupos seleccionados de una vez."
        : "Paste the exact same post. Attach the same photo. Tap the blue Post button — it goes to all selected groups at once.",
      illustration: <CpFbPostToAll />,
      extra: (
        <div style={{ marginTop:16 }}>
          <button onClick={copyPost} style={{ background:copied?W1_GREEN:W1_NAVY, color:copied?W1_WHITE:W1_YELLOW, border:"none", borderRadius:10, padding:"13px 24px", fontWeight:700, fontSize:15, cursor:"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:8 }}>
            {copied
              ? (lang==="es"?"✓ ¡Copiado!":"✓ Copied!")
              : (lang==="es"?"📋 Copiar publicación de nuevo":"📋 Copy post again")}
          </button>
        </div>
      ),
    },
  ];

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  return (
    <W1Card>
      {/* Progress bar */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<=stepIdx?W1_NAVY:W1_GRAY200, transition:"background 0.2s" }}/>
        ))}
      </div>

      {/* Step badge */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:800 }}>
          {lang==="es"?"PASO ":"STEP "}{step.num} {lang==="es"?"de":"of"} {steps.length}
        </span>
        {step.badge && (
          <span style={{ background:"#EFF6FF", color:"#1877F2", borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
            {step.badge}
          </span>
        )}
      </div>

      <h2 style={{ fontSize:20, fontWeight:800, color:W1_NAVY, margin:"0 0 8px", lineHeight:1.3 }}>{step.label}</h2>
      <p style={{ fontSize:14, color:W1_GRAY600, margin:"0 0 20px", lineHeight:1.7 }}>{step.detail}</p>

      {/* Illustration — only when present */}
      {step.illustration && (
        <div style={{ borderRadius:12, overflow:"hidden", border:"1.5px solid "+W1_GRAY200, background:W1_GRAY50 }}>
          {step.illustration}
        </div>
      )}

      {/* Extra content e.g. group suggestions on step 3 */}
      {step.extra}

      <CardNav
        onBack={stepIdx === 0 ? onBack : () => setStepIdx(i => i - 1)}
        onNext={isLast ? onNext : () => setStepIdx(i => i + 1)}
        nextLabel={isLast ? t.next : (lang==="es"?"Siguiente →":"Next →")}
        t={t}
      />
    </W1Card>
  );
}

// ── Post It Step ─────────────────────────────────────────────────────────────

function FbGroupJoinCard() {
  return (
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="180" fill="#F0F2F5" rx="8"/>
      <rect x="12" y="12" width="376" height="70" rx="10" fill="white"/>
      <rect x="20" y="22" width="50" height="50" rx="8" fill="#E4E6EB"/>
      <text x="45" y="52" textAnchor="middle" fontSize="22">🏘️</text>
      <text x="82" y="38" fill="#1C1E21" fontSize="13" fontWeight="700">East Nashville Neighbors</text>
      <text x="82" y="52" fill="#65676B" fontSize="11">Public · 16K members · 80+ posts a day</text>
      <text x="82" y="66" fill="#65676B" fontSize="10">👥 4 friends are members</text>
      <rect x="310" y="30" width="66" height="30" rx="6" fill="#E7F3FF"/>
      <text x="343" y="50" textAnchor="middle" fill="#1877F2" fontSize="13" fontWeight="700">Join</text>
      <polygon points="304,45 290,37 290,53" fill="#10B981"/>
      <rect x="188" y="36" width="98" height="18" rx="5" fill="#10B981"/>
      <text x="237" y="49" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Tap Join</text>
      <rect x="12" y="96" width="376" height="70" rx="10" fill="white"/>
      <rect x="20" y="106" width="50" height="50" rx="8" fill="#E4E6EB"/>
      <text x="45" y="136" textAnchor="middle" fontSize="22">❤️</text>
      <text x="82" y="122" fill="#1C1E21" fontSize="13" fontWeight="700">East Nashville/Inglewood Community</text>
      <text x="82" y="136" fill="#65676B" fontSize="11">Public · 4.1K members · 6 posts a day</text>
      <rect x="310" y="114" width="66" height="30" rx="6" fill="#E7F3FF"/>
      <text x="343" y="134" textAnchor="middle" fill="#1877F2" fontSize="13" fontWeight="700">Join</text>
    </svg>
  );
}

function FbGroupOpen() {
  return (
    <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="140" fill="#ffffff" rx="8"/>
      <rect width="400" height="56" fill="#E4E6EB" rx="8"/>
      <rect y="48" width="400" height="8" fill="#E4E6EB"/>
      <rect x="16" y="32" width="48" height="48" rx="8" fill="#BCC0C4" stroke="white" strokeWidth="3"/>
      <text x="40" y="63" textAnchor="middle" fontSize="22">🏘️</text>
      <text x="76" y="80" fill="#1C1E21" fontSize="14" fontWeight="700">East Nashville Neighbors</text>
      <text x="76" y="95" fill="#65676B" fontSize="11">Public group · 16K members</text>
      <rect x="280" y="72" width="108" height="30" rx="6" fill="#E4E6EB"/>
      <text x="334" y="91" textAnchor="middle" fill="#1C1E21" fontSize="12" fontWeight="700">Visit group</text>
      <polygon points="274,87 260,79 260,95" fill={W1_YELLOW}/>
      <rect x="100" y="110" width="188" height="22" rx="6" fill={W1_NAVY}/>
      <text x="194" y="125" textAnchor="middle" fill={W1_YELLOW} fontSize="11" fontWeight="700">Tap to open the group</text>
    </svg>
  );
}

function FbComposerWriteSomething() {
  return (
    <svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="130" fill="#ffffff" rx="8"/>
      <rect width="400" height="36" fill="#F0F2F5" rx="8"/>
      <rect y="28" width="400" height="8" fill="#F0F2F5"/>
      <circle cx="22" cy="18" r="10" fill="#E4E6EB"/>
      <rect x="38" y="10" width="100" height="8" rx="4" fill="#BCC0C4"/>
      <rect x="38" y="22" width="70" height="6" rx="3" fill="#E4E6EB"/>
      <rect x="12" y="46" width="376" height="40" rx="20" fill="#F0F2F5" stroke="#E4E6EB" strokeWidth="1.5"/>
      <circle cx="36" cy="66" r="12" fill="#E4E6EB"/>
      <circle cx="36" cy="62" r="5" fill="#BCC0C4"/>
      <path d="M26 74 Q36 68 46 74" fill="#BCC0C4"/>
      <text x="56" y="70" fill="#65676B" fontSize="13">Write something...</text>
      <polygon points="224,100 216,88 232,88" fill={W1_YELLOW}/>
      <rect x="140" y="100" width="190" height="24" rx="6" fill={W1_NAVY}/>
      <text x="235" y="116" textAnchor="middle" fill={W1_YELLOW} fontSize="11" fontWeight="700">Tap here to start your post</text>
    </svg>
  );
}

function FbComposerPaste() {
  return (
    <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="160" fill="#ffffff" rx="8"/>
      <rect width="400" height="44" fill="#ffffff" rx="8"/>
      <rect y="36" width="400" height="1" fill="#E4E6EB"/>
      <text x="200" y="27" textAnchor="middle" fill="#1C1E21" fontSize="14" fontWeight="700">Create post</text>
      <text x="382" y="27" textAnchor="middle" fill="#65676B" fontSize="18">✕</text>
      <circle cx="26" cy="60" r="12" fill="#E4E6EB"/>
      <circle cx="26" cy="56" r="5" fill="#BCC0C4"/>
      <path d="M16 68 Q26 62 36 68" fill="#BCC0C4"/>
      <text x="44" y="57" fill="#1C1E21" fontSize="12" fontWeight="700">Your Name</text>
      <rect x="12" y="76" width="376" height="52" rx="8" fill="#F9F9F9" stroke="#E4E6EB" strokeWidth="1"/>
      <text x="24" y="96" fill="#1C1E21" fontSize="12">I still remember the moment I decided...</text>
      <rect x="24" y="104" width="280" height="6" rx="3" fill="#E4E6EB" opacity="0.7"/>
      <rect x="24" y="116" width="220" height="6" rx="3" fill="#E4E6EB" opacity="0.5"/>
      <rect x="80" y="48" width="110" height="26" rx="6" fill="#1C1E21"/>
      <text x="92" y="65" fill="white" fontSize="11" fontWeight="700">📋 Paste</text>
      <polygon points="120,74 112,66 128,66" fill="#1C1E21"/>
      <polygon points="310,76 302,64 318,64" fill={W1_YELLOW}/>
      <rect x="226" y="50" width="162" height="20" rx="5" fill={W1_NAVY}/>
      <text x="307" y="64" textAnchor="middle" fill={W1_YELLOW} fontSize="10" fontWeight="700">Hold + tap Paste</text>
    </svg>
  );
}

function FbComposerAttachPhoto() {
  return (
    <svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="170" fill="#ffffff" rx="8"/>
      <rect width="400" height="44" fill="#ffffff" rx="8"/>
      <rect y="36" width="400" height="1" fill="#E4E6EB"/>
      <text x="200" y="27" textAnchor="middle" fill="#1C1E21" fontSize="14" fontWeight="700">Create post</text>
      <text x="16" y="62" fill="#1C1E21" fontSize="12">I still remember the moment I decided...</text>
      <rect x="16" y="70" width="300" height="6" rx="3" fill="#E4E6EB" opacity="0.6"/>
      <rect x="16" y="82" width="240" height="6" rx="3" fill="#E4E6EB" opacity="0.5"/>
      <rect x="16" y="94" width="270" height="6" rx="3" fill="#E4E6EB" opacity="0.4"/>
      <rect x="0" y="110" width="400" height="1" fill="#E4E6EB"/>
      <rect x="12" y="118" width="376" height="40" rx="8" fill="#F0F2F5"/>
      <text x="30" y="143" fill="#65676B" fontSize="12" fontWeight="600">Add to your post</text>
      <rect x="196" y="122" width="32" height="32" rx="6" fill="#E8F5E9" stroke="#45BD62" strokeWidth="2"/>
      <text x="212" y="143" textAnchor="middle" fontSize="18">🖼️</text>
      <text x="240" y="143" fill="#F7B928" fontSize="18">😊</text>
      <text x="268" y="143" fill="#1877F2" fontSize="18">📍</text>
      <text x="296" y="143" fill="#F02849" fontSize="18">🎬</text>
      <text x="324" y="143" fill="#65676B" fontSize="16">···</text>
      <polygon points="212,116 204,106 220,106" fill="#10B981"/>
      <rect x="60" y="92" width="144" height="20" rx="5" fill="#10B981"/>
      <text x="132" y="106" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Tap to attach photo</text>
    </svg>
  );
}

function FbComposerPostButton() {
  return (
    <svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", borderRadius:10, display:"block" }}>
      <rect width="400" height="130" fill="#ffffff" rx="8"/>
      <rect width="400" height="44" fill="#ffffff" rx="8"/>
      <rect y="43" width="400" height="1" fill="#E4E6EB"/>
      <text x="200" y="27" textAnchor="middle" fill="#1C1E21" fontSize="14" fontWeight="700">Create post</text>
      <text x="382" y="27" textAnchor="middle" fill="#65676B" fontSize="18">✕</text>
      <rect x="16" y="56" width="300" height="8" rx="4" fill="#E4E6EB" opacity="0.7"/>
      <rect x="16" y="70" width="240" height="8" rx="4" fill="#E4E6EB" opacity="0.5"/>
      <rect x="330" y="50" width="56" height="42" rx="6" fill="#E4E6EB"/>
      <text x="358" y="77" textAnchor="middle" fontSize="20">🧑</text>
      <rect x="12" y="102" width="376" height="20" rx="6" fill="#E4E6EB" opacity="0.4"/>
      <rect x="264" y="98" width="120" height="26" rx="6" fill="#1877F2"/>
      <text x="324" y="115" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Post</text>
      <polygon points="258,111 244,103 244,119" fill={W1_YELLOW}/>
      <rect x="60" y="103" width="180" height="22" rx="6" fill={W1_NAVY}/>
      <text x="150" y="118" textAnchor="middle" fill={W1_YELLOW} fontSize="11" fontWeight="700">Tap Post — you're done!</text>
    </svg>
  );
}

function PostItStep({ onBack, onNext, lang, post, postEn, postLoading, postError, answers, onGenerate, onSetPost, allCh3Met, groups, groupsLoading, onWritePost, stepIdx, onStepChange }) {
  const t = T[lang];
  const [copied, setCopied] = useState(false);
  const [photoIdeas, setPhotoIdeas] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  function goTo(i) { onStepChange(i); setCopied(false); }

  // Auto-generate post when user reaches step 4 (paste step) and no post yet
  useEffect(() => {
    if (stepIdx === 4 && allCh3Met && !post && !postLoading) {
      onGenerate(answers);
    }
  }, [stepIdx]);

  // Generate photo ideas when user reaches step 5 (photo step)
  useEffect(() => {
    if (stepIdx === 5 && !photoIdeas && !photoLoading) {
      setPhotoLoading(true);
      const isEs = lang === "es";
      const prompt = "A home service business owner filled out these details:\n- Human detail: "+(answers.humanDetail||"not provided")+"\n- Local place: "+(answers.localFlavor||"not provided")+"\n- Why started: "+(answers.whyStarted||"not provided")+"\n- Hero moment: "+(answers.heroMoment||"not provided")+"\n\nGive 3 personalized Facebook photo ideas rated Good, Better, Best. Return ONLY valid JSON"+(isEs?", in Spanish":"")+", no markdown:\n{\"good\":{\"label\":\"short title\",\"desc\":\"1 sentence\"},\"better\":{\"label\":\"short title\",\"desc\":\"1 sentence tied to their details\"},\"best\":{\"label\":\"short title\",\"desc\":\"1 sentence most trust-building for them\"}}";
      W1_callClaude([{ role:"user", content:prompt }])
        .then(reply => {
          const BT3=String.fromCharCode(96);const cleaned=reply.split(BT3+BT3+BT3+"json").join("").split(BT3+BT3+BT3).join("").trim();
          const s=cleaned.indexOf("{"), e=cleaned.lastIndexOf("}");
          if (s!==-1&&e!==-1) setPhotoIdeas(JSON.parse(cleaned.slice(s,e+1)));
          else throw new Error("parse");
        })
        .catch(() => setPhotoIdeas({ good:{label:lang==="es"?"Foto real tuya":"Any real photo of you",desc:lang==="es"?"Cara visible, luz natural.":"Face visible, natural light."}, better:{label:lang==="es"?"Haciendo algo que amas":"You doing something you love",desc:lang==="es"?"Un hobby, el juego de tus hijos, tu lugar local.":"A hobby, your kids' game, your local spot."}, best:{label:lang==="es"?"Momento candid en el trabajo":"A candid moment on the job",desc:lang==="es"?"Tú trabajando, sonriendo, cara visible.":"You working, smiling, face clearly visible."} }))
        .finally(() => setPhotoLoading(false));
    }
  }, [stepIdx]);

  function copyPost() {
    const textToCopy = (lang === "es" && postEn) ? postEn : post;
    if (!textToCopy) return;
    try { const el=document.createElement("textarea"); el.value=textToCopy; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); } catch(e) { navigator.clipboard&&navigator.clipboard.writeText(textToCopy); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  }

  const photoTiers = [
    { key:"good",   badge:"GOOD",    color:"#F0FDF4", border:"#86EFAC", textColor:"#166534" },
    { key:"better", badge:"BETTER",  color:"#EFF6FF", border:"#93C5FD", textColor:"#1E40AF" },
    { key:"best",   badge:"BEST ⭐", color:"#FEF9EC", border:W1_YELLOW,    textColor:"#92400E" },
  ];

  const steps = [
    // Step 1: Find & join groups
    {
      num: 1,
      label: lang === "es" ? "Únete a un grupo" : "Join a group",
      detail: lang === "es"
        ? "Busca uno de estos grupos en Facebook y únete. Si es público puedes publicar de inmediato. Si es privado, espera aprobación."
        : "Find one of these groups on Facebook and join it. Public groups — you can post right away. Private groups — join and wait for approval.",
      illustration: null,
      extra: (!groupsLoading && groups && groups.length > 0) ? (
        <div style={{ marginTop:8 }}><GroupTable groups={groups} t={t}/></div>
      ) : groupsLoading ? (
        <p style={{ color:W1_GRAY600, fontSize:14, marginTop:12 }}>{t.loadingGroupSuggestions}</p>
      ) : null,
    },
    // Step 2: Join
    {
      num: 2,
      label: lang === "es" ? "Toca Unirse en el grupo" : "Tap Join on the group",
      detail: lang === "es"
        ? "Una vez que encuentres el grupo, toca el botón azul Unirse."
        : "Once you find the group, tap the blue Join button.",
      illustration: <FbGroupJoinCard />,
    },
    // Step 3: Open group
    {
      num: 3,
      label: lang === "es" ? "Abre el grupo" : "Open the group",
      detail: lang === "es"
        ? "Toca el nombre del grupo para abrirlo y ver el feed."
        : "Tap the group name to open it and see the group feed.",
      illustration: <FbGroupOpen />,
    },
    // Step 4: Tap Write something
    {
      num: 4,
      label: lang === "es" ? "Toca \"Escribir algo\"" : "Tap \"Write something\"",
      detail: lang === "es"
        ? "En la parte superior del feed del grupo, toca el cuadro que dice Escribir algo."
        : "At the top of the group feed, tap the box that says Write something.",
      illustration: <FbComposerWriteSomething />,
    },
    // Step 5: Copy & paste post
    {
      num: 5,
      label: lang === "es" ? "Copia y pega tu publicación" : "Copy and paste your post",
      detail: lang === "es"
        ? "Copia tu publicación aquí abajo, luego pégala en el cuadro de Facebook."
        : "Copy your post below, then paste it into the Facebook text box.",
      illustration: <FbComposerPaste />,
      extra: (
        <div>
          {postLoading && (
            <div style={{ textAlign:"center", padding:"24px 0", color:W1_GRAY600, fontSize:14 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>✨</div>
              {lang==="es"?"Escribiendo tu publicación...":"Writing your post..."}
            </div>
          )}
          {postError && !postLoading && (
            <div style={{ background:"#FEF2F2", borderRadius:10, padding:"10px 14px", marginBottom:12, color:W1_RED, fontSize:13 }}>
              {t.couldNotGenerate} <button onClick={() => onGenerate(answers)} style={{ background:"none", border:"none", color:W1_NAVY, fontWeight:700, cursor:"pointer", textDecoration:"underline", fontSize:13 }}>{t.tryAgain}</button>
            </div>
          )}
          {post && !postLoading && (
            <>
              <pre
                style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+W1_NAVY, borderRadius:12, padding:16, fontSize:14, lineHeight:1.8, color:W1_GRAY800, fontFamily:"inherit", background:W1_GRAY50, margin:"0 0 14px", whiteSpace:"pre-wrap", wordBreak:"break-word", userSelect:"text", cursor:"default" }}
              >{post}</pre>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
                <button onClick={copyPost} style={{ background:copied?W1_GREEN:W1_YELLOW, color:copied?W1_WHITE:W1_NAVY, border:"none", borderRadius:10, padding:"13px 24px", fontWeight:700, fontSize:15, cursor:"pointer", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:8 }}>
                  {copied ? (lang==="es"?"✓ ¡Copiado!":"✓ Copied!") : (lang==="es"?"📋 Copiar publicación":"📋 Copy post")}
                </button>
                <button onClick={() => { setCopied(false); onGenerate(answers); }} style={{ background:"none", border:"none", fontSize:13, fontWeight:700, color:W1_GRAY600, cursor:"pointer", textDecoration:"underline", padding:0, fontFamily:"inherit" }}>{t.regenerate}</button>
              </div>
              {/* Paste tips — shown after copy button */}
              <div style={{ background:"#EFF6FF", borderRadius:10, padding:"12px 16px", fontSize:13, color:W1_NAVY }}>
                <p style={{ fontWeight:700, margin:"0 0 8px" }}>{lang==="es"?"Atajos para pegar:":"Pasting Shortcuts:"}</p>
                <ul style={{ margin:0, paddingLeft:18, lineHeight:2 }}>
                  {(lang==="es" ? [
                    "Windows: Ctrl + V",
                    "Mac: Command + V",
                    "Móvil: mantén presionado el área de texto y toca Pegar",
                  ] : [
                    "Windows: Ctrl + V",
                    "Mac: Command + V",
                    "Mobile: long-press the text area and tap Paste",
                  ]).map((tip,i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            </>
          )}
          {!post && !postLoading && (
            <div style={{ background:"#FEF9EC", border:"1.5px solid "+W1_YELLOW, borderRadius:12, padding:20 }}>
              <p style={{ fontWeight:700, color:W1_NAVY, fontSize:14, margin:"0 0 6px" }}>{t.needPostToContinue}</p>
              <p style={{ color:W1_GRAY600, fontSize:13, lineHeight:1.7, margin:"0 0 16px" }}>{t.needPostDesc}</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                <button onClick={onWritePost} style={{ background:W1_NAVY, color:W1_YELLOW, border:"none", borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                  ✍️ {lang==="es"?"Escribir mi publicación":"Write My Post"}
                </button>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:W1_NAVY, margin:"0 0 8px" }}>{t.pastePostLabel}</p>
              <textarea
                value={post}
                onChange={e => onSetPost(e.target.value)}
                rows={6}
                placeholder={t.pastePlaceholder}
                style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+W1_GRAY200, borderRadius:10, padding:14, fontSize:14, lineHeight:1.8, color:W1_GRAY800, fontFamily:"inherit", resize:"vertical", background:W1_WHITE, outline:"none" }}
              />
            </div>
          )}
        </div>
      ),
    },
    // Step 6: Attach photo
    {
      num: 6,
      label: lang === "es" ? "Adjunta tu foto" : "Attach your photo",
      detail: lang === "es"
        ? "Toca el ícono de foto en la barra inferior del compositor y selecciona tu foto."
        : "Tap the photo icon in the composer toolbar and select your photo.",
      illustration: <FbComposerAttachPhoto />,
      extra: (
        <div style={{ marginTop:16 }}>
          <p style={{ fontSize:13, fontWeight:700, color:W1_NAVY, margin:"0 0 10px" }}>
            {lang==="es"?"📷 Ideas de foto para ti":"📷 Photo ideas for you"}
          </p>
          {photoLoading ? (
            <p style={{ fontSize:13, color:W1_GRAY400, fontStyle:"italic" }}>{lang==="es"?"Generando ideas...":"Generating ideas..."}</p>
          ) : photoIdeas ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
              {photoTiers.map(tier => (
                <div key={tier.key} style={{ background:tier.color, border:"1.5px solid "+tier.border, borderRadius:10, padding:"10px", display:"flex", flexDirection:"column", gap:6 }}>
                  <span style={{ background:tier.border, color:tier.textColor, borderRadius:4, padding:"2px 6px", fontSize:10, fontWeight:800, alignSelf:"flex-start" }}>{tier.badge}</span>
                  <div style={{ fontWeight:700, color:W1_NAVY, fontSize:12, lineHeight:1.3 }}>{photoIdeas[tier.key].label}</div>
                  <div style={{ fontSize:11, color:W1_GRAY600, lineHeight:1.4 }}>{photoIdeas[tier.key].desc}</div>
                </div>
              ))}
            </div>
          ) : null}
          <div style={{ fontSize:12, fontWeight:700, color:W1_GREEN, marginBottom:8 }}>{t.goodPhotos}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {GOOD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:8, overflow:"hidden", border:"2px solid #86EFAC", aspectRatio:"1", background:W1_GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML="<span style='font-size:24px;display:flex;align-items:center;justify-content:center;height:100%'>📸</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:W1_RED, marginBottom:8 }}>{t.badPhotos}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {BAD_PHOTOS.map((src,i) => <div key={i} style={{ borderRadius:8, overflow:"hidden", border:"2px solid #FCA5A5", aspectRatio:"1", background:W1_GRAY100 }}><img src={src} alt="" onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML="<span style='font-size:24px;display:flex;align-items:center;justify-content:center;height:100%'>🚫</span>";}} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/></div>)}
          </div>
        </div>
      ),
    },
    // Step 7: Tap Post
    {
      num: 7,
      label: lang === "es" ? "Toca Publicar" : "Tap Post",
      detail: lang === "es"
        ? "Toca el botón azul Publicar. ¡Eso es todo! Tu historia ya está frente a tu comunidad."
        : "Tap the blue Post button. That's it — your story is now in front of your community.",
      illustration: <FbComposerPostButton />,
    },
  ];

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const nextBlocked = stepIdx === 4 && !post;

  return (
    <W1Card>
      {/* Flat progress bar across all 7 steps */}
      <div style={{ display:"flex", gap:4, marginBottom:20 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<=stepIdx?W1_NAVY:W1_GRAY200, transition:"background 0.2s" }}/>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ background:W1_NAVY, color:W1_YELLOW, borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:800 }}>
          {lang==="es"?"PASO ":"STEP "}{step.num} {lang==="es"?"de":"of"} {steps.length}
        </span>
      </div>
      <h2 style={{ fontSize:20, fontWeight:800, color:W1_NAVY, margin:"0 0 8px", lineHeight:1.3 }}>{step.label}</h2>
      <p style={{ fontSize:14, color:W1_GRAY600, margin:"0 0 20px", lineHeight:1.7 }}>{step.detail}</p>
      {step.illustration && (
        <div style={{ borderRadius:12, overflow:"hidden", border:"1.5px solid "+W1_GRAY200, background:W1_GRAY50, marginBottom:step.extra?16:0 }}>
          {step.illustration}
        </div>
      )}
      {step.extra}
      {nextBlocked && (
        <p style={{ fontSize:12, color:W1_GRAY400, margin:"16px 0 0", textAlign:"center" }}>
          {lang==="es"?"Copia tu publicación para continuar":"Copy your post to continue"}
        </p>
      )}
      <CardNav
        onBack={stepIdx === 0 ? onBack : () => goTo(stepIdx - 1)}
        onNext={nextBlocked ? undefined : (isLast ? onNext : () => goTo(stepIdx + 1))}
        nextDisabled={nextBlocked}
        nextLabel={isLast ? t.next : (lang==="es"?"Siguiente →":"Next →")}
        t={t}
      />
    </W1Card>
  );
}


// ── Main App ──────────────────────────────────────────────────────────────────
function Week1App({onHome}) {
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
  const [postStepIdx, setPostStepIdx] = useState(0);
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
    if (appPhase==="dopost" && groups5.length===0 && !groupsLoading) {
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
        W1_callClaude([{ role:"user", content:"Translate the following Facebook post from Spanish to English. Keep the same tone, structure, and line breaks. Output only the translated post, no labels or explanation.\n\n"+c }])
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
    setAppPhase("lane");
  }

  const ALL_QUESTIONS = lang === "es" ? QUESTIONS_ES : QUESTIONS_EN;
  const ch3Qs = ALL_QUESTIONS.filter(q => q.chapter === "ch3");
  const allCh3Met = ch3Qs.every(q => wordCount(answers[q.id]) >= q.minWords);
  const answeredN = ALL_QUESTIONS.filter(q => wordCount(answers[q.id]) >= q.minWords).length;
  const AUDIT_ITEMS = lang === "es" ? AUDIT_ITEMS_ES : AUDIT_ITEMS_EN;

  return (
    <div style={{ minHeight:"100vh", background:W1_GRAY100, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      {showDashboard && <CoachDashboard onClose={() => setShowDashboard(false)} lang={lang}/>}
      {showCoachLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:W1_WHITE, borderRadius:20, padding:32, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>🔐</div>
            <h3 style={{ color:W1_NAVY, fontSize:18, fontWeight:800, margin:"0 0 16px", textAlign:"center" }}>{t.coachAccess}</h3>
            <input type="password" value={passcodeInput} onChange={e=>{setPasscodeInput(e.target.value);setPasscodeError(false);}}
              onKeyDown={e=>{if(e.key==="Enter"){if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true);}}}
              placeholder={t.enterPasscode} style={{ width:"100%", boxSizing:"border-box", border:"2px solid "+(passcodeError?W1_RED:W1_GRAY200), borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none", marginBottom:8 }}/>
            {passcodeError && <p style={{ color:W1_RED, fontSize:12, margin:"0 0 8px" }}>{t.incorrectPasscode}</p>}
            <W1Btn style={{ width:"100%", justifyContent:"center", marginBottom:10 }} onClick={() => { if(passcodeInput===COACH_PASSCODE){setShowDashboard(true);setShowCoachLogin(false);setPasscodeInput("");}else setPasscodeError(true); }}>{t.enterDashboard}</W1Btn>
            <button onClick={() => { setShowCoachLogin(false);setPasscodeInput("");setPasscodeError(false); }} style={{ width:"100%", background:"none", border:"none", color:W1_GRAY400, fontSize:13, cursor:"pointer", padding:"4px 0" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:W1_NAVY, color:W1_WHITE, borderRadius:12, padding:"14px 24px", fontSize:14, fontWeight:600, zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", gap:10, whiteSpace:"nowrap" }}>
          <span style={{ fontSize:18 }}>✅</span> {t.saveExitToast}
        </div>
      )}

      {/* Header */}
      <div style={{ background:W1_NAVY, padding:"0 16px", height:W1_HEADER_H, display:"flex", alignItems:"center", justifyContent:"space-between", position:"fixed", top:0, left:0, right:0, zIndex:160, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {onHome && <button onClick={onHome} style={{ background:W1_YELLOW, border:"none", borderRadius:8, padding:"7px 14px", color:W1_NAVY, fontSize:12, fontWeight:800, cursor:"pointer" }}>{t.allWeeks}</button>}
          <div>
            <div style={{ color:W1_WHITE, fontWeight:800, fontSize:14, lineHeight:1 }}>{t.appTitle}</div>
            <div style={{ color:W1_YELLOW, fontSize:11, fontWeight:600 }}>{t.appSubtitle}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Language toggle */}
          <div style={{ display:"inline-flex", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, overflow:"hidden" }}>
            {["en","es"].map(l => <button key={l} onClick={() => setLang(l)} style={{ background:lang===l?W1_YELLOW:"transparent", color:lang===l?W1_NAVY:W1_WHITE, border:"none", padding:"5px 12px", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{l==="en"?"EN":"ES"}</button>)}
          </div>
          {/* Save & Exit button */}
          {appPhase !== "lane" && (
            <button onClick={handleSaveExit}
              style={{ background:saveFlash?W1_GREEN:"rgba(255,255,255,0.1)", border:"1px solid "+(saveFlash?"transparent":"rgba(255,255,255,0.25)"), borderRadius:8, padding:"6px 14px", color:W1_WHITE, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.3s", display:"flex", alignItems:"center", gap:5 }}>
              {saveFlash ? <>✓ {t.saved}</> : t.saveExit}
            </button>
          )}
          {appPhase==="lane" && <button onClick={() => setShowCoachLogin(true)} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, padding:"6px 14px", color:W1_WHITE, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.coachDashboard}</button>}
        </div>
      </div>

      <SidebarNav current={appPhase} onNavigate={setAppPhase} completedSections={completedSections} lang={lang} postStep={postStepIdx} onJumpPostStep={i => setPostStepIdx(i)}/>

      <div style={{ paddingTop:W1_HEADER_H, marginLeft:showSidebar?W1_SIDEBAR_W:0, transition:"margin-left 0.2s ease", minHeight:"calc(100vh - "+W1_HEADER_H+"px)" }}>
        <div ref={topRef} style={{ maxWidth:680, margin:"0 auto", padding:"28px 16px 60px" }}>

          {/* HOME */}
          {appPhase==="lane" && (
            <div>
              <div style={{ background:W1_NAVY, borderRadius:16, padding:32, marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
                <h1 style={{ color:W1_WHITE, fontSize:24, fontWeight:900, margin:"0 0 12px", lineHeight:1.3 }}>{t.heroHeadline}<br/><span style={{ color:W1_YELLOW }}>{t.heroHighlight}</span></h1>
                <p style={{ color:W1_GRAY400, fontSize:14, lineHeight:1.8, margin:"0 0 20px" }}>{t.heroDesc}</p>
                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
                  {t.totalStats.map((s,i) => <div key={i} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 18px", fontSize:13, color:W1_WHITE }}>{s}</div>)}
                </div>
                <button onClick={() => { if(answeredN===0) setAppPhase("ch1"); else if(!post) setAppPhase("dopost"); else setAppPhase("replicate"); }}
                  style={{ background:W1_YELLOW, border:"none", borderRadius:12, padding:"14px 28px", color:W1_NAVY, fontWeight:900, fontSize:16, cursor:"pointer" }}>
                  {lang==="es"
                    ? (answeredN===0 ? "Continuar → Escribir Publicación" : !post ? "Continuar → Generar Publicación" : "Continuar → Publicar en Grupos")
                    : (answeredN===0 ? "Continue → Write Post" : !post ? "Continue → Generate Post" : "Continue → Post in Groups")}
                </button>
              </div>

              <h3 style={{ color:W1_NAVY, fontSize:15, fontWeight:800, margin:"0 0 12px" }}>{t.week1Checklist}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
                {[
                  {
                    phase:"ch1", num:1,
                    title:t.writePost, desc:t.writePostDesc,
                    status: answeredN===0
                      ? {l:t.notStarted, done:false, locked:false}
                      : answeredN < ALL_QUESTIONS.length
                        ? {l:t.inProgress, done:false, locked:false}
                        : {l:t.done, done:true, locked:false},
                  },
                  {
                    phase:"dopost", num:2,
                    title:t.postInGroups, desc:t.postInGroupsDesc,
                    status: completedSections.includes("grouppost")
                      ? {l:t.done, done:true, locked:false}
                      : post
                        ? {l:t.inProgress, done:false, locked:false}
                        : {l:t.notStarted, done:false, locked:false},
                  },
                  {
                    phase:"leads", num:3,
                    title:t.workLeads, desc:t.workLeadsDesc,
                    status: totalJobs > 0
                      ? {l:t.done, done:true, locked:false}
                      : completedSections.includes("leads")
                        ? {l:t.inProgress, done:false, locked:false}
                        : {l:t.notStarted, done:false, locked:false},
                  },
                  {
                    phase:"amplify", num:4,
                    title:t.amplify, desc:t.amplifyDesc, bonus:true,
                    status: completedSections.includes("amplify")
                      ? {l:t.done, done:true, locked:false}
                      : {l:t.notStarted, done:false, locked:false},
                  },
                  {
                    phase:"tracker", num:5,
                    title: lang==="es"?"Rastreador de Responsabilidad":"Accountability Tracker",
                    desc: lang==="es"?"Registra tu actividad y mide tus resultados":"Log your activity and measure your results",
                    bonus:true,
                    status: {l:t.notStarted, done:false, locked:false},
                  },
                ].map(item => (
                  <div key={item.phase} onClick={() => setAppPhase(item.phase)}
                    style={{ marginBottom:0, borderRadius:14, border:"1.5px solid "+(item.status.done?W1_GREEN:item.bonus?"#C4B5FD":W1_GRAY200), overflow:"hidden", boxShadow:"0 2px 12px rgba(0,41,66,0.06)", display:"flex", alignItems:"center", gap:14, padding:"16px 18px", background:item.status.done?"#F0FDF4":item.bonus?"#FAF5FF":W1_WHITE, cursor:"pointer" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:item.status.done?W1_GREEN:W1_NAVY, color:W1_WHITE, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, flexShrink:0 }}>
                      {item.status.done
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : item.num}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, color:item.status.done?"#065F46":W1_NAVY, fontSize:15 }}>{item.title}</div>
                      <div style={{ fontSize:12, color:W1_GRAY600, marginTop:2 }}>{item.desc}</div>
                    </div>
                    {item.comingSoon
                      ? <span style={{ background:W1_GRAY100, color:W1_GRAY400, borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{"Coming Soon"}</span>
                      : item.bonus
                      ? <span style={{ background:"#EDE9FE", color:"#6D28D9", borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{"Bonus"}</span>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={W1_GRAY400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>}
                  </div>
                ))}
              </div>
              {isDev && <DevShortcuts setAnswers={setAnswers} setPost={setPost} setAppPhase={setAppPhase} t={t}/>}
            </div>
          )}

          {appPhase==="voice" && <VoiceMode onComplete={va => { setAnswers(va); setAppPhase("dopost"); handleGeneratePost(va); }} lang={lang}/>}

          {(appPhase==="ch1"||appPhase==="ch2"||appPhase==="ch3") && (
            <TypeMode onComplete={va => { setAnswers(va); setAppPhase("dopost"); }} savedAnswers={answers} onAnswerChange={(id,val) => setAnswers(prev => ({...prev,[id]:val}))} lang={lang} onSwitchToVoice={() => setAppPhase("voice")}/>
          )}

          {appPhase==="dopost" && <PostItStep onBack={() => setAppPhase("lane")} onNext={() => setAppPhase("approval")} lang={lang} post={post} postEn={postEn} postLoading={postLoading} postError={postError} answers={answers} onGenerate={handleGeneratePost} onSetPost={setPost} allCh3Met={allCh3Met} groups={groups5} groupsLoading={groupsLoading} onWritePost={() => setAppPhase("ch1")} stepIdx={postStepIdx} onStepChange={setPostStepIdx}/>}

          {appPhase==="approval" && (
            <W1Card>
              <W1SectionHeader emoji="📋" title={t.step5Approval}/>
              <div style={{ background:"#EFF6FF", borderRadius:12, padding:20, marginBottom:24, textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:10 }}>👋</div>
                <p style={{ color:W1_NAVY, fontWeight:700, fontSize:15, margin:"0 0 8px" }}>{t.postIsLive}</p>
                <p style={{ color:W1_GRAY600, fontSize:14, lineHeight:1.7, margin:0 }}>{t.readyForAudit}</p>
              </div>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontWeight:800, color:W1_NAVY, fontSize:15, marginBottom:4 }}>{t.coachAudit}</div>
                <p style={{ fontSize:13, color:W1_GRAY600, margin:"0 0 16px" }}>{t.tapToSeeWhy}</p>
                {AUDIT_ITEMS.map((item,i) => <AuditRow key={i} item={item} t={t}/>)}
              </div>
              <CardNav onBack={() => setAppPhase("dopost")} onNext={() => { saveSubmission(answers,post,t.coachApproved); setAppPhase("replicate"); }} t={t}/>
            </W1Card>
          )}

          {appPhase==="replicate" && (
            <CrossPostStep
              onBack={() => setAppPhase("approval")}
              onNext={() => { setCompletedSections(p=>p.includes("grouppost")?p:[...p,"grouppost"]); saveSubmission(answers,post,lang==="es"?"10 Grupos Completados":"10 Groups Done"); setAppPhase("celebrate"); }}
              lang={lang}
              groups={groups20}
              groupsLoading={groupsLoading}
              post={post}
              postEn={postEn}
              t={t}
            />
          )}

          {appPhase==="celebrate" && <CelebrationScreen onNext={() => setAppPhase("leads")} onBack={() => setAppPhase("replicate")} lang={lang}/>}
          {appPhase==="leads"     && <LeadEngagement onBack={() => setAppPhase("celebrate")} onAmplify={() => setAppPhase("amplify")} lang={lang} leadsLog={leadsLog} setLeadsLog={setLeadsLog} totalJobs={totalJobs} setTotalJobs={setTotalJobs} onMarkStarted={() => setCompletedSections(p=>p.includes("leads")?p:[...p,"leads"])}/>}
          {appPhase==="amplify"   && <AmplifyScreen onBack={() => setAppPhase("leads")} city={city} lang={lang} onMarkStarted={() => setCompletedSections(p=>p.includes("amplify")?p:[...p,"amplify"])}/>}
          {appPhase==="tracker"   && <TrackerHome onNext={() => setAppPhase("amplify")}/>}

        </div>
      </div>
    </div>
  );
}


// ── AUTO-IMPORT: Read Week 1 data for Week 2 ─────────────────────────────────
function getWeek1Data(){
  try{
    const raw=localStorage.getItem("hbc_week1_progress");
    if(!raw)return null;
    const d=JSON.parse(raw);
    if(!d||!d.post)return null;
    return {
      week1Post: d.postEn||d.post||"",
      proName: (d.answers&&d.answers.name)||"",
      trade: "",
      city: (d.answers&&(d.answers.area||""))||d.manualCity||"",
      businessPageName: (d.answers&&d.answers.business)||"",
    };
  }catch(e){return null;}
}

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
  "← All Weeks":"← Todas las Semanas",
  "Profile built. Intro posted. Comments done. Your Nextdoor presence is live.":"Perfil creado. Introducción publicada. Presencia en Nextdoor activa.",
};
function useSpT(x){ return useContext(LangCtx)==="es"?(ES[x]||x):x; }

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
const REPLY_PROMPT="You are helping a home service professional write a high-converting reply to a Nextdoor post using an Anti-Ad strategy. The person replying owns the business — never call them a tech, technician, or employee. Your goal is to make the Pro sound like the most helpful and technically competent neighbor in the thread, not a salesperson.\n\nYou will receive:\n1. Trade\n2. Urgency level\n3. City and one nearby neighborhood, landmark, or cross street\n4. The neighbor's full post\n5. One real hyper-local detail\n\nCORE STRATEGY REQUIREMENTS FOR BOTH OPTIONS:\n- The reply must clearly reflect the tone and specific context of the neighbor's post so it feels written only for this thread. It must not be reusable in 200 threads unchanged.\n- Open by naturally acknowledging what the neighbor is asking using their tone and key words. Paraphrase naturally — never quote or repeat their full sentence verbatim.\n- Include one concrete, tangible micro-diagnostic or safety insight a homeowner can immediately picture. Avoid abstract industry commentary.\n- Include one thoughtful clarifying question that makes the homeowner think about their specific situation. Avoid yes-or-no-only questions.\n- Include one subtle hyper-local authority signal using the detail provided in input 5.\n- Include one subtle scarcity or boundary cue that signals the Pro is actively working, without sounding unavailable or arrogant.\n- Offer a low-pressure DM path.\n- No phone number. No sales phrases like free estimate. No flyer tone. Must sound natural and conversational.\n\nFORMATTING — CRITICAL:\n- Write in SHORT PARAGRAPHS. Each paragraph is 1-2 sentences maximum.\n- Put a blank line between EVERY paragraph.\n- No em dashes, en dashes, or double hyphens. Use commas or periods.\n- No markdown: no **, no *, no #.\n\nOPTION 1 — NEIGHBOR FIRST (under 120 words):\nThink of this like a block party conversation. You are talking to a neighbor, getting to know each other as humans, and then almost as a coincidence or afterthought you mention what you do for work. It should never feel like a Pro spotted a lead. It should feel like a neighbor genuinely reacted to what someone said.\n\nCRITICAL OPENING RULE — the first 1-2 sentences must be pure human warmth. Genuine empathy. The kind of thing you would text a neighbor: Oh man, that is rough. Or: Ugh, worst timing. Or: Sorry to hear that, that is no fun especially right now. No trade. No business. No diagnostic. No years of experience. Just a real person reacting with genuine concern.\n\nOnly after that warm human opening does the reply naturally mention the trade — and it must feel like a coincidence, not a pitch. Something like: Actually funny enough, I do HVAC work. Or: I happen to fix this stuff, what is going on with it? The reveal should feel accidental and low-key, the way it would come up naturally at a block party.\n\nAfter the reveal, include the diagnostic insight and clarifying question. Keep the hyper-local detail and scarcity cue subtle — they should feel like natural conversation, not credentials.\n\nOPTION 2 — AUTHORITY VERSION (under 150 words):\nStronger positioning. Highlights one hidden complexity or quality factor most homeowners would not think about. Calm, controlled tone. Open immediately with the diagnostic or authority angle — no need for a warm opener here. This option earns trust through expertise, not empathy.\n\nAFTER EACH OPTION include:\nWHY_THIS_WORKS_[N]: 2-3 bullet points explaining the psychological and engagement triggers.\nPATH_TO_BOOKING_[N]: Brief explanation of how this typically moves from public comment to DM to paid job.\nSTANDS_OUT_[N]: Brief explanation of how this beats generic call me replies and avoids looking like spam.\n\nFormat exactly:\nOPTION_1:\n[reply]\nWHY_THIS_WORKS_1:\n[bullets]\nPATH_TO_BOOKING_1:\n[text]\nSTANDS_OUT_1:\n[text]\nOPTION_2:\n[reply]\nWHY_THIS_WORKS_2:\n[bullets]\nPATH_TO_BOOKING_2:\n[text]\nSTANDS_OUT_2:\n[text]";

// ── Claude ────────────────────────────────────────────────────────────────────
async function callClaude(messages,system){
  const body={model:"claude-sonnet-4-20250514",max_tokens:2500,messages};
  if(system)body.system=system;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const d=await r.json();
  return(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("")||"";
}
function stripTrailingQuestion(t){
  // Strip em dashes and double hyphens, replace with a comma or nothing
  let r=t.trim()
    .replace(/\s*—\s*/g, ", ")   // em dash → comma
    .replace(/\s*–\s*/g, ", ")   // en dash → comma
    .replace(/\s*--\s*/g, ", ")  // double hyphen → comma
    .replace(/,\s*,/g, ",")      // clean up double commas
    .trim();
  if(!r.endsWith("?"))return r;
  // Find the last sentence boundary before the question
  const NL="\n";const lastDot=Math.max(r.lastIndexOf(". "),r.lastIndexOf("! "),r.lastIndexOf("."+NL),r.lastIndexOf("!"+NL));
  return lastDot>0?r.slice(0,lastDot+1).trim():r;
}
const genBio=post=>callClaude([{role:"user",content:"Write a personal Nextdoor bio using ONLY the facts explicitly stated in this post. Do not invent, assume, or add any detail not present in the post.\n\nTHIS BIO SHOULD BUILD TRUST THROUGH HUMAN CONNECTION — not introduce a business.\n\nSTRUCTURE:\n1. Open with something personal and specific from their real life — a hobby, family moment, weekend routine, or something they're into. Pull this directly from the post.\n2. Weave in a moment of vulnerability or authenticity — something real about why they do what they do or what they stand for. Use their actual words where possible.\n3. Mention their trade and city naturally, as context — not as the lead.\n\nRULES:\n- First-person, written as a neighbor introducing themselves\n- Max 500 chars\n- STRICT NO-HALLUCINATION: Every detail must come directly from the post. No invented hobbies, no assumed family details, no generic filler.\n- Sound like a real person talking, not a professional profile\n- No sales language, no CTA, no business promotion\n- Absolutely no em dashes (— or –), no double hyphens, no buzzwords\n- Do NOT end with a question\n- Output the bio only, no labels or explanation\n\nPost:\n"+post}]);
const genStory=post=>callClaude([{role:"user",content:"Write a Nextdoor Business Page 'Your Story' section using ONLY the facts explicitly stated in this post. Do not invent, assume, or add any detail not present in the post.\n\nSTRUCTURE:\n1. Open with the real moment that pushed them to start their business — pull this directly and specifically from the post. This is the hook.\n2. State what the business stands for as a result of that moment.\n3. Feature the specific customer fear they focus on overcoming and the concrete habit or practice they do on every job to prevent it — use their exact words where possible.\n\nRULES:\n- First-person as the business owner\n- Include the business name and trade naturally\n- Max 500 chars total\n- STRICT NO-HALLUCINATION: Every detail must come directly from the post. No invented habits, no assumed values, no generic contractor language.\n- No sales language, no CTA, absolutely no em dashes (— or –), no double hyphens, no buzzwords like integrity, excellence, or professionalism\n- Do NOT end with a question\n- Output the story only, no labels or explanation\n\nPost:\n"+post}]);
const genActivation=inp=>callClaude([{role:"user",content:"Pro First Name: "+(inp.proName||"").split(" ")[0]+"\nPro Full Name: "+inp.proName+"\nBusiness Name: "+inp.businessPageName+"\nTrade: "+inp.trade+"\nCity: "+inp.city+"\nNextdoor Link: "+inp.businessPageLink+"\n\nGenerate the two outreach messages."}],ACT_PROMPT);
const genReplyText=(text,trade,city,urgency,localDetail)=>callClaude([{role:"user",content:"1. Trade: "+trade+"\n2. Urgency: "+(urgency||"urgent")+"\n3. City and nearby area: "+city+"\n4. Neighbor's post:\n\n\""+text+"\"\n\n5. Hyper-local detail: "+(localDetail||"Not provided")+"\n\nGenerate two reply options."}],REPLY_PROMPT);
const TRADE_LIST=["HVAC","Plumbing","Electrical","Appliance Repair","Garage Door Services","Locksmith","Carpet Cleaning","House Cleaning","Window Cleaning","Lawn Care","Landscaping","Pest Control","Pool and Spa Service","Handyman","Fireplace and Chimney Services","Junk Removal","Pressure Washing","Restoration Services","General Contracting","Remodeling","Home Building"];
const genExtract=post=>callClaude([{role:"user",content:"From this home service business introduction post, extract:\n1. Owner full name (first and last name of the person writing the post)\n2. Trade — pick the BEST MATCH from this exact list: "+TRADE_LIST.join(", ")+". If none match, use the closest description from the post.\n3. City (the city or area they serve)\n4. Business name (if mentioned)\n\nRespond ONLY with valid JSON, no markdown, no explanation:\n{\"ownerName\":\"\",\"trade\":\"\",\"city\":\"\",\"businessName\":\"\"}\n\nPost:\n"+post}]);
const genReplyImg=(b64,mime,trade,city,urgency,localDetail)=>callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:mime,data:b64}},{type:"text",text:"The image above is a screenshot of a Nextdoor post. Read the post text from the image.\n\n1. Trade: "+trade+"\n2. Urgency: "+(urgency||"urgent")+"\n3. City and nearby area: "+city+"\n4. Neighbor's post: [read from screenshot above]\n5. Hyper-local detail: "+(localDetail||"Not provided")+"\n\nGenerate two reply options. You MUST use the exact format with these markers: OPTION_1:, WHY_THIS_WORKS_1:, PATH_TO_BOOKING_1:, STANDS_OUT_1:, OPTION_2:, WHY_THIS_WORKS_2:, PATH_TO_BOOKING_2:, STANDS_OUT_2:"}]}],REPLY_PROMPT);

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
function CopyBox({text,label,paragraphs}){const [c,sC]=useState(false);function copy(){try{const el=document.createElement("textarea");el.value=text;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){}sC(true);setTimeout(()=>sC(false),2000);}function splitParas(t){// Split on double newlines first, then single newlines that follow punctuation
const paras=t.split(/\n\n+/);const result=[];paras.forEach(block=>{const lines=block.split(/\n/).map(l=>l.trim()).filter(Boolean);if(lines.length)result.push(lines.join(" "));});return result.filter(Boolean);}return <div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:16,marginBottom:14}}>{label&&<div style={{fontSize:11,fontWeight:700,color:GRAY400,marginBottom:6,textTransform:"uppercase"}}>{label}</div>}{paragraphs?<div style={{fontSize:13,color:GRAY800,fontFamily:"inherit"}}>{splitParas(text||"").map((para,i)=><p key={i} style={{margin:i===0?"0 0 10px 0":"10px 0",lineHeight:1.8}}>{para}</p>)}</div>:<pre style={{margin:0,fontSize:13,color:GRAY800,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{text}</pre>}<div style={{marginTop:12}}><Btn onClick={copy} variant={c?"success":"primary"} style={{fontSize:13}}>{c?"✓ Copied!":"📋 Copy"}</Btn></div></div>;}
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
      <a href="https://nextdoor.com" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:YELLOW,color:NAVY,borderRadius:10,padding:"11px 20px",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:16}}>{"🏘 "}{s?"Abrir Nextdoor":"Open Nextdoor"}</a>
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
function GetPost({inputs,setInputs,setFlag,onNext,w1DataAvailable,autoImport}){
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
      <div onClick={()=>{if(w1DataAvailable&&!confirmed){setMode("auto");}else if(!w1DataAvailable){setMode("auto");}}} style={{borderRadius:14,border:"2px solid "+(mode==="auto"?NAVY:GRAY200),background:mode==="auto"?NAVY:WHITE,cursor:"pointer",padding:20,display:"flex",flexDirection:"column",gap:10,position:"relative",transition:"all 0.2s"}}>
        <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:ND_GREEN,color:WHITE,borderRadius:99,padding:"2px 12px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>{s?"⭐ Recomendado":"⭐ Recommended"}</div>
        <div style={{fontSize:32,textAlign:"center",marginTop:8}}>⚡</div>
        <div style={{fontWeight:800,fontSize:15,color:mode==="auto"?YELLOW:NAVY,textAlign:"center"}}>{s?"Auto-importar desde Semana 1":"Auto-Import from Week 1"}</div>
        <div style={{fontSize:12,color:mode==="auto"?GRAY200:GRAY600,textAlign:"center",lineHeight:1.5}}>{s?"Tu publicación se importa automáticamente desde la Semana 1.":"Your post pulls over automatically from Week 1."}</div>
        <div style={{background:mode==="auto"?"rgba(255,255,255,0.1)":w1DataAvailable?"#F0FDF4":"#FEF9EC",borderRadius:8,padding:"6px 10px",textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:mode==="auto"?GRAY200:w1DataAvailable?"#065F46":"#92400E"}}>{w1DataAvailable?"✓ Week 1 Found":"Complete Week 1 first"}</span></div>
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

    {/* Auto-import selected */}
    {mode==="auto"&&w1DataAvailable&&<Card style={{border:"2px solid "+ND_GREEN,background:"#F0FDF4"}}>
      <div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{fontSize:40,marginBottom:10}}>✅</div>
        <h3 style={{color:NAVY,fontWeight:800,fontSize:16,margin:"0 0 8px"}}>{"Week 1 post found — ready to import"}</h3>
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 4px",lineHeight:1.6}}>{"Your intro post, name, city, and business name will pull over automatically. Click Next to continue."}</p>
      </div>
    </Card>}
    {mode==="auto"&&!w1DataAvailable&&<Card style={{border:"2px solid #FDE68A",background:"#FFFBEB"}}>
      <div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{fontSize:40,marginBottom:10}}>🔗</div>
        <h3 style={{color:NAVY,fontWeight:800,fontSize:16,margin:"0 0 8px"}}>{"Week 1 not found"}</h3>
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 8px",lineHeight:1.6}}>{"To use Auto-Import, complete Week 1 first and generate your post. Once saved, it will pull over here automatically."}</p>
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 16px",lineHeight:1.6}}>{"Already finished Week 1? Your browser may have cleared its data. Use the paste option to continue."}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="ghost" onClick={()=>setMode(null)} style={{fontSize:13}}>{"← Go Back"}</Btn>
          <Btn onClick={()=>setMode("paste")} style={{fontSize:13}}>{"Paste from Facebook →"}</Btn>
        </div>
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

    <BottomNav onBack={()=>onNext("home")} backLabel={s?"← Atrás":"← Back"} onNext={()=>{if(mode==="auto"&&w1DataAvailable){const w1data=autoImport&&autoImport();if(w1data){setInputs(p=>({...p,week1Post:w1data.week1Post||p.week1Post,proName:p.proName||w1data.proName||"",city:p.city||w1data.city||"",businessPageName:p.businessPageName||w1data.businessPageName||""}));}setFlag("postConfirmed",true);onNext("setup");}else{setInputs(p=>({...p,week1Post:pasted}));setFlag("postConfirmed",true);onNext("setup");}}} nextLabel={s?"Siguiente →":"Next →"} nextDisabled={mode==="auto"?!w1DataAvailable:!canConfirm}/>
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
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:12,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On Nextdoor, click your profile photo → Edit Profile → scroll to Bio → paste this in."}
      </div>
      <a href="https://nextdoor.com" target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:YELLOW,color:NAVY,borderRadius:10,padding:"11px 20px",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:16}}>
        {"🏘 Open Nextdoor"}
      </a>
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
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:12,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On your Nextdoor Business Page, click Edit Page → scroll to Your Story → Describe your page → paste this in."}
      </div>
      <a href="https://nextdoor.com" target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:YELLOW,color:NAVY,borderRadius:10,padding:"11px 20px",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:16}}>
        {"🏘 Open Nextdoor"}
      </a>
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
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:12,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On Nextdoor, click your profile photo → Edit Profile → scroll to Bio → paste this in."}
      </div>
      <a href="https://nextdoor.com" target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:YELLOW,color:NAVY,borderRadius:10,padding:"11px 20px",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:16}}>
        {"🏘 Open Nextdoor"}
      </a>
      <BioBox title={s?"Tu Bio Personal — Lista para Pegar":"Personal Bio — Ready to Paste"} fieldName="Bio" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Perfil, desplázate a Bio y pégalo.":"Click Edit Profile, scroll to Bio, and paste this in."}/>
    </Card>
    <BottomNav onBack={()=>{setFlag("setupPath",null);}} backLabel={s?"← Atrás":"← Back"} onNext={()=>{setFlag("personalAccountDone",true);onNext("setup_business_video");}} nextLabel={s?"Siguiente →":"Next →"}/>
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
    />
    <Card>
      <div style={{background:"#EFF6FF",border:"1.5px solid #93C5FD",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:NAVY}}>
        <strong>{"Where to paste:"}</strong>{" On your Nextdoor Business Page, click Edit Page → scroll to Your Story → paste this in."}
      </div>
      <BioBox title={s?"Tu Historia — Lista para Pegar":"Your Story — Ready to Paste"} fieldName="Your Story" text={outputs.personalBio} loading={bioLoading} pasteInstruction={s?"Toca Editar Página, desplázate a Tu Historia y pégalo.":"Click Edit Page, scroll to Your Story, and paste this in."}/>
    </Card>
    <BottomNav onBack={()=>onBack("setup_personal")} backLabel={s?"← Atrás":"← Back"} onNext={()=>{setFlag("businessPageDone",true);onNext("setup_customers");}} nextLabel={s?"Siguiente →":"Next →"}/>
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
    {cur.tradeChips ? (
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {cur.tradeChips.map((chip,i)=>{
            const sel=val===chip;
            return <button key={i} onClick={()=>si(cur.key,sel?"":chip)}
              style={{background:sel?NAVY:GRAY50,color:sel?YELLOW:NAVY,border:"1.5px solid "+(sel?NAVY:GRAY200),borderRadius:99,padding:"7px 16px",fontSize:13,fontWeight:sel?800:600,cursor:"pointer",transition:"all 0.15s"}}>
              {sel?"✓ ":""}{chip}
            </button>;
          })}
        </div>
        <p style={{fontSize:12,color:GRAY400,margin:"0 0 8px"}}>{s?"¿No está en la lista? Escríbelo aquí:":"Not on the list? Type it here:"}</p>
        <FormField label="" value={cur.tradeChips.includes(val)?"":val} onChange={v=>{si(cur.key,v);}} placeholder={cur.placeholder} rows={1}/>
      </div>
    ) : (
      <>
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
      </>
    )}
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
     placeholder:s?"Escribe tu oficio si no está en la lista":"Type your trade if it's not in the list", rows:1,
     tradeChips:["HVAC","Plumbing","Electrical","Appliance Repair","Garage Door Services","Locksmith","Carpet Cleaning","House Cleaning","Window Cleaning","Lawn Care","Landscaping","Pest Control","Pool and Spa Service","Handyman","Fireplace and Chimney Services","Junk Removal","Pressure Washing","Restoration Services","General Contracting","Remodeling","Home Building"]},
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

      {/* Side-by-side Text (Recommended) + Email */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:8}}>

        {/* Text — Recommended (first) */}
        <div style={{border:"2px solid "+YELLOW,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:10,position:"relative",background:"#FFFBEB"}}>
          <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:YELLOW,color:NAVY,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:900,whiteSpace:"nowrap"}}>⭐ {s?"Recomendado — Mayor conversión":"Recommended — Higher Conversion"}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
            <span style={{fontSize:18}}>💬</span>
            <span style={{fontWeight:800,color:NAVY,fontSize:14}}>{s?"Mensaje de texto":"Text Message"}</span>
          </div>
          <div style={{background:"rgba(255,183,6,0.12)",borderRadius:8,padding:"8px 10px",fontSize:12,color:NAVY,fontWeight:600}}>
            {s?"98% de tasa de apertura vs. 20% por correo":"98% open rate vs. 20% for email"}
          </div>
          <CopyBox text={textMsg||body} label={s?"mensaje de texto":"text message"}/>
        </div>

        {/* Email (second) */}
        <div style={{border:"1.5px solid "+GRAY200,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📧</span>
            <span style={{fontWeight:800,color:NAVY,fontSize:14}}>{s?"Correo electrónico":"Email"}</span>
          </div>
          {subj&&<div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:8,padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:700,color:GRAY400,textTransform:"uppercase"}}>{s?"Asunto: ":"Subject: "}</span><span style={{fontWeight:700,color:NAVY,fontSize:12}}>{subj}</span></div>}
          <CopyBox text={body} label={s?"cuerpo del correo":"email body"}/>
        </div>

      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+GRAY200}}>
        <Btn variant="ghost" onClick={()=>setStep(GENERATE_STEP)} style={{minWidth:110,fontSize:14}}>{s?"← Atrás":"← Back"}</Btn>
        <Btn onClick={()=>{setFlag("customersDone",true);onNext("setup_complete");}} style={{minWidth:110,fontSize:14}}>{s?"Siguiente →":"Next →"}</Btn>
      </div>
    </Card>}
  </div>;
}

// ── SETUP COMPLETE ────────────────────────────────────────────────────────────
function SetupComplete({onNext,s}){
  return <div>
    <div style={{background:NAVY,borderRadius:20,padding:"40px 32px",textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <h1 style={{color:YELLOW,fontSize:24,fontWeight:900,margin:"0 0 12px",lineHeight:1.3}}>{s?"¡Configuración de Cuenta Completa!":"Account Setup Complete!"}</h1>
      <p style={{color:WHITE,fontSize:15,lineHeight:1.8,margin:"0 0 24px"}}>{s?"Tu bio personal, historia de negocio y mensajes de solicitud de reseñas están listos.":"Your personal bio, business story, and review request messages are all set."}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:28}}>
        {[
          {emoji:"👤",label:s?"Bio Personal":"Personal Bio",desc:s?"Lista para pegar":"Ready to paste"},
          {emoji:"🏢",label:s?"Tu Historia":"Your Story",desc:s?"Lista para pegar":"Ready to paste"},
          {emoji:"⭐",label:s?"Mensajes de Reseña":"Review Messages",desc:s?"Texto y correo listos":"Text & email ready"},
        ].map((item,i)=><div key={i} style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>{item.emoji}</div>
          <div style={{color:YELLOW,fontWeight:800,fontSize:13,marginBottom:2}}>{item.label}</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:11}}>{item.desc}</div>
        </div>)}
      </div>
    </div>
    <div style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:14,padding:"18px 20px",marginBottom:20}}>
      <p style={{fontWeight:800,color:"#065F46",fontSize:15,margin:"0 0 6px"}}>{"What's next: Intro Posts"}</p>
      <p style={{color:"#166534",fontSize:13,lineHeight:1.7,margin:0}}>{s?"Ahora publicarás tu publicación de introducción en grupos de Nextdoor. Es la misma historia que usamos para construir tu bio — solo hay que llevarla a tu comunidad.":"Now you'll post your intro post in Nextdoor groups. It's the same story we used to build your bio — time to get it in front of your community."}</p>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <Btn variant="ghost" onClick={()=>onNext("setup_customers")} style={{fontSize:14,minWidth:100}}>{s?"← Atrás":"← Back"}</Btn>
      <Btn onClick={()=>onNext("post_path")} style={{fontSize:14,minWidth:100}}>{s?"Siguiente →":"Next →"}</Btn>
    </div>
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
  return <div>
    <VideoPlaceholder
      title="How to Find Comments — Video Walkthrough"
      titleEs="Cómo Encontrar Comentarios — Video Tutorial"
      videoUrl={null}
      s={s}
    />
    <BottomNav onBack={()=>onBack("comment_path")} backLabel={s?"← Atrás":"← Back"} onNext={()=>onNext("comment_generate")} nextLabel={s?"Siguiente →":"Next →"}/>
  </div>;
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

function ReplyOption({optNum,label,reply,coaching,s}){
  const [open,setOpen]=useState(false);
  return <div style={{border:"1.5px solid "+GRAY200,borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:8}}>
    <div style={{fontWeight:700,color:NAVY,fontSize:13}}>Option {optNum} — {label}</div>
    <CopyBox text={reply} label={"option "+optNum} paragraphs={true}/>
    {(coaching.why||coaching.path||coaching.standsOut)&&(
      <div>
        <button onClick={()=>setOpen(v=>!v)} style={{background:"none",border:"none",color:GRAY400,fontSize:12,fontWeight:700,cursor:"pointer",padding:"4px 0",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
          {open?"▲":"▼"} {s?"¿Por qué funciona?":"Why this works"}
        </button>
        {open&&<div style={{background:GRAY50,borderRadius:10,padding:"12px 14px",marginTop:6,display:"flex",flexDirection:"column",gap:10}}>
          {coaching.why&&<div>
            <div style={{fontWeight:800,color:NAVY,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{"Why it works"}</div>
            <div style={{fontSize:12,color:GRAY800,lineHeight:1.7,whiteSpace:"pre-line"}}>{coaching.why}</div>
          </div>}
          {coaching.path&&<div style={{borderTop:"1px solid "+GRAY200,paddingTop:8}}>
            <div style={{fontWeight:800,color:NAVY,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{"Path to booking"}</div>
            <div style={{fontSize:12,color:GRAY800,lineHeight:1.7}}>{coaching.path}</div>
          </div>}
          {coaching.standsOut&&<div style={{borderTop:"1px solid "+GRAY200,paddingTop:8}}>
            <div style={{fontWeight:800,color:NAVY,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{"Why it stands out"}</div>
            <div style={{fontSize:12,color:GRAY800,lineHeight:1.7}}>{coaching.standsOut}</div>
          </div>}
        </div>}
      </div>
    )}
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
  const [urgency,setUrgency]=useState("non-urgent");
  const [localDetail,setLocalDetail]=useState("");
  const [imgData,setImgData]=useState(null);const [imgMime,setImgMime]=useState(null);const [imgName,setImgName]=useState("");
  const [reply1,setReply1]=useState("");const [reply2,setReply2]=useState("");
  const [coaching1,setCoaching1]=useState({why:"",path:"",standsOut:""});
  const [coaching2,setCoaching2]=useState({why:"",path:"",standsOut:""});
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const [screen,setScreen]=useState("input");
  const [tradeMatch,setTradeMatch]=useState(null);
  const fileRef=useRef(null);

  const count=amplify?(flags.amplifyCommentCount||0):(flags.commentCount||0);
  const goal=amplify?null:5;

  function handleFile(e){const f=e.target.files[0];if(!f||!f.type.startsWith("image/"))return;setImgName(f.name);setImgMime(f.type);const r=new FileReader();r.onload=ev=>setImgData(ev.target.result.split(",")[1]);r.readAsDataURL(f);}
  function handlePaste(e){const items=(e.clipboardData||e.originalEvent&&e.originalEvent.clipboardData||{}).items;if(!items)return;for(let i=0;i<items.length;i++){if(items[i].type.startsWith("image/")){const f=items[i].getAsFile();if(!f)continue;setImgName("pasted-image.png");setImgMime(f.type);const r=new FileReader();r.onload=ev=>setImgData(ev.target.result.split(",")[1]);r.readAsDataURL(f);break;}}}

  function parseReply(res, optNum){
    const markers=[
      "OPTION_1:","WHY_THIS_WORKS_1:","PATH_TO_BOOKING_1:","STANDS_OUT_1:",
      "OPTION_2:","WHY_THIS_WORKS_2:","PATH_TO_BOOKING_2:","STANDS_OUT_2:"
    ];
    // Also try alternate formats the model might use
    const altMarkers1=["Option 1:","OPTION 1:","**OPTION_1:**","**Option 1**:","Option 1 —","OPTION 1 —"];
    const altMarkers2=["Option 2:","OPTION 2:","**OPTION_2:**","**Option 2**:","Option 2 —","OPTION 2 —"];
    function extract(tag){
      const start=res.indexOf(tag);
      if(start<0)return "";
      const after=start+tag.length;
      const nextPos=markers.map(m=>res.indexOf(m,after)).filter(p=>p>after);
      const end=nextPos.length?Math.min(...nextPos):res.length;
      return res.slice(after,end).trim();
    }
    function extractAlt(alts){
      for(const tag of alts){
        const start=res.indexOf(tag);
        if(start>=0){
          const after=start+tag.length;
          // find next option marker
          const allM=[...markers,...altMarkers1,...altMarkers2];
          const nextPos=allM.map(m=>res.indexOf(m,after)).filter(p=>p>after);
          const end=nextPos.length?Math.min(...nextPos):res.length;
          const text=res.slice(after,end).trim();
          if(text.length>20)return text;
        }
      }
      return "";
    }
    let reply=extract("OPTION_"+optNum+":");
    if(!reply) reply=extractAlt(optNum===1?altMarkers1:altMarkers2);
    return {
      reply,
      why:extract("WHY_THIS_WORKS_"+optNum+":"),
      path:extract("PATH_TO_BOOKING_"+optNum+":"),
      standsOut:extract("STANDS_OUT_"+optNum+":")
    };
  }

  async function generate(){
    if(!inputs.trade||!inputs.city){setErr(s?"Asegúrate de que tu oficio y ciudad estén completos en Configuración.":"Make sure your trade and city are filled in from Setup.");return;}
    setLoading(true);setErr("");setReply1("");setReply2("");setCoaching1({why:"",path:"",standsOut:""});setCoaching2({why:"",path:"",standsOut:""});
    try{
      let res;
      if(mode==="screenshot"&&imgData) res=await genReplyImg(imgData,imgMime,inputs.trade,inputs.city,urgency,localDetail);
      else if(mode==="text"&&postText.trim()) res=await genReplyText(postText,inputs.trade,inputs.city,urgency,localDetail);
      else{setErr(s?"Proporciona el contenido de la publicación primero.":"Provide the post content first.");setLoading(false);return;}
      function stripMd(t){return t.split("\u2014").join(",").split("\u2013").join(",").split("---").join(",").split("--").join(",").split("**").join("").split("__").join("").trim();}
      function stripMdKeepLines(t){
        let clean = t
          .split("**").join("").split("__").join("")
          .split("\u2014").join(",").split("\u2013").join(",")
          .replace(/---/g,",").replace(/--/g,",")
          .replace(/[Ff]eel free to /g,"");
        // If model sent \n\n already, preserve them
        clean = clean.replace(/\n{3,}/g,"\n\n");
        // Convert single \n after sentence-ending punctuation to \n\n
        clean = clean.replace(/([.!?])\n(?!\n)/g,"$1\n\n");
        // If still no double newlines at all, split into paragraphs by sentence groups
        if(!clean.includes("\n\n")){
          // Split into sentences and group into ~2 sentence paragraphs
          const sentences = clean.match(/[^.!?]+[.!?]+/g)||[clean];
          const groups=[];
          for(let i=0;i<sentences.length;i+=2){
            groups.push(sentences.slice(i,i+2).join(" ").trim());
          }
          clean=groups.join("\n\n");
        }
        return clean.trim().replace(/[\s.,\-]+$/,"");
      }
      const p1=parseReply(res,1);const p2=parseReply(res,2);
      if(!p1.reply&&!p2.reply){setErr(s?"No se pudo analizar la respuesta. Intenta de nuevo o usa Escribir Mis Respuestas.":"Could not parse the reply. Try again or use Type My Answers.");setLoading(false);return;}
      setReply1(stripMdKeepLines(p1.reply));setReply2(stripMdKeepLines(p2.reply));
      setCoaching1({why:stripMd(p1.why),path:stripMd(p1.path),standsOut:stripMd(p1.standsOut)});
      setCoaching2({why:stripMd(p2.why),path:stripMd(p2.path),standsOut:stripMd(p2.standsOut)});
      setScreen("replies");
    }catch(e){setErr(s?"No se pudo generar. Verifica tu conexión.":"Could not generate. Check your connection.");}
    setLoading(false);
  }

  function logIt(){
    if(amplify){
      const newCount=(flags.amplifyCommentCount||0)+1;
      setFlag("amplifyCommentCount",newCount);
      if(newCount%5===0){setScreen("milestone");}
      else{setReply1("");setReply2("");setCoaching1({why:"",path:"",standsOut:""});setCoaching2({why:"",path:"",standsOut:""});setPostText("");setImgData(null);setImgName("");setMode(null);setUrgency("non-urgent");setLocalDetail("");setErr("");setScreen("input");}
    } else {
      const newCount=Math.min(count+1,goal||5);
      setFlag("commentCount",newCount);
      const postsDone=(flags.introPostCount||0)>=5;
      if(newCount>=goal&&postsDone){onNext("week_complete");}
      else if(newCount>=goal){onNext("leads_main");}
      else{setReply1("");setReply2("");setCoaching1({why:"",path:"",standsOut:""});setCoaching2({why:"",path:"",standsOut:""});setPostText("");setImgData(null);setImgName("");setMode(null);setUrgency("non-urgent");setLocalDetail("");setErr("");setScreen("input");}
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
        <p style={{color:GRAY600,fontSize:13,margin:"0 0 12px"}}>{s?"Elige una opción, cópiala y publícala en Nextdoor.":"Pick one option, copy it, and post it on Nextdoor."}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{label:s?"Vecino Primero":"Neighbor First",reply:reply1,coaching:coaching1},{label:s?"Experto Diagnóstico":"Diagnostic Expert",reply:reply2,coaching:coaching2}].map((opt,idx)=>(
            <ReplyOption key={idx} optNum={idx+1} label={opt.label} reply={opt.reply} coaching={opt.coaching} s={s}/>
          ))}
        </div>
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
      {mode==="screenshot"&&<div onPaste={handlePaste}><input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>{!imgData?<button onClick={()=>fileRef.current&&fileRef.current.click()} onPaste={handlePaste} style={{width:"100%",border:"2px dashed "+GRAY200,borderRadius:12,padding:"24px 16px",background:GRAY50,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><span style={{fontSize:32}}>📸</span><span style={{fontWeight:700,color:NAVY,fontSize:14}}>{s?"Clic para subir captura":"Click to upload screenshot"}</span><span style={{fontSize:12,color:GRAY400}}>{s?"O copia la imagen y pégala aquí (Ctrl+V / ⌘V)":"Or copy the image and paste here (Ctrl+V / ⌘V)"}</span></button>:<div style={{background:"#F0FDF4",border:"1.5px solid "+GREEN,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:22}}>🖼️</span><div style={{flex:1}}><div style={{fontWeight:700,color:"#065F46",fontSize:14}}>{imgName}</div><div style={{fontSize:12,color:GREEN}}>✓ {s?"Lista":"Ready"}</div></div><button onClick={()=>{setImgData(null);setImgName("");}} style={{background:"none",border:"none",color:GRAY400,fontSize:20,cursor:"pointer"}}>x</button></div>}</div>}
      {mode==="text"&&<textarea value={postText} onChange={e=>setPostText(e.target.value)} placeholder={s?"Pega o escribe la publicación del vecino...":"Paste or type the neighbor\'s post..."} rows={5} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+GRAY200,borderRadius:10,padding:"10px 14px",fontSize:13,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none",marginBottom:8}}/>}
      {mode&&<div style={{marginTop:14}}>
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:700,color:NAVY,fontSize:13,marginBottom:6}}>{s?"¿Es urgente?":"Is this urgent?"}</div>
          <div style={{display:"flex",gap:8}}>
            {[{id:"non-urgent",l:s?"No urgente":"Non-urgent"},{id:"urgent",l:s?"Urgente":"Urgent"}].map(u=><button key={u.id} onClick={()=>setUrgency(u.id)} style={{padding:"7px 16px",borderRadius:8,border:"2px solid "+(urgency===u.id?NAVY:GRAY200),background:urgency===u.id?NAVY:GRAY50,color:urgency===u.id?YELLOW:GRAY600,fontWeight:700,fontSize:12,cursor:"pointer"}}>{u.l}</button>)}
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:NAVY,fontSize:13,marginBottom:4}}>{s?"Detalle hiperlocal (opcional)":"Hyper-local detail (optional)"}</div>
          <div style={{fontSize:11,color:GRAY600,marginBottom:6}}>{s?"Un detalle real y específico para establecer credibilidad local. Ej: 'Trabajo en Brookdale casi todas las semanas.'":"A real, specific detail to establish local credibility. e.g. 'I'm in Brookdale almost every week.' or 'Just replaced a water heater off 75th and Modaff last month.'"}</div>
          <textarea value={localDetail} onChange={e=>setLocalDetail(e.target.value)} placeholder={s?"Ej: Trabajo en Brookdale casi todas las semanas...":"e.g. A lot of the homes near Oak Street have older galvanized lines..."} rows={2} style={{width:"100%",boxSizing:"border-box",border:"2px solid "+GRAY200,borderRadius:10,padding:"8px 12px",fontSize:13,color:GRAY800,fontFamily:"inherit",resize:"vertical",outline:"none"}}/>
        </div>
      </div>}
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
function WorkLeads({flags,setFlag,onBack,onNext}){
  const s=useSp();
  const [active,setAct]=useState(null);const [sub,setSub]=useState(null);const [ci,sCi]=useState(null);const [log,setLog]=useState([]);
  const [ji,sJi]=useState("");const [sje,setSje]=useState(false);const [jb,setJb]=useState(flags.jobsBooked||0);const [lw,setLw]=useState(flags.leadsWorked||{like:0,comment:0,share:0,dm:0});
  function copy(t,i){try{const el=document.createElement("textarea");el.value=t;el.style.cssText="position:fixed;opacity:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}catch(e){}sCi(i);setTimeout(()=>sCi(null),2000);}
  function logL(id){setLog(p=>[...p,{type:id}]);const nx={...lw,[id]:(lw[id]||0)+1};setLw(nx);setFlag("leadsWorked",nx);}
  function addJ(n){const t=(jb||0)+n;setJb(t);setFlag("jobsBooked",t);sJi("");setSje(false);}
  function reset(){setAct(null);setSub(null);}
  const al=ND_LEADS.find(l=>l.id===active),as=al&&sub?(al.subtypes||[]).find(t=>t.id===sub):null;
  const sc=ND_LEADS.reduce((a,t)=>({...a,[t.id]:log.filter(l=>l.type===t.id).length}),{}),st=log.length;
  function SB({text,i}){const hasBrackets=text.includes("[");return <div style={{background:GRAY50,border:"1.5px solid "+GRAY200,borderRadius:12,padding:"14px 16px",marginBottom:10}}>{hasBrackets&&<div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:8,padding:"6px 12px",marginBottom:8,fontSize:12,color:"#991B1B",fontWeight:700}}>{"⚠️ Replace all [bracketed text] before sending."}</div>}<p style={{fontSize:14,color:GRAY800,lineHeight:1.8,margin:"0 0 10px",fontStyle:"italic"}}>{text}</p><button onClick={()=>copy(text,i)} style={{background:ci===i?GREEN:NAVY,color:ci===i?WHITE:YELLOW,border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{ci===i?"✓ Copied!":"📋 Copy Script"}</button></div>;}
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
    {al&&al.simple&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{al.label}</h3></div>{al.steps.map((st2,i)=><div key={i}><SL n={i+1} t={st2.label}/>{st2.note?<div style={{background:"#EFF6FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:NAVY}}>Use the <strong>Direct Message</strong> playbook once they respond.</div>:<SB text={st2.script} i={i}/>}</div>)}<div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16}}><Btn variant="success" onClick={()=>{logL(al.id);reset();}}>✓ Mark as Worked</Btn></div></Card>}
    {al&&!al.simple&&!sub&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={reset} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><h3 style={{color:NAVY,fontSize:18,fontWeight:800,margin:0}}>{al.label}</h3></div><p style={{color:GRAY600,fontSize:13,margin:"0 0 16px"}}>What did they say?</p><div style={{display:"flex",flexDirection:"column",gap:8}}>{al.subtypes.map(t=><button key={t.id} onClick={()=>setSub(t.id)} style={{background:al.color,border:"1.5px solid "+al.border,borderRadius:12,padding:"12px 16px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:3}}><span style={{fontWeight:700,color:NAVY,fontSize:14}}>{t.label}</span><span style={{fontSize:12,color:GRAY600,fontStyle:"italic"}}>{t.example}</span></button>)}</div></Card>}
    {al&&!al.simple&&as&&<Card><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><button onClick={()=>setSub(null)} style={{background:GRAY100,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,color:GRAY600,fontWeight:600,cursor:"pointer"}}>← Back</button><span style={{fontSize:26}}>{al.emoji}</span><div><div style={{fontWeight:800,color:NAVY,fontSize:15}}>{al.label}</div><div style={{fontSize:12,color:GRAY600}}>{as.label}</div></div></div>{al.id==="comment"&&<div><SL n={1} t="Reply publicly"/>{(as.pub||[]).map((r,i)=><SB key={i} text={r} i={i}/>)}<SL n={2} t="Then immediately DM"/><SB text={as.dm} i={99}/></div>}{al.id==="dm"&&<div><SL n={1} t="Reply within 24 hours"/><SB text={as.dm} i={0}/></div>}<div style={{borderTop:"1px solid "+GRAY200,paddingTop:16,marginTop:16}}><Btn variant="success" onClick={()=>{logL(al.id);reset();}}>✓ Mark as Worked</Btn></div></Card>}
    {st>0&&!active&&<Card><h3 style={{color:NAVY,fontSize:16,fontWeight:800,margin:"0 0 14px"}}>📊 {s?"Esta Sesión":"This Session"}</h3><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>{ND_LEADS.map(t=>sc[t.id]>0&&<div key={t.id} style={{background:t.color,border:"1.5px solid "+t.border,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{t.emoji}</span><span style={{fontWeight:800,color:NAVY,fontSize:14}}>{sc[t.id]}</span><span style={{fontSize:12,color:GRAY600}}>{t.label}</span></div>)}</div><div style={{background:NAVY,borderRadius:12,padding:16}}><p style={{color:YELLOW,fontWeight:700,margin:"0 0 4px",fontSize:14}}>{s?"Todo camino lleva a un DM. Cada DM es una oportunidad.":"Every path leads to a DM. Every DM is a chance to book a job."}</p><p style={{color:WHITE,fontSize:13,margin:0}}>{s?"Sigue adelante. Las primeras 48 horas lo son todo.":"Keep going. The first 48 hours are everything."}</p></div></Card>}
    <BottomNav onBack={()=>onBack("comment_path")} onNext={()=>onNext("amplify_home")} nextLabel={"Next →"}/>
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
  const [showConfetti,setShowConfetti]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setShowConfetti(false),4000);playCelebrationSound();return()=>clearTimeout(t);},[]);

  const COLORS=[YELLOW,"#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8"];
  const pieces=Array.from({length:60},(_,i)=>({id:i,color:COLORS[i%COLORS.length],left:Math.random()*100,delay:Math.random()*2,duration:2+Math.random()*2,size:6+Math.random()*8}));

  return <div style={{position:"relative"}}>
    {showConfetti&&<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
      {pieces.map(p=><div key={p.id} style={{position:"absolute",left:p.left+"%",top:"-20px",width:p.size+"px",height:p.size+"px",background:p.color,borderRadius:p.id%3===0?"50%":"2px",animation:`fall ${p.duration}s ${p.delay}s ease-in forwards`}}/>)}
    </div>}

    {/* Hero */}
    <div style={{background:"linear-gradient(135deg,"+NAVY+",#083072)",borderRadius:20,padding:"36px 28px",marginBottom:20,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:8}}>🏆</div>
      <div style={{background:YELLOW,borderRadius:99,display:"inline-block",padding:"5px 18px",marginBottom:12}}>
        <span style={{color:NAVY,fontWeight:900,fontSize:13,letterSpacing:"0.05em"}}>{s?"META DE IMPLEMENTACIÓN SEMANA 2 COMPLETADA":"WEEK 2 IMPLEMENTATION GOAL COMPLETE"}</span>
      </div>
      <h1 style={{color:YELLOW,fontSize:24,fontWeight:900,margin:"0 0 8px",lineHeight:1.2}}>{s?"Eres un Pro del Vecindario ahora.":"You're a Nextdoor Insider now."}</h1>
      <p style={{color:"rgba(255,255,255,0.85)",fontSize:14,lineHeight:1.8,margin:0}}>{s?"Perfil activo. Intros publicadas. Comentarios colocados. Estás en vivo.":"Profile live. Intros posted. Comments placed. You are live."}</p>
    </div>

    {/* Accomplishments */}
    <div style={{background:WHITE,border:"1.5px solid "+GRAY200,borderRadius:16,padding:"18px 20px",marginBottom:16}}>
      <h3 style={{color:NAVY,fontWeight:900,fontSize:16,margin:"0 0 14px"}}>{s?"Lo que ejecutaste esta semana:":"What you executed this week:"}</h3>
      <div style={{fontSize:11,fontWeight:800,color:GRAY400,textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 8px"}}>{s?"Construiste tu base":"You built your foundation"}</div>
      {[
        {emoji:"👤",title:s?"Presencia personal en vivo":"Personal presence live",desc:s?"Tu bio y foto muestran quién eres antes de que alguien te llame.":"Your bio and photo show who you are before anyone calls."},
        {emoji:"🏢",title:s?"Historia de negocio publicada":"Business story posted",desc:s?"Los vecinos pueden ver por qué empezaste y cómo operas diferente.":"Neighbors can see why you started and how you operate differently."},
        {emoji:"⭐",title:s?"Solicitudes de reseñas enviadas":"Review requests sent",desc:s?"Tus mejores clientes recibieron un mensaje personal pidiendo sus favoritos y recomendaciones.":"Your best customers got a personal message asking for their faves and recommendations."},
      ].map((item,i)=>(
        <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:GRAY50,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
          <span style={{fontSize:20,flexShrink:0}}>{item.emoji}</span>
          <div><div style={{fontWeight:800,color:NAVY,fontSize:13,marginBottom:2}}>{item.title}</div><div style={{fontSize:12,color:GRAY600,lineHeight:1.5}}>{item.desc}</div></div>
        </div>
      ))}
      <div style={{fontSize:11,fontWeight:800,color:GRAY400,textTransform:"uppercase",letterSpacing:"0.06em",margin:"16px 0 8px"}}>{s?"Te pusiste frente a los vecinos":"You got in front of neighbors"}</div>
      {[
        {emoji:"📣",title:s?"5 publicaciones de introducción":"5 intro posts",desc:s?"Tu historia en 5 grupos — 5 nuevas audiencias que no te conocían.":"Your story in 5 groups — 5 new audiences who didn't know you."},
        {emoji:"💬",title:s?"5 comentarios en publicaciones de vecinos":"5 comments on neighbor posts",desc:s?"Te mostraste como un recurso, no un anuncio. Eso es lo que construye confianza.":"You showed up as a resource, not an ad. That's what builds trust."},
      ].map((item,i)=>(
        <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:GRAY50,borderRadius:12,padding:"12px 14px",marginBottom:i===1?0:8}}>
          <span style={{fontSize:20,flexShrink:0}}>{item.emoji}</span>
          <div><div style={{fontWeight:800,color:NAVY,fontSize:13,marginBottom:2}}>{item.title}</div><div style={{fontSize:12,color:GRAY600,lineHeight:1.5}}>{item.desc}</div></div>
        </div>
      ))}
    </div>

    {/* Combined fishing + $0 section */}
    <div style={{background:"#001833",border:"2px solid "+YELLOW,borderRadius:16,padding:"20px 20px",marginBottom:20}}>
      <div style={{fontSize:36,textAlign:"center",marginBottom:10}}>🎣</div>
      <p style={{color:WHITE,fontSize:14,lineHeight:1.8,margin:"0 0 12px",textAlign:"center"}}>
        {s?"Cada interacción que recibes de tus publicaciones y comentarios es un prospecto. Cada trabajo que reservas de esas interacciones no te costó ni un centavo en publicidad.":"Every engagement you got from those posts and comments is a lead. Every job you book from those leads didn't cost you a single dollar in advertising."}
      </p>
      <div style={{background:"rgba(254,183,6,0.12)",border:"1.5px solid "+YELLOW,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
        <p style={{color:YELLOW,fontWeight:900,fontSize:14,margin:0}}>{s?"Ahora ve a trabajar esos prospectos.":"Now go work those leads."}</p>
      </div>
    </div>

    <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,borderTop:"1px solid "+GRAY200}}>
      <Btn variant="ghost" onClick={()=>onNext("comment_generate")} style={{fontSize:14,minWidth:120}}>{"← Back"}</Btn>
      <Btn onClick={()=>onNext("leads_main")} style={{fontSize:14,minWidth:120}}>{"Next →"}</Btn>
    </div>
  </div>;
}

// ── Main App ──────────────────────────────────────────────────────────────────
const VALID_PHASES=new Set(["home","get_post","setup","setup_personal","setup_business","setup_business_video","setup_customers","setup_complete","post_path","post_coach","post_video","post_personal","post_group","post_loop","comment_path","comment_how","comment_video","comment_coach","comment_generate","leads_main","week_complete","amplify_home","amplify_posts","amplify_comments","amplify_generate","amplify_how","amplify_video","amplify_post_coach","amplify_post_video","amplify_post_personal","tracker_home"]);
function Week2App({onHome,autoImport}){
  const [phase,setPhaseRaw]=useState(()=>{const p=lsGet(LS_PHASE,"home");return VALID_PHASES.has(p)?p:"home";});
  const [flags,setFlagsRaw]=useState(()=>({...DEF_FLAGS,...lsGet(LS_FLAGS,{})}));
  const [inputs,setInputsRaw]=useState(()=>{
    const saved={...DEF_INPUTS,...lsGet(LS_INPUTS,{})};
    // Only use MOCK_POST if there's no real post saved and no Week 1 data available
    const w1=autoImport&&autoImport();
    const realPost=saved.week1Post&&saved.week1Post!==MOCK_POST?saved.week1Post:(w1&&w1.week1Post?w1.week1Post:MOCK_POST);
    return {...saved,week1Post:realPost};
  });
  const [outputs,setOutputsRaw]=useState(()=>({...DEF_OUTPUTS,...lsGet(LS_OUTPUTS,{})}));
  const [lang,setLang]=useState(()=>lsGet("hcp_nd_lang","en"));
  const w1DataAvailable=!!(autoImport&&autoImport()&&autoImport().week1Post);
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
            {onHome && <button onClick={onHome} style={{background:YELLOW,border:"none",borderRadius:10,padding:"8px 16px",color:NAVY,fontWeight:900,fontSize:14,cursor:"pointer",whiteSpace:"nowrap"}}>{s?"← Todas las Semanas":"← All Weeks"}</button>}
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
                {phase==="get_post"            &&<GetPost        inputs={inputs} setInputs={setInputs} setFlag={setFlag} onNext={setPhase} w1DataAvailable={w1DataAvailable} autoImport={autoImport}/>}
                {phase==="setup"               &&<SetupPath      setFlag={setFlag} onNext={setPhase} s={s}/>}
                {phase==="setup_personal"      &&(flags.setupPath==="coach"?<SetupPersonalCoach {...sp2}/>:<SetupPersonal  {...sp2}/>)}
                {phase==="setup_business"      &&(flags.setupPath==="coach"?<SetupBusinessCoach {...sp2}/>:<SetupBusiness  {...sp2}/>)}
                {phase==="setup_business_video"&&<div><VideoPlaceholder title="Business Page Setup — Video Walkthrough" titleEs="Página de Negocio — Video Tutorial" videoUrl={null} s={s}/><BottomNav onBack={()=>setPhase("setup_personal")} backLabel={s?"← Atrás":"← Back"} onNext={()=>{setFlag("businessPageDone",true);setPhase("setup_customers");}} nextLabel={s?"Siguiente →":"Next →"}/></div>}
                {phase==="setup_customers"     &&<SetupCustomers {...sp2}/>}
                {phase==="setup_complete"      &&<SetupComplete onNext={setPhase} s={s}/>}
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
                {phase==="leads_main"      &&<WorkLeads      flags={flags} setFlag={setFlag} onBack={setPhase} onNext={setPhase}/>}
              </div>
            </div>
          </div>}
        </div>
      </div>
    </LangCtx.Provider>
  );
}

// ── COMBINED APP SHELL ────────────────────────────────────────────────────────
const FB_LOGO="data:image/png;base64,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";
const METZ_PHOTO="data:image/jpeg;base64,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";
const ND_LOGO="data:image/png;base64,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ACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAAAYIIEBAAAAAAAMEECAgAAAAAAmCABAQAAAAAATJCAAAAAAAAAJkhAAAAAAAAAEyQgAAAAAACACRIQAAAAAADABAkIAAAAAABgggQEAAAAAAAwQQICAAAAAACYIAEBAAAAAABMkIAAAAAAAAAmSEAAAAAAAAATJCAAAAAAAIAJEhAAAAAAAMAECQgAAAAAAGCCBAQAAAAAADBBAgIAAAAAAJggAQEAAAAAAEyQgAAAAAAAACZIQAAAAAAAABMkIAAAAAAAgAkSEAAAAAAAwAQJCAAAAAD4/7d3N7ltW1EAhc99FJWkBbqHDDPpBpqFZhfZTZaQUYGiP4kTybw3Az7abGvXamtbcXg+wDjRX6yRwafLJ0qSNsgBgSRJkiRJkiRJG+SAQNq4AtZ/CgLIvz9h9ZRCkiRJkiR9HaKWBXsjzvpOJD1Fu3O/AUnn0rj61L/1kUDO99T8T1pBJn8aJTYgV0cc4bxAkiRJkqRHtazFlzV61PzTarVOd70u6QTuIJAENAiuzjRYdhBEAdFvxfqRpKKogOovstZaa6211lpr7f33P/u/r5e0Ce4gkHSjU080yLg+Y8Faa6211lprrbX320XG9Vp9GR5kXN+u6M/p9xHML1huu6NA0g3i7qdI+hYFjUZjAhgSIonLfhDCfNwwxI6p+p3fwYvXr+rlTz/yMS447oKM9k+/QpIkSZIk3YNWy4BgXocPOTf7rv8himmaGNrIDxfBuzdvg58v+4BggJwcEEi6kTsIJJ2m5jlBFET07zYEEocEkiRJkiQ9mOWrf0+Q61OBA3DNLukODgikzVquPnz6gQbAUKvhQHmoIUmSJEnSg6pG9NPz1tcMnE/ia1QkwfVFim/7P/7t+l/SNjggkHS3foARy3CgGkMWEe5QlCRJkiTpUfQd/VRjzPkCA8u6vPXHW8GQMQ8ErqYJ53rDkp4CBwTSpuVfepN+lkEfDLRaBgWNoRrVv27IWmuttdZaa621D915Xd4SGsHUCqoRUZBFi8ZQwPIjSXdwQCDpVlmrwcF+RxQcPh3Yfb8jyPnopNpXcIBkrbXWWmuttdZ+q02CoIAk5l0CFQTzoACAKJ7t9hyy+PTHB8b9cyYOZJ3hwwRJT4oDAmnzbt89sB/3XObElAkXl/z6/j2/v5jIdgSOwP7R3qUkSZIkSdvU1+2RUP2jvOVqxFEQwOEz7EcYRp4fB46//Hb10DiOHA6Hc7xxSU/AFywjyjSr9uHHAAAAAElFTkSuQmCC";
export default function App(){
  const [week,setWeek]=useState(()=>{
    try{return localStorage.getItem("hbc_active_week")||"home";}catch{return "home";}
  });

  function navTo(w){
    setWeek(w);
    try{localStorage.setItem("hbc_active_week",w);}catch{}
  }

  // Home screen
  if(week==="home"){
    return <div style={{minHeight:"100vh",background:"#ECEFF1",fontFamily:"Inter,-apple-system,sans-serif"}}>
      <div style={{background:"#0A2443",padding:"20px 32px",display:"flex",alignItems:"center",gap:14}}>

        <div>
          <div style={{color:"#FFFFFF",fontWeight:800,fontSize:17,lineHeight:1}}>Business Coaching Foundations</div>
          <div style={{color:"#00B246",fontSize:12,fontWeight:600,marginTop:2}}>12-Week Program</div>
        </div>
      </div>
      <div style={{maxWidth:760,margin:"0 auto",padding:"28px 24px 48px"}}>

        {/* 1. BY THE NUMBERS */}
        <div style={{marginBottom:28}}>
          <div style={{background:"#0A2443",borderRadius:"16px 16px 0 0",padding:"24px 28px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,textAlign:"center"}}>
            {[
              {num:"10–30",label:"jobs added during the program"},
              {num:"$3K–$9K",label:"in new revenue"},
              {num:"8–30%",label:"increased conversion rates"},
            ].map((s,i)=><div key={i} style={{padding:"0 16px",borderRight:i<2?"1px solid rgba(255,255,255,0.15)":"none"}}>
              <div style={{color:"#FFB706",fontSize:26,fontWeight:900,lineHeight:1}}>{s.num}</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:6,lineHeight:1.4}}>{s.label}</div>
            </div>)}
          </div>
          <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRfLUPR6hMYeioMmEpF7lLnjpj27Ao0eR5i6fPGjDORypBFLvcG6SDtFP6npFV5YzB7Jhz0ZJs1aNh5/pubhtml?gid=403805056&single=true"
            target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",justifyContent:"center",background:"#FFB706",borderRadius:"0 0 16px 16px",padding:"12px 20px",textDecoration:"none"}}>
            <span style={{color:"#0A2443",fontWeight:900,fontSize:13}}>{"🏆  Click to See the Live Leaderboard"}</span>
          </a>
        </div>

        {/* 4. MIKE METZ TESTIMONIAL */}
        <div style={{background:"#0A2443",borderRadius:16,padding:"20px 24px",marginBottom:28}}>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <img src={METZ_PHOTO} alt="Mike Metz" style={{width:100,height:100,borderRadius:12,objectFit:"cover",objectPosition:"center top",flexShrink:0,border:"2px solid #FFB706"}}/>
            <div>
              <div style={{color:"#FFFFFF",fontSize:14,fontStyle:"italic",lineHeight:1.7,marginBottom:6}}>{"I saw a return on investment in the first week, and it didn’t cost me anything."}</div>
              <div style={{color:"#FFB706",fontSize:12,fontWeight:700}}>{"Mike Metz — Metz Heating and Air"}</div>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{"788 leads · 34 jobs · $15,572 revenue"}</div>
            </div>
          </div>
        </div>

        {/* 5. THREE KEYS */}
        <div style={{marginBottom:28}}>
          <div style={{fontWeight:800,color:"#0A2443",fontSize:14,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>{"3 Keys to Getting Results"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[
              {emoji:"📅",key:"Attend",desc:"Block your calendar. Show up like it’s a job for your best customer."},
              {emoji:"🙋",key:"Engage",desc:"Camera on, ask questions, share what’s happening in your business."},
              {emoji:"⚡",key:"Implement",desc:"Ideas don’t grow your business — action does. Apply each strategy in-session."},
            ].map((k,i)=><div key={i} style={{background:"#F8FAFC",border:"1.5px solid #E2E8F0",borderRadius:12,padding:"16px 14px",textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>{k.emoji}</div>
              <div style={{fontWeight:800,color:"#0A2443",fontSize:13,marginBottom:4}}>{k.key}</div>
              <div style={{fontSize:12,color:"#666666",lineHeight:1.5}}>{k.desc}</div>
            </div>)}
          </div>
        </div>

        {/* 6. STRATEGIES */}
        <div style={{fontWeight:800,color:"#0A2443",fontSize:14,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>{"Your Strategies"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {week:"week1",logo:FB_LOGO,logoStyle:{width:48,height:48,borderRadius:"50%"},title:"Week 1 — Facebook Groups",subtitle:"Go viral in your online community for $0. Join 10 groups, post your story, generate leads.",color:"#EFF6FF",border:"#93C5FD"},
            {week:"week2",logo:ND_LOGO,logoStyle:{width:90,height:28,objectFit:"contain"},title:"Week 2 — Nextdoor Groups + Comments",subtitle:"5 intro posts + 5 comments = a live Nextdoor presence and inbound leads.",color:"#F0FDF4",border:"#86EFAC"},
          ].map(s=><div key={s.week} onClick={()=>navTo(s.week)}
            style={{background:s.color,border:"2px solid "+s.border,borderRadius:16,padding:"18px 22px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 12px rgba(0,41,66,0.06)",transition:"transform 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",width:60}}><img src={s.logo} alt="" style={s.logoStyle}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:"#0A2443",fontSize:15,marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:13,color:"#555555"}}>{s.subtitle}</div>
            </div>
          </div>)}
        </div>
        <p style={{color:"#999999",fontSize:12,textAlign:"center",marginTop:24}}>{"Weeks 3–12 coming soon"}</p>


      </div>
    </div>;
  }

  if(week==="week1") return <Week1App onHome={()=>navTo("home")}/>;
  if(week==="week2") return <Week2App onHome={()=>navTo("home")} autoImport={getWeek1Data}/>;
  return null;
}
