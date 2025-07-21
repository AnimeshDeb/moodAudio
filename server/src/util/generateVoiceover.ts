import dotenv from 'dotenv';
import { Readable } from 'stream';
import { ElevenLabs, ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
dotenv.config();

export async function generateVoiceover(script: string, voiceValue: string) {
  const xi_voice_api_key = process.env.XI_ALLVOICE_API_KEY;

  const elevenlabs = new ElevenLabsClient({
    apiKey: xi_voice_api_key,
  });

  const audioStream=await elevenlabs.textToSpeech.stream(`${voiceValue}`,{
    text:`${script}`,
    modelId:'eleven_multilingual_v2',
  });

  return audioStream

  
}
