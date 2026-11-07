import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { getPortfolio } from "@/lib/content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { profile, currentExperience } = await getPortfolio();
  return {
    title: `${profile.name} | ${currentExperience.role}`,
    description: profile.bio,
    robots: { index: false, follow: false },
  };
}

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
