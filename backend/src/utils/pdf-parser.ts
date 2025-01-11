import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export async function pdfParse(pdfBuffer: Buffer): Promise<string> {
  try {
    // Create a temporary file to store the PDF
    const tempDir = process.env.TEMP_DIR || '/tmp';
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);
    
    // Write buffer to temporary file
    await fs.writeFile(tempFilePath, pdfBuffer);
    
    try {
      // Use pdftotext to extract text
      const { stdout, stderr } = await execAsync(`pdftotext "${tempFilePath}" -`);
      
      // Remove extra whitespace and trim
      const extractedText = stdout
        .replace(/\s+/g, ' ')
        .trim();
      
      return extractedText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      
      // Type guard to handle unknown errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Unknown error occurred';
      
      throw new Error(`Failed to extract PDF text: ${errorMessage}`);
    } finally {
      // Clean up temporary file
      await fs.unlink(tempFilePath).catch(() => {});
    }
  } catch (error) {
    console.error('Error parsing PDF:', error);
    
    // Type guard to handle unknown errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown error occurred';
    
    throw new Error(`Failed to parse PDF: ${errorMessage}`);
  }
}

export function extractCourseDetails(pdfText: string): {
  title: string;
  description: string;
  level: string;
  learningObjectives: string[];
} {
  // Basic course details extraction
  const defaultDetails = {
    title: 'Unknown Course',
    description: 'No description available',
    level: 'Unknown',
    learningObjectives: []
  };

  try {
    // Extract title (first line)
    const titleMatch = pdfText.match(/^([^\n]+)/);
    const title = titleMatch ? titleMatch[1].trim() : defaultDetails.title;

    // Try to extract description (first paragraph)
    const descriptionMatch = pdfText.match(/^[^\n]+\n\n([^\n]+)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : defaultDetails.description;

    // Infer course level
    const level = inferCourseLevel(pdfText);

    // Extract learning objectives
    const learningObjectives = extractLearningObjectives(pdfText);

    return {
      title,
      description,
      level,
      learningObjectives
    };
  } catch (error) {
    console.warn('Error extracting course details:', error);
    
    // Type guard to handle unknown errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown error occurred';
    
    console.warn(`Failed to extract course details: ${errorMessage}`);
    return defaultDetails;
  }
}

function inferCourseLevel(text: string): string {
  const levelKeywords = {
    'Beginner': ['introduction', 'basics', 'fundamentals', 'beginner', 'starter'],
    'Intermediate': ['intermediate', 'advanced basics', 'next level', 'deeper dive'],
    'Advanced': ['advanced', 'expert', 'professional', 'deep dive']
  };

  const lowercaseText = text.toLowerCase();

  for (const [level, keywords] of Object.entries(levelKeywords)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return level;
    }
  }

  return 'Unknown';
}

function extractLearningObjectives(text: string): string[] {
  const objectivesPatterns = [
    /learning\s*objectives?:?\s*(.*?)(?:\n\n|$)/i,
    /course\s*goals:?\s*(.*?)(?:\n\n|$)/i,
    /what\s*you'll\s*learn:?\s*(.*?)(?:\n\n|$)/i
  ];

  for (const pattern of objectivesPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Split by bullet points or semicolons
      const objectives = match[1]
        .split(/[•\n-]/)
        .map(obj => obj.trim())
        .filter(obj => obj.length > 10);  // Filter out very short or empty strings
      
      return objectives.length > 0 ? objectives : [];
    }
  }

  return [];
}
