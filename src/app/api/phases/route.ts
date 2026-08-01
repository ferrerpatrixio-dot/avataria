import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { phaseId, status, taskId, taskStatus, decisionId, decision, notes } = body

    if (taskId && taskStatus) {
      const task = await db.phaseTask.update({
        where: { id: taskId },
        data: {
          status: taskStatus,
          completedAt: taskStatus === 'completed' ? new Date() : null,
        },
      })
      return NextResponse.json({ task })
    }

    if (decisionId && decision) {
      const updated = await db.decision.update({
        where: { id: decisionId },
        data: { decision, notes: notes || undefined, decidedAt: new Date() },
      })
      return NextResponse.json({ decision: updated })
    }

    if (phaseId && status) {
      const phase = await db.phase.update({
        where: { id: phaseId },
        data: {
          status,
          endDate: status === 'completed' ? new Date() : undefined,
          startDate: status === 'active' && !((await db.phase.findUnique({ where: { id: phaseId } }))?.startDate)
            ? new Date()
            : undefined,
        },
      })

      if (status === 'active') {
        const project = await db.project.findFirst({
          where: { phases: { some: { id: phaseId } } },
        })
        if (project) {
          await db.project.update({
            where: { id: project.id },
            data: { currentPhase: String(phase.phaseNumber) },
          })
        }
      }

      return NextResponse.json({ phase })
    }

    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  } catch (error) {
    console.error('Phase API error:', error)
    return NextResponse.json({ error: 'Error actualizando fase' }, { status: 500 })
  }
}
