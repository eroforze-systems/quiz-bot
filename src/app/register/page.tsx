"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ModernBadge,
  ModernHeading,
  ModernShell,
} from "@/components/modern-shell";
import { QUIZ_LANGUAGES, QuizLanguage } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Languages, UserRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const register = useMutation(api.participants.register);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<QuizLanguage>("tamil");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and phone number are required.");
      return;
    }

    setLoading(true);
    try {
      const participantId = await register({
        name: name.trim(),
        phone: phone.trim(),
        language,
      });
      router.push(`/quiz?participantId=${participantId}`);
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ModernShell className="h-full overflow-hidden">
      <main className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-6 pb-12 pt-6 sm:px-10 sm:pb-16 lg:px-12 lg:pb-20">
        <header className="flex shrink-0 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <ModernBadge>Step 1 of 2</ModernBadge>
        </header>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="space-y-8">
              <ModernHeading
                eyebrow="Participant Registration"
                title="Join the"
                highlight="quiz"
                subtitle="Enter participant name and phone number, then start the quiz. The quiz ends immediately after a wrong answer."
              />

              <div className="hidden rounded-[2rem] bg-[#ECE9FF] p-8 lg:block">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <UserRound className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-900">
                      Operator flow
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      Register each participant before they play. Their name,
                      phone number, and score are saved and listed on the staff
                      dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg">
              <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="mb-6 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    Participant details
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-950 sm:text-3xl">
                    Register to play
                  </h2>
                  <p className="text-xs text-neutral-500 sm:text-sm">
                    பங்கேற்பாளர் பதிவு · Participant Registration
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-2xl border-black/10 bg-[#FAFAF8] px-4 text-base shadow-none focus-visible:border-neutral-400 focus-visible:ring-neutral-200 sm:h-14"
                      placeholder="Enter participant name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-neutral-700">
                      Quiz Language
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {QUIZ_LANGUAGES.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => setLanguage(lang.value)}
                          className={cn(
                            "flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition sm:h-14",
                            language === lang.value
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-black/10 bg-[#FAFAF8] text-neutral-700 hover:bg-white"
                          )}
                        >
                          <Languages className="h-4 w-4" />
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-neutral-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12 rounded-2xl border-black/10 bg-[#FAFAF8] px-4 text-base shadow-none focus-visible:border-neutral-400 focus-visible:ring-neutral-200 sm:h-14"
                      placeholder="Enter phone number"
                      autoComplete="tel"
                    />
                  </div>

                  {error && (
                    <p className="rounded-2xl bg-red-50 px-4 py-2 text-center text-sm text-red-600 sm:py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-base font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:h-14"
                  >
                    {loading ? "Registering..." : "Start Quiz"}
                    {!loading && <ArrowRight className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ModernShell>
  );
}
