import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { PageFooter } from "@/components/page-footer";
import { PageLogos } from "@/components/page-logos";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Police Awareness Quiz",
  description:
    "A quiz application for police awareness events with Tamil questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ta"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden font-sans">
        <Providers>
          <div className="flex h-dvh flex-col overflow-hidden">
            <PageLogos />
            <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="flex min-h-full flex-1 flex-col">{children}</div>
            </div>
            <PageFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
