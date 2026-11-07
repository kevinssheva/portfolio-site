import type { Technology } from "@/lib/content";

export function TechnologyList({ technologies }: { technologies: Technology[] }) {
  if (technologies.length === 0) return null;
  return <ul className="technology-list">{technologies.map((technology) => <li key={technology.id}>{technology.label}</li>)}</ul>;
}
