import { site } from "@/content/site";
import { Icon } from "./icon";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <p><Icon name="code" size={16} /><span>{name}</span></p>
        <a href="#overview">{site.backToOverviewLabel}</a>
      </div>
    </footer>
  );
}
