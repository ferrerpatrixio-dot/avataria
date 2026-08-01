import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public');

const outfits = [
  {
    base: 'leia-reference.png',
    name: 'leia-outfit1-pool-glam.png',
    title: 'Outfit - Pool glam plateada',
    prompt: 'same woman, sparkly silver-grey halter-neck bikini top with deep V-cut and metallic ring connector, paired with low-rise heather-grey jersey shorts with white drawstring. Standing upright facing camera, one hand pulling at shorts waistband. Nighttime poolside setting with dark blue water, warm orange lights in background. Confident glamorous pool party vibe. Long loose wavy blonde hair. Full body visible.'
  },
  {
    base: 'leia-angle-frontal.png',
    name: 'leia-outfit2-corset-jeans.png',
    title: 'Outfit - Corset blanco + jeans',
    prompt: 'same woman, white long-sleeved button-up corset-style shirt with deep V-neckline and cropped hem revealing midriff, sleeves rolled to forearms. Light-wash denim jeans with copper buttons. Standing upright facing camera. Interior setting with glass block wall and warm natural light. Clean girl aesthetic. Long loose wavy hair over one shoulder. Full body visible.'
  },
  {
    base: 'leia-angle-34r.png',
    name: 'leia-outfit3-gingham-corset.png',
    title: 'Outfit - Gingham corset mediterráneo',
    prompt: 'same woman, black and white gingham corset-style top with white lace trim along neckline, thin cream straps, structured fitted bodice. White skirt at waist. Leaning left arm casually against stone pillar, standing 3/4 angle. Mediterranean terrace with beige stone columns and green foliage. Romantic coquette aesthetic. Long straight hair with highlights, middle part. Full body visible.'
  },
  {
    base: 'leia-reference.png',
    name: 'leia-outfit4-crop-denim-chair.png',
    title: 'Outfit - Crop gris + short denim',
    prompt: 'same woman, fitted light grey ribbed crop top with thin straps and low neckline, high-waisted light blue denim shorts with frayed hem and button fly. Seated on black chair, leaning back with right arm behind head. Outdoor tiled patio with concrete pillar, bright daylight. Post-swim casual aesthetic. Wet-look slicked back loose waves hair. Full body visible.'
  },
  {
    base: 'leia-angle-frontal.png',
    name: 'leia-outfit5-floral-cami.png',
    title: 'Outfit - Camisola floral verde',
    prompt: 'same woman, white spaghetti-strap camisole top with delicate green floral print, sweetheart neckline. Thin gold necklace with small circular pendant, small hoop earrings. Standing front-facing with subtle smile, head slightly tilted. Plain neutral-toned interior wall background. Fresh clean girl aesthetic. Long voluminous loose wavy blonde hair over both shoulders. Full body visible.'
  },
  {
    base: 'leia-reference.png',
    name: 'leia-outfit6-bikini-open-shirt.png',
    title: 'Outfit - Bikini + camisa abierta',
    prompt: 'same woman, colorful blue-yellow-white floral bikini top, high-waisted white denim shorts, unbuttoned white button-up shirt with rolled sleeves worn open over bikini. Gold necklace and bracelet. Mirror selfie pose, holding phone, three-quarter angle body. Bathroom with blue square wall tiles and window. Casual confident summer getting-ready vibe. Long straight ombre blonde hair loosely over shoulders. Full body visible.'
  },
  {
    base: 'leia-angle-frontal.png',
    name: 'leia-outfit7-white-bikini.png',
    title: 'Outfit - Bikini blanca',
    prompt: 'same woman, white triangle bikini top with thin straps and deep V-neckline, low-rise white denim shorts with button fly. Standing upright facing camera, arms relaxed, slight head tilt, soft smile with eyes gently closed. Interior with dark glass block wall grid pattern. Effortlessly radiant summery vibe. Long voluminous bouncy wavy blonde hair past shoulders. Full body visible.'
  },
  {
    base: 'leia-angle-frontal.png',
    name: 'leia-outfit8-halter-white-denim.png',
    title: 'Outfit - Halter blanca + denim',
    prompt: 'same woman, white halter-style bikini top with deep V-neckline and subtle ribbed texture, low-rise white denim bottoms. Delicate thin necklace with small pendant. Standing front-facing, shoulders relaxed, upright posture, eye contact. Interior with dark charcoal walls and translucent glass block grid. Polished summery glamorous vibe. Long voluminous wavy blonde hair with side part. Full body visible.'
  },
  {
    base: 'leia-angle-profile.png',
    name: 'leia-outfit9-pink-crop-back.png',
    title: 'Outfit - Crop rosa espalda',
    prompt: 'same woman, fitted light pink spaghetti-strap crop top, high-waisted white denim shorts with button fly and small red logo tag. Standing three-quarter back pose, looking back over right shoulder toward camera, left hand on hip. Bedroom with white walls, colorful sunflower painting, built-in wardrobes. Casual confident summery flirty vibe. Long voluminous wavy blonde hair with side part. Full body visible.'
  },
  {
    base: 'leia-angle-34r.png',
    name: 'leia-outfit10-pink-cami-side.png',
    title: 'Outfit - Camisola rosa perfil',
    prompt: 'same woman, light pink cropped camisole top with thin spaghetti straps and scalloped neckline, high-waisted white denim shorts with button fly and front pockets. Standing three-quarter side profile, left hand on thigh, weight on one leg, head turned to camera. Bedroom with white walls, colorful sunflower painting, bed with quilted cover. Clean girl casual summer vibe. Long straight blonde hair with center part. Full body visible.'
  },
];

async function run() {
  const zai = await ZAI.create();
  const results: {name: string; title: string; success: boolean; error?: string}[] = [];

  for (let i = 0; i < outfits.length; i++) {
    const o = outfits[i];
    try {
      console.log(`[${i+1}/${outfits.length}] Generating ${o.name}...`);
      const src = path.join(process.cwd(), 'public', o.base);
      const buf = fs.readFileSync(src);
      const dataUrl = 'data:image/png;base64,' + buf.toString('base64');

      const fullPrompt = o.prompt + '. NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos on clothing.';

      const res = await zai.images.generations.edit({
        prompt: fullPrompt,
        images: [{ url: dataUrl }],
        size: '1024x1024',
      });

      const imgBuf = Buffer.from(res.data[0].base64, 'base64');
      fs.writeFileSync(path.join(OUT_DIR, o.name), imgBuf);
      results.push({ name: o.name, title: o.title, success: true });
      console.log(`  ✓ Saved ${o.name} (${imgBuf.length} bytes)`);
    } catch (e: any) {
      console.error(`  ✗ Failed ${o.name}:`, e.message);
      results.push({ name: o.name, title: o.title, success: false, error: String(e.message || e) });
    }
  }

  fs.writeFileSync('/tmp/gen_outfits_result.json', JSON.stringify(results, null, 2));
  console.log('ALL DONE. Results saved.');
}

run();
