import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          {site.skipLinkLabel}
        </a>
        {children}
      </body>
    </html>
  );
}
