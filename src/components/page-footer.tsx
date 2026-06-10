"use client";

import { useCallback, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  return (
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element })
      .webkitFullscreenElement ??
    null
  );
}

async function requestFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    await element.requestFullscreen();
    return;
  }
  const webkitRequest = (
    element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }
  ).webkitRequestFullscreen;
  if (webkitRequest) {
    await webkitRequest.call(element);
  }
}

async function exitFullscreen() {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  const webkitExit = (
    document as Document & { webkitExitFullscreen?: () => Promise<void> }
  ).webkitExitFullscreen;
  if (webkitExit) {
    await webkitExit.call(document);
  }
}

export function PageFooter() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(getFullscreenElement()));
    };

    onFullscreenChange();
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (getFullscreenElement()) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
    } catch {
      // Blocked by browser or unsupported on this device.
    }
  }, []);

  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-5 z-50 w-full px-6 sm:bottom-6 sm:px-10 lg:px-12">
      <div className="grid w-full grid-cols-2 items-end gap-4">
        <div className="flex flex-col items-start gap-2.5">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            title={isFullscreen ? "Exit full screen" : "Enter full screen"}
            className={cn(
              "pointer-events-auto inline-flex items-center justify-center border border-black/10 bg-white text-neutral-700 shadow-md transition hover:bg-neutral-50 hover:shadow-lg",
              isFullscreen
                ? "h-9 w-9 rounded-full p-0 sm:h-10 sm:w-10"
                : "gap-2 rounded-full px-3 py-2 text-xs font-medium sm:px-4 sm:py-2.5 sm:text-sm"
            )}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <Maximize2 className="h-4 w-4 shrink-0" />
                <span>Full screen</span>
              </>
            )}
          </button>
          <p className="text-[11px] font-semibold tracking-wide text-neutral-600 sm:text-xs">
            Supported by LMW Ltd
          </p>
        </div>

        <p className="justify-self-end text-right text-[11px] font-semibold tracking-wide text-neutral-600 sm:text-xs">
          Crafted by Eroforze Systems
        </p>
      </div>
    </footer>
  );
}
