import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/images (5).jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait of a happy latina woman with long dark wavy hair, wearing an orange and white striped sweater, holding a gray shark plushie toy. REMOVE ALL brand logos and text: no UFC, no UFC.COM, no brand names visible anywhere. The sweater should have only orange and white horizontal stripes with NO text. The background should be clean dark with NO logos, NO text, NO UFC branding. Keep her face, expression, hair, the shark plushie, and her jewelry (silver necklace, small earrings) exactly the same. She should look warm, approachable, girl-next-door vibe.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-reel-shark.png', buffer);
  console.log('Photo #5 cleaned -> leia-reel-shark.png');
}

main().catch(console.error);
