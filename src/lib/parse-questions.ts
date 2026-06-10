import type { AnswerOption } from "./constants";

export type ParsedQuestion = {
  questionTamil: string;
  questionEnglish: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAEnglish: string;
  optionBEnglish: string;
  optionCEnglish: string;
  optionDEnglish: string;
  correctAnswer: AnswerOption;
};

type SingleLanguageQuestion = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
};

function parseSingleLanguageFile(
  content: string,
  answerLabel: "Answer" | "பதில்"
): SingleLanguageQuestion[] {
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

    const options: Partial<Record<"A" | "B" | "C" | "D", string>> = {};
    let correctAnswer: AnswerOption | null = null;

    for (const line of lines.slice(1)) {
      const optionMatch = line.match(/^([a-d])\)\s*(.+?)(?:\s*✅)?$/i);
      if (optionMatch) {
        const key = optionMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
        options[key] = optionMatch[2].trim();
      }

      const answerRegex = new RegExp(`^${answerLabel}:\\s*([a-d])`, "i");
      const answerMatch = line.match(answerRegex);
      if (answerMatch) {
        correctAnswer = answerMatch[1].toUpperCase() as AnswerOption;
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

export function mergeBilingualQuestions(
  tamilContent: string,
  englishContent: string
): ParsedQuestion[] {
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
