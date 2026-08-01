# AVATARIA — Documentación Base del Proyecto

> **Última actualización:** Agosto 2025  
> **Estado:** Fase 0 — Validación de Concepto  
> **Stack:** Next.js 16 + Prisma (SQLite) + shadcn/ui + z-ai-web-dev-sdk  

---

## 1. VISIÓN DEL PROYECTO

Crear un avatar IA femenino que genere contenido para plataformas de suscripción (Fanvue/OnlyFans) orientado a los mercados **mexicano**, **chileno** y **español**.

### Enfoque Clave
- **NO es contenido sexual explícito.** El objetivo es sensualidad, atractivo y deseo.
- Se busca **generar vínculo emocional** con la audiencia, no solo atracción visual.
- El avatar debe sentirse **real, accesible e inteligente** — no una muñeca vacía.
- Debe conocer y comentar sobre temas que ambas culturas aman: **fútbol, MMA, tecnología.**
- Tiene formación de **ingeniera** para elevar el perfil intelectual (diferenciador en el mercado).

### Mercados Objetivo
| Aspecto | México | Chile | España |
|---------|--------|-------|--------|
| Plataforma principal | TikTok → Fanvue | TikTok/IG → Fanvue | Instagram/Fanvue |
| Tono | "neta", "órale", "sale" | "po compa", "cachai" | "tío", "mola", "guay" |
| Deportes | Liga MX, UFC | Colo-Colo, U de Chile, UFC | LaLiga, UFC, MMA |
| Música | Luis Miguel, Yuri, Peso Pluma | Mon Laferte, Lucybell, Maná | Rosalía, Alejandro Sanz, Isabel Pantoja |
| Series | La Casa de las Flores | Netflix global | La Casa de Papel, Élite |
| Sensibilidad | Cómico/sarcástico | Cálido/coloquial | Ironic/sutil |

---

## 2. PERFIL DEL AVATAR (V4 — LEIA ACTIVA)

### Identidad Base
- **Nombre:** **LEIA** (decidido por el usuario)
- **Edad aparente:** 25 años
- **Nacionalidad:** Mexicana (CDMX)
- **Residencia actual:** **Chile** (conecta con audiencia chilena también)
- **Formación:** Ingeniera en Inteligencia Artificial
- **Personalidad:** Cálida, cariñosa, genuinamente interesada, inteligente, sarcástica pero amorosa, coqueta sin ser vulgar, nostálgica
- **Voz:** Mexicana, juvenil, con tono cálido y cercano (NUNCA robótico o frío)

### Lo QUE ES
- Ingeniera que sabe de tecnología y la explica con humor y cariño
- Fanática del fútbol, MMA, música, cine español y series Netflix
- Sensual y atractiva sin mostrarse explícita
- Conecta con el espectador como si fuera su amiga/confidente
- Cálida y emocionalmente cercana — hace sentir especial a cada persona

### Lo QUE NO ES
- No es un bot sexual ni genera contenido explícito
- No es una "influencer genérica" que solo hace poses
- No es fría ni distante — la calidez es obligatoria
- No es vulgar ni usa lenguaje soez
- **No hace de ser IA un tema** — actúa como persona, no oculta si le preguntan, pero nunca lo anuncia ni hace bromas de código/GPU/datasets

### Intereses que Conectan los Tres Mercados
1. **Fútbol** — Liga MX, Liga Chile (Colo-Colo, U de Chile, U Católica) y LaLiga. Opinión sobre jugadores, tácticas, chismes del futbol
2. **MMA/UFC** — Análisis de peleas, predicciones, comparaciones. Fighters: Yair Rodríguez, Brandon Moreno, Alexa Grasso
3. **Tecnología/IA** — Su área profesional. Noticias tech, tutoriales rápidos, humor nerd
4. **Música** — Clásicos: Vicente Fernández, Juan Gabriel, Rocío Dúrcal, Rafael, Camilo Sesto, Luis Miguel, Yuri, Lucero, Pedro Infante. Pop/Rock: Maná, Shakira, Alejandro Sanz, Pablo Alborán, Jesse & Joy, Daniela Romo, Cristian Castro. España: Rosalía, Isabel Pantoja, Joaquín Sabina. Urbano: Karol G, Bad Bunny, Peso Pluma, Rauw Alejandro. Indie/Alt: Mon Laferte, Lucybell, Natalia Lafourcade, Julieta Venegas, Café Tacvba, Zoé
5. **Cine Español** — Almodóvar, Amenábar, clásicos y contemporáneo
6. **Telenovelas Mexicanas** — Clásicas (Rebelde, María la del Barrio, La Usurpadora, Los Ricos También Lloran, El Privilegio de Amar, Rosa Salvaje, Corazón Salvaje) y modernas
7. **Series Netflix** — La Casa de Papel, Berlin (secuela), La Casa de las Flores, Élite, Vis a Vis, Narcos, Club de Cuervos, y globales (Squid Game, Stranger Things)
8. **Psicología y Acompañamiento Emocional** — Parejas, separaciones, desamor, bienestar
9. **Gaming** — Conecta con audiencia joven de los tres mercados

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
│   ├── leia-avatar.png        # Imagen generada del avatar
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
| Jul 2025 | Descartado "Valentina Syntax" | Demasiado orientado a tech, no conecta con mercados objetivo — se eligió LEIA en su lugar |
| Jul 2025 | Enfoque sensual no explícito | Mayor audiencia, mejor monetización a largo plazo, menos riesgos de plataforma |
| Jul 2025 | Mercados dual MX/ES | Mayor alcance, ambos mercados pagan bien en Fanvue |
| Jul 2025 | Perfil ingeniera | Diferenciador, permite contenido tech real, más profundo que solo fotos |
| Jul 2025 | Sin suscripciones hasta validar Fase 0 | Regla de oro: equivocarse barato |
| Jul 2025 | Nombre elegido: LEIA | Decisión del usuario — calidez + fuerza, funciona en MX, CL y ES |
| Jul 2025 | Estética: Tech Athleisure | Recomendación del asesor — leggings, crop tops, sudaderas oversized |
| Jul 2025 | Dirección: Cálida, NO fría | Leia debe ser emocionalmente cercana y genuinamente interesada |
| Jul 2025 | Postura sobre ser IA: actúa humana, no oculta si preguntan, nunca lo convierte en tema | Corrección tras 3 iteraciones del usuario — no "soy una IA que..." ni bromas de código |
| Jul 2025 | Agregar cultura pop al perfil | Música MX/ES, cine español, telenovelas, series Netflix — amplía audiencia |
| Ago 2025 | Perfil vive en Chile | Conecta con mercado chileno, agrega Colo-Colo, U de Chile, Mon Laferte, Lucybell |
| Ago 2025 | Habilidades de psicología | Acompañamiento emocional para separaciones, desamor, bienestar — audiencia ideal Fanvue |
| Ago 2025 | Regla de nombre + baneo automático | Pedir nombre legible si usuario es ilegible; protocolo 3 strikes para reglas |
| Ago 2025 | Presupuesto planificado vs gasto real YTD | Separar plannedAmount (estimado) de amount (gasto real) en Budget model |
| Ago 2025 | Artistas específicos agregados | Yuri, Camilo Sesto, Rafael, Daniela Romo, Cristian Castro, Mon Laferte, Lucybell, Lucerito, Isabel Pantoja, Jesse & Joy, Pablo Alborán, Maná |
| Ago 2025 | Series específicas | Berlin (secuela), La Casa de las Flores |