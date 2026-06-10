import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function parseSingleLanguageFile(content, answerLabel) {
  const cleaned = content.split(/Consolidated Answer Key/i)[0].trim();
  const blocks = cleaned
    .split(/\n(?=\d+\.\s)/)
    .filter((b) => /^\d+\.\s/.test(b.trim()));

  return blocks.map((block) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const questionMatch = lines[0]?.match(/^\d+\.\s*(.+)$/);
    if (!questionMatch) {
      throw new Error(`Invalid question block: ${lines[0]}`);
    }

    const options = {};
    let correctAnswer = null;

    for (const line of lines.slice(1)) {
      const optionMatch = line.match(/^([a-d])\)\s*(.+?)(?:\s*✅)?$/i);
      if (optionMatch) {
        options[optionMatch[1].toUpperCase()] = optionMatch[2].trim();
      }

      const answerRegex = new RegExp(`^${answerLabel}:\\s*([a-d])`, "i");
      const answerMatch = line.match(answerRegex);
      if (answerMatch) {
        correctAnswer = answerMatch[1].toUpperCase();
      }
    }

    if (!options.A || !options.B || !options.C || !options.D || !correctAnswer) {
      throw new Error(`Incomplete question: ${questionMatch[1]}`);
    }

    return {
      question: questionMatch[1],
      optionA: options.A,
      optionB: options.B,
      optionC: options.C,
      optionD: options.D,
      correctAnswer,
    };
  });
}

function mergeBilingualQuestions(tamilContent, englishContent) {
  const tamil = parseSingleLanguageFile(tamilContent, "பதில்");
  const english = parseSingleLanguageFile(englishContent, "Answer");

  if (tamil.length !== english.length) {
    throw new Error(
      `Question count mismatch: Tamil ${tamil.length}, English ${english.length}`
    );
  }

  return tamil.map((tq, i) => {
    const eq = english[i];
    if (tq.correctAnswer !== eq.correctAnswer) {
      throw new Error(
        `Answer mismatch at question ${i + 1}: Tamil ${tq.correctAnswer}, English ${eq.correctAnswer}`
      );
    }

    return {
      questionTamil: tq.question,
      questionEnglish: eq.question,
      optionA: tq.optionA,
      optionB: tq.optionB,
      optionC: tq.optionC,
      optionD: tq.optionD,
      optionAEnglish: eq.optionA,
      optionBEnglish: eq.optionB,
      optionCEnglish: eq.optionC,
      optionDEnglish: eq.optionD,
      correctAnswer: tq.correctAnswer,
    };
  });
}

const tamilPath = resolve(
  root,
  "சாலைப் பாதுகாப்பு வினாடி வினா 100.txt"
);
const englishPath = resolve(root, "Road Safety Quiz - English.txt");

const tamilContent = readFileSync(tamilPath, "utf8");
const englishContent = readFileSync(englishPath, "utf8");
const questions = mergeBilingualQuestions(tamilContent, englishContent);

console.log(`Parsed ${questions.length} bilingual questions.`);

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in environment.");
}

const client = new ConvexHttpClient(convexUrl);
const result = await client.mutation("seed:bulkImport", {
  questions,
  replaceExisting: true,
});

console.log(`Imported ${result.imported} questions into Convex.`);
