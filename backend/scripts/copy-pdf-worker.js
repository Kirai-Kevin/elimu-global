import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyPdfWorker() {
  const sourceFile = join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.js');
  const destDir = join(process.cwd(), 'dist');
  const destFile = join(destDir, 'pdf.worker.js');

  try {
    // Ensure the dist directory exists
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    
    await copyFile(sourceFile, destFile);
    console.log('PDF worker file copied successfully');
  } catch (error) {
    console.error('Error copying PDF worker file:', error);
    console.error('Source path:', sourceFile);
    console.error('Destination path:', destFile);
    process.exit(1);
  }
}

copyPdfWorker();
