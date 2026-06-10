"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  ModernBadge,
  ModernHeading,
  ModernShell,
} from "@/components/modern-shell";
import { ArrowRight, Trophy } from "lucide-react";

function LoadingState() {
  return (
    <ModernShell>
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-neutral-500">Loading results...</p>
      </main>
    </ModernShell>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId") as Id<"participants"> | null;
  const scoreParam = searchParams.get("score");
  const answeredParam = searchParams.get("answered");

  const participant = useQuery(
    api.participants.get,
    participantId ? { id: participantId } : "skip"
  );
  const result = useQuery(
    api.quizResults.getByParticipant,
    participantId ? { participantId } : "skip"
  );

  const score = result?.score ?? (scoreParam ? Number(scoreParam) : 0);
  const answered =
    result?.answeredQuestions ??
    (answeredParam ? Number(answeredParam) : 0);

  if (!participantId) {
    return (
      <ModernShell>
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-lg rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <p className="text-neutral-500">Result not found.</p>
            <Link
              href="/register"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white"
            >
              Try again
            </Link>
          </div>
        </main>
      </ModernShell>
    );
  }

  if (participant === undefined) {
    return <LoadingState />;
  }

  return (
    <ModernShell className="h-full overflow-hidden">
      <main className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-6 pb-10 pt-4 sm:px-10 sm:pb-12 sm:pt-6 lg:px-12 lg:pb-16">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="grid w-full items-center gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <ModernHeading
            eyebrow="Quiz Complete"
            title="Thank you"
            highlight="for playing"
            subtitle="This participant's score has been saved. It will appear on the staff dashboard."
          />

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F3FF] sm:mb-5 sm:h-16 sm:w-16">
                <Trophy className="h-6 w-6 text-neutral-800 sm:h-7 sm:w-7" />
              </div>

              <ModernBadge>Results</ModernBadge>

              <div className="mt-4 space-y-1 sm:mt-5">
                <p className="text-xl font-semibold text-neutral-950 sm:text-2xl">
                  {participant?.name}
                </p>
                <p className="text-xs text-neutral-500 sm:text-sm">{participant?.phone}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4">
                <div className="rounded-2xl bg-[#FAFAF8] p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-xs">
                    Score
                  </p>
                  <p className="mt-1.5 text-3xl font-bold tracking-tight text-neutral-950 sm:mt-2 sm:text-4xl">{score}</p>
                </div>
                <div className="rounded-2xl bg-[#F4F3FF] p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-xs">
                    Answered
                  </p>
                  <p className="mt-1.5 text-3xl font-bold tracking-tight text-neutral-950 sm:mt-2 sm:text-4xl">{answered}</p>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-neutral-500 sm:mt-7">
                Thank you for participating in the Police Awareness event.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-medium text-white transition hover:bg-neutral-800 sm:mt-7 sm:h-14 sm:text-base"
              >
                Next Participant
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </main>
    </ModernShell>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultContent />
    </Suspense>
  );
}
