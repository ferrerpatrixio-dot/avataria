'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Image,
  Video,
  Sparkles,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MousePointer,
  Users,
  ImageIcon,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Metric {
  id: string
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  followers: number
  recordedAt: string
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
  metrics: Metric[]
}

interface ContentPanelProps {
  contents: ContentItem[]
  onRefresh: () => void
}

const typeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  static_image: { label: 'Imagen', icon: Image, color: 'text-cyan-400' },
  talking_head: { label: 'Talking Head', icon: Video, color: 'text-purple-400' },
  kling_video: { label: 'Kling Video', icon: Video, color: 'text-amber-400' },
  capcut_edit: { label: 'CapCut Edit', icon: Video, color: 'text-pink-400' },
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  planned: { label: 'Planeado', variant: 'secondary' },
  in_production: { label: 'Producción', variant: 'outline' },
  review: { label: 'Revisión', variant: 'outline' },
  published: { label: 'Publicado', variant: 'default' },
  discarded: { label: 'Descartado', variant: 'destructive' },
}

const metricItems = [
  { key: 'views', label: 'Vistas', icon: Eye, color: 'text-cyan-400' },
  { key: 'likes', label: 'Likes', icon: Heart, color: 'text-pink-400' },
  { key: 'comments', label: 'Comentarios', icon: MessageSquare, color: 'text-amber-400' },
  { key: 'shares', label: 'Shares', icon: Share2, color: 'text-primary' },
  { key: 'saves', label: 'Saves', icon: Bookmark, color: 'text-purple-400' },
  { key: 'clicks', label: 'Clics', icon: MousePointer, color: 'text-orange-400' },
  { key: 'followers', label: 'Followers', icon: Users, color: 'text-emerald-400' },
] as const

const BASE_PHOTOS = [
  { value: '/leia-avatar.png', label: 'Perfil principal (hoodie, riendo)', score: '9/10' },
  { value: '/leia-reel-shark.png', label: 'Suéter naranja + tiburón', score: '8.5/10' },
  { value: '/leia-reel-pumpkin.png', label: 'Outfit naranja + calabaza', score: '8/10' },
  { value: '/leia-reel-braids.png', label: 'Dos trenzas + tiburón', score: '7.5/10' },
  { value: '/leia-reel-orange.png', label: 'Chamarra naranja, sonrisa', score: 'Nueva' },
  { value: '/leia-reference.png', label: '⭐ LEIA DEFINITIVA', score: '9/10' },
] as const

export function ContentPanel({ contents, onRefresh }: ContentPanelProps) {
  const [generating, setGenerating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showMetric, setShowMetric] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('static_image')
  const [newPlatform, setNewPlatform] = useState('tiktok')
  const [newNotes, setNewNotes] = useState('')
  const [imgPrompt, setImgPrompt] = useState('')
  const [metrics, setMetrics] = useState<Record<string, string>>({})
  const [useBaseImage, setUseBaseImage] = useState(true)
  const [selectedBase, setSelectedBase] = useState(BASE_PHOTOS[0].value)

  const generateImage = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt: imgPrompt || undefined,
          baseImage: useBaseImage ? selectedBase : undefined,
        }),
      })
      if (res.ok) {
        toast.success(useBaseImage ? 'Variación generada desde foto base' : 'Imagen de Leia generada')
        onRefresh()
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || 'Error generando imagen')
      }
    } catch { toast.error('Error de conexión') }
    setGenerating(false)
  }

  const createContent = async () => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', title: newTitle, type: newType, platform: newPlatform, notes: newNotes }),
    })
    toast.success('Contenido creado')
    setShowCreate(false)
    setNewTitle('')
    setNewNotes('')
    onRefresh()
  }

  const addMetric = async (contentId: string) => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_metric',
        contentId,
        platform: newPlatform,
        views: Number(metrics.views) || 0,
        likes: Number(metrics.likes) || 0,
        comments: Number(metrics.comments) || 0,
        shares: Number(metrics.shares) || 0,
        saves: Number(metrics.saves) || 0,
        clicks: Number(metrics.clicks) || 0,
        followers: Number(metrics.followers) || 0,
      }),
    })
    toast.success('Métricas registradas')
    setShowMetric(null)
    setMetrics({})
    onRefresh()
  }

  const updateStatus = async (contentId: string, status: string) => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', contentId, status }),
    })
    toast.success(`Estado: ${statusLabels[status]?.label || status}`)
    onRefresh()
  }

  const deleteContent = async (contentId: string) => {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', contentId }),
    })
    toast.success('Contenido eliminado')
    onRefresh()
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Nuevo Contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Nuevo Contenido</DialogTitle>
              <DialogDescription>Agrega un nuevo elemento al pipeline de contenido</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Input placeholder="Título" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static_image">Imagen Estática</SelectItem>
                    <SelectItem value="talking_head">Talking Head</SelectItem>
                    <SelectItem value="kling_video">Kling Video</SelectItem>
                    <SelectItem value="capcut_edit">CapCut Edit</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newPlatform} onValueChange={setNewPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="fanvue">Fanvue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Notas..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} rows={2} />
            </div>
            <DialogFooter>
              <Button onClick={createContent} disabled={!newTitle}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="border-primary/30">
              <Sparkles className="w-4 h-4 mr-1 text-primary" /> Generar Imagen IA
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md !max-h-[80vh] !overflow-hidden !flex !flex-col">
            <DialogHeader className="!shrink-0">
              <DialogTitle>Generar Imagen de Leia</DialogTitle>
              <DialogDescription>Crea variaciones a partir de las fotos limpias o genera desde cero</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 overflow-y-auto flex-1 min-h-0 scrollbar-thin">
              {/* Base image toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Usar foto como base
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Image-to-image: mantiene la cara de Leia
                  </p>
                </div>
                <Switch checked={useBaseImage} onCheckedChange={setUseBaseImage} />
              </div>

              {/* Base photo selector */}
              {useBaseImage && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Foto base</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {BASE_PHOTOS.map((photo) => (
                      <button
                        key={photo.value}
                        type="button"
                        onClick={() => setSelectedBase(photo.value)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                          selectedBase === photo.value
                            ? 'border-primary ring-1 ring-primary/50'
                            : 'border-border/50 hover:border-border'
                        }`}
                      >
                        <img
                          src={photo.value}
                          alt={photo.label}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-1">
                          <p className="text-[9px] font-medium text-white leading-tight truncate">{photo.label}</p>
                          <p className="text-[8px] text-white/60">{photo.score}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  {useBaseImage
                    ? 'Prompt de edición (qué cambiar - ropa, fondo, expresión...)'
                    : 'Prompt personalizado (opcional - se usa un prompt por defecto)'}
                </Label>
                <Textarea
                  placeholder={useBaseImage
                    ? 'Ej: cambiar el fondo a un café acogedor, ropa roja, sonrisa tímida...'
                    : 'Prompt personalizado (opcional - se usa un prompt por defecto de Leia)'}
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter className="shrink-0 pt-2">
              <Button onClick={generateImage} disabled={generating}>
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generando...
                  </span>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1" /> {useBaseImage ? 'Generar Variación' : 'Generar'}</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((item) => {
          const tc = typeLabels[item.type] || typeLabels.static_image
          const TypeIcon = tc.icon
          const sc = statusLabels[item.status] || statusLabels.planned
          const latestMetric = item.metrics[item.metrics.length - 1]

          return (
            <Card key={item.id} className="bg-card/60 hover:bg-card/80 transition-colors overflow-hidden">
              {item.imageUrl && (
                <div className="aspect-video bg-background/30 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <TypeIcon className={`w-4 h-4 ${tc.color} shrink-0`} />
                    <p className="text-sm font-medium truncate">{item.title}</p>
                  </div>
                  <Badge variant={sc.variant} className="text-[10px] shrink-0">{sc.label}</Badge>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  {item.platform && <Badge variant="outline" className="text-[10px] h-4 px-1.5">{item.platform}</Badge>}
                  <span className="font-mono">{new Date(item.createdAt).toLocaleDateString('es-MX')}</span>
                </div>

                {/* Metrics preview */}
                {latestMetric && (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
                    {[
                      { v: latestMetric.views, icon: Eye, color: 'text-cyan-400' },
                      { v: latestMetric.likes, icon: Heart, color: 'text-pink-400' },
                      { v: latestMetric.comments, icon: MessageSquare, color: 'text-amber-400' },
                      { v: latestMetric.clicks, icon: MousePointer, color: 'text-orange-400' },
                    ].map((m, i) => {
                      const MIcon = m.icon
                      return (
                        <div key={i} className="text-center">
                          <MIcon className={`w-3 h-3 mx-auto mb-0.5 ${m.color}`} />
                          <p className="text-[10px] font-mono">{m.v > 1000 ? `${(m.v / 1000).toFixed(1)}K` : m.v}</p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <Dialog open={showMetric === item.id} onOpenChange={(open) => setShowMetric(open ? item.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> Métricas</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                      <DialogHeader>
                        <DialogTitle>Registrar Métricas</DialogTitle>
                        <DialogDescription>{item.title}</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {metricItems.map((m) => {
                          const MIcon = m.icon
                          return (
                            <div key={m.key} className="space-y-1">
                              <label className="text-xs flex items-center gap-1.5">
                                <MIcon className={`w-3 h-3 ${m.color}`} />{m.label}
                              </label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={metrics[m.key] || ''}
                                onChange={(e) => setMetrics((prev) => ({ ...prev, [m.key]: e.target.value }))}
                              />
                            </div>
                          )
                        })}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => addMetric(item.id)}>Guardar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {item.status === 'planned' && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => updateStatus(item.id, 'in_production')}>Producción</Button>}
                  {item.status === 'in_production' && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => updateStatus(item.id, 'review')}>Revisión</Button>}
                  {item.status === 'review' && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => updateStatus(item.id, 'published')}>Publicar</Button>}
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => deleteContent(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {contents.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-card/60">
              <CardContent className="p-8 text-center">
                <Video className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay contenido en el pipeline. Crea el primero o genera una imagen.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}