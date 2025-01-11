import * as fs from 'fs';
import * as path from 'path';

// Create a custom loader that doesn't try to read test files
const PDFParser = require('pdf-parse');

export async function parsePDF(dataBuffer: Buffer) {
    return PDFParser(dataBuffer);
}

export default parsePDF;
