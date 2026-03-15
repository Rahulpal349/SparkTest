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
    
    // Sort items by vertical position top-to-bottom, then horizontal left-to-right
    // This is much more robust for complex PDF layouts
    const items = textContent.items.sort((a, b) => {
      if (Math.abs(a.transform[5] - b.transform[5]) < 5) { // Same line (5px threshold)
        return a.transform[4] - b.transform[4];
      }
      return b.transform[5] - a.transform[5]; // Higher Y is higher on page
    });

    const pageText = items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  // Debug: Log a snippet of extracted text to see how symbols are rendered
  console.log('PDF Text Extract Snippet:', fullText.substring(0, 1000));
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
    const firstOptMatch = content.match(/(?:^|\s)(?:[\u2713-\u2718✓✔✗✘✕✖❌❎]|\btick\b|\bcross\b)?\s*1[\.\)]\s*/i);
    if (firstOptMatch) {
      questionText = content.slice(0, firstOptMatch.index).trim();
      optionsText = content.slice(firstOptMatch.index).trim();
    } else {
      return null;
    }
  }

  if (!questionText || !optionsText) return null;

  let correctOptionId = null;

  // Split options by numbered pattern - make symbols and numbers optional/flexible
  // Increased robustness of the split regex
  const optionParts = optionsText.split(/(?=(?:[\u2713-\u2718\u2705\u2611✓✔✗✘✕✖\u274C\u274E❌❎]|\btick\b|\bcross\b)?\s*[1-4][\.\)])/i);

  for (const part of optionParts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    const symbolRegex = /[\u2713-\u2714✓✔\u2705\u2611]|\btick\b/i;
    const isCorrect = symbolRegex.test(trimmedPart) || trimmedPart.includes('✔') || trimmedPart.includes('✓');
    
    const wrongRegex = /[\u2715-\u2718✗✘✕✖\u274C\u274E❌❎]|\bcross\b/i;
    const isWrong = wrongRegex.test(trimmedPart) || trimmedPart.includes('✗');

    // Extract option number and text
    const optMatch = trimmedPart.match(/(?:.*?)?([1-4])[\.\)]\s*(.*)/s);
    if (optMatch) {
      const optId = parseInt(optMatch[1]);
      let optText = optMatch[2].trim();

      // Clean up the option text
      optText = optText.replace(/[\u2713-\u2718\u2705\u2611✓✔✗✘✕✖\u274C\u274E❌❎]/g, '').trim();
      optText = optText.replace(/\s*(Que|Chosen|Question|Ques).*$/i, '').trim();

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

  // Auto-Correction: Process of elimination
  if (correctOptionId === null && options.length === 4) {
    const wrongRegex = /[\u2715-\u2718✗✘✕✖\u274C\u274E❌❎]|\bcross\b/i;
    const partsWithWrongSymbol = optionParts.filter(p => wrongRegex.test(p)).length;
    if (partsWithWrongSymbol === 3) {
      const winnerPart = optionParts.find(p => p.match(/[1-4][\.\)]/) && !wrongRegex.test(p));
      const winnerMatch = winnerPart?.match(/([1-4])[\.\)]/);
      if (winnerMatch) correctOptionId = parseInt(winnerMatch[1]);
    }
  }

  // Only return if we have at least 2 options
  if (options.length < 2) return null;

  return {
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
  // Normalize then split by anything that looks like a question number start at a newline
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
