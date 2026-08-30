import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { OfflineProvider } from "@/components/OfflineProvider";
import { SOSProvider } from "@/contexts/SOSContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IsleHelp — Resilient Island Community",
  description:
    "Social-first community platform for isolated coastal regions. Offline-first resource sharing, cross-water trade, and community coordination.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IsleHelp",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c2d44",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ocean-950 font-sans text-sand-100 antialiased">
        <OfflineProvider>
          <SOSProvider>
            {children}
            <BottomNav />
          </SOSProvider>
        </OfflineProvider>
      </body>
    </html>
  );
}
