import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();
export async function Mooddetection(text) {
    const hfApi = process.env.HF_API_KEY;
    const moods = [];
    if (!hfApi) {
        console.log('NO key exists');
    }
    const client = new InferenceClient(hfApi);
    const output = await client.textClassification({
        model: 'j-hartmann/emotion-english-distilroberta-base',
        inputs: `${text}`,
        provider: 'hf-inference',
    });
    output.sort((a, b) => b.score - a.score);
    const overallMood = output[0].label;
    return overallMood;
}
