import { spawn } from 'child_process';
import { Readable } from 'stream';
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import ffmpeg from 'ffmpeg-static';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
dotenv.config();

export async function voiceoverAndMusic(
  userEmail: string,
  musicfilePath: string
): Promise<Buffer | null> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  
  const musicFileAbsolutePath = path.resolve(
    __dirname,
    '../musicTracks/ambient_345093.mp3'
  );

  const ffmpegPath = ffmpeg as unknown as string;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (
    !redisUrl ||
    !redisToken ||
    !userEmail ||
    !musicfilePath ||
    !ffmpegPath ||
    !ffmpeg
  ) {
    throw new Error('Missing required inputs or environment variables.');
  }

  const redis = new Redis({ url: redisUrl, token: redisToken });

  // fetching voiceover from redis
  const base64 = await redis.get<string>(userEmail);
  if (!base64) return null;

  const voiceBuffer = Buffer.from(base64, 'base64');

  // starting ffmpeg
  return new Promise<Buffer>((resolve, reject) => {
    //using spawn because we are processing in memory the audio instead of saving to files
    const ffmpeg = spawn(ffmpegPath!, [
      '-y',
      '-i',
      'pipe:0', // voiceover from stdin
      '-i',
      musicFileAbsolutePath, // music from disk
      '-filter_complex',
      '[1:a]volume=0.3[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2',
      '-f',
      'mp3', // output format
      'pipe:1', // output to stdout
    ]);

    const outputChunks: Buffer[] = [];

    ffmpeg.stdout.on('data', (chunk) => outputChunks.push(chunk));
    ffmpeg.stderr.on('data', (data) => process.stderr.write(data)); // log errors
    ffmpeg.on('error', reject);
    ffmpeg.on('close', async (code) => {
      if (code === 0) {
        const finalBuffer = Buffer.concat(outputChunks);
        const encoded = finalBuffer.toString('base64');
        await redis.set(`${userEmail}:combined`, encoded); // save final combined audio result to redis encoded 

        //writing combined audio to file 
        const combinedBase64=await redis.get<string>(`${userEmail}:combined`);//getting combined audio string from redis
        if (!combinedBase64) return null 

        const combinedAudioBuffer=Buffer.from(combinedBase64, 'base64')//converting combined audio string into buffer decoded

        await fs.writeFile('combined_output.mp3', combinedAudioBuffer);
        console.log('Audio saved to combined_output.mp3');

        resolve(combinedAudioBuffer);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    // Piping voiceover to stdin so that ffmpeg can process it
    Readable.from(voiceBuffer).pipe(ffmpeg.stdin);
  });
}
