import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ 추가

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 기반 연애 횟수 예측 설문",
  description: "AI를 통해 연애 횟수를 예측하기 위한 설문조사",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId="940848428759-0iuk6hshn82nhrpc4elnfsf8t97ijqaa.apps.googleusercontent.com">
          {" "}
          {/* ✅ 추가 */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
