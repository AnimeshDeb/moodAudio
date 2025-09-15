import { fileURLToPath } from 'url';
import path from 'path';
import { writeFile } from 'fs/promises';
import { Redis } from '@upstash/redis';
import { convertBufferRedis } from './convertBufferRedis.js';
import dotenv from 'dotenv'
dotenv.config()
async function streamToBuffer(asyncIterable: AsyncIterable<Uint8Array>) {
  const chunks: Buffer[] = [];
  for await (const chunk of asyncIterable) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function savevoiceoverBuffer(voiceStream: AsyncIterable<Uint8Array>, userEmail: string) {
  const voiceoverBuffer = await streamToBuffer(voiceStream);//voiceoverBuffer is a Buffer object
  const redisUrl=process.env.UPSTASH_REDIS_REST_URL
  const redisToken=process.env.UPSTASH_REDIS_REST_TOKEN
  if(!redisUrl){
    throw new Error('No redis url received.')
  }
  if(!redisToken){
    throw new Error('No redis token received.')
  }

  const redis=new Redis({
    url: redisUrl,
    token: redisToken,
  })
  const userExists=await redis.exists(userEmail)
  if(userExists === 0){
    const convertedBufferAudio=await convertBufferRedis(voiceoverBuffer);//redis needs everything to be a string so we convert buffer to a string (base64)
    await redis.set(userEmail, convertedBufferAudio );
  }
 

 
}
