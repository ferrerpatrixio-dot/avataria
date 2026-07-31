'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingDown, CreditCard, Headphones, Image, Film, Monitor, Heart } from 'lucide-react'

interface Budget {
  id: string
  category: string
  description: string | null
  amount: number
  currency: string
  spentAt: string
}

interface BudgetPanelProps {
  budgets: Budget[]
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  elevenlabs: { label: 'ElevenLabs', icon: Headphones, color: 'text-cyan-400' },
  kling_ai: { label: 'Kling AI', icon: Film, color: 'text-purple-400' },
  flux: { label: 'Flux', icon: Image, color: 'text-amber-400' },
  openart: { label: 'OpenArt', icon: Image, color: 'text-pink-400' },
  capcut: { label: 'CapCut', icon: Monitor, color: 'text-emerald-400' },
  fanvue: { label: 'Fanvue', icon: Heart, color: 'text-red-400' },
  other: { label: 'Otro', icon: CreditCard, color: 'text-muted-foreground' },
}

const phaseBudgets = [
  { phase: 'Fase 0', min: 0, max: 10, color: 'border-red-500/20' },
  { phase: 'Fase 1', min: 20, max: 40, color: 'border-amber-500/20' },
  { phase: 'Fase 2', min: 0, max: 30, color: 'border-emerald-500/20' },
]

export function BudgetPanel({ budgets }: BudgetPanelProps) {
  const totalSpent = budgets.reduce((sum, b) => sum + b.amount, 0)
  const maxTotalBudget = phaseBudgets.reduce((sum, p) => sum + p.max, 0) // $80
  const budgetUsage = maxTotalBudget > 0 ? Math.round((totalSpent / maxTotalBudget) * 100) : 0

  // Group by category
  const byCategory = budgets.reduce<Record<string, number>>((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + b.amount
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-muted-foreground">Total Gastado</span>
            </div>
            <p className="text-2xl font-bold font-mono">${totalSpent.toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">de ${maxTotalBudget} máx. ({budgetUsage}%)</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Presupuesto Restante</span>
            </div>
            <p className="text-2xl font-bold font-mono text-primary">${(maxTotalBudget - totalSpent).toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">para completar las 3 fases</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Gasto Promedio por Tool</span>
            </div>
            <p className="text-2xl font-bold font-mono">
              ${Object.keys(byCategory).length > 0 ? (totalSpent / Object.keys(byCategory).length).toFixed(2) : '0.00'}
            </p>
            <p className="text-[11px] text-muted-foreground">{Object.keys(byCategory).length} herramientas usadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget by Phase */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Presupuesto por Fase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {phaseBudgets.map((pb) => (
            <div key={pb.phase} className={`rounded-lg border ${pb.color} p-3`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{pb.phase}</span>
                <span className="text-xs font-mono text-muted-foreground">${pb.min} - ${pb.max} USD</span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pb.phase === 'Fase 0' ? 'bg-red-500' : pb.phase === 'Fase 1' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.round((totalSpent * (pb.max / maxTotalBudget)) / pb.max * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(byCategory).map(([cat, amount]) => {
              const config = categoryConfig[cat] || categoryConfig.other
              const Icon = config.icon
              return (
                <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-[11px] text-muted-foreground">{budgets.find((b) => b.category === cat)?.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-medium">${amount.toFixed(2)}</span>
                </div>
              )
            })}
            {Object.keys(byCategory).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Sin gastos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense History */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Historial de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-1.5">
            {budgets.map((b) => {
              const config = categoryConfig[b.category] || categoryConfig.other
              return (
                <div key={b.id} className="flex items-center justify-between py-2 text-xs border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">{config.label}</Badge>
                    <span className="text-muted-foreground truncate max-w-[200px]">{b.description}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono">${b.amount.toFixed(2)}</span>
                    <span className="text-muted-foreground font-mono">{new Date(b.spentAt).toLocaleDateString('es-MX')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
