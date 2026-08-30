import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { AppShell } from "@/components/app/AppShell";
import { OfflineProvider } from "@/components/OfflineProvider";
import { IntroCurtain } from "@/components/IntroCurtain";
import { FeedProvider } from "@/contexts/FeedContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { SOSProvider } from "@/contexts/SOSContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IsleHelp — No island should have to cope alone",
  description:
    "Social-first community platform for isolated coastal regions. Offline-first resource sharing, cross-water trade, and community coordination.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IsleHelp",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7fbfc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans text-ink-soft antialiased">
        <SoundProvider>
          <OfflineProvider>
            <SOSProvider>
              <FeedProvider>
                <IntroCurtain />
                <AppShell>{children}</AppShell>
              </FeedProvider>
            </SOSProvider>
          </OfflineProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
