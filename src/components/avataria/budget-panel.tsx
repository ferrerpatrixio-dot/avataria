'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingDown, Wallet, CreditCard, Headphones, Image, Film, Monitor, Heart, AlertCircle, CircleCheck } from 'lucide-react'

interface Budget {
  id: string
  category: string
  description: string | null
  plannedAmount: number
  amount: number
  currency: string
  spentAt: string | null
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
  { phase: 'Fase 0', min: 0, max: 10, color: 'border-red-500/20', barColor: 'bg-red-500' },
  { phase: 'Fase 1', min: 20, max: 40, color: 'border-amber-500/20', barColor: 'bg-amber-500' },
  { phase: 'Fase 2', min: 0, max: 30, color: 'border-emerald-500/20', barColor: 'bg-emerald-500' },
]

export function BudgetPanel({ budgets }: BudgetPanelProps) {
  const totalPlanned = budgets.reduce((sum, b) => sum + b.plannedAmount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.amount, 0)
  const maxPhaseBudget = phaseBudgets.reduce((sum, p) => sum + p.max, 0) // $80
  const spentPct = maxPhaseBudget > 0 ? Math.round((totalSpent / maxPhaseBudget) * 100) : 0
  const hasRealExpenses = budgets.some((b) => b.amount > 0 && b.spentAt)

  // Group by category for expense list
  const byCategory = budgets.reduce<Record<string, { planned: number; spent: number; items: Budget[] }>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = { planned: 0, spent: 0, items: [] }
    acc[b.category].planned += b.plannedAmount
    acc[b.category].spent += b.amount
    acc[b.category].items.push(b)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* === PRESUPUESTO PLANIFICADO === */}
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Presupuesto Planificado</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-card/60 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Estimado Total</span>
            </div>
            <p className="text-2xl font-bold font-mono text-blue-400">${totalPlanned.toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">en {budgets.filter((b) => b.plannedAmount > 0).length} herramientas</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Máx. por Fases</span>
            </div>
            <p className="text-2xl font-bold font-mono">${maxPhaseBudget.toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">tope para las 3 fases</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Holgura</span>
            </div>
            <p className="text-2xl font-bold font-mono">${(maxPhaseBudget - totalPlanned).toFixed(2)}</p>
            <p className="text-[11px] text-muted-foreground">disponible bajo tope</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget by Phase */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Plan por Fase</CardTitle>
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
                  className={`h-full rounded-full transition-all ${pb.barColor}`}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Planned Tool Breakdown */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Herramientas — Estimado vs Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(byCategory).map(([cat, data]) => {
              const config = categoryConfig[cat] || categoryConfig.other
              const Icon = config.icon
              return (
                <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-[11px] text-muted-foreground">{data.items[0]?.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">
                      <span className="text-blue-400">${data.spent.toFixed(2)}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-muted-foreground">${data.planned.toFixed(2)}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">real / estimado</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* === GASTO REAL YTD === */}
      <div className="flex items-center gap-2 mt-6 mb-1">
        <CreditCard className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Gasto Real YTD</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-auto">solo cargos reales</Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className={`bg-card/60 ${totalSpent > 0 ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className={`w-4 h-4 ${totalSpent > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span className="text-xs text-muted-foreground">Total Gastado YTD</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${totalSpent > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground">de ${maxPhaseBudget} máx. ({spentPct}%)</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {totalSpent === 0 ? (
                <CircleCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-primary" />
              )}
              <span className="text-xs text-muted-foreground">
                {totalSpent === 0 ? 'Estado' : 'Restante'}
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {totalSpent === 0 ? '$0.00' : `$${(maxPhaseBudget - totalSpent).toFixed(2)}`}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {totalSpent === 0 ? 'Sin gastos reales aún' : 'disponible'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real Expense History */}
      <Card className="bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Historial de Gastos Reales
            {!hasRealExpenses && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-emerald-400 border-emerald-500/30">
                <CircleCheck className="w-2.5 h-2.5 mr-0.5" /> Limpio
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasRealExpenses ? (
            <div className="text-center py-6">
              <CircleCheck className="w-8 h-8 text-emerald-500/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sin gastos reales registrados</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                Los gastos aparecen aquí cuando se pagan herramientas reales
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {budgets
                .filter((b) => b.amount > 0 && b.spentAt)
                .map((b) => {
                  const config = categoryConfig[b.category] || categoryConfig.other
                  return (
                    <div key={b.id} className="flex items-center justify-between py-2 text-xs border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{config.label}</Badge>
                        <span className="text-muted-foreground truncate max-w-[200px]">{b.description}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-amber-400">${b.amount.toFixed(2)}</span>
                        <span className="text-muted-foreground font-mono">{new Date(b.spentAt!).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
