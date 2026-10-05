# AVATARIA — Documento de traspaso (handoff)

Última actualización: 2026-10-04. Léelo completo antes de tocar código.
Contexto de negocio y estrategia: `docs/PROYECTO_BASE.md`, `docs/fase0/`, `docs/prompts/`.
Historial técnico detallado: `worklog.md`.

## 1. Qué es
Panel de gestión del proyecto "AVATARIA": un avatar IA femenino (**Leia**) para
contenido en TikTok/Instagram y monetización en Fanvue (mercados MX, CL, ES), con
validación por fases y decisiones Kill/Go. La app tiene login y 6 secciones:
Dashboard, Fases & Decisiones, Guiones IA, El Estratega (asesor IA), Pipeline de
Contenido, Presupuesto.

## 2. Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + shadcn/ui
- Prisma 6 + **PostgreSQL (Supabase vía integración de Vercel)**. Antes era SQLite.
- IA: `z-ai-web-dev-sdk` (chat del asesor y generación de imágenes)
- Gestor de paquetes: **npm** (`package-lock.json`). `bun.lock` fue eliminado.

## 3. Despliegue
- GitHub: `ferrerpatrixio-dot/avataria`, rama `main`. Cada push despliega en Vercel.
- Vercel: proyecto `avataria`, equipo `ia-en-proceso-s-projects`.
- Producción: https://avataria-phi.vercel.app/
- `vercel.json` NO debe definir `buildCommand`: anularía el script `vercel-build`.
- `vercel-build` (package.json) ejecuta, en orden:
  1. `prisma generate`
  2. `prisma db push` con `STORAGE_POSTGRES_URL_NON_POOLING`
  3. `prisma/seed-admin.mjs` (crea el admin si no existe)
  4. `prisma/seed-project.mjs` (crea proyecto/fases/guiones/presupuesto y registra fotos)
  5. `next build`
  Los seeds son idempotentes y nunca borran datos.

## 4. Variables de entorno (nunca commitear valores)
| Variable | Uso |
|---|---|
| `STORAGE_POSTGRES_PRISMA_URL` | Conexión de la app (pooler) — `src/lib/db.ts` |
| `STORAGE_POSTGRES_URL_NON_POOLING` | Conexión directa para `prisma db push` |
| `DATABASE_URL` | Fallback local; el schema lo lee con `env("DATABASE_URL")` |
| `ADMIN_PASSWORD` | Contraseña del admin (obligatoria; sin ella el seed no crea el admin) |
| `ADMIN_EMAIL` | Opcional, por defecto `admin@avataria.com` |

Vercel crea además muchas `STORAGE_SUPABASE_*` / `NEXT_PUBLIC_*` que el código no usa.
Para desarrollo local: `.env` con `DATABASE_URL` a un Postgres, luego
`npm install`, `npm run db:push`, `npm run db:seed-admin`, `npm run db:seed-project`, `npm run dev`.

## 5. Mapa del código
- `src/app/page.tsx` — shell con login y pestañas
- `src/app/api/` — `auth`, `project`, `phases`, `scripts`, `content`, `advisor`
- `src/components/avataria/` — un panel por sección
- `src/hooks/use-project-data.ts` — tipos y fetch del proyecto
- `src/lib/db.ts` — cliente Prisma
- `prisma/schema.prisma` — User, Project, Phase, PhaseTask, Decision, Script, Content, Metric, Budget
- `prisma/seed.ts` — seed ANTIGUO y DESTRUCTIVO (borra todo). No usar en producción.
- `public/` — fotos base de Leia (`leia-*.png`) + `instagram/`, `tiktok/`, `generated-images/`

## 6. Fotos base de Leia
- Viven en `public/` (sin subcarpetas) y se sirven como `/leia-xxx.png`.
- Para que una foto nueva sea usable como base de generación hay que:
  1. copiarla a `public/` (preferible comprimida; el repo ya tuvo problemas de peso),
  2. añadirla a `ALLOWED` en `src/app/api/content/route.ts`,
  3. añadirla a `PHOTO_CATEGORIES` en `src/components/avataria/content-panel.tsx`.
- `seed-project.mjs` crea un registro de pipeline (`planned`) por cada `public/leia-*`
  que aún no tenga uno, en el siguiente deploy.
- Pendientes de registrar en `ALLOWED`: `leia-avatar`, `leia-reel-braids`,
  `leia-reel-orange` (2,4 MB), `leia-reel-pumpkin`, `leia-reel-shark`.

## 7. Problemas conocidos / pendientes
1. **Generación de imágenes en Vercel no funciona**: `content/route.ts` escribe
   `._gen_once.ts` en la raíz y guarda en `public/generated-images`, y usa
   `/tmp` y procesos hijos. El FS de Vercel es de solo lectura. Hace falta
   almacenamiento externo (p. ej. Vercel Blob / Supabase Storage). En local sí funciona.
2. `next.config.ts` tiene `typescript.ignoreBuildErrors: true`. `src/` compila limpio
   con `npx tsc --noEmit`; se puede quitar. Quedan errores en `examples/` y `scripts/`
   (no son parte de la app).
3. Texto `\n` literal visible bajo el título en la pantalla de login (`login-screen.tsx`).
4. Seguridad: la contraseña antigua `avataria2024` está en el historial de git, en
   `docs/PROYECTO_BASE.md` y en `prisma/seed.ts`. Si estuvo en producción, cámbiala.
5. Usuario de la tabla `User`: solo el admin; no hay gestión de usuarios en la UI.
6. El script `start` usa `bun`; solo sirve para correr el build standalone en local.

## 8. Convenciones de trabajo
- Respuestas y UI en español. Cambios mínimos y quirúrgicos; verificar con
  `npx tsc --noEmit` antes de commitear.
- Los archivos tienen finales de línea CRLF (Windows): al editar por script, conservarlos.
- Commits en `main` con mensaje corto en inglés.
