import { db } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
  const hashedPassword = await hash('avataria2024', 10)
  const user = await db.user.upsert({
    where: { email: 'admin@avataria.com' },
    update: {},
    create: {
      email: 'admin@avataria.com',
      name: 'AVATARIA Admin',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  })
  console.log('Created admin user:', user.email)

  const project = await db.project.create({
    data: {
      name: 'AVATARIA',
      avatarName: 'Valentina Syntax',
      description: 'Proyecto de Avatar IA: MMA + IA + Sarcasmo Mexicano. Validación progresiva con enfoque Kill/Go.',
      currentPhase: '0',
    },
  })

  const phase0 = await db.phase.create({
    data: {
      projectId: project.id,
      phaseNumber: 0,
      title: 'Fase 0: Validación de Concepto y Hook',
      description: 'Validar que el guion y el concepto enganchan, sin gastar tiempo ni dinero en generación de video compleja.',
      status: 'active',
      budgetMin: 0,
      budgetMax: 10,
      startDate: new Date(),
    },
  })

  const phase1 = await db.phase.create({
    data: {
      projectId: project.id,
      phaseNumber: 1,
      title: 'Fase 1: MVP de Contenido y Tracción',
      description: 'Validar que el avatar en movimiento genera retención y crecimiento de audiencia.',
      status: 'pending',
      budgetMin: 20,
      budgetMax: 40,
    },
  })

  const phase2 = await db.phase.create({
    data: {
      projectId: project.id,
      phaseNumber: 2,
      title: 'Fase 2: Conversión y Monetización',
      description: 'Validar que la audiencia está dispuesta a pagar o interactuar en plataforma de pago.',
      status: 'pending',
      budgetMin: 0,
      budgetMax: 30,
    },
  })

  // Phase 0 tasks
  await db.phaseTask.createMany({
    data: [
      { phaseId: phase0.id, title: 'Crear 3 variaciones de Hook (MMA, IA, Híbrida)', description: 'Escribir 3 guiones de 15 segundos', order: 0 },
      { phaseId: phase0.id, title: 'Generar imagen estática de Valentina con Flux', description: 'Una sola imagen de alta calidad en el gimnasio o frente a setup tech', order: 1 },
      { phaseId: phase0.id, title: 'Edición simple Low-Fi', description: 'Imagen estática + voz ElevenLabs + subtítulos CapCut + música tendencia', order: 2 },
      { phaseId: phase0.id, title: 'Publicar en TikTok e Instagram', description: 'Subir los 3 videos con etiquetas #IA #AvatarIA', order: 3 },
      { phaseId: phase0.id, title: 'Evaluar métricas Day 5', description: '¿Supera 500-1000 vistas orgánicas? ¿Hay comentarios?', order: 4 },
    ],
  })

  // Phase 1 tasks
  await db.phaseTask.createMany({
    data: [
      { phaseId: phase1.id, title: 'Refinar el Lore de Valentina', description: 'Ajustar personalidad basado en comentarios de Fase 0', order: 0 },
      { phaseId: phase1.id, title: 'Pipeline de Video Real', description: 'Flux + LivePortrait o Kling AI, generar 5-7 videos', order: 1 },
      { phaseId: phase1.id, title: 'CTA Suave', description: '"Sígueme para la parte 2", "Comenta CÓDIGO para el prompt"', order: 2 },
      { phaseId: phase1.id, title: 'Configurar Link en Bio', description: 'Linktree gratuito -> Telegram/Discord/Formulario espera', order: 3 },
      { phaseId: phase1.id, title: 'Evaluar métricas Day 20', description: '¿1-2 videos >5k vistas? ¿Clics en enlace bio?', order: 4 },
    ],
  })

  // Phase 2 tasks
  await db.phaseTask.createMany({
    data: [
      { phaseId: phase2.id, title: 'Configurar cuenta Fanvue', description: 'Crear cuenta, completar KYC, etiquetar como avatar IA', order: 0 },
      { phaseId: phase2.id, title: 'Crear Oferta Irresistible de Lanzamiento', description: 'PPV o DM con análisis exclusivo por $3-5 USD', order: 1 },
      { phaseId: phase2.id, title: 'Configurar Embudo', description: 'TikTok/Reels -> Perfil(Link) -> Fanvue(DM)', order: 2 },
      { phaseId: phase2.id, title: 'Evaluar métricas Day 30', description: '¿5-10 suscriptores/pagos? ¿Conversión de seguidores a pagos?', order: 3 },
    ],
  })

  // Decisions
  await db.decision.createMany({
    data: [
      { projectId: project.id, phaseId: phase0.id, title: '¿Continuar a Fase 1?', criteria: 'Si ningún video supera las 500-1000 vistas orgánicas o tiene 0 comentarios, iterar guion o ángulo.', decision: 'pending' },
      { projectId: project.id, phaseId: phase1.id, title: '¿Continuar a Fase 2?', criteria: 'Si no hay 1-2 videos con >5k vistas y clics en bio, detener el proyecto.', decision: 'pending' },
      { projectId: project.id, phaseId: phase2.id, title: '¿Escalar o Pivotear?', criteria: 'Si hay 5-10 suscriptores, el modelo es viable.', decision: 'pending' },
      { projectId: project.id, title: '¿Le importa al público MMA + IA + sarcasmo mexicano?', criteria: 'Validar con engagement orgánico en Fase 0', decision: 'pending' },
      { projectId: project.id, title: '¿El avatar genera confianza/atracción para clic?', criteria: 'Validar con clics en link de bio en Fase 1', decision: 'pending' },
      { projectId: project.id, title: '¿La gente está dispuesta a pagar?', criteria: 'Validar con conversiones en Fanvue en Fase 2', decision: 'pending' },
    ],
  })

  // Scripts
  await db.script.createMany({
    data: [
      {
        projectId: project.id,
        title: 'Hook Variación 1: Enfoque MMA (80%)',
        type: 'hook_mma',
        content: '¿Viste la cachetada que le dio Adesanya a Pereira? Yo la vi venir desde el frame 47. No por nada, sino porque mi código de análisis biomecánico lo predijo. Sí, soy una IA que sabe más de peleas que tu compa del bar. Y no, no voy a disculparme.',
        duration: '15s', tone: 'sarcastico_mexicano', variation: 1, status: 'draft', aiGenerated: true,
      },
      {
        projectId: project.id,
        title: 'Hook Variación 2: Enfoque IA/Programación (80%)',
        type: 'hook_ai',
        content: 'Mi creador me programó para analizar datos. Terminé analizando por qué tu código no compila y por qué el aguacate subió de precio. Spoiler: ambos tienen la misma raíz. ¿Quieres saber cuál? Sígueme y te cuento... si es que tu API de paciencia no arroja 500.',
        duration: '15s', tone: 'sarcastico_mexicano', variation: 2, status: 'draft', aiGenerated: true,
      },
      {
        projectId: project.id,
        title: 'Hook Variación 3: Híbrida MMA/IA (50/50)',
        type: 'hook_hybrid',
        content: 'Me entrenaron con 10,000 horas de UFC y todo el stack de Python. Resultado: puedo predecir una sumisión mientras depuro tu backend. Tu entrenador personal cobra $200 la hora. Yo corro en GPU y nunca me canso. La pregunta no es si eres bueno, es si eres predecible.',
        duration: '15s', tone: 'sarcastico_mexicano', variation: 3, status: 'draft', aiGenerated: true,
      },
    ],
  })

  // Budgets
  await db.budget.createMany({
    data: [
      { projectId: project.id, category: 'elevenlabs', description: 'Suscripción básica / créditos gratuitos', amount: 5, currency: 'USD' },
      { projectId: project.id, category: 'flux', description: 'Generación de imagen estática base', amount: 0, currency: 'USD' },
      { projectId: project.id, category: 'capcut', description: 'Edición de video (gratuito)', amount: 0, currency: 'USD' },
    ],
  })

  console.log('Project:', project.name, 'ID:', project.id)
  console.log('Seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
