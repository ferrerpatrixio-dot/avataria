import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import path from 'path'

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
      const { prompt: imgPrompt, baseImage } = body

      // Delegate to gen-service (port 3003) to avoid crashing Next.js
      const genRes = await fetch('http://localhost:3003/?XTransformPort=3003', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imgPrompt, baseImage }),
      })
      const genData = await genRes.json()

      if (genData.error) {
        return NextResponse.json({ error: genData.error }, { status: genRes.status || 500 })
      }

      const content = await db.content.create({
        data: {
          projectId: project.id,
          title: baseImage
            ? `Variación desde ${path.basename(baseImage)} - ${new Date().toLocaleString('es-MX')}`
            : `Imagen generada - ${new Date().toLocaleString('es-MX')}`,
          type: 'static_image',
          imageUrl: genData.imageUrl,
          prompt: imgPrompt || 'variación natural',
          status: 'review',
        },
      })

      return NextResponse.json({ content, imageUrl: genData.imageUrl })
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
