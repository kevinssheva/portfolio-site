import { site } from "@/content/site";
import { Icon } from "./icon";

export function SectionNavigation({ projectCount }: { projectCount: number }) {
  return (
    <nav className="section-navigation" aria-label={site.navigationLabel}>
      <div className="page-container navigation-inner">
        <ul className="section-links">
          {Object.entries(site.sections).map(([id, section]) => (
            <li key={id}>
              <a className="section-link" href={`#${id}`}>
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
