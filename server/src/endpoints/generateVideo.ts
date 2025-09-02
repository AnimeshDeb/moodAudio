import express from 'express';
import { Request, Response } from 'express';
import { Mooddetection } from '../util/sentimentAnalysis/moodDetection.js';
import { generateVoiceover } from '../util/generateVoiceover.js';
import { createWriteStream } from 'fs';
import dotenv from 'dotenv';
import { savevoiceoverBuffer } from '../util/voiceBuffer.js';
import { voiceoverAndMusic } from '../util/voiceoverAndMusic.js';
import { Redis } from '@upstash/redis';
import { convertBufferRedis } from '../util/convertBufferRedis.js';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import getImages from '../util/getImages.js';
import { AddVisuals } from '../util/addVisuals.js';
dotenv.config();

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const {
    script,
    voiceValue,
    themeValue,
    musicValue,
    audienceValue,
    userEmail,
  } = req.body;

  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  if (
    !script ||
    !voiceValue ||
    !themeValue ||
    !musicValue ||
    !audienceValue ||
    !userEmail
  ) {
    return res.status(400).json({ error: 'Missing field' });
  }

  //If music tracks are not in redis, we store them there after converting them into strings from buffers
  if (musicValue == 'ambient') {
    const musicExists = await redis.exists(`music:${musicValue}`);
    if (musicExists == 0) {
      //converting to buffer
      const musicFileAbsolutePath = path.resolve(
        __dirname,
        '../musicTracks/ambient_345093.mp3'
      );

      //reading content of file to a buffer
      const bufferMusic = await fs.readFile(musicFileAbsolutePath);

      //converting buffer to string
      const convertedBufferMusic = await convertBufferRedis(bufferMusic);

      //storing music file track in redis as string

      await redis.set(`music: ambient`, convertedBufferMusic);
    }
  }

   if (musicValue == 'emotional') {
    const musicExists = await redis.exists(`music:${musicValue}`);
    if (musicExists == 0) {
      //converting to buffer
      const musicFileAbsolutePath = path.resolve(
        __dirname,
        '../musicTracks/emotional_333684.mp3'
      );

      //reading content of file to a buffer
      const bufferMusic = await fs.readFile(musicFileAbsolutePath);

      //converting buffer to string
      const convertedBufferMusic = await convertBufferRedis(bufferMusic);

      //storing music file track in redis as string

      await redis.set(`music: emotional`, convertedBufferMusic);
    }
  }
   if (musicValue == 'epic') {
    const musicExists = await redis.exists(`music:${musicValue}`);
    if (musicExists == 0) {
      //converting to buffer
      const musicFileAbsolutePath = path.resolve(
        __dirname,
        '../musicTracks/epic_364885.mp3'
      );

      //reading content of file to a buffer
      const bufferMusic = await fs.readFile(musicFileAbsolutePath);

      //converting buffer to string
      const convertedBufferMusic = await convertBufferRedis(bufferMusic);

      //storing music file track in redis as string

      await redis.set(`music: epic`, convertedBufferMusic);
    }
  }
   if (musicValue == 'uplifting') {
    const musicExists = await redis.exists(`music:${musicValue}`);
    if (musicExists == 0) {
      //converting to buffer
      const musicFileAbsolutePath = path.resolve(
        __dirname,
        '../musicTracks/uplifting_328600.mp3'
      );

      //reading content of file to a buffer
      const bufferMusic = await fs.readFile(musicFileAbsolutePath);

      //converting buffer to string
      const convertedBufferMusic = await convertBufferRedis(bufferMusic);

      //storing music file track in redis as string

      await redis.set(`music: uplifting`, convertedBufferMusic);
    }
  }
   

  //Get voiceover from script and combine with music

  
  //elevenlabs voice
  const voiceOver = await generateVoiceover(script, voiceValue);
  await savevoiceoverBuffer(voiceOver, userEmail);// voiceover buffer is stored as string in redis
  await voiceoverAndMusic(userEmail, musicValue);//combined voice and music buffer is stored as string in redis
  // await getImages(themeValue)
  await AddVisuals(userEmail, themeValue)
  

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
  return res.status(200).json({ message: 'No AI music processing is needed.' , scriptData: script});
});

export default router;
