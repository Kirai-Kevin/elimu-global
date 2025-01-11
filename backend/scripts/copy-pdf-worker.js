import { writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PDF.js version should match the one in package.json
const PDFJS_VERSION = '4.0.269';
const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.js`;

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        writeFile(dest, data)
          .then(() => resolve())
          .catch(reject);
      });

      response.on('error', reject);
    }).on('error', reject);
  });
}

async function findOrDownloadPdfWorker() {
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
      console.log('Found PDF worker at:', path);
      return path;
    }
  }
  
  // If we couldn't find the file, download it
  console.log('PDF worker not found locally, downloading from unpkg...');
  const destDir = join(process.cwd(), 'dist');
  const destFile = join(destDir, 'pdf.worker.js');

  if (!existsSync(destDir)) {
    await mkdir(destDir, { recursive: true });
  }

  await downloadFile(WORKER_URL, destFile);
  console.log('Successfully downloaded PDF worker to:', destFile);
  return destFile;
}

async function copyPdfWorker() {
  try {
    const sourceFile = await findOrDownloadPdfWorker();
    const destDir = join(process.cwd(), 'dist');
    const destFile = join(destDir, 'pdf.worker.js');

    // If the source file is already in the right place, we're done
    if (sourceFile === destFile) {
      console.log('PDF worker is already in the correct location');
      return;
    }

    // Ensure the dist directory exists
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    
    // Copy the file using the fs module
    const content = await import('fs/promises').then(fs => fs.readFile(sourceFile));
    await writeFile(destFile, content);
    console.log('PDF worker file copied successfully from:', sourceFile);
    console.log('To:', destFile);
  } catch (error) {
    console.error('Error in copyPdfWorker:', error);
    process.exit(1);
  }
}

copyPdfWorker();
