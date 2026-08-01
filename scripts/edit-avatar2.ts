import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/public/leia-avatar-clean.png');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait of a confident smiling latina woman with dark hair in a bun holding a plain black microphone. REMOVE the UFC logo text visible in the background (left side). The background should be a solid dark gray color with absolutely NO text, NO logos, NO brand names, NO letters anywhere. Her black athletic jacket with white abstract patterns has NO logos. Keep her face, expression, hair, pose, body, and clothing exactly the same. Only change: make background completely clean dark gray with zero text or logos.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-avatar-clean.png', buffer);
  console.log('Background cleaned');
}

main().catch(console.error);
