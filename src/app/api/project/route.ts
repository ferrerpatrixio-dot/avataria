import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const project = await db.project.findFirst({
      where: { name: 'AVATARIA' },
      include: {
        phases: {
          include: {
            tasks: { orderBy: { order: 'asc' } },
            decisions: true,
          },
          orderBy: { phaseNumber: 'asc' },
        },
        scripts: { orderBy: { variation: 'asc' } },
        contents: {
          include: { metrics: true },
          orderBy: { createdAt: 'desc' },
        },
        budgets: { orderBy: { createdAt: 'desc' } },
        decisions: { where: { phaseId: null } },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Compute summary stats
    const totalSpent = project.budgets.reduce((sum, b) => sum + b.amount, 0)
    const totalTasks = project.phases.reduce((sum, p) => sum + p.tasks.length, 0)
    const completedTasks = project.phases.reduce(
      (sum, p) => sum + p.tasks.filter((t) => t.status === 'completed').length,
      0
    )
    const totalContent = project.contents.length
    const publishedContent = project.contents.filter((c) => c.status === 'published').length

    // Aggregate metrics across all content
    const totalViews = project.contents.reduce(
      (sum, c) => sum + c.metrics.reduce((m, met) => m + met.views, 0),
      0
    )
    const totalLikes = project.contents.reduce(
      (sum, c) => sum + c.metrics.reduce((m, met) => m + met.likes, 0),
      0
    )
    const totalComments = project.contents.reduce(
      (sum, c) => sum + c.metrics.reduce((m, met) => m + met.comments, 0),
      0
    )

    return NextResponse.json({
      project,
      stats: {
        totalSpent,
        totalTasks,
        completedTasks,
        totalContent,
        publishedContent,
        totalViews,
        totalLikes,
        totalComments,
        phaseProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
