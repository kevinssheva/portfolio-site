import { site } from "@/content/site";
import type { Recognition } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { Icon } from "./icon";

export function RecognitionSection({ recognition }: { recognition: Recognition[] }) {
  return (
    <section id="recognition" className="portfolio-section content-section" aria-labelledby="recognition-heading">
      <h2 id="recognition-heading" className="section-heading">{site.sections.recognition.label}</h2>
      <ol className="compact-list">
        {recognition.map((award) => (
          <li key={award.id}>
            <Icon name="trophy" />
            <div>
              <div className="entry-heading"><h3>{award.title}</h3><time dateTime={award.date}>{formatMonth(award.date)}</time></div>
              <p className="entry-meta">{award.issuer}</p>
              <p>{award.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
