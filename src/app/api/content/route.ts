import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const checkJob = url.searchParams.get('checkJob')

  if (checkJob) {
    const resultPath = `/tmp/gen_result_${checkJob}.json`
    if (fs.existsSync(resultPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(resultPath, 'utf-8'))
        fs.unlinkSync(resultPath)
        if (data.error) return NextResponse.json({ status: 'error', error: data.error })
        // Create DB record
        const project = await db.project.findFirst({ where: { name: 'AVATARIA' } })
        if (project && data.imageUrl) {
          const content = await db.content.create({
            data: {
              projectId: project.id,
              title: `Variación ${data.baseName} - ${new Date().toLocaleString('es-MX')}`,
              type: 'static_image',
              imageUrl: data.imageUrl,
              prompt: data.prompt || 'variación natural',
              status: 'review',
            },
          })
          return NextResponse.json({ status: 'done', content, imageUrl: data.imageUrl })
        }
        return NextResponse.json({ status: 'done', ...data })
      } catch {
        return NextResponse.json({ status: 'pending' })
      }
    }
    return NextResponse.json({ status: 'pending' })
  }

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

      const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
      const promptStr = (imgPrompt || 'same person, natural slight variation in expression and lighting, same vibe')
        + '. NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos.'

      const scriptPath = path.join(process.cwd(), '._gen_once.ts')
      fs.writeFileSync(scriptPath, `
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const GEN_DIR = path.join(process.cwd(), 'public', 'generated-images');
if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR, { recursive: true });

async function run() {
  try {
    const zai = await ZAI.create();
    const src = path.join(process.cwd(), 'public', '${safeName}');
    const buf = fs.readFileSync(src);
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
    const res = await zai.images.generations.edit({
      prompt: ${JSON.stringify(promptStr)},
      images: [{ url: dataUrl }],
      size: '1024x1024',
    });
    const imgBuf = Buffer.from(res.data[0].base64, 'base64');
    const filename = 'leia_' + Date.now() + '.png';
    fs.writeFileSync(path.join(GEN_DIR, filename), imgBuf);
    fs.writeFileSync('/tmp/gen_result_${jobId}.json', JSON.stringify({
      imageUrl: '/generated-images/' + filename,
      baseName: '${safeName}',
      prompt: ${JSON.stringify(imgPrompt || 'variación natural')},
    }));
    console.log('DONE');
  } catch(e: any) {
    fs.writeFileSync('/tmp/gen_result_${jobId}.json', JSON.stringify({ error: String(e.message || e) }));
    console.error('FAIL:', e);
    process.exit(1);
  }
}
run();
`)

      // Spawn as detached process
      const child = spawn('bun', [scriptPath], {
        detached: true,
        stdio: 'ignore',
        cwd: process.cwd(),
      })
      child.unref()

      // Clean up temp script after a delay
      setTimeout(() => { try { fs.unlinkSync(scriptPath) } catch {} }, 5000)

      return NextResponse.json({ jobId, status: 'started' })
    }

    if (action === 'delete') {
      const { contentId } = body
      await db.content.delete({ where: { id: contentId } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json({ error: 'Error en contenido' }, { status: 500 })
  }
}
