'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  Play,
  Skull,
  SkipForward,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

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
  tasks: PhaseTask[]
  decisions: Decision[]
}

interface PhaseTask {
  id: string
  title: string
  description: string | null
  status: string
  order: number
  completedAt: string | null
}

interface Decision {
  id: string
  title: string
  criteria: string | null
  decision: string | null
  notes: string | null
  decidedAt: string | null
}

interface PhasesPanelProps {
  phases: Phase[]
  onRefresh: () => void
}

const phaseConfig: Record<number, { color: string; bg: string; border: string; icon: React.ElementType; label: string }> = {
  0: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'Validación' },
  1: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Play, label: 'Tracción' },
  2: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'Monetización' },
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  active: { label: 'Activa', variant: 'default' },
  completed: { label: 'Completada', variant: 'outline' },
  skipped: { label: 'Saltada', variant: 'secondary' },
  killed: { label: 'Detenida', variant: 'destructive' },
}

const taskStatusIcon: Record<string, React.ElementType> = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  blocked: XCircle,
}

export function PhasesPanel({ phases, onRefresh }: PhasesPanelProps) {
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({})

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    await fetch('/api/phases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, taskStatus: nextStatus }),
    })
    toast.success(nextStatus === 'completed' ? 'Tarea completada' : 'Tarea reabierta')
    onRefresh()
  }

  const updatePhaseStatus = async (phaseId: string, status: string) => {
    await fetch('/api/phases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phaseId, status }),
    })
    toast.success(`Fase actualizada a: ${status}`)
    onRefresh()
  }

  const makeDecision = async (decisionId: string, decision: string, notes?: string) => {
    await fetch('/api/phases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionId, decision, notes }),
    })
    const msg = decision === 'go' ? 'Decisión: CONTINUAR' : 'Decisión: DETENER'
    toast[decision === 'go' ? 'success' : 'error'](msg)
    onRefresh()
  }

  return (
    <div className="space-y-6">
      {/* Golden Rules */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
            <Eye className="w-4 h-4" />
            5 Reglas de Oro — Equivocarse Barato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'No compres suscripciones anuales — usa pay-as-you-go',
              'Imagen estática + buena voz > video mal generado',
              'Etiqueta la IA desde el día 1 — es un feature, no un bug',
              'A/B Testing de Nicho — que el algoritmo decida',
              'Automatiza solo después de validar manualmente',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-primary font-mono font-bold shrink-0">{i + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase Timeline */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const config = phaseConfig[phase.phaseNumber] || phaseConfig[0]
          const Icon = config.icon
          const completedTasks = phase.tasks.filter((t) => t.status === 'completed').length
          const progress = phase.tasks.length > 0 ? Math.round((completedTasks / phase.tasks.length) * 100) : 0
          const isActive = phase.status === 'active'
          const phaseDecision = phase.decisions[0]

          return (
            <Card key={phase.id} className={`border ${isActive ? `${config.border} phase-active` : 'border-border'} bg-card/60`}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {phase.title}
                        <Badge variant={statusConfig[phase.status]?.variant || 'secondary'} className="text-[10px]">
                          {statusConfig[phase.status]?.label || phase.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground font-mono">
                      ${phase.budgetMin} - ${phase.budgetMax} {phase.currency}
                    </span>
                    {isActive && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updatePhaseStatus(phase.id, 'completed')}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Completar
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => updatePhaseStatus(phase.id, 'killed')}>
                          <Skull className="w-3 h-3 mr-1" /> Matar
                        </Button>
                      </div>
                    )}
                    {phase.status === 'pending' && phase.phaseNumber === 0 && (
                      <Button size="sm" className="h-7 text-xs" onClick={() => updatePhaseStatus(phase.id, 'active')}>
                        <Play className="w-3 h-3 mr-1" /> Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Tareas ({completedTasks}/{phase.tasks.length})</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-primary)' }}>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                {/* Tasks */}
                <div className="space-y-1.5">
                  {phase.tasks.map((task) => {
                    const TaskIcon = taskStatusIcon[task.status] || Circle
                    return (
                      <button
                        key={task.id}
                        onClick={() => isActive && toggleTask(task.id, task.status)}
                        disabled={!isActive}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left text-sm transition-all ${
                          isActive ? 'hover:bg-accent/50 cursor-pointer' : 'opacity-70'
                        } ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}
                      >
                        <TaskIcon className={`w-4 h-4 shrink-0 ${
                          task.status === 'completed' ? 'text-primary' : task.status === 'blocked' ? 'text-destructive' : task.status === 'in_progress' ? 'text-amber-400' : 'text-muted-foreground/40'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{task.title}</p>
                          {task.description && <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Kill/Go Decision */}
                {phaseDecision && (
                  <div className={`rounded-xl border p-4 ${
                    phaseDecision.decision === 'go' ? 'border-primary/30 bg-primary/5' :
                    phaseDecision.decision === 'kill' ? 'border-destructive/30 bg-destructive/5' :
                    'border-amber-500/20 bg-amber-500/5'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-2">
                          {phaseDecision.decision === 'pending' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          {phaseDecision.decision === 'go' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          {phaseDecision.decision === 'kill' && <Skull className="w-4 h-4 text-destructive" />}
                          {phaseDecision.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{phaseDecision.criteria}</p>
                        {phaseDecision.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">"{phaseDecision.notes}"</p>
                        )}
                      </div>
                      {!phaseDecision.decision && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="shrink-0">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Decidir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                Punto de Decisión
                              </DialogTitle>
                              <DialogDescription>{phaseDecision.title}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm text-muted-foreground mb-4">Criterio: {phaseDecision.criteria}</p>
                              <Textarea
                                placeholder="Notas adicionales sobre la decisión..."
                                value={decisionNotes[phaseDecision.id] || ''}
                                onChange={(e) => setDecisionNotes((prev) => ({ ...prev, [phaseDecision.id]: e.target.value }))}
                                rows={3}
                              />
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => makeDecision(phaseDecision.id, 'kill', decisionNotes[phaseDecision.id])}
                              >
                                <Skull className="w-4 h-4 mr-1" /> KILL — Detener
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => makeDecision(phaseDecision.id, 'go', decisionNotes[phaseDecision.id])}
                              >
                                <Play className="w-4 h-4 mr-1" /> GO — Continuar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {phaseDecision.decision && (
                        <Badge variant={phaseDecision.decision === 'go' ? 'default' : 'destructive'} className="shrink-0 px-3 py-1">
                          {phaseDecision.decision === 'go' ? 'GO — Continuar' : 'KILL — Detener'}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
