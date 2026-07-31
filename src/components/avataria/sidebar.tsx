'use client'

import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  GitBranch,
  FileText,
  Clapperboard,
  DollarSign,
  LogOut,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'phases', label: 'Fases & Decisiones', icon: GitBranch },
  { id: 'scripts', label: 'Guiones IA', icon: FileText },
  { id: 'advisor', label: 'El Estratega', icon: Sparkles },
  { id: 'content', label: 'Pipeline Contenido', icon: Clapperboard },
  { id: 'budget', label: 'Presupuesto', icon: DollarSign },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col h-screen fixed left-0 top-0 z-40 lg:relative">
      {/* Brand */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">
              <span className="text-primary">AVATA</span>RIA
            </h2>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Leia IA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sidebar-primary' : ''}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8 h-8">
            <AvatarImage src="/leia-avatar.png" alt="Leia" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              <Shield className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
