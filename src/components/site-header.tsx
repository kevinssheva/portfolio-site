import { site } from "@/content/site";
import type { Profile } from "@/lib/content";
import { Icon } from "./icon";

export function SiteHeader({ profile }: { profile: Profile }) {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <a className="site-brand" href="#overview">
          <span className="brand-mark"><Icon name="code" size={20} /></span>
          <span className="font-semibold">{profile.name}</span>
          <span className="brand-divider" aria-hidden="true">/</span>
          <span className="brand-label">{site.brand}</span>
        </a>
        {profile.links.github && (
          <a className="header-link" href={profile.links.github}>
            <Icon name="repository" size={16} />
            <span>{site.githubLabel}</span>
          </a>
        )}
      </div>
    </header>
  );
}
