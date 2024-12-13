import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

/**
 * Combines audio from one MP4 file with the video from another MP4 file.
 * @param videoPath - Path to the MP4 file containing the video.
 * @param audioPath - Path to the MP4 file containing the audio.
 * @param outputPath - Path to save the combined output MP4 file.
 * @returns A Promise that resolves when the operation is complete.
 */
export const combineAudioAndVideo = (videoPath: string, audioPath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(['-c:v copy', '-c:a aac', '-strict experimental'])
      .on('progress', (progress) => {
         // Clear the current line and print the updated progress
         process.stdout.clearLine(0); 
         process.stdout.cursorTo(0);
         process.stdout.write(`Processing: ${progress.percent?.toFixed(2)}% done`);
      })
      .on('end', () => {
        console.log(`Audio and video combined successfully! Output saved to ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during combination:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
};

/**
 * Checks if an MP4 file contains an audio stream.
 * @param filePath - Path to the MP4 file.
 * @returns A Promise that resolves with a boolean indicating whether the file contains audio.
 */
export const hasAudioStream = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject('Error probing file: ' + err.message);
        return;
      }

      // Check the streams for audio
      const audioStream = metadata.streams.find((stream) => stream.codec_type === 'audio');
      if (audioStream) {
        resolve(true); // Contains audio stream
      } else {
        resolve(false); // No audio stream
      }
    });
  });
};
