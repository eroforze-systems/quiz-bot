export const QUESTIONS_PER_ATTEMPT = 100;

export type AnswerOption = "A" | "B" | "C" | "D";

export const ANSWER_OPTIONS: AnswerOption[] = ["A", "B", "C", "D"];

export type QuizLanguage = "tamil" | "english";

export const QUIZ_LANGUAGES: { value: QuizLanguage; label: string }[] = [
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "english", label: "English" },
];
