import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import ZAI from 'z-ai-web-dev-sdk'

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
          platform,
          scriptId,
          notes,
          prompt,
          status: 'planned',
        },
      })
      return NextResponse.json({ content })
    }

    if (action === 'update_status') {
      const { contentId, status } = body
      const content = await db.content.update({
        where: { id: contentId },
        data: {
          status,
          publishedAt: status === 'published' ? new Date() : undefined,
        },
      })
      return NextResponse.json({ content })
    }

    if (action === 'add_metric') {
      const { contentId, platform, views, likes, comments, shares, saves, clicks, followers } = body
      const metric = await db.metric.create({
        data: {
          contentId,
          platform: platform || 'tiktok',
          views: views || 0,
          likes: likes || 0,
          comments: comments || 0,
          shares: shares || 0,
          saves: saves || 0,
          clicks: clicks || 0,
          followers: followers || 0,
        },
      })
      return NextResponse.json({ metric })
    }

    if (action === 'generate_image') {
      const { prompt: imgPrompt } = body
      const zai = await ZAI.create()

      const ANTI_FIGHTER = 'soft facial features, feminine jawline, slim shoulders, casual style, warm smile, girl-next-door vibe. NOT athletic, NOT muscular definition, NOT broad shoulders, NOT fighting pose. NO UFC, NO MMA, NO fighter, NO cage, NO octagon, NO gym setting, NO combat gear, NO brazilian flag colors, NO green and yellow palette, NO Venum, NO Reebok, NO brand logos on clothing.'

      const fullPrompt = imgPrompt
        ? `${imgPrompt}. ${ANTI_FIGHTER}`
        : `Photorealistic portrait of Leia, a stunning young Latina woman in her mid-20s with a confident warm smile. Dark wavy hair past shoulders, natural makeup. Wearing a casual fitted black hoodie with abstract white geometric patterns, no logos. Background: cozy modern apartment with warm ambient lighting. Girl-next-door energy, approachable, genuine warmth. ${ANTI_FIGHTER}`

      const response = await zai.images.generations.create({
        prompt: fullPrompt,
        size: '1024x1024',
      })

      const imageBase64 = response.data[0]?.base64
      if (!imageBase64) throw new Error('No se generó la imagen')

      const filename = `leia_${Date.now()}.png`
      const outputPath = path.join(process.cwd(), 'public', 'generated-images', filename)
      fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'))

      const content = await db.content.create({
        data: {
          projectId: project.id,
          title: `Imagen generada - ${new Date().toLocaleString('es-MX')}`,
          type: 'static_image',
          imageUrl: `/generated-images/${filename}`,
          prompt: fullPrompt,
          status: 'review',
        },
      })

      return NextResponse.json({ content, imageUrl: `/generated-images/${filename}` })
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
