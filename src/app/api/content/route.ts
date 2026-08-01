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
      const { prompt: imgPrompt, baseImage } = body
      const zai = await ZAI.create()

      const ANTI_FIGHTER = 'soft facial features, feminine jawline, slim shoulders, casual style, warm smile, girl-next-door vibe. NOT athletic, NOT muscular definition, NOT broad shoulders, NOT fighting pose. NO UFC, NO MMA, NO fighter, NO cage, NO octagon, NO gym setting, NO combat gear, NO brazilian flag colors, NO green and yellow palette, NO Venum, NO Reebok, NO brand logos on clothing.'

      // Build prompt based on whether we're using a base image or generating from scratch
      let fullPrompt: string
      if (baseImage) {
        // Image-to-image: prompt describes the EDIT/VARIATION to apply
        fullPrompt = imgPrompt
          ? `${imgPrompt}. ${ANTI_FIGHTER}`
          : `Create a natural variation of this person with slightly different expression and lighting, same person, same vibe. ${ANTI_FIGHTER}`
      } else {
        // Text-to-image: full description from scratch
        fullPrompt = imgPrompt
          ? `${imgPrompt}. ${ANTI_FIGHTER}`
          : `Photorealistic portrait of Leia, a stunning young Latina woman in her mid-20s with a confident warm smile. Dark wavy hair past shoulders, natural makeup. Wearing a casual fitted black hoodie with abstract white geometric patterns, no logos. Background: cozy modern apartment with warm ambient lighting. Girl-next-door energy, approachable, genuine warmth. ${ANTI_FIGHTER}`
      }

      let imageBase64: string

      if (baseImage) {
        // IMAGE-TO-IMAGE: read the base photo and use edit API
        const allowedBases = [
          'leia-avatar.png',
          'leia-reel-shark.png',
          'leia-reel-pumpkin.png',
          'leia-reel-braids.png',
          'leia-reel-orange.png',
          'leia-reference.png',
          'leia-angle-frontal.png',
          'leia-angle-34r.png',
          'leia-angle-profile.png',
          'leia-angle-34l.png',
          'leia-angle-looking-up.png',
        ]
        const safeName = path.basename(baseImage)
        if (!allowedBases.includes(safeName)) {
          return NextResponse.json({ error: 'Imagen base no permitida' }, { status: 400 })
        }
        const sourcePath = path.join(process.cwd(), 'public', safeName)
        if (!fs.existsSync(sourcePath)) {
          return NextResponse.json({ error: 'Imagen base no encontrada' }, { status: 404 })
        }
        const sourceBuffer = fs.readFileSync(sourcePath)
        const mimeType = 'image/png'
        const dataUrl = `data:${mimeType};base64,${sourceBuffer.toString('base64')}`

        const response = await zai.images.generations.edit({
          prompt: fullPrompt,
          images: [{ url: dataUrl }],
          size: '1024x1024',
        })
        imageBase64 = response.data[0]?.base64
        if (!imageBase64) throw new Error('No se generó la imagen editada')
      } else {
        // TEXT-TO-IMAGE: generate from scratch
        const response = await zai.images.generations.create({
          prompt: fullPrompt,
          size: '1024x1024',
        })
        imageBase64 = response.data[0]?.base64
        if (!imageBase64) throw new Error('No se generó la imagen')
      }

      const filename = `leia_${Date.now()}.png`
      const outputPath = path.join(process.cwd(), 'public', 'generated-images', filename)
      fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'))

      const content = await db.content.create({
        data: {
          projectId: project.id,
          title: baseImage
            ? `Variación desde ${path.basename(baseImage)} - ${new Date().toLocaleString('es-MX')}`
            : `Imagen generada - ${new Date().toLocaleString('es-MX')}`,
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
