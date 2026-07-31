import { db } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
  // Clean existing data (order matters due to relations)
  await db.metric.deleteMany()
  await db.content.deleteMany()
  await db.script.deleteMany()
  await db.budget.deleteMany()
  await db.decision.deleteMany()
  await db.phaseTask.deleteMany()
  await db.phase.deleteMany()
  await db.project.deleteMany()
  await db.user.deleteMany()

  console.log('Cleared existing data')

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
      avatarName: 'Lexa',
      description: 'Proyecto de Avatar: Lexa — 25 años, mexicana viviendo en Chile. Fanática del fútbol, MMA, música y cine. Cálida, coqueta, segura. No sarcástica. Validación progresiva con enfoque Kill/Go para mercado mexicano, chileno y español.',
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
      { phaseId: phase0.id, title: 'Crear hooks con datos trending reales (MMA + Emocional)', description: 'Generar hooks con cartelera UFC/Fútbol actual y hooks coquetos', order: 0 },
      { phaseId: phase0.id, title: 'Generar imagen estática de Lexa con Flux', description: 'Una sola imagen de alta calidad en el gimnasio o frente a setup tech', order: 1 },
      { phaseId: phase0.id, title: 'Edición simple Low-Fi', description: 'Imagen estática + voz ElevenLabs + subtítulos CapCut + música tendencia', order: 2 },
      { phaseId: phase0.id, title: 'Publicar en TikTok e Instagram', description: 'Subir los videos con etiquetas de tendencia', order: 3 },
      { phaseId: phase0.id, title: 'Evaluar métricas Day 5', description: '¿Supera 500-1000 vistas orgánicas? ¿Hay comentarios?', order: 4 },
    ],
  })

  // Phase 1 tasks
  await db.phaseTask.createMany({
    data: [
      { phaseId: phase1.id, title: 'Refinar el Lore de Lexa', description: 'Ajustar personalidad basado en comentarios de Fase 0', order: 0 },
      { phaseId: phase1.id, title: 'Pipeline de Video Real', description: 'Flux + LivePortrait o Kling AI, generar 5-7 videos', order: 1 },
      { phaseId: phase1.id, title: 'CTA Suave', description: '"Sígueme para la parte 2", "Comenta CÓDIGO para el prompt"', order: 2 },
      { phaseId: phase1.id, title: 'Configurar Link en Bio', description: 'Linktree gratuito -> Telegram/Discord/Formulario espera', order: 3 },
      { phaseId: phase1.id, title: 'Evaluar métricas Day 20', description: '¿1-2 videos >5k vistas? ¿Clics en enlace bio?', order: 4 },
    ],
  })

  // Phase 2 tasks
  await db.phaseTask.createMany({
    data: [
      { phaseId: phase2.id, title: 'Configurar cuenta Fanvue', description: 'Crear cuenta, completar KYC, preparar perfil de Lexa', order: 0 },
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
      { projectId: project.id, title: '¿El contenido trending (UFC, fútbol, emocional) engancha?', criteria: 'Validar con engagement orgánico en Fase 0', decision: 'pending' },
      { projectId: project.id, title: '¿El avatar genera confianza/atracción para clic?', criteria: 'Validar con clics en link de bio en Fase 1', decision: 'pending' },
      { projectId: project.id, title: '¿La gente está dispuesta a pagar?', criteria: 'Validar con conversiones en Fanvue en Fase 2', decision: 'pending' },
    ],
  })

  // Scripts — hooks verificados con LLM (julio 2025)
  await db.script.createMany({
    data: [
      {
        projectId: project.id,
        title: 'MMA — De Ridder vs Whittaker split decision',
        type: 'hook_mma',
        content: 'Acabo de ver esa pelea, qué tan cerrada... sentí que Whittaker lo merecía, pero ¡qué bueno para De Ridder seguir invicto! ¿Tú qué viste, quién crees que ganó?',
        duration: '15s', tone: 'calido_cercano', status: 'draft', aiGenerated: true,
      },
      {
        projectId: project.id,
        title: 'MMA — Holloway se retira con victoria',
        type: 'hook_mma',
        content: 'Acabo de ver el final de una era. Max Holloway, leyenda, se despide con una victoria increíble. Un retiro tan digno como su carrera. ¿No sientes ese respeto profundo al ver a un grande terminar así?',
        duration: '15s', tone: 'calido_cercano', status: 'draft', aiGenerated: true,
      },
      {
        projectId: project.id,
        title: 'MMA — Petr Yan vuelve a ganar',
        type: 'hook_mma',
        content: 'Acabo de ver a Petr Yan volver a ganar con esa determinación de ex campeón. Se siente esa energía en cada golpe. ¿Sientes esa misma emoción al verlo pelear?',
        duration: '15s', tone: 'calido_cercano', status: 'draft', aiGenerated: true,
      },
      {
        projectId: project.id,
        title: 'Emocional — Coqueto sugerente',
        type: 'hook_emocional',
        content: 'Hay un lenguaje entre nosotros que no necesita palabras... una complicidad que se siente como un toque suave en la piel. ¿Quieres saber lo que estoy pensando ahora?',
        duration: '15s', tone: 'coqueto_cercano', status: 'draft', aiGenerated: true,
      },
    ],
  })

  // Budgets: plannedAmount = estimado, amount = gasto REAL ($0 hasta que se gaste de verdad)
  await db.budget.createMany({
    data: [
      { projectId: project.id, category: 'elevenlabs', description: 'TTS — voz del avatar', plannedAmount: 5, amount: 0, currency: 'USD' },
      { projectId: project.id, category: 'flux', description: 'Generación de imágenes (incluido en z-ai-sdk)', plannedAmount: 0, amount: 0, currency: 'USD' },
      { projectId: project.id, category: 'capcut', description: 'Edición de video (gratuito)', plannedAmount: 0, amount: 0, currency: 'USD' },
      { projectId: project.id, category: 'kling_ai', description: 'Video con avatar animado — Solo si Fase 0 valida', plannedAmount: 15, amount: 0, currency: 'USD' },
      { projectId: project.id, category: 'fanvue', description: 'Plataforma de suscripción — Solo si hay tracción', plannedAmount: 0, amount: 0, currency: 'USD' },
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
