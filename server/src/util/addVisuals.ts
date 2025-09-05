import ffmpeg from 'ffmpeg-static';
import { Redis } from '@upstash/redis';
import getImages from './getImages.js';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import fs from 'fs';
import { Readable } from 'stream';

dotenv.config();
/*
Code below forms an mp4 looped video (video long enough for the voiceover and music to be covered by the visuals).
mp4 video has no audio so we have to use another ffmpeg command in another file to move the audio in mp3 and add it to
mp4.


*/
export async function AddVisuals(userEmail: string, theme: string) {
  // Redis setup
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    throw new Error('Missing Redis credentials');
  }
  const redis = new Redis({ url: redisUrl, token: redisToken });

  // Get combined audio
  const combinedAudioString = await redis.get<string>(`${userEmail}:combined`);
  if (!combinedAudioString) return null;
  const combinedAudioBuffer = Buffer.from(combinedAudioString, 'base64');

  // Get images
  const imageArr = await getImages(theme);
  if (!imageArr.length) throw new Error('No images found for the theme.');

  // FFmpeg binary
  if (!ffmpeg) throw new Error('ffmpeg binary not found.');
  const ffmpegPath = ffmpeg as unknown as string;

  // Spawn FFmpeg
 // Spawn FFmpeg
const ff = spawn(
  ffmpegPath,
  [
    '-y',
    '-thread_queue_size', '512',

    // Images
    '-f', 'mjpeg',
    '-framerate', '1',
    '-i', 'pipe:4',

    // Audio (pipe:3 → explicitly MP3 format)
    '-f', 'mp3',
    '-i', 'pipe:3',

    // Encoding
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-movflags', 'frag_keyframe+empty_moov',
    '-f', 'mp4',
    'pipe:1',
  ],
  { stdio: ['pipe', 'pipe', 'inherit', 'pipe', 'pipe'] }
);


  if (!ff.stdout) throw new Error('ffmpeg stdout is null.');
  const audioPipe = ff.stdio[3] as NodeJS.WritableStream;
  const imagePipe = ff.stdio[4] as NodeJS.WritableStream;

  // ✅ Stream audio buffer without premature .end()
  const audioStream = Readable.from(combinedAudioBuffer);
  audioStream.pipe(audioPipe);
  audioStream.on('end',()=> audioPipe.end())

  const chunks: Buffer[] = [];
  ff.stdout.on('data', (d) => chunks.push(d));

  // ✅ Keep looping images until FFmpeg finishes
  (async () => {
    try {
      while (true) {
        for (const url of imageArr) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
          const buf = Buffer.from(await res.arrayBuffer());

          if (!imagePipe.write(buf)) {
            await new Promise<void>((resolve) =>
              imagePipe.once('drain', resolve)
            );
          }
        }
      }
    } catch (err) {
      console.error('Image loop error:', err);
    } finally {
      imagePipe.end();
    }
  })();

  // Wait for FFmpeg
  const videoBuffer: Buffer = await new Promise<Buffer>((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  fs.writeFileSync(`video_${userEmail}.mp4`, videoBuffer);

  

 
  console.log('Video saved as video.mp4');

  return videoBuffer;
}
