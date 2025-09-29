import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";
import "./prism.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Fixed variable name
});

export const metadata: Metadata = {
  title: "DeepSeek",
  description:
    "Chat with DeepSeek AI – your intelligent assistant for coding, content creation, file reading, and more...",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className={`font-sans antialiased`}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
