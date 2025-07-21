import { fileURLToPath } from 'url';
import path from 'path';
import { writeFile } from 'fs/promises';


async function streamToBuffer(asyncIterable: AsyncIterable<Uint8Array>) {
  const chunks: Buffer[] = [];
  for await (const chunk of asyncIterable) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function saveVoiceBuffer(voiceStream: AsyncIterable<Uint8Array>, outpath: string) {
  const voiceBuffer = await streamToBuffer(voiceStream);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const safeBaseDirectory = path.resolve(__dirname, '../musicTracks/voiceover');
  const resolvedPath = path.resolve(safeBaseDirectory, outpath);

  if (!resolvedPath.startsWith(safeBaseDirectory + path.sep)) {
    throw new Error('Attempted path traversal detected. Invalid output path.');
  }

  const outputDir = path.dirname(resolvedPath);
  await import('fs/promises').then(fs => fs.mkdir(outputDir, { recursive: true }));

  await writeFile(resolvedPath, voiceBuffer);
}
