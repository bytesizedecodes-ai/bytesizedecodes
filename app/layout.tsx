import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { DataProvider } from "@/lib/data/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "bytesizedecodes — Learn AI visually. Practise it. Build something real.",
  description:
    "Visual AI lessons, intelligent practice, spaced review, and goal-based paths for beginners, students, professionals, and founders.",
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
        <ConvexAuthNextjsServerProvider>
          <DataProvider>{children}</DataProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
