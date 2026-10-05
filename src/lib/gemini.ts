const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash'

// Gemini responde 429/503 en picos de demanda: se reintenta con espera creciente
export async function fetchGemini(body: unknown, apiKey: string): Promise<Response> {
  let res: Response
  for (let attempt = 0; attempt < 4; attempt++) {
    res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status !== 503 && res.status !== 429) return res
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
  }
  return res!
}

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

// La respuesta trae el texto en `output_text` según la documentación; si no, se busca el primer bloque de texto
function findText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const obj = node as Record<string, unknown>
  if (typeof obj.output_text === 'string') return obj.output_text
  if (obj.type === 'text' && typeof obj.text === 'string') return obj.text
  for (const value of Object.values(obj)) {
    const found = findText(value)
    if (found) return found
  }
  return ''
}

export async function generateText(system: string, turns: ChatTurn[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Falta GEMINI_API_KEY')

  // Se envía la conversación como una sola transcripción para no depender del formato de turnos
  const transcript = turns.length === 1
    ? turns[0].content
    : turns.map((t) => `${t.role === 'user' ? 'Usuario' : 'Tú'}: ${t.content}`).join('\n\n') + '\n\nResponde al último mensaje del usuario.'

  const res = await fetchGemini({
    model: GEMINI_TEXT_MODEL,
    system_instruction: system,
    input: [{ type: 'text', text: transcript }],
  }, apiKey)
  const raw = await res.text()
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${raw.slice(0, 200)}`)
  return findText(JSON.parse(raw)).trim()
}
