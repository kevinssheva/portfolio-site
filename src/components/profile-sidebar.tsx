import Image from "next/image";
import { site } from "@/content/site";
import type { Experience, Profile } from "@/lib/content";
import { Icon, type IconName } from "./icon";

export function ProfileSidebar({ profile, currentExperience }: { profile: Profile; currentExperience: Experience }) {
  const links = [
    { label: site.githubLabel, href: profile.links.github, icon: "repository" },
    { label: site.linkedinLabel, href: profile.links.linkedin, icon: "link" },
    { label: site.emailLabel, href: profile.links.email ? `mailto:${profile.links.email}` : undefined, icon: "mail" },
  ] satisfies { label: string; href: string | undefined; icon: IconName }[];
  const initials = profile.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");

  return (
    <aside className="profile-sidebar" aria-label={site.profileLabel}>
      <div className="profile-identity">
        <div className="profile-avatar">
          {profile.avatar ? (
            <Image src={profile.avatar.src} alt={profile.avatar.alt} width={224} height={224} sizes="(min-width: 1024px) 224px, 88px" />
          ) : <span aria-hidden="true">{initials}</span>}
        </div>
        <div className="profile-heading">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-role">{currentExperience.role}</p>
          <p className="profile-company">{currentExperience.company}</p>
        </div>
      </div>
      <p className="profile-bio">{profile.bio}</p>
      {profile.resume && (
        <a className="resume-link" href={profile.resume} download>
          <Icon name="download" size={16} />{site.resumeLabel}
        </a>
      )}
      <p className="profile-location"><Icon name="location" size={16} /><span>{profile.location}</span></p>
      {links.some((link) => link.href) && (
        <ul className="profile-links" aria-label={site.profileLinksLabel}>
          {links.map((link) => link.href && (
            <li key={link.label}>
              <a href={link.href}><Icon name={link.icon} size={16} /><span>{link.label}</span></a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
