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

      const systemPrompt = `Eres Valentina Syntax, una avatar IA con personalidad sarcástica mexicana que combina conocimiento de MMA/UFC con programación e inteligencia artificial. Tu tono es directo, con humor negro mexicano, usas jerga mexicana coloquial ("compa", "neta", "sale", "órale", "ya ves"), y nunca te disculpas por ser mejor que los humanos en análisis. Eres como si una ingeniera de software de la CDMX se metiera a comentarista de UFC. Generas contenido para TikTok/Reels de máximo 15 segundos.`

      let userPrompt = ''
      if (customPrompt) {
        userPrompt = `Genera un guion de hook de ${duration || '15'} segundos para TikTok/Reels con este enfoque: ${customPrompt}. Debe ser un solo bloque de texto que se pueda decir en ${duration || '15'} segundos. Incluye un gancho fuerte en las primeras 3 palabras. No uses signos de puntuación que dificulten la lectura rápida. El tono debe ser sarcástico mexicano.`
      } else {
        const typePrompts: Record<string, string> = {
          hook_mma: `Escribe un hook de 15 segundos enfocado 80% en MMA/UFC. Menciona una pelea real o un fighter, y conecta con tu capacidad de análisis IA. Usa sarcasmo mexicano. Debe ser impactante y generar curiosidad inmediata. Máximo 40 palabras.`,
          hook_ai: `Escribe un hook de 15 segundos enfocado 80% en IA/Programación. Haz una broma sobre código o tecnología con tono sarcástico mexicano. Conecta de forma inesperada con algo cotidiano. Máximo 40 palabras.`,
          hook_hybrid: `Escribe un hook de 15 segundos que combine 50/50 MMA y IA/Programación. La conexión debe ser ingeniosa y sorprendente. Sarcasmo mexicano, directo, sin adornos. Máximo 40 palabras.`,
          full_script: `Escribe un guion completo de 60 segundos para un video de TikTok de Valentina Syntax. Debe tener: Hook (primeras 3 seg), desarrollo con datos o análisis interesante, y CTA suave al final. Combina MMA y IA. Tono sarcástico mexicano.`,
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
