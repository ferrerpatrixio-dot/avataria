import { PrismaClient } from '@prisma/client'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const db = new PrismaClient()

const SCRIPTS = [
  {
    title: 'MMA — D-Rod Rodriguez en UFC Belgrade (1 ago 2026)',
    type: 'hook_mma',
    content: 'Acabo de ver que hoy la UFC está en Belgrado por primera vez y D-Rod, nuestro hermano mexicano-americano, pelea. ¡Vamos a apoyarlo con todo el corazón! ¿Quién más siente esa energía latina esta noche?',
    tone: 'barrista_conversacional',
  },
  {
    title: 'MMA — Ankalaev TKO Guskov R5 (25 jul 2026)',
    type: 'hook_mma',
    content: 'Acabo de ver esa pelea. Fue una dominación total, ¡qué potencia la de Ankalaev! Se vio venir ese TKO, Guskov no tuvo ninguna oportunidad. ¿No les parece que Ankalaev es el próximo contendiente indiscutible?',
    tone: 'calido_cercano',
  },
  {
    title: 'Fútbol — Liga MX Jornada 3 (1 ago 2026)',
    type: 'hook_futbol',
    content: 'Hoy la Liga MX enciende la Jornada 3 con un clásico: León vs Pachuca. ¡Qué emoción! ¿Listo para ver el mejor fútbol de México?',
    tone: 'calido_cercano',
  },
  {
    title: 'MMA — Makhachev vs Garry UFC 330 (15 ago 2026)',
    type: 'hook_mma',
    content: 'Se viene... una prueba de fuego para Garry. El invicto Makhachev es una montaña. Es la definición de presión. ¿Crees que el ritmo de Garry puede romper la maquinaria rusa?',
    tone: 'calido_cercano',
  },
]

const PHASES = [
  {
    phaseNumber: 0,
    title: 'Fase 0: Validación de Concepto y Hook',
    description: 'Validar que el guion y el concepto enganchan, sin gastar tiempo ni dinero en generación de video compleja.',
    status: 'active',
    budgetMin: 0,
    budgetMax: 10,
    decision: { title: '¿Continuar a Fase 1?', criteria: 'Si ningún video supera las 500-1000 vistas orgánicas o tiene 0 comentarios, iterar guion o ángulo.' },
    tasks: [
      ['Crear hooks con datos trending reales (MMA + Emocional)', 'Generar hooks con cartelera UFC/Fútbol actual y hooks coquetos'],
      ['Generar imagen estática de Leia con Flux', 'Una sola imagen de alta calidad en el gimnasio o frente a setup tech'],
      ['Edición simple Low-Fi', 'Imagen estática + voz ElevenLabs + subtítulos CapCut + música tendencia'],
      ['Publicar en TikTok e Instagram', 'Subir los videos con etiquetas de tendencia'],
      ['Evaluar métricas Day 5', '¿Supera 500-1000 vistas orgánicas? ¿Hay comentarios?'],
    ],
  },
  {
    phaseNumber: 1,
    title: 'Fase 1: MVP de Contenido y Tracción',
    description: 'Validar que el avatar en movimiento genera retención y crecimiento de audiencia.',
    status: 'pending',
    budgetMin: 20,
    budgetMax: 40,
    decision: { title: '¿Continuar a Fase 2?', criteria: 'Si no hay 1-2 videos con >5k vistas y clics en bio, detener el proyecto.' },
    tasks: [
      ['Refinar el Lore de Leia', 'Ajustar personalidad basado en comentarios de Fase 0'],
      ['Pipeline de Video Real', 'Flux + LivePortrait o Kling AI, generar 5-7 videos'],
      ['CTA Suave', '"Sígueme para la parte 2", "Comenta CÓDIGO para el prompt"'],
      ['Configurar Link en Bio', 'Linktree gratuito -> Telegram/Discord/Formulario espera'],
      ['Evaluar métricas Day 20', '¿1-2 videos >5k vistas? ¿Clics en enlace bio?'],
    ],
  },
  {
    phaseNumber: 2,
    title: 'Fase 2: Conversión y Monetización',
    description: 'Validar que la audiencia está dispuesta a pagar o interactuar en plataforma de pago.',
    status: 'pending',
    budgetMin: 0,
    budgetMax: 30,
    decision: { title: '¿Escalar o Pivotear?', criteria: 'Si hay 5-10 suscriptores, el modelo es viable.' },
    tasks: [
      ['Configurar cuenta Fanvue', 'Crear cuenta, completar KYC, preparar perfil de Leia'],
      ['Crear Oferta Irresistible de Lanzamiento', 'PPV o DM con análisis exclusivo por $3-5 USD'],
      ['Configurar Embudo', 'TikTok/Reels -> Perfil(Link) -> Fanvue(DM)'],
      ['Evaluar métricas Day 30', '¿5-10 suscriptores/pagos? ¿Conversión de seguidores a pagos?'],
    ],
  },
]

const GENERAL_DECISIONS = [
  ['¿El contenido trending (UFC, fútbol, emocional) engancha?', 'Validar con engagement orgánico en Fase 0'],
  ['¿El avatar genera confianza/atracción para clic?', 'Validar con clics en link de bio en Fase 1'],
  ['¿La gente está dispuesta a pagar?', 'Validar con conversiones en Fanvue en Fase 2'],
]

const BUDGETS = [
  { category: 'elevenlabs', description: 'TTS — voz del avatar', plannedAmount: 5 },
  { category: 'flux', description: 'Generación de imágenes (incluido en z-ai-sdk)', plannedAmount: 0 },
  { category: 'capcut', description: 'Edición de video (gratuito)', plannedAmount: 0 },
  { category: 'kling_ai', description: 'Video con avatar animado — Solo si Fase 0 valida', plannedAmount: 15 },
  { category: 'fanvue', description: 'Plataforma de suscripción — Solo si hay tracción', plannedAmount: 0 },
]

async function seedProject() {
  const existing = await db.project.findFirst({ where: { name: 'AVATARIA' } })
  if (existing) return existing

  const project = await db.project.create({
    data: {
      name: 'AVATARIA',
      avatarName: 'Leia',
      description: 'Proyecto de Avatar: Leia — 25 años, mexicana viviendo en Chile. Fanática del fútbol, MMA, música y cine. Cálida, coqueta, segura. No sarcástica. Validación progresiva con enfoque Kill/Go para mercado mexicano, chileno y español.',
      currentPhase: '0',
    },
  })

  for (const { tasks, decision, ...phaseData } of PHASES) {
    const phase = await db.phase.create({
      data: {
        projectId: project.id,
        ...phaseData,
        startDate: phaseData.status === 'active' ? new Date() : undefined,
      },
    })
    await db.phaseTask.createMany({
      data: tasks.map(([title, description], order) => ({ phaseId: phase.id, title, description, order })),
    })
    await db.decision.create({
      data: { projectId: project.id, phaseId: phase.id, ...decision, decision: 'pending' },
    })
  }

  await db.decision.createMany({
    data: GENERAL_DECISIONS.map(([title, criteria]) => ({ projectId: project.id, title, criteria, decision: 'pending' })),
  })

  await db.script.createMany({
    data: SCRIPTS.map((s) => ({ projectId: project.id, ...s, duration: '15s', status: 'draft', aiGenerated: true })),
  })

  await db.budget.createMany({
    data: BUDGETS.map((b) => ({ projectId: project.id, ...b, amount: 0, currency: 'USD' })),
  })

  console.log('Created project AVATARIA with phases, scripts and budgets')
  return project
}

function titleFromFile(file) {
  const name = file.replace(/\.[^.]+$/, '').replace(/^leia-/, '').replace(/-/g, ' ')
  return `Leia — ${name}`
}

async function seedPhotos(project) {
  const files = readdirSync(join(process.cwd(), 'public')).filter((f) => /^leia-.*\.(png|jpe?g|webp)$/i.test(f))
  const known = new Set((await db.content.findMany({ where: { projectId: project.id }, select: { imageUrl: true } })).map((c) => c.imageUrl))
  const fresh = files.filter((f) => !known.has(`/${f}`))

  if (fresh.length) {
    await db.content.createMany({
      data: fresh.map((f) => ({
        projectId: project.id,
        title: titleFromFile(f),
        type: 'static_image',
        imageUrl: `/${f}`,
        status: 'planned',
      })),
    })
  }
  console.log(`Photos registered: ${fresh.length} new, ${files.length - fresh.length} already existed`)
}

async function main() {
  const project = await seedProject()
  await seedPhotos(project)
}

main()
  .catch((error) => {
    console.error('Unable to seed the project', error)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
