'use client'

import { create } from 'zustand'

type UserData = {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthState {
  user: UserData | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      if (typeof window !== 'undefined') {
        localStorage.setItem('avataria_token', data.token)
        localStorage.setItem('avataria_user', JSON.stringify(data.user))
      }
      set({ user: data.user, token: data.token, isAuthenticated: true })
      return true
    } catch {
      return false
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('avataria_token')
      localStorage.removeItem('avataria_user')
    }
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false })
      return
    }
    const token = localStorage.getItem('avataria_token')
    const userStr = localStorage.getItem('avataria_user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        const payload = JSON.parse(atob(token))
        if (payload.exp > Date.now()) {
          set({ user, token, isAuthenticated: true, isLoading: false })
          return
        }
      } catch { /* expired or corrupt */ }
    }
    localStorage.removeItem('avataria_token')
    localStorage.removeItem('avataria_user')
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },
}))
