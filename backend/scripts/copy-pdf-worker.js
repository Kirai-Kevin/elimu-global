import { copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyPdfWorker() {
  const sourceFile = join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
  const destFile = join(__dirname, '../dist/pdf.worker.js');

  try {
    await copyFile(sourceFile, destFile);
    console.log('PDF worker file copied successfully');
  } catch (error) {
    console.error('Error copying PDF worker file:', error);
    process.exit(1);
  }
}

copyPdfWorker();
