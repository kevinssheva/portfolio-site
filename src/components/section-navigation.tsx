"use client";

import { site } from "@/content/site";
import { useScrollspy } from "@/lib/navigation/use-scrollspy";
import { Icon } from "./icon";

export function SectionNavigation({ projectCount }: { projectCount: number }) {
  const { navigationRef, sectionId, ready } = useScrollspy();
  return (
    <nav ref={navigationRef} className="section-navigation" aria-label={site.navigationLabel} data-scrollspy-ready={ready ? "true" : undefined}>
      <div className="page-container navigation-inner">
        <ul className="section-links">
          {Object.entries(site.sections).map(([id, section]) => (
            <li key={id}>
              <a className="section-link" href={`#${id}`} aria-current={ready && sectionId === id ? "location" : undefined}>
                <Icon name={section.icon} size={17} />
                <span>{section.label}</span>
                {id === "projects" && <span className="navigation-count" aria-hidden="true">{projectCount}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
