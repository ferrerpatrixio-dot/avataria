import http from 'http'
import fs from 'fs'
import path from 'path'
import ZAI from 'z-ai-web-dev-sdk'

const PORT = 3003
const GEN_DIR = path.join(process.cwd(), '..', '..', 'public', 'generated-images')

const ALLOWED = [
  'leia-reference.png',
  'leia-angle-frontal.png',
  'leia-angle-34r.png',
  'leia-angle-34l.png',
  'leia-angle-profile.png',
  'leia-angle-looking-up.png',
]

const ANTI_FIGHTER = 'NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos.'

let zai: Awaited<ReturnType<typeof ZAI.create>>

async function init() {
  zai = await ZAI.create()
  console.log('Gen service ready on port', PORT)
}

async function generate(body: any) {
  const { prompt, baseImage } = body
  const safeName = path.basename(baseImage || '')
  if (!safeName || !ALLOWED.includes(safeName)) {
    return { error: 'Imagen no permitida' }
  }

  const srcPath = path.join(process.cwd(), '..', '..', 'public', safeName)
  if (!fs.existsSync(srcPath)) {
    return { error: 'Imagen no encontrada' }
  }

  const buf = fs.readFileSync(srcPath)
  const dataUrl = 'data:image/png;base64,' + buf.toString('base64')

  const fullPrompt = prompt
    ? `${prompt}. ${ANTI_FIGHTER}`
    : `same person, natural slight variation in expression and lighting, same vibe. ${ANTI_FIGHTER}`

  const res = await zai.images.generations.edit({
    prompt: fullPrompt,
    images: [{ url: dataUrl }],
    size: '1024x1024',
  })

  const imgBuf = Buffer.from(res.data[0].base64, 'base64')
  const filename = `leia_${Date.now()}.png`
  fs.writeFileSync(path.join(GEN_DIR, filename), imgBuf)

  return { imageUrl: `/generated-images/${filename}` }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    try {
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk)
      const body = JSON.parse(Buffer.concat(chunks).toString())
      const result = await generate(body)
      res.writeHead(result.error ? 400 : 200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } catch (e: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: e.message }))
    }
  } else {
    res.writeHead(200)
    res.end('gen-service ok')
  }
})

init().then(() => server.listen(PORT))
