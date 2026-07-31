'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, Trash2, MessageSquare, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  '\xbfQu\xe9 tipo de contenido de Lexa conectar\xeda mejor con la audiencia mexicana vs. espa\xf1ola?',
  '\xbfCu\xe1les son las diferencias culturales clave entre M\xe9xico y Espa\xf1a para este tipo de avatar?',
  'Analiza el nombre "Lexa" para el mercado mexicano y espa\xf1ol. \xbfEs el adecuado?',
  'Dame una estrategia de contenido para la Fase 0 en TikTok e Instagram',
  '\xbfQu\xe9 horarios y d\xedas son mejores para publicar en M\xe9xico y Espa\xf1a?',
  '\xbfC\xf3mo generar v\xednculo emocional sin recurrir a contenido sexual expl\xedcito?',
]

export function AdvisorPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      if (data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error de conexi\xf3n con el asesor. Intenta de nuevo.' },
      ])
    }
    setLoading(false)
  }

  const handleClear = async () => {
    await fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '', clearHistory: true }),
    })
    setMessages([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-4">
      {/* Advisor Info Card */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-amber-300">El Estratega — Asesor de Marketing</h3>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Experto en mercados de contenido de pago en M\xe9xico y Espa\xf1a. Te asesora en imagen de marca,
                estrategia cultural, y adaptaci\xf3n de contenido para Leia en ambas audiencias.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-3 h-3" /> Solo LLM local
                </span>
                <span className="text-[10px] text-muted-foreground">$0 costo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            Chat con el Estratega
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            onClick={handleClear}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-[400px] overflow-y-auto rounded-lg border border-border bg-background/50 p-3 space-y-3 mb-3"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-amber-400/50" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Pregunta al Estratega
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Asesor\xeda en marca, cultura, y estrategia de contenido
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta sobre estrategia, mercado, cultura..."
              rows={2}
              className="resize-none flex-1"
              disabled={loading}
            />
            <Button
              size="sm"
              className="h-auto self-end bg-amber-500 hover:bg-amber-600 text-black"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggested Prompts */}
          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Preguntas sugeridas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card/50 hover:bg-card hover:border-amber-500/30 text-muted-foreground hover:text-amber-300 transition-colors disabled:opacity-50 text-left"
                >
                  {prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
