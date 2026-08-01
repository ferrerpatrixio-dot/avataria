
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const zai = await ZAI.create();
    const buf = fs.readFileSync('/home/z/my-project/public/leia-reference.png');
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
    const res = await zai.images.generations.edit({
      prompt: "same person, natural slight variation in expression and lighting, same vibe. NOT athletic, NOT muscular, NOT fighting pose. NO UFC, NO MMA, NO brand logos.",
      images: [{ url: dataUrl }],
      size: '1024x1024',
    });
    const imgBuf = Buffer.from(res.data[0].base64, 'base64');
    fs.writeFileSync('/home/z/my-project/public/generated-images/leia_1785567816901.png', imgBuf);
    console.log('OK:' + '/generated-images/leia_1785567816901.png');
  } catch(e: any) {
    console.error('FAIL:' + (e.message || String(e)));
    process.exit(1);
  }
}
run();
