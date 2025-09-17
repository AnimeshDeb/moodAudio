// import ffmpeg from 'ffmpeg-static';
// import ffprobe from 'ffprobe-static';
// import { spawn } from 'child_process';
export {};
// export default async function inspectStream(file: string) {
//   return new Promise<void>((resolve, reject) => {
//     const probe = spawn(ffprobe.path, ['-hide_banner', '-i', file], { stdio: 'inherit' });
//     probe.on('close', (code) => {
//       if (code === 0) resolve();
//       else reject(new Error(`ffprobe exited with code ${code}`));
//     });
//   });
// }
