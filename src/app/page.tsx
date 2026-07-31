'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useProjectData } from '@/hooks/use-project-data'
import { LoginScreen } from '@/components/avataria/login-screen'
import { Sidebar } from '@/components/avataria/sidebar'
import { StatsOverview } from '@/components/avataria/stats-overview'
import { PhasesPanel } from '@/components/avataria/phases-panel'
import { ScriptsPanel } from '@/components/avataria/scripts-panel'
import { ContentPanel } from '@/components/avataria/content-panel'
import { BudgetPanel } from '@/components/avataria/budget-panel'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Zap, Menu, X, ArrowRight, Sparkles, Bot, Clapperboard, DollarSign, GitBranch, LayoutDashboard } from 'lucide-react'

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data, loading, refetch } = useProjectData(true)

  const project = data?.project
  const stats = data?.stats

  const renderContent = () => {
    if (loading && !data) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return stats && project ? (
          <>
            <StatsOverview stats={stats} currentPhase={project.currentPhase} />
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Próximos Pasos Recomendados
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Sparkles, label: 'Generar Guiones IA', desc: 'Crea hooks con Valentina', tab: 'scripts', color: 'text-primary' },
                  { icon: Bot, label: 'Generar Imagen', desc: 'Nueva variación del avatar', tab: 'content', color: 'text-cyan-400' },
                  { icon: Clapperboard, label: 'Pipeline Contenido', desc: 'Gestiona videos e imágenes', tab: 'content', color: 'text-purple-400' },
                  { icon: DollarSign, label: 'Ver Presupuesto', desc: 'Control de gastos', tab: 'budget', color: 'text-amber-400' },
                ].map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.tab)}
                      className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card/80 hover:border-primary/30 transition-all text-left group"
                    >
                      <ItemIcon className={`w-5 h-5 ${item.color} mb-2 group-hover:scale-110 transition-transform`} />
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        ) : null

      case 'phases':
        return project ? <PhasesPanel phases={project.phases} onRefresh={refetch} /> : null

      case 'scripts':
        return <ScriptsPanel scripts={project?.scripts || []} onRefresh={refetch} />

      case 'content':
        return <ContentPanel contents={project?.contents || []} onRefresh={refetch} />

      case 'budget':
        return <BudgetPanel budgets={project?.budgets || []} />

      default:
        return null
    }
  }

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    phases: 'Fases & Decisiones Kill/Go',
    scripts: 'Guiones IA',
    content: 'Pipeline de Contenido',
    budget: 'Presupuesto',
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false) }} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">
              <span className="text-primary">AVATA</span>RIA
            </span>
          </div>
          <Avatar className="w-7 h-7">
            <AvatarImage src="/valentina-avatar.png" alt="" />
            <AvatarFallback className="bg-primary/20 text-primary text-[10px]">VS</AvatarFallback>
          </Avatar>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              {activeTab === 'dashboard' && <LayoutDashboard className="w-5 h-5 text-primary" />}
              {activeTab === 'phases' && <GitBranch className="w-5 h-5 text-primary" />}
              {activeTab === 'scripts' && <Bot className="w-5 h-5 text-primary" />}
              {activeTab === 'content' && <Clapperboard className="w-5 h-5 text-primary" />}
              {activeTab === 'budget' && <DollarSign className="w-5 h-5 text-primary" />}
              {tabTitles[activeTab] || 'Dashboard'}
            </h1>
          </div>

          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-border px-4 py-4 flex items-center justify-between text-[11px] text-muted-foreground/50">
          <span>AVATARIA v1.0 — Valentina Syntax</span>
          <span>Acceso Restringido</span>
        </footer>
      </main>
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return <LoginScreen />
  return <AuthenticatedApp />
}