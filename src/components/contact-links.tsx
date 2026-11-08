import { site } from "@/content/site";
import type { Profile } from "@/lib/content";
import { Icon, type IconName } from "./icon";

export function ContactLinks({ profile, className = "contact-links", includeResume = false }: {
  profile: Profile;
  className?: string;
  includeResume?: boolean;
}) {
  const links: { label: string; href?: string; icon: IconName; download?: boolean }[] = [
    { label: site.githubLabel, href: profile.links.github, icon: "repository" },
    { label: site.linkedinLabel, href: profile.links.linkedin, icon: "link" },
    { label: site.emailLabel, href: profile.links.email ? `mailto:${profile.links.email}` : undefined, icon: "mail" },
  ];
  if (includeResume && profile.resume) links.push({ label: site.resumeLabel, href: profile.resume, icon: "download", download: true });
  if (!links.some((link) => link.href)) return null;

  return (
    <ul className={className} aria-label={site.profileLinksLabel}>
      {links.map((link) => link.href && (
        <li key={link.label}>
          <a href={link.href} download={link.download || undefined}>
            <Icon name={link.icon} size={16} /><span>{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
