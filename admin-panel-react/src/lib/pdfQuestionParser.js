import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set the worker source from the local npm package
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text from a PDF file.
 * @param {File} file - The PDF file to parse.
 * @returns {Promise<string>} - The extracted text.
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items;

    if (items.length === 0) continue;

    // Detect if the page has multiple columns
    // We group items by their X-coordinate (transform[4])
    const xCoords = items.map(item => Math.floor(item.transform[4] / 10) * 10); // Round to nearest 10px
    const xClusters = {};
    xCoords.forEach(x => xClusters[x] = (xClusters[x] || 0) + 1);
    
    // Sort clusters by frequency to find primary columns
    const sortedClusters = Object.keys(xClusters)
      .map(Number)
      .sort((a, b) => xClusters[b] - xClusters[a]);
    
    // If we have distinct X-clusters that are far apart, it's likely multi-column
    // Usually columns are at least 150-200px apart
    const columns = [];
    if (sortedClusters.length > 1) {
      // Simple heuristic: if we have significant clusters more than 150px apart
      const significantClusters = sortedClusters.filter(x => xClusters[x] > items.length * 0.05);
      significantClusters.sort((a, b) => a - b);
      
      let lastX = -1000;
      for (const x of significantClusters) {
        if (x - lastX > 150) {
          columns.push(x);
          lastX = x;
        }
      }
    }

    let sortedItems;
    if (columns.length > 1) {
      // Multi-column sort: Column -> Y (top to bottom) -> X (left to right)
      sortedItems = [...items].sort((a, b) => {
        const colA = columns.reduce((prev, curr) => (a.transform[4] >= curr ? curr : prev), columns[0]);
        const colB = columns.reduce((prev, curr) => (b.transform[4] >= curr ? curr : prev), columns[0]);
        
        if (colA !== colB) return colA - colB;
        
        // Same column: Sort by Y (inverted since higher Y is higher on page)
        if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
          return a.transform[4] - b.transform[4];
        }
        return b.transform[5] - a.transform[5];
      });
    } else {
      // Single column sort: Y (top to bottom) -> X (left to right)
      sortedItems = [...items].sort((a, b) => {
        if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
          return a.transform[4] - b.transform[4];
        }
        return b.transform[5] - a.transform[5];
      });
    }

    const pageText = sortedItems.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Try to extract the Section/Subject from the text.
 * Look for patterns like "Section : General Intelligence and Reasoning"
 */
export function extractSubject(text) {
  const match = text.match(/Section\s*:\s*([^~\n\r]+)/i);
  return match ? match[1].trim() : null;
}

/**
 * Parse Adda247-style question text into structured question objects.
 * Format: Q.N [question text] Ans [✗/✔] 1. option ... 2. option ... 3. option ... 4. option
 * @param {string} rawText - Extracted PDF text.
 * @returns {Array} - Array of parsed question objects.
 */
export function parseQuestions(rawText) {
  let questions = [];

  // Normalize whitespace
  let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Strategy 1: Split by structured Q.N or "Question [No]" prefixes
  // We DO NOT split by "Question ID" anymore as it often appears at the end of a block
  const splitRegex = /(?=(?:Q(?:uestion)?(?:\.|\s|No[\.\s:]+)*)\s*\d+(?:[\.\s:]+|$))/i;
  let questionBlocks = text.split(splitRegex);
  
  let currentSection = null;

  for (const block of questionBlocks) {
    if (!block.trim()) continue;

    // Check for section header
    const sectionMatch = block.match(/Section\s*:\s*([^~\n\r]+)/i);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
    }

    try {
      const parsed = parseSingleQuestion(block);
      if (parsed) {
        parsed.section = currentSection;
        questions.push(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse question block:', block.substring(0, 50), e);
    }
  }

  // Strategy 2: If Strategy 1 found NO questions or poor answer detection, try the alternative system.
  const questionsWithAnswers = questions.filter(q => q.correct_option_id !== null).length;
  
  if (questions.length === 0 || questionsWithAnswers < questions.length * 0.1) { 
    console.log('Strategy 1 found ' + questions.length + ' questions. Trying Strategy 2...');
    const altQuestions = parseQuestionsAlternative(rawText);
    const altWithAnswers = altQuestions.filter(q => q.correct_option_id !== null).length;
    
    // Choose whichever strategy found more questions/answers
    if (altQuestions.length > questions.length || altWithAnswers > questionsWithAnswers) {
      console.log('Strategy 2 detected more questions/answers. Using Strategy 2.');
      return altQuestions;
    }
  }

  return questions;
}

/**
 * Parse a single question block.
 */
function parseSingleQuestion(block) {
  // Supports patterns like Q.1, Q 1, Question 1, Question No: 1
  // ALSO handles numeric-only starts like "1. Question text" if they are at the start of a block
  let qNumMatch = block.match(/(?:^|\n|\r|\s)?(?:Q(?:uestion)?(?:\.|\s|No[\.\s:]+)*)\s*(\d+)[\.\s:]+/i);
  
  if (!qNumMatch) {
    // Try just numeric start
    qNumMatch = block.match(/(?:^|\n|\r|\s)?(\d+)[\.\)]\s+/);
  }

  if (!qNumMatch) {
    qNumMatch = block.match(/Question\s*ID\s*[:\-]\s*(\d+)/i);
  }

  if (!qNumMatch) return null;

  const questionNumber = parseInt(qNumMatch[1]);
  let content = block.slice(block.indexOf(qNumMatch[0]) + qNumMatch[0].length).trim();

  let questionText = '';
  let optionsText = '';

  const ansMatch = content.match(/\bAns\b/i);
  if (ansMatch) {
    questionText = content.slice(0, ansMatch.index).trim();
    optionsText = content.slice(ansMatch.index + ansMatch[0].length).trim();
  } else {
    // Try to split at first numbered option (1. or 1))
    // Refined regex to avoid split by metadata IDs like "Option 1 ID"
    // We look for a number followed by . or ) and then NOT followed by "ID" or similar metadata markers
    const firstOptMatch = content.match(/(?:^|\s)(?:[\u2713-\u2718✓✔✗✘✕✖❌❎]|\btick\b|\bcross\b)?\s*1[\.\)]\s+(?!ID|Chosen)/i);
    if (firstOptMatch) {
      questionText = content.slice(0, firstOptMatch.index).trim();
      optionsText = content.slice(firstOptMatch.index).trim();
    } else {
      return null;
    }
  }

  if (!questionText || !optionsText) return null;

  let correctOptionId = null;
  let options = [];

  // Split options by numbered pattern - make symbols and numbers optional/flexible
  // Increased robustness of the split regex with negative lookahead for IDs
  const optionParts = optionsText.split(/(?=(?:[\u2713-\u2718\u2705\u2611✓✔✗✘✕✖\u274C\u274E❌❎]|\btick\b|\bcross\b)?\s*[1-4][\.\)]\s+(?!ID|Chosen))/i);

  for (const part of optionParts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    const symbolRegex = /[\u2713-\u2714✓✔\u2705\u2611]|\btick\b/i;
    const isCorrect = symbolRegex.test(trimmedPart) || trimmedPart.includes('✔') || trimmedPart.includes('✓');
    
    // Extract option number and text - must NOT be followed by "ID"
    const optMatch = trimmedPart.match(/(?:.*?)?([1-4])[\.\)]\s+(?!ID|Chosen)(.*)/s);
    if (optMatch) {
      const optId = parseInt(optMatch[1]);
      let optText = optMatch[2].trim();

      // Clean up the option text
      optText = optText.replace(/[\u2713-\u2718\u2705\u2611✓✔✗✘✕✖\u274C\u274E❌❎]/g, '').trim();
      
      // Stop if we hit metadata markers
      const metaIndex = optText.search(/(?:Que|Chosen|Question|Ques).*$/i);
      if (metaIndex !== -1) {
        optText = optText.substring(0, metaIndex).trim();
      }

      if (optText) {
        options.push({ id: optId, text: optText });
        if (isCorrect) correctOptionId = optId;
      }
    }
  }

  // If we couldn't find symbols, search for explicit metadata in the WHOLE block
  if (correctOptionId === null && options.length > 0) {
    const metadataMatch = block.match(/(?:Correct Answer|Correct Option|Answer)\s*[:\-]?\s*([1-4])(?!\s*[\.\)])/i);
    if (metadataMatch) {
      correctOptionId = parseInt(metadataMatch[1]);
    }

    const ansShorthandMatch = block.match(/\bAns\s*[:\-]\s*([1-4])(?!\s*[\.\)])/i);
    if (ansShorthandMatch) {
      correctOptionId = parseInt(ansShorthandMatch[1]);
    }

    const chosenMatch = block.match(/Chosen Option\s*[:\-]?\s*([1-4])/i);
    if (!correctOptionId && chosenMatch) {
      const val = parseInt(chosenMatch[1]);
      if (!isNaN(val)) correctOptionId = val;
    }

    // 4. Smart Metadata: Look for "Correct Option ID : [number]" and match it with option list
    const correctIdMatch = block.match(/(?:Correct|Ans|Answer)\s*(?:Option|Opt)?\s*ID\s*[:\-]\s*(\d+)/i);
    if (!correctOptionId && correctIdMatch) {
      const targetId = correctIdMatch[1];
      // Try to find which option [1-4] corresponds to this ID by searching the block
      for (let i = 1; i <= 4; i++) {
        const optIdRegex = new RegExp(`Option\\s*${i}\\s*ID\\s*[:\\-]?\\s*${targetId}`, 'i');
        if (optIdRegex.test(block)) {
          correctOptionId = i;
          break;
        }
      }
    }
  }

  // Only return if we have at least 2 options
  if (options.length < 2) return null;

  return {
    id: crypto.randomUUID(), // Stable ID for React keys
    number: questionNumber,
    question_text: questionText,
    options: options,
    correct_option_id: correctOptionId,
  };
}

/**
 * Alternative parser for PDFs where text extraction doesn't capture Unicode markers.
 * Uses "Ans" position relative to option numbering.
 */
export function parseQuestionsAlternative(rawText) {
  const questions = [];
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = text.split(/(?=(?:^|\n|\r)(?:Q(?:uestion)?[\.\s:]+)?\d+[\.\)]\s)/i);
  
  let currentSection = null;

  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // Check for section header in this block
    const sectionMatch = block.match(/Section\s*:\s*([^~\n\r]+)/i);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
    }

    // Try to parse this block
    const parsed = parseSingleQuestion(block);
    if (parsed) {
      parsed.section = currentSection;
      questions.push(parsed);
    }
  }
  
  return questions;
}
