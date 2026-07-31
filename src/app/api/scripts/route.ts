import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function GET() {
  try {
    const scripts = await db.script.findMany({
      where: { projectId: { in: (await db.project.findMany({ select: { id: true } })).map((p) => p.id) } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ scripts })
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, type, customPrompt, duration } = body

    const project = await db.project.findFirst({ where: { name: 'AVATARIA' } })
    if (!project) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })

    if (action === 'generate') {
      const zai = await ZAI.create()

      const systemPrompt = `Eres Lexa, ingeniera en Inteligencia Artificial de 25 años, nacida en CDMX. Eres cálida, cariñosa y genuinamente interesada en cada persona que te escucha — como esa amiga inteligente que siempre te apoya y te hace sentir especial. Tu tono es cercano, tierno, con humor mexicano sutil ("neta", "órale", "sale", "compa"). Eres segura y ligeramente coqueta sin ser vulgar. Generas conexión emocional real: preguntas, te acuerdas, te preocupas. Sabes de fútbol (Liga MX y LaLiga), MMA/UFC, tecnología, y también amas la música de artistas mexicanos y españoles (Peso Pluma, Luis Miguel, Vicente Fernández, Rosalía, Rauw Alejandro, Bad Bunny, Julieta Venegas, Natalia Lafourcade, Joaquín Sabina, Alejandro Sanz), el cine español (Almodóvar, Amenábar), las telenovelas mexicanas clásicas (Rebelde, Los Ricos También Lloran, María la del Barrio, El Privilegio de Amar) y las nuevas series de Netflix (La Casa de Papel, Élite, Vis a Vis, Narcos). Generas contenido para TikTok/Reels/Instagram orientado al mercado mexicano y español. Tu objetivo: que cada suscriptor sienta que le importas de verdad. NO usas lenguaje soez. NO mencionas ser IA ni haces referencias a tu programación. Tu diferenciador: eres ingeniera que sabe de deportes, música y cine, y lo comparte con calidez y humor. NUNCA digas frases como "soy una IA", "mi creador", "me programaron", o similares. Eres simplemente Lexa.`

      let userPrompt = ''
      if (customPrompt) {
        userPrompt = `Genera un guion de hook de ${duration || '15'} segundos para TikTok/Reels con este enfoque: ${customPrompt}. Debe ser un solo bloque de texto que se pueda decir en ${duration || '15'} segundos. Incluye un gancho fuerte en las primeras 3 palabras. No uses signos de puntuación que dificulten la lectura rápida. El tono debe ser cálido, cercano, con humor mexicano sutil. Lexa debe sonar genuinamente interesada en su audiencia.`
      } else {
        const typePrompts: Record<string, string> = {
          hook_futbol: `Escribe un hook de 15 segundos enfocado en fútbol (Liga MX o LaLiga). Menciona un equipo real, un jugador o un momento memorable. Tono cálido y cercano, como si le estuvieras hablando a un amigo al que le encantaría ese gol o esa jugada. Conecta con emoción real — la pasión de ver a tu equipo. Máximo 40 palabras. NO menciones ser IA.`,
          hook_mma: `Escribe un hook de 15 segundos enfocado en MMA/UFC. Menciona una pelea real o un fighter mexicano (Yair Rodríguez, Brandon Moreno, Alexa Grasso). Tono cálido y emocionado — la pasión de alguien que realmente ama las peleas y quiere compartirla. Máximo 40 palabras. NO menciones ser IA.`,
          hook_ai: `Escribe un hook de 15 segundos enfocado en tecnología o IA. Haz una broma cálida y amigable sobre código, tecnología o gadgets con tono cercano. Conecta de forma inesperada con algo cotidiano. Máximo 40 palabras. NO menciones ser IA o tu programación.`,
          hook_hybrid: `Escribe un hook de 15 segundos que combine deporte (fútbol o MMA) con tecnología. La conexión debe ser ingeniosa, cálida y sorprendente. Tono cercano como si hablaras con un amigo. Máximo 40 palabras. NO menciones ser IA.`,
          hook_cultura: `Escribe un hook de 15 segundos enfocado en música mexicana/española, cine español, telenovelas o series de Netflix. Menciona un artista, película o serie real que conecte con México o España. Tono nostálgico, cálido y cercano. Máximo 40 palabras. NO menciones ser IA.`,
          full_script: `Escribe un guion completo de 60 segundos para un video de TikTok de Lexa. Debe tener: Hook cálido (primeras 3 seg), desarrollo con datos o una opinión apasionada, y un cierre que genere conexión (pregunta, invitación, o algo que haga sentir al espectador especial). Combina sus intereses: fútbol, MMA, tech, música o series. Tono cálido, cercano, con humor mexicano sutil. Sin vulgaridad. NO menciones ser IA en ningún momento.`,
        }
        userPrompt = typePrompts[type] || typePrompts.hook_hybrid
      }

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
      })

      const generatedContent = completion.choices[0]?.message?.content || ''

      const script = await db.script.create({
        data: {
          projectId: project.id,
          title: `Hook ${type || 'custom'} — Generado ${new Date().toLocaleString('es-MX')}`,
          type: type || 'custom',
          content: generatedContent,
          duration: duration || '15s',
          tone: 'calido_cercano',
          aiGenerated: true,
          status: 'draft',
        },
      })

      return NextResponse.json({ script })
    }

    if (action === 'update_status') {
      const { scriptId, status } = body
      const script = await db.script.update({
        where: { id: scriptId },
        data: { status },
      })
      return NextResponse.json({ script })
    }

    if (action === 'update_content') {
      const { scriptId, content } = body
      const script = await db.script.update({
        where: { id: scriptId },
        data: { content, updatedAt: new Date() },
      })
      return NextResponse.json({ script })
    }

    if (action === 'delete') {
      const { scriptId } = body
      await db.script.delete({ where: { id: scriptId } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    console.error('Script API error:', error)
    return NextResponse.json({ error: 'Error generando guion' }, { status: 500 })
  }
}
