import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PRobe — AI Code Review",
  description:
    "Automated AI-powewhite PR code reviews for your GitHub repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        {" "}
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            classNames: {
              success: "[&>[data-icon]]:text-emerald-500",
              error: "[&>[data-icon]]:text-red-500",
              warning: "[&>[data-icon]]:text-amber-500",
              info: "[&>[data-icon]]:text-blue-400",
            },
          }}
        />{" "}
      </body>
    </html>
  );
}
