import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/images (4).jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait of a joyful latina woman with dark hair in a messy bun, wearing an orange sports outfit with black skull patterns, holding a large orange pumpkin against her chest. REMOVE ALL brand logos and text: no FightLikeAGirl text, no brand names. The orange outfit should have only skull patterns with NO text or logos. The background should be clean (boxing ring ropes should be plain black, no logos). Keep her face, smile, hair, the pumpkin, and her joyful expression exactly the same. Girl-next-door, warm, fun energy.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-reel-pumpkin.png', buffer);
  console.log('Photo #4 cleaned -> leia-reel-pumpkin.png');
}

main().catch(console.error);
