import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const GEN_DIR = path.join(process.cwd(), 'public')
const ANTI = '. NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos.'

const variations = [
  { src: 'leia-reference.png',     out: 'leia-expr-calm.png',       prompt: 'neutral calm expression, relaxed face, no smile, soft gaze, natural everyday look' + ANTI },
  { src: 'leia-angle-frontal.png', out: 'leia-expr-soft-smile.png', prompt: 'gentle warm soft smile, kind eyes, friendly approachable expression, slight head tilt' + ANTI },
  { src: 'leia-angle-34r.png',     out: 'leia-expr-playful.png',    prompt: 'playful cheeky expression, slight smirk, one eyebrow raised, confident fun vibe' + ANTI },
  { src: 'leia-angle-34l.png',     out: 'leia-expr-serious.png',    prompt: 'serious confident gaze, strong eye contact, powerful piercing look, no smile' + ANTI },
  { src: 'leia-angle-profile.png', out: 'leia-expr-smirk.png',      prompt: 'subtle smirk, mysterious half smile, confident side profile, elegant attitude' + ANTI },
  { src: 'leia-angle-profile-right.png', out: 'leia-expr-laugh.png', prompt: 'candid natural laugh, genuine joyful expression, eyes slightly closed laughing, warm happy vibe' + ANTI },
  { src: 'leia-angle-looking-up.png', out: 'leia-expr-dreamy.png',  prompt: 'dreamy soft expression, eyes half closed, sensual gentle look, gazing upward, romantic mood' + ANTI },
]

async function main() {
  const zai = await ZAI.create()
  console.log('ZAI ready')

  for (const v of variations) {
    const srcPath = path.join(GEN_DIR, v.src)
    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP ${v.src} not found`)
      continue
    }
    console.log(`Generating ${v.out}...`)
    const buf = fs.readFileSync(srcPath)
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64')

    try {
      const res = await zai.images.generations.edit({
        prompt: v.prompt,
        images: [{ url: dataUrl }],
        size: '1024x1024',
      })
      const imgBuf = Buffer.from(res.data[0].base64, 'base64')
      fs.writeFileSync(path.join(GEN_DIR, v.out), imgBuf)
      console.log(`  DONE: ${v.out} (${imgBuf.length} bytes)`)
    } catch (e: any) {
      console.error(`  FAIL ${v.out}: ${e.message}`)
    }
  }
  console.log('ALL DONE')
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
