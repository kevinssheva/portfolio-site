import Image from "next/image";
import { site } from "@/content/site";
import type { Experience, Profile } from "@/lib/content";
import { Icon } from "./icon";
import { ContactLinks } from "./contact-links";

export function ProfileSidebar({ profile, currentExperience }: { profile: Profile; currentExperience: Experience }) {
  const initials = profile.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");

  return (
    <aside className="profile-sidebar" aria-label={site.profileLabel}>
      <div className="profile-identity">
        <div className="profile-avatar">
          {profile.avatar ? (
            <Image src={profile.avatar.src} alt={profile.avatar.alt} width={224} height={224} sizes="(min-width: 1024px) 224px, 88px" loading="eager" />
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
      <ContactLinks profile={profile} className="profile-links" />
    </aside>
  );
}
