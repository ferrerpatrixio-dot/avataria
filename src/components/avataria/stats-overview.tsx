'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Eye, Heart, MessageSquare, FileText, CheckCircle2, TrendingUp, Activity } from 'lucide-react'

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

interface StatsOverviewProps {
  stats: Stats
  currentPhase: string
}

export function StatsOverview({ stats, currentPhase }: StatsOverviewProps) {
  const phaseLabels: Record<string, { label: string; color: string }> = {
    '0': { label: 'Fase 0: Validación', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    '1': { label: 'Fase 1: Tracción', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    '2': { label: 'Fase 2: Monetización', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    completed: { label: 'Completado', color: 'bg-primary/20 text-primary border-primary/30' },
    killed: { label: 'Detenido', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  }

  const current = phaseLabels[currentPhase] || phaseLabels['0']

  const statCards = [
    { label: 'Invertido', value: `$${stats.totalSpent.toFixed(2)}`, icon: DollarSign, sub: 'USD total', accent: 'text-amber-400' },
    { label: 'Tareas', value: `${stats.completedTasks}/${stats.totalTasks}`, icon: CheckCircle2, sub: `${stats.phaseProgress}% completo`, accent: 'text-primary' },
    { label: 'Contenido', value: `${stats.publishedContent}/${stats.totalContent}`, icon: FileText, sub: 'publicados', accent: 'text-purple-400' },
    { label: 'Vistas', value: stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : String(stats.totalViews), icon: Eye, sub: 'total acumulado', accent: 'text-cyan-400' },
    { label: 'Likes', value: stats.totalLikes > 1000 ? `${(stats.totalLikes / 1000).toFixed(1)}K` : String(stats.totalLikes), icon: Heart, sub: 'total', accent: 'text-pink-400' },
    { label: 'Comentarios', value: String(stats.totalComments), icon: MessageSquare, sub: 'total', accent: 'text-orange-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.72_0.19_150_/_0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Leia IA</h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Avatar IA: Ingeniera, fanática del fútbol y MMA. Mercadeo para Fanvue.
              Sensual sin ser explícita. México primero, después España.
            </p>
          </div>
          <Badge variant="outline" className={`${current.color} px-3 py-1.5 text-sm shrink-0 self-start`}>
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            {current.label}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="bg-card/60">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Progreso General
            </span>
            <span className="text-sm text-primary font-mono">{stats.phaseProgress}%</span>
          </div>
          <Progress value={stats.phaseProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="bg-card/60 hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${card.accent}`} />
                </div>
                <p className="text-xl font-bold font-mono">{card.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Risks Banner */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Suposiciones de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { q: '¿Fútbol + IA + sensualidad inteligente conecta?', status: currentPhase === '0' ? 'Validando...' : 'Pendiente' },
              { q: '¿Leia genera confianza y deseo para clic?', status: currentPhase === '1' ? 'Validando...' : currentPhase === '0' ? 'Pendiente' : 'Validado' },
              { q: '¿La audiencia mexicana pagará en Fanvue?', status: currentPhase === '2' ? 'Validando...' : 'Pendiente' },
            ].map((risk, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-background/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${risk.status === 'Validando...' ? 'bg-amber-400 animate-pulse' : 'bg-muted-foreground/30'}`} />
                <div>
                  <p className="text-xs font-medium">{risk.q}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{risk.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
