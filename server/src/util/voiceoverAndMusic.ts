import { execFile } from 'child_process';
import util from 'util';
import path from 'path';
import * as fs from 'fs/promises'; // Import the promises API for fs
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';

export async function voiceoverAndMusic(
  musicfile: string,
  voiceoverfile: string,
  outpath: string
) {
  if (!ffmpegPath || typeof ffmpegPath !== 'string') {
    throw new Error('FFmpeg binary not found or invalid type');
  }

  const execFileAsync = util.promisify(execFile);
  // __filename equivalent in ES modules
  const __filename = fileURLToPath(import.meta.url);
  // __dirname equivalent in ES modules
  const __dirname = path.dirname(__filename);
  // Define secure base directories for inputs and outputs
  const safeBaseInputDirectory = path.resolve(__dirname, '../musicTracks');
  const safeBaseOutputDirectory = path.resolve(__dirname, '../processed_audio');

  // Ensure base directories exist
  await fs.mkdir(safeBaseInputDirectory, { recursive: true });
  await fs.mkdir(safeBaseOutputDirectory, { recursive: true });

  // --- Validate Input Paths ---
  const validateAndResolvePath = async (
    filePath: string,
    baseDir: string,
    type: 'input' | 'output'
  ): Promise<string> => {
    const resolvedPath = path.resolve(baseDir, filePath);

    // Critical security check: Ensure the resolved path is within the base directory
    if (!resolvedPath.startsWith(baseDir + path.sep)) {
      throw new Error(
        `Attempted path traversal detected for ${type} file: ${filePath}`
      );
    }

    if (type === 'input') {
      try {
        // For input files, verify they exist and are actual files
        const stats = await fs.stat(resolvedPath);
        if (!stats.isFile()) {
          throw new Error(`Input path ${filePath} is not a valid file.`);
        }
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          throw new Error(`Input file not found: ${filePath}`);
        }
        throw error; // Re-throw other file system errors
      }
    } else if (type === 'output') {
      // For output files, ensure the parent directory exists
      const outputDir = path.dirname(resolvedPath);
      await fs.mkdir(outputDir, { recursive: true });
    }

    return resolvedPath;
  };

  let validatedMusicFile: string;
  let validatedVoiceoverFile: string;
  let validatedOutPath: string;

  try {
    validatedMusicFile = await validateAndResolvePath(
      musicfile,
      safeBaseInputDirectory,
      'input'
    );
    validatedVoiceoverFile = await validateAndResolvePath(
      voiceoverfile,
      safeBaseInputDirectory,
      'input'
    );
    validatedOutPath = await validateAndResolvePath(
      outpath,
      safeBaseOutputDirectory,
      'output'
    );
  } catch (validationError) {
    console.error(
      'File path validation error: ',
      (validationError as Error).message
    );
    throw validationError; // Re-throw to prevent function from proceeding
  }
  //
  const command: string = ffmpegPath; // assert type after the check
  // Construct the command and arguments using the validated paths

  const args = [
    '-i',
    validatedVoiceoverFile,
    '-i',
    validatedMusicFile,
    '-filter_complex',
    '[1:a]volume=0.3[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2',
    '-c:a',
    'libmp3lame',
    '-q:a',
    '4',
    validatedOutPath,
  ];

  try {
    const { stdout, stderr } = await execFileAsync(command, args);
    console.log('Combined audio saved to: ', validatedOutPath);
    if (stdout) console.log('FFmpeg stdout:', stdout);
    if (stderr) console.error('FFmpeg stderr:', stderr);
  } catch (error: any) {
    console.error('FFmpeg error: ', error.message || error);
    if (error.code) {
      console.error('FFmpeg exit code:', error.code);
    }
    if (error.stdout) {
      console.error('FFmpeg stdout on error:', error.stdout);
    }
    if (error.stderr) {
      console.error('FFmpeg stderr on error:', error.stderr);
    }
  }
}
