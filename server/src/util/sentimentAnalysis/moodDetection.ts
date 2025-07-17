import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

export async function Mooddetection(text: string) {
  const hfApi = process.env.HF_API_KEY;
  const moods=[]
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
  return overallMood

  // //Splitting into two sentences from string and analyzing mood for these

  // //dividing into groups of 2 sentences

  // const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [];
  // const result = [];

  // for (let i = 0; i < sentences.length; i += 2) {
  //   const group = sentences[i] + (sentences[i + 1] || '');
  //   result.push(group.trim());
  // }

  // //getting mood of each group 
  // for (let i = 0; i < result.length; i++) {
   
  //   const subOutput = await client.textClassification({
  //     model: 'j-hartmann/emotion-english-distilroberta-base',
  //     inputs: `${result[i]}`,
  //     provider: 'hf-inference',
  //   });

  //   subOutput.sort((a, b) => b.score - a.score);
    
  //   if(subOutput[0].score <0.70){
  //     moods.push(overallMood)
  //   }
  //   else{
  //     moods.push(subOutput[0].label)
  //   }

  // }

}
