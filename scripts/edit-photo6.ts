import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/images (6).jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait of a happy latina woman with dark hair in two long braids, wearing a black sleeveless crop top, gold dangling earrings and gold bracelet, holding a gray shark plushie. REMOVE ALL brand logos and text: no UFC, no @UFC, no brand names visible anywhere. The background should be clean dark with absolutely NO logos, NO text, NO UFC branding. Keep her face, smile, braids, shark plushie, gold jewelry exactly the same. Warm, approachable, joyful energy.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-reel-braids.png', buffer);
  console.log('Photo #6 cleaned -> leia-reel-braids.png');
}

main().catch(console.error);
