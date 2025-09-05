import dotenv from 'dotenv';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import fs from 'fs';

dotenv.config();
export async function mergeAudioVideo(userEmail: string) {
  if (!ffmpeg) throw new Error('ffmpeg binary not found.');
  const ffmpegPath = ffmpeg as unknown as string;

  await new Promise<void>((resolve, reject) => {
    const ff = spawn(ffmpegPath, [
      '-i', `video_${userEmail}.mp4`,
      '-i', `combined_output_${userEmail}.mp3`,
      '-c:v', 'copy',    // copy video
      '-c:a', 'aac',     // encode audio
      '-b:a', '192k',    // audio bitrate
      '-map', '0:v:0',
      '-map', '1:a:0',
      `output_${userEmail}.mp4`
    ], { stdio: 'inherit' });

    ff.on('error', reject);
    ff.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  console.log(`Merged video saved as output_${userEmail}.mp4`);
}

