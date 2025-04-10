import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./globals.css";
import FooterSection from "@/components/sections/footer/default";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-0 items-center">
              {/* Navbar */}
              <Navbar />
              {/* Main Content */}
              <div className="flex flex-col gap-20 max-w-7xl p-5 w-full">
                {children}
              </div>
              
              {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-0 py-4"> */}
                {/* <p> */}
                  {/* Powered by <span><MagneticSocialLinksDemo /></span> */}
                {/* </p> */}
                {/* <ThemeSwitcher /> */}
              {/* </footer> */}
              <FooterSection />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
