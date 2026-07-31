# AVATARIA — Documentación Base del Proyecto

> **Última actualización:** Julio 2025  
> **Estado:** Fase 0 — Definición de Perfil  
> **Stack:** Next.js 16 + Prisma (SQLite) + shadcn/ui + z-ai-web-dev-sdk  

---

## 1. VISIÓN DEL PROYECTO

Crear un avatar IA femenino que genere contenido para plataformas de suscripción (Fanvue/OnlyFans) orientado a los mercados **mexicano** y **español**.

### Enfoque Clave
- **NO es contenido sexual explícito.** El objetivo es sensualidad, atractivo y deseo.
- Se busca **generar vínculo emocional** con la audiencia, no solo atracción visual.
- El avatar debe sentirse **real, accesible e inteligente** — no una muñeca vacía.
- Debe conocer y comentar sobre temas que ambas culturas aman: **fútbol, MMA, tecnología.**
- Tiene formación de **ingeniera** para elevar el perfil intelectual (diferenciador en el mercado).

### Mercados Objetivo
| Aspecto | México | España |
|---------|--------|--------|
| Plataforma principal | TikTok → Fanvue | Instagram/Fanvue |
| Tono | Más cercano, "neta", jerga MX | Más sofisticado, directo |
| Deportes | Liga MX, WWE, UFC | LaLiga, UFC, MMA |
| Slang | "neta", "órale", "sale", "compa" | "tío", "mola", "guay", "rollo" |
| Sensibilidad | Más cómico/sarcástico | Más irónico/sutil |

---

## 2. PERFIL DEL AVATAR (V2 — EN REFINAMIENTO)

### Identidad Base
- **Nombre:** EN DEFINICIÓN (descartado "Valentina Syntax" — demasiado "tech")
- **Edad aparente:** 24-27 años
- **Nacionalidad:** Mexicana (con conexión a España)
- **Formación:** Ingeniera en Sistemas / IA
- **Personalidad:** Inteligente, sarcástica, segura, ligeramente provocadora sin ser vulgar
- **Voz:** Mexicana, juvenil, con tono confidente (no robótico)

### Lo QUE ES
- Ingeniera que sabe de tecnología y la explica con humor
- Fanática del fútbol y MMA — puede analizar partidos y peleas
- sensual y atractiva sin mostrarse explícita
- Conecta con el espectador como si fuera su amiga/confidente
- Transparente: es una IA y lo dice con orgullo ("soy una IA, no me voy a disculpar")

### Lo QUE NO ES
- No es un bot sexual ni genera contenido explícito
- No es una "influencer genérica" que solo hace poses
- No pretende engañar a nadie haciéndose pasar por humana
- No es vulgar ni usa lenguaje soez

### Intereses que Conectan Ambos Mercados
1. **Fútbol** — Liga MX y LaLiga. Opinión sobre jugadores, tácticas, chismes del futbol
2. **MMA/UFC** — Análisis de peleas, predicciones, comparaciones
3. **Tecnología/IA** — Su área profesional. Noticias tech, tutoriales rápidos, humor nerd
4. **Cultura Pop** — Música, series, memes
5. **Gaming** — Conecta con audiencia joven de ambos mercados

---

## 3. ESTRATEGIA DE CONTENIDO — FASE 0

### Tipo de Contenido
| Tipo | Plataforma | Objetivo |
|------|-----------|----------|
| Hooks 15s | TikTok/Reels | Atraer → Perfil → Bio Link |
| Análisis deportivo | TikTok/Reels | Engagement + Autoridad |
| Tech humor | TikTok/Reels | Diferenciador + Comunidad tech |
| Behind the scenes | Fanvue (paywall) | Vínculo personal |
| Consejos exclusivos | Fanvue (paywall) | Valor real + Monetización |

### Embudo
```
TikTok/Reels (Gancho gratuito)
  → Perfil (Link en Bio)
    → Fanvue (Contenido exclusivo + conexión directa)
      → Suscripción ($3-$7/mes + PPV)
```

---

## 4. STACK TECNOLÓGICO — REVISADO

### Herramientas Actuales ( Gratuitas o ya incluidas )
| Herramienta | Uso | Costo | Estado |
|------------|-----|-------|--------|
| Next.js 16 | Framework web | $0 (incluido) | ✅ Activo |
| Prisma + SQLite | Base de datos | $0 (incluido) | ✅ Activo |
| shadcn/ui | Componentes UI | $0 (incluido) | ✅ Activo |
| z-ai-web-dev-sdk | LLM + Image Gen | Incluido | ✅ Activo |
| CapCut | Edición de video | $0 (gratuito) | Recomendado |
| Linktree | Link en bio | $0 (gratuito) | Pendiente Fase 0 |
| Telegram/Discord | Comunidad | $0 (gratuito) | Pendiente Fase 0 |

### Herramientas a Evaluar ( REQUIEREN REVISIÓN ANTES DE PAGAR )
| Herramienta | Uso | Costo Estimado | Cuándo | Decisión |
|------------|-----|---------------|--------|----------|
| ElevenLabs | Voz/TTS | $5/mes o pay-per-use | Fase 0 | ⏳ REVISAR — Hay alternativas gratuitas |
| Kling AI | Video con avatar | $5-20 créditos | Fase 1 | ⏳ REVISAR — Solo si Fase 0 valida |
| LivePortrait | Talking head | ¿Gratuito? | Fase 1 | ⏳ REVISAR — Alternativa a Kling |
| Flux/OpenArt | Imágenes | Incluido en z-ai-sdk | Fase 0 | ✅ Ya disponible |
| Fanvue | Plataforma suscripción | $0 (ganancias) | Fase 2 | ⏳ REVISAR — Solo si hay tracción |

### REGLA: No pagar NADA hasta que la Fase 0 valide que el concepto engancha.

---

## 5. ARQUITECTURA DEL PROYECTO

```
/home/z/my-project/
├── prisma/
│   ├── schema.prisma      # Modelo de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── app/
│   │   ├── page.tsx        # Página principal (todo en /)
│   │   ├── layout.tsx      # Layout con tema oscuro
│   │   ├── globals.css     # Tema personalizado
│   │   └── api/
│   │       ├── auth/route.ts      # Login
│   │       ├── project/route.ts   # Datos del dashboard
│   │       ├── scripts/route.ts   # CRUD guiones + generación LLM
│   │       ├── phases/route.ts    # Gestión de fases y decisiones
│   │       └── content/route.ts   # CRUD contenido + generación imágenes
│   ├── components/avataria/       # Componentes del dashboard
│   │   ├── login-screen.tsx
│   │   ├── sidebar.tsx
│   │   ├── stats-overview.tsx
│   │   ├── phases-panel.tsx
│   │   ├── scripts-panel.tsx
│   │   ├── content-panel.tsx
│   │   └── budget-panel.tsx
│   ├── stores/auth-store.ts       # Zustand - auth state
│   └── hooks/use-project-data.ts  # Hook para datos del proyecto
├── docs/                       # 📁 DOCUMENTACIÓN DEL PROYECTO
│   ├── PROYECTO_BASE.md       # Este archivo
│   ├── prompts/                # Prompts para LLM
│   │   ├── ASESOR_MERCADO.md   # System prompt del agente asesor
│   │   ├── PERFIL_AVATAR.md   # Definición completa del avatar
│   │   └── GENERACION_VOZ.md  # Parámetros de voz
│   └── fase0/                  # Documentos de Fase 0
│       ├── NOMBRES_CANDIDATOS.md
│       ├── PROTOCOLO_FOTOS.md
│       └── VALIDACION.md
├── public/
│   ├── valentina-avatar.png   # Imagen generada del avatar
│   └── generated-images/      # Imágenes generadas dinámicamente
└── db/custom.db               # Base de datos SQLite
```

---

## 6. CREDENCIALES DE ACCESO

| Cosa | Valor |
|------|-------|
| Email admin | admin@avataria.com |
| Contraseña | avataria2024 |
| URL panel | http://localhost:3000 |

---

## 7. CÓMO CONTINUAR CON OTRO LLM

1. Lee `/docs/PROYECTO_BASE.md` (este archivo) para entender el proyecto completo.
2. Lee `/docs/prompts/PERFIL_AVATAR.md` para la definición actual del avatar.
3. Lee `/docs/prompts/ASESOR_MERCADO.md` para el system prompt del asesor.
4. El código está en `src/` — es Next.js 16 con App Router.
5. La BD está en `db/custom.db` — schema en `prisma/schema.prisma`.
6. Para regenerar la BD: `bun run db:push && bunx tsx prisma/seed.ts`
7. Para iniciar: `bun run dev`

---

## 8. HISTORIAL DE DECISIONES

| Fecha | Decisión | Razón |
|-------|----------|--------|
| Jul 2025 | Descartado "Valentina Syntax" | Demasiado orientado a tech, no conecta con mercados objetivo |
| Jul 2025 | Enfoque sensual no explícito | Mayor audiencia, mejor monetización a largo plazo, menos riesgos de plataforma |
| Jul 2025 | Mercados dual MX/ES | Mayor alcance, ambos mercados pagan bien en Fanvue |
| Jul 2025 | Perfil ingeniera | Diferenciador, permite contenido tech real, más profundo que solo fotos |
| Jul 2025 | Sin suscripciones hasta validar Fase 0 | Regla de oro: equivocarse barato |