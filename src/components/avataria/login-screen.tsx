'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { toast } from 'sonner'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Completa todos los campos')
      return
    }
    setLoading(true)
    const success = await login(email, password)
    setLoading(false)
    if (!success) {
      toast.error('Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.72_0.19_150_/_0.08)_0%,_transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_oklch(0.65_0.25_25_/_0.06)_0%,_transparent_70%)]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 avatara-glow">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">AVATA</span>
            <span className="text-foreground">RIA</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Lexa IA — Ingeniera, Fanática del Fútbol y MMA
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12 bg-border" />\n            <Lock className="w-3 h-3 text-muted-foreground" />\n            <span className="text-xs text-muted-foreground uppercase tracking-widest">Acceso Restringido</span>
            <Lock className="w-3 h-3 text-muted-foreground" />\n            <div className="h-px w-12 bg-border" />\n          </div>
        </div>

        <Card className="avatatia-border bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@avataria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Accediendo...
                  </span>
                ) : (
                  'Acceder al Panel'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Proyecto AVATARIA v1.0 — Validación Progresiva Kill/Go
        </p>
      </div>
    </div>
  )
}
