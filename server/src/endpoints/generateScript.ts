import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
const router = express.Router();
dotenv.config();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { prompt, audience, theme} = req.body;
  const scriptGemini = process.env.GEMINI_2_5_FLASH_KEY;

  if (!audience) {
    return res.status(400).json({ error: 'No prompt received.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt received.' });
  }
  if (!scriptGemini) {
    return res.status(400).json({ error: 'Script key not found.' });
  }
  try {
    const ai = new GoogleGenAI({ apiKey: scriptGemini });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
            role:'user',
            parts:[
                {
                    text:`You are a professional motivational scriptwriter. Your job is
                    to write compelling, emotionally powerful scripts for short-form podcasts (30-60 seconds)
                    that deeply inspire and connect with viewers. The length of the script should be a maximum of 800 characters. Write in a confident, uplifting tone. Use 
                    vivid language, short punchy sentences, and strong emotional hooks. Start with a powerful line that captures attention. 
                    Build up to a motivational climax. End with a message of hope, strength,
                    or call to action. Only output the script - no explanations, no title. Here is the core idea ${prompt}. Here is the target audience ${audience}. 
                    Here is the theme of the podcast ${theme}. `
                }
            ],
        },
      ],
    });
    const aiAnswer=await response.text

    return res.json({data:aiAnswer})
    
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router
