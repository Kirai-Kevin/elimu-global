import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function findPdfWorker() {
  const possiblePaths = [
    // Standard node_modules location
    join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.js'),
    // Render deployment path
    '/opt/render/project/src/backend/node_modules/pdfjs-dist/build/pdf.worker.js',
    // Try lib directory
    join(process.cwd(), 'node_modules/pdfjs-dist/lib/pdf.worker.js'),
    // Try es5 directory
    join(process.cwd(), 'node_modules/pdfjs-dist/es5/build/pdf.worker.js'),
    // Try legacy directory
    join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.js')
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  throw new Error('Could not find pdf.worker.js in any of the expected locations');
}

async function copyPdfWorker() {
  try {
    const sourceFile = await findPdfWorker();
    const destDir = join(process.cwd(), 'dist');
    const destFile = join(destDir, 'pdf.worker.js');

    // Ensure the dist directory exists
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    
    await copyFile(sourceFile, destFile);
    console.log('PDF worker file copied successfully from:', sourceFile);
    console.log('To:', destFile);
  } catch (error) {
    console.error('Error in copyPdfWorker:', error);
    if (error.code === 'ENOENT') {
      console.error('Could not find pdf.worker.js. Please ensure pdfjs-dist is installed correctly.');
      console.error('Try running: npm install pdfjs-dist@4.0.269 --save');
    }
    process.exit(1);
  }
}

copyPdfWorker();
