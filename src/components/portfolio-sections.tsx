import { site } from "@/content/site";
import type { Experience, Project, Recognition } from "@/lib/content";
import { Icon } from "./icon";

// Compact real-content targets keep native navigation useful before Phase 4's detailed layouts.
export function PortfolioSections({ experience, projects, recognition }: {
  experience: Experience[];
  projects: Project[];
  recognition: Recognition[];
}) {
  return (
    <>
      <section id="experience" className="portfolio-section summary-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-heading">{site.sections.experience.label}</h2>
        <ul className="summary-list">
          {experience.map((employer) => (
            <li key={employer.id}>
              <Icon name="briefcase" />
              <div>
                <h3>{employer.company}</h3>
                <p className="summary-meta">{employer.role}{employer.employmentType && ` · ${employer.employmentType}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section id="projects" className="portfolio-section summary-section" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-heading">{site.sections.projects.label}</h2>
        <ul className="summary-list">
          {projects.map((project) => (
            <li key={project.slug}>
              <Icon name="repository" />
              <div><h3>{project.title}</h3><p>{project.summary}</p></div>
            </li>
          ))}
        </ul>
      </section>
      <section id="recognition" className="portfolio-section summary-section" aria-labelledby="recognition-heading">
        <h2 id="recognition-heading" className="section-heading">{site.sections.recognition.label}</h2>
        <ul className="summary-list">
          {recognition.map((award) => (
            <li key={award.id}>
              <Icon name="trophy" />
              <div><h3>{award.title}</h3><p className="summary-meta">{award.issuer}</p><p>{award.description}</p></div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
