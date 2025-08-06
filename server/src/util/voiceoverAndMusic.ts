import { spawn } from 'child_process';
import { Readable } from 'stream';
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import ffmpeg from 'ffmpeg-static';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { Writable } from 'stream';
dotenv.config();

export async function voiceoverAndMusic(
  userEmail: string,
  musicValue: string
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
    !musicValue ||
    !ffmpegPath ||
    !ffmpeg
  ) {
    throw new Error('Missing required inputs or environment variables.');
  }

  const redis = new Redis({ url: redisUrl, token: redisToken });

  // fetching voiceover from redis
  const base64 = await redis.get<string>(userEmail);
  console.log('base64 string: ', base64);
  if (!base64) return null;

  //fetching music track from redis

  const music64 = await redis.get<string>(`music: ${musicValue}`);
  console.log('music64 string: ', music64);
  if (!music64) return null;

  const musicBuffer = Buffer.from(music64, 'base64');

  const voiceBuffer = Buffer.from(base64, 'base64');

  // starting ffmpeg
  return new Promise<Buffer>((resolve, reject) => {
    //using spawn because we are processing in memory the audio instead of saving to files
    const ffmpeg = spawn(
      ffmpegPath!,
      [
        '-y',
        '-i',
        'pipe:0', // voiceover from stdin
        '-i',
        'pipe:3', //music from stdin
        '-filter_complex',
        '[1:a]volume=0.3[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2',
        '-f',
        'mp3', // output format
        'pipe:1', // output to stdout
      ],
      {
        stdio: ['pipe', 'pipe', 'inherit', 'pipe'], //stdin, stdout, stderr, pipe:3
      }
    );

    const outputChunks: Buffer[] = [];
    if (!ffmpeg.stdout) return reject(new Error('ffmpeg stdout is null'));
    ffmpeg.stdout.on('data', (chunk) => outputChunks.push(chunk));
    // ffmpeg.stderr.on('data', (data) => process.stderr.write(data)); // log errors
    ffmpeg.on('error', reject);
    ffmpeg.on('close', async (code) => {
      if (code === 0) {
        const finalBuffer = Buffer.concat(outputChunks);
        const encoded = finalBuffer.toString('base64');
        await redis.set(`${userEmail}:combined`, encoded); // save final combined audio result to redis encoded

        await redis.del(userEmail); //deleting voiceover of text from redis

        //writing combined audio to file
        const combinedBase64 = await redis.get<string>(`${userEmail}:combined`); //getting combined audio string from redis
        if (!combinedBase64) return null;

        const combinedAudioBuffer = Buffer.from(combinedBase64, 'base64'); //converting combined audio string into buffer decoded

        await fs.writeFile('combined_output.mp3', combinedAudioBuffer);
        console.log('Audio saved to combined_output.mp3');

        resolve(combinedAudioBuffer);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    // Piping voiceover to stdin so that ffmpeg can process it
    // Voiceover stream (pipe:0)
    const voiceStream = Readable.from(voiceBuffer);
    voiceStream.pipe(ffmpeg.stdin!);
    voiceStream.on('end', () => {
      ffmpeg.stdin?.end(); // important to signal end of input
    });

    // Music stream (pipe:3)
    const musicStream = Readable.from(musicBuffer);
    const musicStdin = ffmpeg.stdio[3] as Writable;
    musicStream.pipe(musicStdin);
    musicStream.on('end', () => {
      musicStdin.end(); // important to avoid pipe closure issues
    });

    // Optional: Add error listeners
    ffmpeg.stdin?.on('error', (err) => console.error('stdin error:', err));
    musicStdin.on('error', (err) => console.error('music pipe error:', err));
  });
}
