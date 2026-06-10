"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const logoHeight =
  "h-10 w-auto sm:h-12 md:h-14 lg:h-16";

export function PageLogos() {
  const pathname = usePathname();

  if (pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-neutral-200 bg-white shadow-sm">
      <div className="relative flex w-full items-center justify-between px-4 py-2 sm:px-8 sm:py-2.5 lg:px-12">
        <Image
          src="/logos/opt/police.webp"
          alt="Coimbatore City Police"
          width={337}
          height={224}
          className={`relative z-10 shrink-0 object-contain ${logoHeight}`}
          priority
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
        />

        <Image
          src="/logos/opt/uyir.webp"
          alt="UYIR - Road Safety Our Right"
          width={298}
          height={224}
          className={`relative z-10 shrink-0 object-contain ${logoHeight}`}
          priority
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/logos/opt/emblem.webp"
            alt="Government of Tamil Nadu"
            width={208}
            height={224}
            className={`shrink-0 object-contain ${logoHeight}`}
            priority
            sizes="112px"
          />
        </div>
      </div>
    </header>
  );
}
