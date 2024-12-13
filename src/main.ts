import path from "path";
import { convertToMp4 } from "./fileConverter";
import fs from 'fs/promises';
import { hasAudioStream, combineAudioAndVideo } from "./combiner";

/**
 * Recursively scans a folder for `.mkv` files, and converts them to `.mp4` in the output folder.
 * @param inputDir - Path to the input directory.
 * @param outputDir - Path to the output directory.
 */
const convertInput = async (inputDir: string, outputDir: string) => {
  try {
    const items = await fs.readdir(inputDir, { withFileTypes: true });

    for (const item of items) {
      const inputPath = path.join(inputDir, item.name);
      const outputPath = path.join(outputDir, item.name);

      if (item.isDirectory()) {
        // Create the mirrored directory in the output folder
        await fs.mkdir(outputPath, { recursive: true });
        // Recursively process the nested directory
        await convertInput(inputPath, outputPath);
      } else if (path.extname(item.name).toLowerCase() === '.mkv') {
        // Ensure the output file has an .mp4 extension
        const outputFilePath = path.join(outputDir, path.basename(item.name, '.mkv') + '.mp4');

        try {
          // Check if the output file already exists
          await fs.access(outputFilePath).catch(() => null); // Catching the error to check existence

          // If the file doesn't exist, convert it
          if (outputFilePath) {
            console.log(`Converting ${inputPath} to ${outputFilePath}`);
            await convertToMp4(inputPath, outputFilePath);
          } else {
            console.log(`${outputFilePath} already exists, skipping conversion.`);
          }
        } catch (err) {
          console.error(`Failed to check or convert ${inputPath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error processing folder:', err);
  }
};

/**
 * Scans the output folder for `.mp4` files, finds the first video with and without audio,
 * and combines them into a single file.
 * @param outputFolder - Path to the output directory.
 */
const combineVideoAndAudio = async (outputFolder: string) => {
  try {
    const items = await fs.readdir(outputFolder, { withFileTypes: true });

    // Loop through each folder in the output directory
    for (const item of items) {
      const folderPath = path.join(outputFolder, item.name);

      if (item.isDirectory()) {
        let mp4WithAudio: string  | undefined = undefined;
        let mp4WithoutAudio: string | undefined = undefined;

        // Check for .mp4 files in the folder
        const subItems = await fs.readdir(folderPath);

        for (const subItem of subItems) {
          const subItemPath = path.join(folderPath, subItem);
          if (path.extname(subItem.toLowerCase()) === '.mp4') {
            const hasAudio = await hasAudioStream(subItemPath);
            if (hasAudio) {
              if (!mp4WithAudio){
                mp4WithAudio = subItemPath;
              }
            } else {
              if(!mp4WithoutAudio){
                mp4WithoutAudio = subItemPath;
              }
            }
          }
          if(mp4WithAudio && mp4WithoutAudio){
            break;
          }
        }

        // If we have at least one file with audio and one without, combine them
        if (mp4WithAudio && mp4WithoutAudio) {
          const audioFile = mp4WithAudio; // First file with audio
          const videoFile = mp4WithoutAudio; // First file without audio
          const outputFilePath = path.join(folderPath, `${item.name}.mp4`);

          console.log(`Combining audio from ${audioFile} and video from ${videoFile} into ${outputFilePath}`);
          try {
            await combineAudioAndVideo(videoFile, audioFile, outputFilePath);
          } catch (err) {
            console.error('Failed to combine audio and video:', err);
          }
        }
        console.error("Can't find items to make the final ", item.name )
      }
    }
  } catch (err) {
    console.error('Error combining audio and video:', err);
  }
};

const main = () => {
  const inputFolder = path.resolve('./input');
  const outputFolder = path.resolve('./output');
  // convert all input files to .mp4
  convertInput(inputFolder, outputFolder);
  // combine video and audio
  combineVideoAndAudio(outputFolder)
}
main();

