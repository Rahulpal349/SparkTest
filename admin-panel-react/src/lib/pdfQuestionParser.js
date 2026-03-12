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
    const pageText = textContent.items.map(item => item.str).join(' ');
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
  const questions = [];

  // Normalize whitespace but preserve newlines
  let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split by question numbers Q.1, Q.2, Q 1, Q 2, etc.
  const questionBlocks = text.split(/(?=Q[\.\s]*\d+[\.\s])/i);
  let currentSection = null;

  for (const block of questionBlocks) {
    if (!block.trim()) continue;

    // Check if this block contains a new section header
    const sectionMatch = block.match(/Section\s*:\s*([^~\n\r]+)/i);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
    }

    try {
      const parsed = parseSingleQuestion(block);
      if (parsed) {
        // Assign the current section to the question
        parsed.section = currentSection;
        questions.push(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse question block:', block.substring(0, 100), e);
    }
  }

  return questions;
}

/**
 * Parse a single question block.
 */
function parseSingleQuestion(block) {
  // Remove the Q.N prefix
  const qNumMatch = block.match(/^Q[\.\s]*(\d+)[\.\s]*/i);
  if (!qNumMatch) return null;

  const questionNumber = parseInt(qNumMatch[1]);
  let content = block.slice(qNumMatch[0].length).trim();

  // Find the answer/options section
  // Look for "Ans" marker or the start of numbered options
  let questionText = '';
  let optionsText = '';

  const ansMatch = content.match(/\bAns\b/i);
  if (ansMatch) {
    questionText = content.slice(0, ansMatch.index).trim();
    optionsText = content.slice(ansMatch.index + ansMatch[0].length).trim();
  } else {
    // Try to split at first numbered option
    const firstOptMatch = content.match(/(?:^|\s)(?:[\u2717\u2713\u2714\u2715\u2716\u2718✗✓✔✕✖✘×]?\s*)?1[\.\)]\s/);
    if (firstOptMatch) {
      questionText = content.slice(0, firstOptMatch.index).trim();
      optionsText = content.slice(firstOptMatch.index).trim();
    } else {
      return null;
    }
  }

  if (!questionText || !optionsText) return null;

  // Parse options - look for 1. 2. 3. 4. patterns
  const options = [];
  let correctOptionId = null;

  // Split options by numbered pattern, but accommodate symbols and varied spacing
  // Supports patterns like: 1. Opt, 1) Opt, ✔ 1. Opt, ✗1.Opt, etc.
  const optionParts = optionsText.split(/(?=(?:[\u2713-\u2718\u2705\u2611✓✔✗✘✕✖\u274C\u274E❌❎]|\btick\b|\bcross\b)?\s*[1-4][\.\)]\s*)/i);

  for (const part of optionParts) {
    if (!part.trim()) continue;

    // Check for correct answer marker (tick/check) or wrong marker (cross)
    // Common markers: Unicode 2713, 2714, 2705, 2611, tick, etc.
    const symbolRegex = /[\u2713-\u2714✓✔\u2705\u2611]|\btick\b/i;
    const isCorrect = symbolRegex.test(part) || part.includes('✔');
    
    const wrongRegex = /[\u2715-\u2718✗✘✕✖\u274C\u274E❌❎]|\bcross\b/i;
    const isWrong = wrongRegex.test(part) || part.includes('✗');

    // Extract option number and text
    const optMatch = part.match(/[\u2717\u2713\u2714\u2715\u2716\u2718✗✓✔✕✖✘×]?\s*([1-4])[\.\)]\s*(.*)/s);
    if (optMatch) {
      const optId = parseInt(optMatch[1]);
      let optText = optMatch[2].trim();

      // Clean up the option text - remove trailing markers and noise
      optText = optText.replace(/[\u2717\u2713\u2714\u2715\u2716\u2718✗✓✔✕✖✘×]/g, '').trim();
      // Remove trailing "Que" or "Chosen" text that appears in some Adda247 PDFs
      optText = optText.replace(/\s*(Que|Chosen|Question|Ques).*$/i, '').trim();

      if (optText) {
        options.push({ id: optId, text: optText });
        if (isCorrect) {
          correctOptionId = optId;
        }
      }
    }
  }

  // If we couldn't find check marks, try alternative patterns
  if (correctOptionId === null && options.length > 0) {
    // 1. Look for explicit metadata patterns (usually found in response sheets)
    // Avoid matching "Ans 1." which is just a label for the first option.
    // We look for patterns like "Correct Answer : 2" or "Answer : 3" that ARE NOT followed by a dot/bracket
    const metadataMatch = block.match(/(?:Correct Answer|Correct Option|Answer)\s*[:\-]?\s*([1-4])(?!\s*[\.\)])/i);
    if (metadataMatch) {
      correctOptionId = parseInt(metadataMatch[1]);
    }

    // 2. Look for "Ans : 2" (common shorthand)
    const ansShorthandMatch = block.match(/\bAns\s*[:\-]\s*([1-4])(?!\s*[\.\)])/i);
      if (ansShorthandMatch) {
      correctOptionId = parseInt(ansShorthandMatch[1]);
    }

    // 3. Fallback: Look for "Chosen Option : [1-4]" 
    // Sometimes response sheets don't have symbols in text, but have this metadata
    const chosenMatch = block.match(/Chosen Option\s*[:\-]?\s*([1-4])/i);
    if (!correctOptionId && chosenMatch) {
      const val = parseInt(chosenMatch[1]);
      if (!isNaN(val)) correctOptionId = val;
    }
  }

  // Auto-Correction logic: If only one option is NOT marked with a cross ✗, it's the correct one
  // Be more permissive with what defines an option part to ensure we catch them all
  if (correctOptionId === null && options.length === 4) {
    const partsWithWrongSymbol = optionParts.filter(p => /[\u2715-\u2718✗✘✕✖\u274C\u274E❌❎]|\bcross\b/i.test(p)).length;
    if (partsWithWrongSymbol === 3) {
      // Find the one without any wrong symbol
      const winnerPart = optionParts.find(p => p.match(/[1-4][\.\)]/) && !/[\u2715-\u2718✗✘✕✖\u274C\u274E❌❎]|\bcross\b/i.test(p));
      const winnerMatch = winnerPart?.match(/([1-4])[\.\)]/);
      if (winnerMatch) {
        correctOptionId = parseInt(winnerMatch[1]);
      }
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
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let i = 0;
  while (i < lines.length) {
    const qMatch = lines[i].match(/^Q[\.\s]*(\d+)[\.\s]+(.*)/i);
    if (!qMatch) { i++; continue; }

    let questionText = qMatch[2].trim();
    i++;

    // Collect question text until we hit "Ans" or option pattern
    while (i < lines.length && !/^Ans\b/i.test(lines[i]) && !/^[1-4][\.\)]\s/.test(lines[i])) {
      // Check if next line starts with a sub-part like a), b), c)
      questionText += ' ' + lines[i];
      i++;
    }

    // Skip "Ans" line if present
    if (i < lines.length && /^Ans\b/i.test(lines[i])) {
      i++;
    }

    // Collect options
    const options = [];
    let correctId = null;

    while (i < lines.length && options.length < 4) {
      const line = lines[i];
      const corrMatch = line.match(/^[\u2713\u2714✓✔]\s*([1-4])[\.\)]\s*(.*)/);
      const wrongMatch = line.match(/^[\u2717\u2715\u2716\u2718✗✕✖✘×]\s*([1-4])[\.\)]\s*(.*)/);
      const plainMatch = line.match(/^([1-4])[\.\)]\s*(.*)/);

      if (corrMatch) {
        const id = parseInt(corrMatch[1]);
        options.push({ id, text: corrMatch[2].trim() });
        correctId = id;
      } else if (wrongMatch) {
        const id = parseInt(wrongMatch[1]);
        options.push({ id, text: wrongMatch[2].trim() });
      } else if (plainMatch) {
        const id = parseInt(plainMatch[1]);
        options.push({ id, text: plainMatch[2].trim() });
      } else if (options.length > 0) {
        // Continuation of previous option text
        options[options.length - 1].text += ' ' + line;
      } else {
        break; // Not an option line
      }
      i++;
    }

    if (options.length >= 2) {
      questions.push({
        number: parseInt(qMatch[1]),
        question_text: questionText.trim(),
        options,
        correct_option_id: correctId,
      });
    }
  }

  return questions;
}
