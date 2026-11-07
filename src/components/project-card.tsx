import { site } from "@/content/site";
import type { Project, Technology } from "@/lib/content";
import { Icon } from "./icon";
import { TechnologyList } from "./technology-list";

export function ProjectCard({ project, technologies }: { project: Project; technologies: Technology[] }) {
  const links = [
    { label: site.projectLinkLabels.repository, href: project.repositoryUrl },
    { label: site.projectLinkLabels.demo, href: project.demoUrl },
    { label: site.projectLinkLabels.details, href: project.detailUrl },
  ];
  return (
    <article className="project-card" aria-labelledby={`project-${project.slug}`}>
      <div className="project-heading">
        <div className="project-title"><Icon name="repository" size={17} />
          <h3 id={`project-${project.slug}`}>
            {project.repositoryUrl ? <a href={project.repositoryUrl}>{project.title}</a> : project.title}
          </h3>
        </div>
        {project.featured && <span className="featured-label">{site.featuredLabel}</span>}
      </div>
      <p className="project-description">{project.summary}</p>
      <TechnologyList technologies={technologies} />
      {links.some((link) => link.href) && (
        <div className="project-links">
          {links.map((link) => link.href && <a key={link.label} href={link.href} aria-label={`${link.label}: ${project.title}`}>{link.label}<Icon name="link" size={14} /></a>)}
        </div>
      )}
    </article>
  );
}

export function ProjectsSection({ projects, technologies }: { projects: Project[]; technologies: Technology[] }) {
  return (
    <section id="projects" className="portfolio-section content-section" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-heading">{site.sections.projects.label}</h2>
      <ul className="project-grid">
        {projects.map((project) => (
          <li key={project.slug}><ProjectCard project={project} technologies={project.technologyIds.map((id) => technologies.find((technology) => technology.id === id)!)} /></li>
        ))}
      </ul>
    </section>
  );
}
