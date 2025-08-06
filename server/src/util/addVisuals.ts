import ffmpeg from 'ffmpeg-static';
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();
export async function AddVisuals( userEmail:string) {
  //get combined audio from redis
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if( !redisUrl || !redisToken){
    throw new Error('Missing required inputs or env variables when adding visuals to combined audio.')
  }
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
  const combinedAudioString=await redis.get<string>(`${userEmail}:combined`);
  if(!combinedAudioString) return null 

  //converting string to buffer for processing

   const combinedAudioBuffer = Buffer.from(combinedAudioString, 'base64'); //converting combined audio string into buffer decoded

   //process buffer using ffmpeg static and combine with visuals received from pixabay or something similar...


}
