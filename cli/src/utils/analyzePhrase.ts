import { Readable } from 'stream';

export async function analyzePhraseStream(hierarchy: any, phraseStream: Readable, depth: number) {
    const result: Record<string, number> = {};
  
    for await (const chunk of phraseStream) {
      const words = chunk.toString().split(/\s+/);
  
      words.forEach((word: string) => {
        const category = findCategoryByDepth(hierarchy, word, depth);
        if (category) {
          result[category] = (result[category] || 0) + 1;
        }
      });
    }
  
    return result;
  }

function findCategoryByDepth(hierarchy: any, word: string, depth: number, currentDepth: number = 1): string | null {
    if (currentDepth > depth) return null;
  
    for (const [key, value] of Object.entries(hierarchy)) {
      if (currentDepth === depth && Array.isArray(value) && value.includes(word)) {
        return key;
      } else if (typeof value === 'object' && value !== null) {
        const result = findCategoryByDepth(value, word, depth, currentDepth + 1);
        if (result) return result;
      }
    }
  
    return null;
  }