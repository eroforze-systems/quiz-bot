import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModernShellProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "quiz";
};

export function ModernShell({
  children,
  className,
  variant = "default",
}: ModernShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-full flex-1 flex-col",
        variant === "quiz"
          ? "w-full bg-[#F4F3FF]"
          : "bg-[#F7F6F3]",
        className
      )}
    >
      {variant === "quiz" && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#E0DBFF]/60 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#D4E4FF]/50 blur-3xl"
          />
        </>
      )}
      {variant !== "quiz" && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#E8E4FF] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#DCE8FF] blur-3xl"
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-full opacity-40"
            viewBox="0 0 1440 120"
            fill="none"
          >
            <path
              d="M0 60C240 20 480 100 720 60C960 20 1200 100 1440 60V120H0V60Z"
              fill="#E4E0F7"
            />
          </svg>
        </>
      )}
      <div
        className={cn(
          "relative z-10 flex min-h-full flex-1 flex-col",
          variant === "quiz" && "w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModernBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
      {children}
    </span>
  );
}

export function ModernHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center"
      )}
    >
      {eyebrow && <ModernBadge>{eyebrow}</ModernBadge>}
      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
        {title}
        {highlight && (
          <>
            <br />
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-neutral-800">
              {highlight}
            </span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className="max-w-md text-base leading-relaxed text-neutral-500 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
