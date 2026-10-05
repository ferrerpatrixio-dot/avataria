import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import path from 'path'

export const maxDuration = 60

const BUCKET = 'leia-images'
const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image'

export async function GET() {
  try {
    const contents = await db.content.findMany({
      include: { metrics: true, script: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ contents })
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

const ALLOWED = [
  'leia-reference.png',
  'leia-angle-frontal.png',
  'leia-angle-34r.png',
  'leia-angle-34l.png',
  'leia-angle-profile.png',
  'leia-angle-profile-right.png',
  'leia-angle-looking-up.png',
  'leia-expr-calm.png',
  'leia-expr-soft-smile.png',
  'leia-expr-playful.png',
  'leia-expr-serious.png',
  'leia-expr-smirk.png',
  'leia-expr-laugh.png',
  'leia-expr-dreamy.png',
  'leia-fit-abs.png',
  'leia-fit-back.png',
  'leia-fit-legs.png',
  'leia-fit-full.png',
  'leia-life-helado.png',
  'leia-life-pelo.png',
  'leia-life-banio.png',
  'leia-life-serie.png',
  'leia-life-perro.png',
  'leia-ref1-green-wall.png',
  'leia-ref2-green-vest.png',
  'leia-ref3-orchid.png',
  'leia-ref4-bed-curly.png',
  'leia-ref5-bed-straight.png',
  'leia-ref6-car-leopard.png',
  'leia-ref7-green-sequin.png',
  'leia-ref8-checkered.png',
  'leia-ref9-bed-wavy.png',
  'leia-outfit1-pool-sparkle.png',
  'leia-outfit2-corset-jeans.png',
  'leia-outfit3-gingham-corset.png',
  'leia-outfit4-grey-crop-shorts.png',
  'leia-outfit5-floral-camisole.png',
  'leia-outfit6-bathroom-shirt.png',
  'leia-outfit7-white-bikini.png',
  'leia-outfit8-halter-denim.png',
  'leia-outfit9-pink-shorts.png',
  'leia-outfit10-pink-scallop.png',
  'leia-outfit11-white-halter-glass.png',
  'leia-outfit12-white-halter-vol.png',
  'leia-casual1-chinita.png',
  'leia-casual2-tongue.png',
  'leia-casual3-blow-kiss.png',
  'leia-casual4-towel-hands.png',
  'leia-casual5-mirror-selfie.png',
  'leia-casual6-wink.png',
  'leia-casual7-bed-stretch.png',
  'leia-casual8-sunglasses.png',
  'leia-selfie1-chinita.png',
  'leia-selfie2-tongue.png',
  'leia-selfie3-beso.png',
  'leia-selfie4-towel-bano.png',
  'leia-selfie5-messy-morning.png',
  'leia-selfie6-car-selfie.png',
  'leia-selfie7-skincare.png',
  'leia-selfie8-coffee.png',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    const project = await db.project.findFirst({ where: { name: 'AVATARIA' } })
    if (!project) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })

    if (action === 'create') {
      const { title, type, platform, scriptId, notes, prompt } = body
      const content = await db.content.create({
        data: {
          projectId: project.id,
          title,
          type: type || 'static_image',
          platform, scriptId, notes, prompt,
          status: 'planned',
        },
      })
      return NextResponse.json({ content })
    }

    if (action === 'update_status') {
      const { contentId, status } = body
      const content = await db.content.update({
        where: { id: contentId },
        data: { status, publishedAt: status === 'published' ? new Date() : undefined },
      })
      return NextResponse.json({ content })
    }

    if (action === 'add_metric') {
      const { contentId, platform, views, likes, comments, shares, saves, clicks, followers } = body
      const metric = await db.metric.create({
        data: {
          contentId,
          platform: platform || 'tiktok',
          views: views || 0, likes: likes || 0, comments: comments || 0,
          shares: shares || 0, saves: saves || 0, clicks: clicks || 0, followers: followers || 0,
        },
      })
      return NextResponse.json({ metric })
    }

    if (action === 'generate_image') {
      const { prompt: imgPrompt, baseImage } = body
      const safeName = path.basename(baseImage || '')
      if (!safeName || !ALLOWED.includes(safeName)) {
        return NextResponse.json({ error: 'Imagen no permitida' }, { status: 400 })
      }

      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) return NextResponse.json({ error: 'Falta GEMINI_API_KEY' }, { status: 500 })

      const promptStr = (imgPrompt || 'same person, natural slight variation in expression and lighting, same vibe')
        + '. NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos.'

      // 1. Foto base: se lee desde el propio sitio (public/ no es accesible por fs en serverless)
      const baseRes = await fetch(new URL(`/${safeName}`, request.url))
      if (!baseRes.ok) return NextResponse.json({ error: 'No se pudo leer la foto base' }, { status: 500 })
      const baseBuf = Buffer.from(await baseRes.arrayBuffer())
      const baseMime = safeName.endsWith('.png') ? 'image/png' : 'image/jpeg'

      // 2. Gemini
      const gemRes = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          input: [
            { type: 'text', text: promptStr },
            { type: 'image', mime_type: baseMime, data: baseBuf.toString('base64') },
          ],
        }),
      })
      const gemText = await gemRes.text()
      if (!gemRes.ok) {
        console.error('Gemini error', gemRes.status, gemText.slice(0, 500))
        return NextResponse.json({ error: `Gemini ${gemRes.status}: ${gemText.slice(0, 200)}` }, { status: 502 })
      }
      const imageB64 = findImageData(JSON.parse(gemText))
      if (!imageB64) {
        console.error('Gemini sin imagen', gemText.slice(0, 500))
        return NextResponse.json({ error: 'Gemini no devolvió imagen (posible bloqueo de contenido)' }, { status: 502 })
      }

      // 3. Supabase Storage
      const filename = `leia_${Date.now()}.png`
      const imageUrl = await uploadToSupabase(filename, Buffer.from(imageB64, 'base64'))

      const content = await db.content.create({
        data: {
          projectId: project.id,
          title: `Variación ${safeName} - ${new Date().toLocaleString('es-MX')}`,
          type: 'static_image',
          imageUrl,
          prompt: imgPrompt || 'variación natural',
          status: 'review',
        },
      })
      return NextResponse.json({ status: 'done', content, imageUrl })
    }

    if (action === 'delete') {
      const { contentId } = body
      await db.content.delete({ where: { id: contentId } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json({ error: `Error en contenido: ${error instanceof Error ? error.message : 'desconocido'}` }, { status: 500 })
  }
}

// La respuesta de Gemini puede traer la imagen en distintos campos: se busca el primer base64 largo marcado como imagen
function findImageData(node: unknown): string | null {
  if (!node || typeof node !== 'object') return null
  const obj = node as Record<string, unknown>
  const mime = String(obj.mime_type ?? obj.mimeType ?? '')
  const data = obj.data
  if (typeof data === 'string' && data.length > 1000 && (obj.type === 'image' || mime.startsWith('image/'))) return data
  for (const value of Object.values(obj)) {
    const found = findImageData(value)
    if (found) return found
  }
  return null
}

async function uploadToSupabase(filename: string, buf: Buffer): Promise<string> {
  const base = process.env.STORAGE_SUPABASE_URL
  const key = process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) throw new Error('Faltan variables de Supabase Storage')
  const headers = { Authorization: `Bearer ${key}`, apikey: key }

  const upload = () => fetch(`${base}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'image/png', 'x-upsert': 'true' },
    body: new Uint8Array(buf),
  })

  let res = await upload()
  if (!res.ok) {
    // El bucket puede no existir todavía: se crea público y se reintenta
    await fetch(`${base}/storage/v1/bucket`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    })
    res = await upload()
  }
  if (!res.ok) throw new Error(`Supabase Storage ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return `${base}/storage/v1/object/public/${BUCKET}/${filename}`
}
