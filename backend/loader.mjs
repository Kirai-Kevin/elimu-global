import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

// Register ts-node as a loader
register('ts-node/esm', pathToFileURL('./'));

export async function resolve(specifier, context, nextResolve) {
  try {
    // Try default resolution first
    return await nextResolve(specifier, context);
  } catch (error) {
    // If resolution fails, try adding .js extension for TypeScript files
    if (!specifier.startsWith('node:') && !specifier.endsWith('.js')) {
      const jsSpecifier = specifier.endsWith('.ts') 
        ? specifier.replace(/\.ts$/, '.js') 
        : `${specifier}.js`;
      
      try {
        return await nextResolve(jsSpecifier, context);
      } catch {
        // If still fails, rethrow original error
        throw error;
      }
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  return await nextLoad(url, context);
}
