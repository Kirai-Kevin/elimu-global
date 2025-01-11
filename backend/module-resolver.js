import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function resolveModule(specifier, context, defaultResolve) {
  console.log('Resolving module:', specifier);
  console.log('Context:', context);

  // Handle absolute paths
  if (specifier.startsWith('/')) {
    try {
      const fileUrl = `file://${specifier}`;
      console.log('Attempting to resolve absolute path:', fileUrl);
      return defaultResolve(fileUrl, context, defaultResolve);
    } catch (absoluteError) {
      console.error('Absolute path resolution error:', absoluteError);
    }
  }

  // First try the default resolution
  try {
    const result = defaultResolve(specifier, context, defaultResolve);
    console.log('Resolved successfully:', result);
    return result;
  } catch (error) {
    console.error('Default resolution error:', error);

    // If default resolution fails, try adding .js extension
    if (!specifier.endsWith('.js')) {
      try {
        const jsSpecifier = specifier + '.js';
        console.log('Trying with .js extension:', jsSpecifier);
        const result = defaultResolve(jsSpecifier, context, defaultResolve);
        console.log('Resolved with .js extension:', result);
        return result;
      } catch (jsError) {
        console.error('.js extension resolution error:', jsError);
        
        // Try resolving with file:// protocol
        try {
          const fileUrl = `file://${path.resolve(specifier)}`;
          console.log('Trying with file:// protocol:', fileUrl);
          const result = defaultResolve(fileUrl, context, defaultResolve);
          console.log('Resolved with file:// protocol:', result);
          return result;
        } catch (fileUrlError) {
          console.error('File URL resolution error:', fileUrlError);
          // If that fails too, rethrow the original error
          throw error;
        }
      }
    }
    throw error;
  }
}

export function load(url, context, defaultLoad) {
  console.log('Loading module:', url);
  console.log('Context:', context);
  return defaultLoad(url, context, defaultLoad);
}
