# Protocolo de Generación de Fotos — Fase 0

> **Objetivo:** Generar fotos del avatar que sean atractivas, coherentes y sirvan como base para el contenido de validación.

---

## 1. FOTOS DE REFERENCIA DEL USUARIO

**Ubicación:** `C:\Users\ferre\Proyectos\AVATARIA\fotosej`

⚠️ **IMPORTANTE:** Estas fotos son de una persona real. NO se usarán directamente.
- Se analizan para **extraer características físicas** (cabello, complexión, rasgos)
- Un LLM con capacidad visual analiza las fotos
- Se extraen los rasgos clave que hacen atractiva a la persona
- Se genera un **avatar completamente nuevo** inspirado en esos rasgos

### Proceso
1. Subir fotos al LLM con VLM (visión)
2. El LLM describe las características físicas relevantes
3. El asesor de mercado recomienda qué características resaltar
4. Se genera el avatar IA con prompt detallado
5. Se iteran hasta lograr la estética deseada

---

## 2. TIPOS DE FOTO A GENERAR (Fase 0)

### Grupo A: Identidad (3 fotos mínimas)
| # | Descripción | Uso | Prioridad |
|---|-------------|-----|----------|
| 1 | Retrato close-up, mirando a cámara, sonrisa sutil | Perfil, thumbnail | ALTA |
| 2 | Retrato medio, gym/casual, actitud segura | TikTok hooks | ALTA |
| 3 | Retrato 3/4, estilo "office chic", sonrisa | Contenido tech | ALTA |

### Grupo B: Escenarios (2-3 fotos)
| # | Descripción | Uso | Prioridad |
|---|-------------|-----|----------|
| 4 | En couch con laptop, mirada pensativa | Contenido "behind the scenes" | MEDIA |
| 5 | Con ropa deportiva, gym o al aire libre | Contenido deportivo | MEDIA |
| 6 | Casual, con cafe, estilo "callejera" | Contenido cercano | BAJA |

### Grupo C: Variaciones (solo si Grupo A valida)
| # | Descripción | Uso | Prioridad |
|---|-------------|-----|----------|
| 7 | Nocturno, look elegante | Contenido premium | BAJA |
| 8 | Con accesorio deportivo (gorra/team) | Contenido fútbol/MMA | MEDIA |

---

## 3. PARÁMETROS DE GENERACIÓN

### Consistencia del Avatar
Para que el avatar sea reconocible en TODAS las fotos:

```
RASGOS FIJOS (no cambian entre fotos):
- Tipo de rostro y proporciones
- Color y estilo de cabello
- Color de ojos
- Tono de piel
- Rasgos distintivos (lunar, dimples, etc.)

VARIABLES (cambian por foto):
- Ropa y estilo
- Escenario/ambiente
- Expresión facial
- Iluminación y ángulo
- Postura
```

### Prompt Base (ajustar después de analizar fotos del usuario)
```
Photorealistic portrait of a [DESCRIPCIÓN DEL ROSTRO BASADA EN FOTOS].
[EDAD] years old, Mexican woman.
[ESTILO DE CABELLO].
[RASGOS DISTINTIVOS].
Wearing [ROPA].
[ESCENARIO].
Cinematic lighting, shot with Sony A7III, 85mm f/1.4.
Shallow depth of field, 8K quality.
Natural skin texture, no plastic look.
```

---

## 4. VOZ (Parámetros para ElevenLabs)

### Cuando se evalúe (solo si Fase 0 avanza)
| Parámetro | Valor Deseado |
|-----------|-------------|
| Acento | Mexicano (neutro CDMX) |
| Tono | Juvenil (24-27), confidente |
| Velocidad | Media-alta (energía) |
| Emoción base | Ligeramente sarcástica |
| Claridad | Alta, sin artificios |