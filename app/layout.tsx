import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DataProvider } from "@/lib/data/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteSizedCodes — five minutes a day to an ML interview",
  description:
    "Daily ML practice for Indian college grads. Drills, spaced review, and bite-sized lessons. Not another course.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
