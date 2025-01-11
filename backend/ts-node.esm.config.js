import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  // Tell ts-node to compile TypeScript files to JavaScript
  transpileOnly: true,
  
  // Specify the TypeScript compiler
  compiler: 'typescript',
  
  // Custom file extensions to handle
  extensionsToTreatAsEsm: ['.ts'],
  
  // Custom file loader
  transformers: {
    before: [
      {
        type: 'program',
        factory: (program) => {
          return {
            before(sourceFile) {
              // Add .js extension to import statements
              return ts.createSourceFile(
                sourceFile.fileName,
                sourceFile.getFullText().replace(/from\s+['"]([^'"]+)['"]/g, (match, p1) => {
                  // Skip node: and @nestjs imports
                  if (p1.startsWith('node:') || p1.startsWith('@nestjs')) return match;
                  
                  // Add .js extension if not already present
                  if (!p1.endsWith('.js') && !p1.startsWith('.')) {
                    return `from '${p1}.js'`;
                  }
                  return match;
                }),
                sourceFile.languageVersion,
                true
              );
            }
          };
        }
      }
    ]
  }
};
