import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/public/leia-reel-braids.png');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait of a happy latina woman with dark hair in two long braids, wearing a black sleeveless crop top, gold dangling earrings and gold bracelet, holding a gray shark plushie in left arm and a plain black microphone with NO logos in right hand. REMOVE the UFC logo from the microphone - make it a completely plain black microphone with zero text or logos. Background is clean dark with NO text or brands. Keep everything else exactly the same.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-reel-braids.png', buffer);
  console.log('Mic logo removed');
}

main().catch(console.error);
