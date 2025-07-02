
export interface DictionaryDefinition {
  word: string;
  definition: string;
  partOfSpeech?: string;
  phonetic?: string;
}

// Using the Free Dictionary API as a simple dictionary service
export const checkWordInDictionary = async (word: string): Promise<DictionaryDefinition | null> => {
  try {
    const cleanWord = word.toLowerCase().trim();
    
    // Basic validation - must be a single word with only letters
    if (!/^[a-zA-Z]+$/.test(cleanWord)) {
      return null;
    }

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const entry = data[0];
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition;
      
      return {
        word: entry.word,
        definition: definition || 'Definition not available',
        partOfSpeech: meaning?.partOfSpeech,
        phonetic: entry.phonetic,
      };
    }

    return null;
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
};

export const isValidDictionaryWord = async (word: string): Promise<boolean> => {
  const result = await checkWordInDictionary(word);
  return result !== null;
};
