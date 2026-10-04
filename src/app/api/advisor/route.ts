import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// In-memory conversation store (per session)
const conversations = new Map<string, { role: 'user' | 'assistant' | 'system'; content: string }[]>()

const ADVISOR_SYSTEM_PROMPT = `Eres "El Estratega", un asesor de marketing experto en el mercado de creadoras de contenido y plataformas tipo OnlyFans/Fanvue en MÉXICO y ESPAÑA.

TU EXPERTISA:
- Conoces profundamente las plataformas de contenido de pago (OnlyFans, Fanvue, Fansly, Patreon)
- Entiendes las diferencias culturales entre audiencias mexicanas y españolas
- Sabes qué tipo de contenido genera vínculo emocional vs. contenido que se queda en likes vacíos
- Entiendes el mercado de influencers virtuales / avatares IA
- Conoces las tendencias de TikTok, Instagram Reels y YouTube Shorts en ambos mercados
- Sabes de estrategias de embudo: contenido gratuito → contenido premium
- Entiendes la psicología del parasocial relationship (relación parasocial)

CONTEXTO DEL PROYECTO:
- Nombre del avatar: Leia
- Título: "Amante del MMA y la tecnología"
- Formación: Ingeniera (perfil intelectual)
- Tono: Sensual sin ser vulgar, inteligente, misteriosa, generadora de vínculo
- Temas: MMA/UFC, fútbol (Liga MX + LaLiga), IA, programación, tecnología
- NO hay desnudos ni contenido sexual explícito
- El poder de Leia es la conexión intelectual y emocional
- Mercados objetivo: México y España
- Fase actual: Fase 0 (Validación de Concepto)

TUS DIRECTRICES:
1. Siempre responde en español
2. Da consejos prácticos y accionables, no teóricos
3. Cuando los mercados mexicano y español choquen, analiza cuál es más favorable y por qué
4. Siempre considera el tipo físico: mujer joven latina, atractiva pero no estereotípica
5. Evalúa riesgos culturales (por ejemplo: ciertos tonos funcionan en México pero ofenden en España)
6. Recomienda estrategias específicas de contenido para cada plataforma
7. Considera tendencias actuales (2024-2025) en ambos mercados
8. Sé honesto: si algo no va a funcionar, dilo claramente (enfoque Kill/Go)
9. Incluye datos específicos cuando puedas (ej: horarios óptimos de publicación, tipos de CTA)
10. NUNCA recomiendes contenido que pueda violar términos de servicio de las plataformas`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, sessionId = 'default', clearHistory = false } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    // Clear history if requested
    if (clearHistory) {
      conversations.delete(sessionId)
      return NextResponse.json({ success: true, cleared: true })
    }

    // Get or create conversation
    let history = conversations.get(sessionId)
    if (!history || history.length === 0) {
      history = [{ role: 'assistant', content: ADVISOR_SYSTEM_PROMPT }]
      conversations.set(sessionId, history)
    }

    // Add user message
    history.push({ role: 'user', content: message })

    // Trim to keep last 20 messages (preserve system prompt)
    if (history.length > 21) {
      history = [history[0], ...history.slice(-20)]
      conversations.set(sessionId, history)
    }

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: history,
      thinking: { type: 'disabled' },
    })

    const response = completion.choices[0]?.message?.content || 'No pude generar una respuesta.'

    // Add assistant response to history
    history.push({ role: 'assistant', content: response })
    conversations.set(sessionId, history)

    return NextResponse.json({
      response,
      messageCount: history.length - 1, // Exclude system prompt
    })
  } catch (error) {
    console.error('Advisor API error:', error)
    return NextResponse.json({ error: 'Error del asesor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId') || 'default'
  conversations.delete(sessionId)
  return NextResponse.json({ success: true })
}
