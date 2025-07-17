import express from 'express';
import { Request, Response } from 'express';
import { Mooddetection } from '../util/sentimentAnalysis/moodDetection.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { script, voiceValue, personaValue, musicValue, audienceValue } =
    req.body;
  if (
    !script ||
    !voiceValue ||
    !personaValue ||
    !musicValue ||
    !audienceValue
  ) {
    return res.status(400).json({ error: 'Missing field' });
  }
  if (musicValue == 'AI_music') {
    //If 'AI_music' is chosen, based on the detected mood, we get the appropriate music background track.
    //Otherwise the background music will be one of the selected ones.
    try {
      const overallMood = await Mooddetection(script);
      return res.json({ data: overallMood });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to detect mood.' });
    }
  }
  return res.status(200).json({ message: 'No AI music processing is needed.' });
});

export default router
