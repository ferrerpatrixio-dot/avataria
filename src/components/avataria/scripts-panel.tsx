'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sparkles,
  Copy,
  Check,
  Trash2,
  Pencil,
  Bot,
  Flame,
  FileText,
  Trophy,
  Music,
  Heart,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'

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

interface ScriptsPanelProps {
  scripts: Script[]
  onRefresh: () => void
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  hook_futbol: { label: 'Fútbol', icon: Trophy, color: 'text-green-400 bg-green-500/10' },
  hook_mma: { label: 'MMA/UFC', icon: Flame, color: 'text-red-400 bg-red-500/10' },
  hook_cultura: { label: 'Música/Cine/Series', icon: Music, color: 'text-pink-400 bg-pink-500/10' },
  hook_emocional: { label: 'Emocional/Coqueto', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
  hook_consejos: { label: 'Consejos para Hombres', icon: MessageCircle, color: 'text-sky-400 bg-sky-500/10' },
  full_script: { label: 'Script Completo', icon: FileText, color: 'text-amber-400 bg-amber-500/10' },
  custom: { label: 'Personalizado', icon: Sparkles, color: 'text-primary bg-primary/10' },
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  approved: { label: 'Aprobado', variant: 'default' },
  used: { label: 'Usado', variant: 'outline' },
  discarded: { label: 'Descartado', variant: 'destructive' },
}

export function ScriptsPanel({ scripts, onRefresh }: ScriptsPanelProps) {
  const [generating, setGenerating] = useState(false)
  const [genType, setGenType] = useState('hook_mma')
  const [customPrompt, setCustomPrompt] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const generateScript = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', type: genType, customPrompt }),
      })
      if (res.ok) {
        toast.success('Guion generado por IA')
        onRefresh()
      } else {
        toast.error('Error generando guion')
      }
    } catch {
      toast.error('Error de conexión')
    }
    setGenerating(false)
  }

  const updateScriptStatus = async (scriptId: string, status: string) => {
    await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', scriptId, status }),
    })
    toast.success(`Estado: ${statusConfig[status]?.label || status}`)
    onRefresh()
  }

  const saveScriptContent = async () => {
    if (!editingId) return
    await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_content', scriptId: editingId, content: editContent }),
    })
    toast.success('Guion actualizado')
    setEditingId(null)
    onRefresh()
  }

  const deleteScript = async (scriptId: string) => {
    await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', scriptId }),
    })
    toast.success('Guion eliminado')
    onRefresh()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles')
  }

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            Generador de Guiones — Leia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Tipo de Hook</label>
              <Select value={genType} onValueChange={setGenType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hook_futbol">⚽ Fútbol</SelectItem>
                  <SelectItem value="hook_mma">🔥 MMA/UFC</SelectItem>
                  <SelectItem value="hook_cultura">🎵 Música/Cine/Series</SelectItem>
                  <SelectItem value="hook_emocional">💝 Emocional/Coqueto</SelectItem>
                  <SelectItem value="hook_consejos">🗣️ Consejos para Hombres</SelectItem>
                  <SelectItem value="full_script">📝 Script Completo (60s)</SelectItem>
                  <SelectItem value="custom">✨ Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {genType === 'custom' && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Instrucciones personalizadas</label>
                <Textarea
                  placeholder="Ej: Un hook sobre Maná viniendo a Chile, preguntando si alguien más va..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={2}
                  className="bg-background/50 text-sm"
                />
              </div>
            )}
          </div>
          <Button onClick={generateScript} disabled={generating} className="w-full sm:w-auto">
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generando con IA...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generar Guion
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Script List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Guiones ({scripts.length})
        </h3>
        {scripts.length === 0 ? (
          <Card className="bg-card/60">
            <CardContent className="p-8 text-center">
              <Bot className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay guiones aún. Genera el primero con IA.</p>
            </CardContent>
          </Card>
        ) : (
          scripts.map((script) => {
            const tc = typeConfig[script.type] || typeConfig.custom
            const TypeIcon = tc.icon
            const sc = statusConfig[script.status] || statusConfig.draft
            const isEditing = editingId === script.id

            return (
              <Card key={script.id} className="bg-card/60 hover:bg-card/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${tc.color} flex items-center justify-center shrink-0`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{script.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-mono">{script.duration}</span>
                          {script.aiGenerated && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">IA</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="text-sm bg-background/50"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveScriptContent}>
                          <Check className="w-3 h-3 mr-1" /> Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background/50 rounded-lg p-3 mb-3">
                      <p className="text-sm leading-relaxed italic">&ldquo;{script.content}&rdquo;</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => copyToClipboard(script.content)}>
                      <Copy className="w-3 h-3 mr-1" /> Copiar
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setEditingId(script.id); setEditContent(script.content) }}>
                      <Pencil className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    {script.status === 'draft' && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => updateScriptStatus(script.id, 'approved')}>
                        <Check className="w-3 h-3 mr-1" /> Aprobar
                      </Button>
                    )}
                    {script.status === 'approved' && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => updateScriptStatus(script.id, 'used')}>
                        <Check className="w-3 h-3 mr-1" /> Marcar Usado
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteScript(script.id)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}