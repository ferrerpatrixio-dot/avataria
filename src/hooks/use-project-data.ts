'use client'

import { useState, useEffect, useCallback } from 'react'

interface Stats {
  totalSpent: number
  totalTasks: number
  completedTasks: number
  totalContent: number
  publishedContent: number
  totalViews: number
  totalLikes: number
  totalComments: number
  phaseProgress: number
}

interface Phase {
  id: string
  phaseNumber: number
  title: string
  description: string | null
  status: string
  startDate: string | null
  endDate: string | null
  budgetMin: number
  budgetMax: number
  currency: string
  tasks: any[]
  decisions: any[]
}

interface Script {
  id: string
  title: string
  type: string
  content: string
  duration: string | null
  tone: string
  variation: number | null
  status: string
  aiGenerated: boolean
  createdAt: string
}

interface ContentItem {
  id: string
  title: string
  type: string
  status: string
  platform: string | null
  imageUrl: string | null
  prompt: string | null
  notes: string | null
  publishedAt: string | null
  createdAt: string
  metrics: any[]
}

interface Budget {
  id: string
  category: string
  description: string | null
  amount: number
  currency: string
  spentAt: string
}

interface ProjectData {
  id: string
  name: string
  avatarName: string
  description: string | null
  currentPhase: string
  phases: Phase[]
  scripts: Script[]
  contents: ContentItem[]
  budgets: Budget[]
  decisions: any[]
}

export function useProjectData(isAuthenticated: boolean) {
  const [data, setData] = useState<{ project: ProjectData; stats: Stats } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/project')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch('/api/project', { signal: controller.signal })
        if (cancelled) return
        if (res.ok) {
          const json = await res.json()
          if (!cancelled) setData(json)
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true; controller.abort() }
  }, [isAuthenticated])

  return { data, loading, refetch: fetchData }
}

export type { ProjectData, Stats, Phase, Script, ContentItem, Budget }
