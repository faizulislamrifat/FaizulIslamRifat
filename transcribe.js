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
  const p = 'C:/Users/hallo/AppData/Local/hermes/cache/documents/native-inputs/94a253815ab1fa46b394812a59c09a109ab88a8def8f84756bc3a1c8f68c6869/audio_e54c1b6318d5.ogg';
  const audioBuffer = fs.readFileSync(p);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          mimeType: 'audio/ogg',
          data: audioBuffer.toString('base64')
        }
      },
      'Please transcribe this audio message accurately in Bengali or English. Return only the exact transcription text.'
    ]
  });
  console.log('TRANSCRIPTION:', response.text);
}
run().catch(console.error);
