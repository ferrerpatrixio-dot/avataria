import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/pasted_image_1785548412810.jpg');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Portrait photo of a confident smiling latina woman with dark hair in a bun, holding a microphone. REMOVE all brand logos and trademarks from her clothing - no UFC, no Venum, no brand names. The black athletic jacket should have subtle abstract white geometric patterns but NO text, NO brand logos, NO trademarked symbols anywhere. The microphone should be plain black with NO logos. Keep her face, expression, hair, pose, and dark gray background exactly the same. This should look like a generic athletic wear photo with no identifiable brands whatsoever.',
    images: [{ url: dataUrl }],
    size: '1024x1024'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/public/leia-avatar-clean.png', buffer);
  console.log('Avatar cleaned and saved to /home/z/my-project/public/leia-avatar-clean.png');
}

main().catch(console.error);
