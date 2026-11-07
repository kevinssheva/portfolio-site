import { loadPortfolio } from "../src/lib/content/load";

loadPortfolio().then((content) => {
  console.log(`Content valid: ${content.experience.length} employers, ${content.projects.length} published projects, ${content.recognition.length} recognitions, ${content.education.length} education entries.`);
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
