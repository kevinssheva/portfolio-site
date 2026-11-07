import { getPortfolio } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SectionNavigation } from "@/components/section-navigation";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { ReadmeSection } from "@/components/readme-section";
import { PortfolioSections } from "@/components/portfolio-sections";

export default async function Home() {
  const { profile, currentExperience, overview, technologies, experience, projects, recognition } = await getPortfolio();
  const selectedTechnologies = profile.technologyIds.map((id) => technologies.find((technology) => technology.id === id)!);
  return (
    <>
      <SiteHeader profile={profile} />
      <SectionNavigation projectCount={projects.length} />
      <div className="page-container portfolio-layout">
        <ProfileSidebar profile={profile} currentExperience={currentExperience} />
        <main id="main-content" className="portfolio-content" tabIndex={-1}>
          <ReadmeSection overview={overview} technologies={selectedTechnologies} />
          <PortfolioSections experience={experience} projects={projects} recognition={recognition} />
        </main>
      </div>
    </>
  );
}
