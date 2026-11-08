import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { getPortfolio } from "@/lib/content";
import { createMetadata, getSeoConfig } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { profile, currentExperience } = await getPortfolio();
  return createMetadata(profile, currentExperience.role, getSeoConfig());
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
