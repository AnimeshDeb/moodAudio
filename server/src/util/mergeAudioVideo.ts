// import dotenv from 'dotenv';
// import ffmpeg from 'ffmpeg-static';
// import { spawn } from 'child_process';

// dotenv.config();

// export async function mergeAudioVideo(userEmail: string) {
//   const ffmpegPath = ffmpeg as unknown as string;

//   await new Promise<void>((resolve, reject) => {
//     const ff = spawn(
//       ffmpegPath,
//       [
//         '-y',
//         '-i', `video_${userEmail}.mp4`,
//         '-i', `combined_output_${userEmail}.mp3`,
//         '-c:v', 'libx264',        // full re-encode video
//         '-pix_fmt', 'yuv420p',
//         '-c:a', 'aac',             // convert audio
//         '-b:a', '192k',
//         '-map', '0:v:0',           // video from first input
//         '-map', '1:a:0',           // audio from second input
//         '-shortest',
//         `output_${userEmail}.mp4`
//       ],
//       { stdio: 'inherit' }
//     );

//     ff.on('error', reject);
//     ff.on('close', (code) => {
//       if (code === 0) resolve();
//       else reject(new Error(`ffmpeg exited with code ${code}`));
//     });
//   });

//   console.log(`Merged video saved as output_${userEmail}.mp4`);
// }
