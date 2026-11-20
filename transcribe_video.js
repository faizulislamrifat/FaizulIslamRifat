import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const envContent = fs.readFileSync('C:/Users/hallo/AppData/Local/hermes/.env', 'utf8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.trim().split('=')[1];
  }
}

const ai = new GoogleGenAI({ apiKey });
async function run() {
  const p = 'D:/Faizul Islam Rifat/downloaded_reel.mp4';
  const videoBuffer = fs.readFileSync(p);
  console.log('Sending video to Gemini...');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          mimeType: 'video/mp4',
          data: videoBuffer.toString('base64')
        }
      },
      'Please listen to this video and provide an exact, word-for-word transcript/script of what is spoken in the video, in Bengali or English.'
    ]
  });
  console.log('TRANSCRIPT:\n', response.text);
}
run().catch(console.error);
