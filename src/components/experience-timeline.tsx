import { site } from "@/content/site";
import type { ContributionGroup as Group, Experience } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { Icon } from "./icon";

function ContributionGroup({ group }: { group: Group }) {
  return (
    <div className="contribution-group">
      <h4>{group.title}</h4>
      <ul className={`contribution-list${group.category === "product" ? " contribution-list-compact" : ""}`}>
        {group.contributions.map((contribution) => (
          <li key={contribution.id} className={`contribution${contribution.featured ? " contribution-featured" : ""}`}>
            <h5>{contribution.title}</h5>
            {contribution.description && <p>{contribution.description}</p>}
            {contribution.metrics.length > 0 && (
              <ul className="contribution-metrics">
                {contribution.metrics.map((metric) => <li key={metric.id}>{metric.text}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperienceEntry({ experience }: { experience: Experience }) {
  return (
    <li className="experience-entry">
      <span className="timeline-marker"><Icon name="briefcase" size={16} /></span>
      <article aria-labelledby={`experience-${experience.id}`}>
        <header className="experience-header">
          <div>
            <h3 id={`experience-${experience.id}`}>{experience.company}</h3>
            <p className="experience-role">{experience.role}{experience.employmentType && ` · ${experience.employmentType}`}</p>
          </div>
          <p className="experience-dates">
            <time dateTime={experience.start}>{formatMonth(experience.start)}</time>{" – "}
            {experience.end ? <time dateTime={experience.end}>{formatMonth(experience.end)}</time> : site.presentLabel}
          </p>
        </header>
        {experience.location && <p className="experience-location">{experience.location}</p>}
        {experience.groups.map((group) => <ContributionGroup key={group.id} group={group} />)}
      </article>
    </li>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="portfolio-section content-section" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="section-heading">{site.sections.experience.label}</h2>
      <ol className="experience-timeline">
        {experience.map((entry) => <ExperienceEntry key={entry.id} experience={entry} />)}
      </ol>
    </section>
  );
}
