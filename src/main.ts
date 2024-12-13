import path from "path";
import { convertToMp4 } from "./converter";
import fs from 'fs';

/**
 * Scans a folder for all `.mkv` files and converts them to `.mp4`.
 * @param folderPath - Path to the folder to scan.
 */
const processFolder = async (folderPath: string, outputFolderPath: string) => {
  try {
    const files = fs.readdirSync(folderPath);

    // Filter for .mkv files
    const mkvFiles = files.filter((file) => path.extname(file).toLowerCase() === '.mkv');

    if (mkvFiles.length === 0) {
      console.log('No .mkv files found in the folder.');
      return;
    }

    console.log(`Found ${mkvFiles.length} .mkv file(s):`, mkvFiles);

    for (const file of mkvFiles) {
      const inputFilePath = path.join(folderPath, file);
      const outputFilePath = path.join(outputFolderPath, path.basename(file, '.mkv') + '.mp4');

      console.log(`Converting ${file} to MP4...`);
      try {
        await convertToMp4(inputFilePath, outputFilePath);
        console.log(`Successfully converted ${file} to ${outputFilePath}`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('Error scanning folder:', err);
  }
};

// Example usage

const main = () => {
  const inputFolder = path.resolve('./input');
  const outputFolder = path.resolve('./output');
  processFolder(inputFolder, outputFolder);
}
main();

