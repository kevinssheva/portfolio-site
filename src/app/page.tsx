import { getPortfolio } from "@/lib/content";

export default async function Home() {
  const { profile, currentExperience } = await getPortfolio();
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto min-h-dvh w-full max-w-300 px-5 py-12 sm:px-8 sm:py-16"
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {profile.name}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
        {currentExperience.role} at {currentExperience.company}, based in {profile.location}.
      </p>
    </main>
  );
}
