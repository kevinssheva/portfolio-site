import { getPortfolio } from "@/lib/content";
import { SectionNavigation } from "@/components/section-navigation";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { ReadmeSection } from "@/components/readme-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/project-card";
import { RecognitionSection } from "@/components/recognition-section";
import { EducationSection } from "@/components/education-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default async function Home() {
  const { profile, currentExperience, overview, technologies, experience, projects, recognition, education } = await getPortfolio();
  const selectedTechnologies = profile.technologyIds.map((id) => technologies.find((technology) => technology.id === id)!);
  return (
    <>
      <SectionNavigation projectCount={projects.length} />
      <div className="page-container portfolio-layout">
        <ProfileSidebar profile={profile} currentExperience={currentExperience} />
        <main id="main-content" className="portfolio-content" tabIndex={-1}>
          <ReadmeSection overview={overview} technologies={selectedTechnologies} />
          <ExperienceTimeline experience={experience} />
          <ProjectsSection projects={projects} technologies={technologies} />
          <RecognitionSection recognition={recognition} />
          <EducationSection education={education} />
          <ContactSection profile={profile} />
        </main>
      </div>
      <Footer name={profile.name} />
    </>
  );
}
