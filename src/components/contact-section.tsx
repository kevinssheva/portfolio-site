import { site } from "@/content/site";
import type { Profile } from "@/lib/content";
import { ContactLinks } from "./contact-links";

export function ContactSection({ profile }: { profile: Profile }) {
  if (!profile.resume && !Object.values(profile.links).some(Boolean)) return null;
  return (
    <section id="contact" className="portfolio-section content-section" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="section-heading">{site.contactHeading}</h2>
      <p className="contact-description">{site.contactDescription}</p>
      <ContactLinks profile={profile} includeResume />
    </section>
  );
}
