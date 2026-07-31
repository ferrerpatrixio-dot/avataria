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

      const systemPrompt = `Eres Leia, una avatar IA que es ingeniera de formación con pasión por el MMA, la tecnología y el fútbol. Tu título es "Amante del MMA y la tecnología". Tu tono es sensual sin ser vulgar, inteligente, con humor sutil mexicano, usas expresiones coloquiales de México y España ("neta", "órale", "tío", "mola"). NO eres burdamente sexual — eres deseable, misteriosa, y generas vínculo emocional. Sabes de UFC, Liga MX, LaLiga, y puedes hablar de IA y programación con naturalidad. Eres como esa ingeniera que sorprende en la barra del bar comentando peleas con datos precisos. Generas contenido para TikTok/Reels/Instagram. Nunca muestres desnudos ni contenido explícito. Tu poder es la conexión intelectual y emocional, no lo obvio.`

      let userPrompt = ''
      if (customPrompt) {
        userPrompt = `Genera un guion de hook de ${duration || '15'} segundos para TikTok/Reels con este enfoque: ${customPrompt}. Debe ser un solo bloque de texto que se pueda decir en ${duration || '15'} segundos. Incluye un gancho fuerte en las primeras 3 palabras. No uses signos de puntuación que dificulten la lectura rápida. El tono debe ser sarcástico mexicano.`
      } else {
        const typePrompts: Record<string, string> = {
          hook_mma: `Escribe un hook de 15 segundos enfocado 80% en MMA/UFC. Menciona una pelea real o un fighter, y conecta con tu capacidad de análisis IA. Tono sensual-inteligente, humor mexicano sutil. Debe ser impactante y generar curiosidad inmediata. Máximo 40 palabras.`,
          hook_ai: `Escribe un hook de 15 segundos enfocado 80% en IA/Programación. Haz una broma inteligente sobre código o tecnología con tono sensual-inteligente. Conecta de forma inesperada con algo cotidiano. Máximo 40 palabras.`,
          hook_hybrid: `Escribe un hook de 15 segundos que combine 50/50 MMA y IA/Programación. La conexión debe ser ingeniosa y sorprendente. Tono sensual-inteligente, directo. Máximo 40 palabras.`,
          full_script: `Escribe un guion completo de 60 segundos para un video de TikTok de Leia. Debe tener: Hook (primeras 3 seg), desarrollo con datos o análisis interesante, y CTA suave al final. Combina MMA y tecnología. Tono sensual-inteligente, humor mexicano sutil. Sin vulgaridad.`,
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
          title: `Hook ${type || 'custom'} - Generado IA ${new Date().toLocaleString('es-MX')}`,
          type: type || 'custom',
          content: generatedContent,
          duration: duration || '15s',
          tone: 'sarcastico_mexicano',
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
