"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export function HomeUserBar() {
  const { user } = useUser();
  const displayName = user?.fullName ?? user?.firstName ?? "Staff";
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <header className="flex w-full justify-end">
      <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-black/5 bg-white/90 py-1.5 pl-1.5 pr-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:gap-3.5 sm:pr-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-white",
            },
          }}
        />

        <div className="min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold leading-tight text-neutral-900">
              {displayName}
            </p>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#ECE9FF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700">
              <ShieldCheck className="h-3 w-3" />
              Staff
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-neutral-500">
            {email ?? "Staff portal"}
          </p>
        </div>
      </div>
    </header>
  );
}
