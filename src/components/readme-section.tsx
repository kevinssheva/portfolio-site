import { site } from "@/content/site";
import type { Technology } from "@/lib/content";
import { Icon } from "./icon";
import { MarkdownContent } from "./markdown-content";

export function ReadmeSection({ overview, technologies }: { overview: string; technologies: Technology[] }) {
  return (
    <section id="overview" className="portfolio-section readme-section" aria-label={site.sections.overview.label}>
      <div className="readme-header"><Icon name="book" size={16} /><span>{site.readmeFilename}</span></div>
      <div className="readme-body">
        <MarkdownContent>{overview}</MarkdownContent>
        {technologies.length > 0 && (
          <div className="readme-technologies">
            <h3>{site.technologiesHeading}</h3>
            <ul className="technology-list">
              {technologies.map((technology) => <li key={technology.id}>{technology.label}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
