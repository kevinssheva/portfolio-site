import { site } from "@/content/site";
import type { Education } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { Icon } from "./icon";

export function EducationSection({ education }: { education: Education[] }) {
  if (education.length === 0) return null;
  return (
    <section id="education" className="portfolio-section content-section" aria-labelledby="education-heading">
      <h2 id="education-heading" className="section-heading">{site.educationHeading}</h2>
      <ul className="compact-list">
        {education.map((entry) => (
          <li key={entry.id}>
            <Icon name="book" />
            <div>
              <h3>{entry.institution}</h3>
              <p className="entry-meta">{entry.degree}</p>
              <p className="education-details">
                <span>{site.graduatedLabel}{" "}<time dateTime={entry.graduated}>{formatMonth(entry.graduated)}</time></span>
                {entry.gpa && <span>{site.gpaLabel}: {entry.gpa.value.toFixed(2)}/{entry.gpa.maximum.toFixed(2)}</span>}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
