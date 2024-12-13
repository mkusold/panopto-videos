import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

/**
 * Converts a video file to MP4 format.
 * @param inputPath - Path to the input video file.
 * @param outputPath - Path to save the output MP4 file.
 * @returns A Promise that resolves when the conversion is complete.
 */
export const convertToMp4 = (inputPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp4') // Convert to MP4 format
      .on('start', (commandLine) => {
        console.log('FFmpeg process started:', commandLine);
      })
      .on('progress', (progress) => {
        // console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
      })
      .on('end', () => {
        console.log('Conversion completed successfully!');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during conversion:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
};