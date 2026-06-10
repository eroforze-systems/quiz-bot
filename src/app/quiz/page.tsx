"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ModernShell } from "@/components/modern-shell";
import {
  ANSWER_OPTIONS,
  AnswerOption,
  QUESTIONS_PER_ATTEMPT,
  QuizLanguage,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/shuffle";
import { Languages, Radio, Trophy, UserRound } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type QuizQuestion = {
  _id: Id<"questions">;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

type DisplayOption = {
  label: AnswerOption;
  text: string;
  answerKey: AnswerOption;
};

function buildShuffledOptions(question: QuizQuestion): DisplayOption[] {
  const items = shuffleArray<{
    answerKey: AnswerOption;
    text: string;
  }>([
    { answerKey: "A", text: question.optionA },
    { answerKey: "B", text: question.optionB },
    { answerKey: "C", text: question.optionC },
    { answerKey: "D", text: question.optionD },
  ]);

  return items.map((item, index) => ({
    label: ANSWER_OPTIONS[index],
    text: item.text,
    answerKey: item.answerKey,
  }));
}

function LoadingState() {
  return (
    <ModernShell variant="quiz">
      <main className="flex h-full items-center justify-center">
        <p className="text-lg font-medium text-neutral-500">Loading quiz...</p>
      </main>
    </ModernShell>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId") as Id<"participants"> | null;

  const participant = useQuery(
    api.participants.get,
    participantId ? { id: participantId } : "skip"
  );
  const participantLanguage: QuizLanguage = participant?.language ?? "tamil";

  const questionsFromQuery = useQuery(
    api.questions.getRandomQuestions,
    participant
      ? { count: QUESTIONS_PER_ATTEMPT, language: participantLanguage }
      : "skip"
  );
  const checkAnswer = useMutation(api.questions.checkAnswer);
  const submitResult = useMutation(api.quizResults.submit);

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState<AnswerOption | null>(
    null
  );
  const [actualCorrectAnswerKey, setActualCorrectAnswerKey] = useState<AnswerOption | null>(
    null
  );
  const [answerFeedback, setAnswerFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);

  const FEEDBACK_DELAY_MS = 1000;

  useEffect(() => {
    if (questionsFromQuery && questions === null) {
      setQuestions(
        shuffleArray(questionsFromQuery as QuizQuestion[])
      );
    }
  }, [questionsFromQuery, questions]);

  const finishQuiz = useCallback(
    async (finalScore: number, answeredQuestions: number) => {
      if (!participantId || !participant || submitting) return;
      setSubmitting(true);

      try {
        await submitResult({
          participantId,
          name: participant.name,
          phone: participant.phone,
          language: participant.language ?? "tamil",
          score: finalScore,
          answeredQuestions,
        });
        router.push(
          `/result?participantId=${participantId}&score=${finalScore}&answered=${answeredQuestions}`
        );
      } catch {
        setSubmitting(false);
      }
    },
    [participantId, participant, submitting, submitResult, router]
  );

  useEffect(() => {
    if (!participantId) {
      router.replace("/register");
    }
  }, [participantId, router]);

  const displayOptions = useMemo(() => {
    if (!questions?.length) return [] as DisplayOption[];
    return buildShuffledOptions(questions[currentIndex]);
  }, [questions, currentIndex]);

  const handleAnswer = async (selected: AnswerOption) => {
    if (answered || !questions || submitting) return;
    setAnswered(true);
    setSelectedAnswerKey(selected);

    const currentQuestion = questions[currentIndex];
    const { isCorrect, correctAnswer } = await checkAnswer({
      questionId: currentQuestion._id,
      selectedAnswer: selected,
    });

    setAnswerFeedback(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      setActualCorrectAnswerKey(correctAnswer);
      const answeredQuestions = currentIndex + 1;
      setTimeout(() => {
        void finishQuiz(score, answeredQuestions);
      }, 2500); // Wait 2.5s to show the correct answer before finishing
      return;
    }

    const newScore = score + 1;
    setScore(newScore);

    const isLastQuestion = currentIndex + 1 >= questions.length;

    if (isLastQuestion) {
      setTimeout(() => {
        void finishQuiz(newScore, questions.length);
      }, FEEDBACK_DELAY_MS);
      return;
    }

    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedAnswerKey(null);
      setActualCorrectAnswerKey(null);
      setAnswerFeedback(null);
    }, FEEDBACK_DELAY_MS);
  };

  if (!participantId) return null;

  if (participant === undefined || questionsFromQuery === undefined || questions === null) {
    return <LoadingState />;
  }

  if (!participant) {
    router.replace("/register");
    return null;
  }

  if (questions.length === 0) {
    return (
      <ModernShell variant="quiz">
        <main className="flex h-full items-center justify-center p-6">
          <div className="max-w-lg rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <h1 className="text-3xl font-semibold text-neutral-950">No questions yet</h1>
            <p className="mt-3 text-neutral-500">
              Staff need to add active questions before the quiz can begin.
            </p>
          </div>
        </main>
      </ModernShell>
    );
  }

  const question = questions[currentIndex] as QuizQuestion;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const languageLabel = participantLanguage === "english" ? "English" : "தமிழ்";

  return (
    <ModernShell variant="quiz" className="h-full overflow-hidden">
      <main className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-3 pb-24 pt-2 sm:px-6 sm:pb-28 sm:pt-3 lg:px-8">
        <header className="mb-2 shrink-0 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-md sm:mb-3 sm:rounded-[1.25rem]">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ECE9FF] to-[#D9D4FF] text-sm font-bold text-neutral-800 shadow-inner sm:h-11 sm:w-11">
                {getInitials(participant.name) || (
                  <UserRound className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-neutral-950 sm:text-base">
                  {participant.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-neutral-500 sm:text-xs">
                  <span>{participant.phone}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="inline-flex items-center gap-1 text-neutral-600">
                    <Languages className="h-3 w-3" />
                    {languageLabel}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <div className="hidden items-center gap-1.5 rounded-full border border-green-200/80 bg-green-50 px-2.5 py-1 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700">
                  Live
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-2xl border border-[#E8E4FF] bg-[#F8F7FF] px-2.5 py-1.5 sm:gap-2 sm:px-3">
                <Trophy className="h-3.5 w-3.5 text-neutral-500" />
                <div className="text-left leading-none">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                    Score
                  </p>
                  <p className="text-sm font-bold text-neutral-950">{score}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-950 px-2.5 py-1.5 text-center sm:px-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                  Q
                </p>
                <p className="text-sm font-bold leading-tight text-white">
                  {currentIndex + 1}
                  <span className="text-neutral-500">/{questions.length}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-1.5 bg-[#F0EEFF]">
            <div
              className="h-full rounded-r-full bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)] sm:rounded-[1.75rem]">
          <div className="relative shrink-0 overflow-hidden border-b border-[#F0EEFF] bg-gradient-to-b from-[#FAFAFF] to-white px-4 py-4 sm:px-8 sm:py-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#ECE9FF]/70 blur-2xl"
            />
            <div className="relative flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E4FF] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
                <Radio className="h-3 w-3" />
                Question {currentIndex + 1}
              </span>
              <h2
                className="mt-3 max-w-4xl text-balance font-semibold leading-snug tracking-tight text-neutral-950"
                style={{ fontSize: "clamp(1.2rem, 3.2vh, 2.25rem)" }}
              >
                {question.questionText}
              </h2>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-2 p-2.5 sm:grid-cols-2 sm:grid-rows-2 sm:gap-3 sm:p-4">
            {displayOptions.map((opt) => {
              const isSelected = selectedAnswerKey === opt.answerKey;
              const isActualCorrect = actualCorrectAnswerKey === opt.answerKey;
              const showCorrect = (isSelected && answerFeedback === "correct") || isActualCorrect;
              const showIncorrect = isSelected && answerFeedback === "incorrect";

              return (
                <button
                  key={`${currentIndex}-${opt.label}-${opt.answerKey}`}
                  type="button"
                  disabled={answered || submitting}
                  onClick={() => handleAnswer(opt.answerKey)}
                  className={cn(
                    "group relative flex h-full min-h-0 w-full items-center overflow-hidden rounded-2xl border px-3 py-2 text-left transition-all duration-300 sm:px-5 sm:py-3",
                    showCorrect &&
                      "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-[0_8px_24px_rgba(34,197,94,0.18)]",
                    showIncorrect &&
                      "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 shadow-[0_8px_24px_rgba(239,68,68,0.18)]",
                    !showCorrect &&
                      !showIncorrect &&
                      "border-black/[0.06] bg-[#FAFAF8] hover:-translate-y-0.5 hover:border-[#D9D4FF] hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] active:translate-y-0",
                    (answered || submitting) && "cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "mr-3 flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105 sm:mr-4",
                      showCorrect && "bg-gradient-to-br from-green-500 to-green-600",
                      showIncorrect && "bg-gradient-to-br from-red-500 to-red-600",
                      !showCorrect &&
                        !showIncorrect &&
                        "bg-gradient-to-br from-neutral-900 to-neutral-700"
                    )}
                    style={{
                      width: "clamp(2.25rem, 5vh, 3rem)",
                      height: "clamp(2.25rem, 5vh, 3rem)",
                      fontSize: "clamp(0.8rem, 1.8vh, 0.95rem)",
                    }}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-3 font-medium leading-snug",
                      showCorrect && "text-green-900",
                      showIncorrect && "text-red-900",
                      !showCorrect && !showIncorrect && "text-neutral-900"
                    )}
                    style={{ fontSize: "clamp(1.1rem, 2.8vh, 1.6rem)" }}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </ModernShell>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <QuizContent />
    </Suspense>
  );
}
