import fs from 'fs';
import path from 'path';

function processFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processFiles(fullPath);
    } else if (path.extname(file) === '.js') {
      // Only rename files that are meant to be CommonJS
      const cjsFiles = [
        'main.js', 
        'app.module.js', 
        'app.controller.js', 
        'app.service.js',
        // Add other files that should be converted to .cjs
      ];

      if (cjsFiles.includes(file)) {
        const newPath = path.join(dir, file.replace('.js', '.cjs'));
        fs.renameSync(fullPath, newPath);
      }
    }
  });
}

processFiles(path.join(process.cwd(), 'dist'));
