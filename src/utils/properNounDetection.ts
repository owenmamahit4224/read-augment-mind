
export interface ProperNoun {
  text: string;
  startIndex: number;
  endIndex: number;
  context: string;
}

export const detectProperNouns = (content: string): ProperNoun[] => {
  const properNouns: ProperNoun[] = [];
  
  // Enhanced regex patterns for proper noun detection
  const patterns = [
    // Names (capitalized words not at sentence start)
    /(?<!^|\. |\? |\! )([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    // Locations and organizations
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:University|College|Corporation|Company|Inc|Ltd|School|Hospital|Bank|Church|Museum|Theater|Centre|Center|Institute|Foundation)))\b/g,
    // Countries, cities, states
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:City|State|Country|Province|Territory|Republic|Kingdom|Empire)))\b/g,
    // Brands and products
    /\b([A-Z][a-z]*[A-Z][a-z]*)\b/g,
  ];

  const sentences = content.split(/[.!?]+/);
  let globalOffset = 0;

  sentences.forEach((sentence, sentenceIndex) => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) {
      globalOffset += sentence.length + 1;
      return;
    }

    patterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(trimmedSentence)) !== null) {
        const properNounText = match[1] || match[0];
        
        // Skip common words that might be capitalized
        const commonWords = [
          'The', 'This', 'That', 'These', 'Those', 'It', 'He', 'She', 'They',
          'I', 'We', 'You', 'My', 'Your', 'His', 'Her', 'Their', 'Our',
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
          'January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'
        ];
        
        if (commonWords.includes(properNounText)) continue;
        
        // Ensure minimum length
        if (properNounText.length < 2) continue;
        
        // Check if it's not already added
        const alreadyExists = properNouns.some(pn => 
          pn.text === properNounText && 
          Math.abs(pn.startIndex - (globalOffset + match.index)) < 10
        );
        
        if (!alreadyExists) {
          const startIndex = globalOffset + match.index;
          const endIndex = startIndex + properNounText.length;
          
          // Get context (surrounding words)
          const contextStart = Math.max(0, match.index - 30);
          const contextEnd = Math.min(trimmedSentence.length, match.index + properNounText.length + 30);
          const context = trimmedSentence.slice(contextStart, contextEnd).trim();
          
          properNouns.push({
            text: properNounText,
            startIndex,
            endIndex,
            context: context
          });
        }
      }
    });

    globalOffset += sentence.length + 1;
  });

  // Remove duplicates and sort by position
  const uniqueProperNouns = properNouns.filter((noun, index, arr) => 
    arr.findIndex(n => n.text === noun.text) === index
  );

  return uniqueProperNouns.sort((a, b) => a.startIndex - b.startIndex);
};
