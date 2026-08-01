import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/pasted_image_1785547216913.jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Athletic portrait of a determined latina woman with long dark braided hair, wearing a white sports top and black athletic shorts. REMOVE ALL brand logos and trademarks: no UFC text on the top, no UFC on the shorts waistband, no brand labels anywhere. The white sports top should have only subtle geometric patterns with NO text. The black shorts should be plain with NO logos or text. Remove any hand wraps/gloves if visible. Keep her face, expression, hair, pose, body, and the overall athletic look exactly the same. Background should be clean with absolutely no brand elements.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-avatar-athletic.png', buffer);
  console.log('Athletic avatar cleaned');
}

main().catch(console.error);
